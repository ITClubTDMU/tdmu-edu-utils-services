import { Request } from 'express';
import { sbdb } from '~/lib/supabase';
import { ErrorKey } from '~/types/http/error';
import { createHttpErr, createHttpSuccess } from '../createHttpResponse';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { ensureDir } from '../esureDir';

export const uploadFile = async (req: Request, options: { path: string; bucket: string }) => {
  const file = req.file;

  if (!file) {
    throw createHttpErr(ErrorKey.MISSING_KEY, 'Missing "file" key');
  }

  const { error } = await sbdb.storage.from(options.bucket).upload(options.path, file.buffer, {
    contentType: file.mimetype
  });
  if (error) throw error;
  const { data: resData } = sbdb.storage.from(options.bucket).getPublicUrl(options.path);
  return createHttpSuccess({ path: options.path, url: resData.publicUrl });
};

export const getFile = async (req: Request, options: { path: string; bucket: string }) => {
  const { data, error } = await sbdb.storage.from(options.bucket).download(options.path);
  if (error) throw error;
  return data;
};

export const deleteFile = async (req: Request, options: { path: string; bucket: string }) => {
  const { error } = await sbdb.storage.from(options.bucket).remove([options.path]);
  if (error) throw error;
  return createHttpSuccess({ message: 'File deleted successfully' });
};

export const docxToPdf = async (req: Request, fileInput: Blob | Buffer | null, fileName: string) => {
  if (!fileInput) throw createHttpErr(ErrorKey.BAD_REQUEST, 'File is not a docx file');

  const incomingFile = req.file;

  const buffer = Buffer.isBuffer(fileInput) ? fileInput : Buffer.from(await fileInput.arrayBuffer());

  const formData = new FormData();
  formData.append('file', buffer, {
    filename: incomingFile
      ? incomingFile?.originalname.split('.').pop() + new Date().getTime().toString() + '.docx'
      : fileName,
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
  formData.append('userId', '23');

  const response = await axios.post(`${process.env.PYTHON_SERVER_URL}/upload`, formData, {
    headers: {
      ...formData.getHeaders() // Quan trọng: để axios biết multipart/form-data với boundary
    },
    responseType: 'arraybuffer', // **Phải dùng arraybuffer để nhận binary**

    maxContentLength: Infinity, // Tùy chọn cho file lớn
    maxBodyLength: Infinity
  });

  const pdfBuffer = Buffer.from(response.data);

  return pdfBuffer;
};

const delimiters = { start: '{{', end: '}}' };

export async function modifyDocxWithVars(
  buffer: ArrayBuffer,
  sbUploadOptions?: { outputPath: string; bucket: string },
  replacements?: Record<string, unknown>
): Promise<{ path: string; buffer: Buffer; fullPath: string }> {
  try {
    const { outputPath, bucket } = sbUploadOptions ?? {};
    const zip = new PizZip(buffer);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters,
      nullGetter: (part) => {
        const { tag, raw, module, value } = part;

        if (process.env.NODE_ENV === 'development')
          console.warn(`Null value for tag: ${tag} (raw: ${raw}, module: ${module}, value: ${value})`);
        return delimiters.start + value + delimiters.end;
      },
      syntax: {
        allowUnopenedTag: true,
        allowUnclosedTag: true
      }
    });

    doc.render(replacements ?? {});
    const bff = doc.getZip().generate({ type: 'nodebuffer' });


    const { data, error } = await sbdb.storage.from(bucket ?? 'TMP').upload(outputPath ?? 'TMP', bff, {
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      upsert: true
    });
    if (error) throw error;

    return { path: data.path, fullPath: data.fullPath, buffer: bff };
  } catch (error) {
    console.error('Error modifying DOCX:', error);
    throw error;
  }
}
