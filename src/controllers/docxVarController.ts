import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { createHttpSuccess } from '~/utils/createHttpResponse';
import fsLib from '~/lib/fs';
import FormData from 'form-data';
import axios from 'axios';

const delimiters = { start: '{{', end: '}}' };

function modifyDocx(inputPath: any, outputPath: any, replacements?: any) {
  try {
    const content = fs.readFileSync(inputPath, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters,
      nullGetter: (part) => {
        const { tag, raw, module, value } = part;

        console.warn(`Null value for tag: ${tag} (raw: ${raw}, module: ${module}, value: ${value})`);
        return delimiters.start + value + delimiters.end;
      },
      syntax: {
        allowUnopenedTag: true,
        allowUnclosedTag: true
      }
    });

    doc.render(replacements ?? {});

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, buffer);
    console.log(`DOCX modified: ${outputPath}`);
  } catch (error) {
    console.error('Error modifying DOCX:', error);
    throw error;
  }
}

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.file);
  if (!req.file) {
    next(new Error('No file uploaded'));
    return;
  }

  try {
    const timestamp = dayjs().format('YYYY-MM-DD_HH-mm');
    const modifiedDocxPath = `outputs/modified_${timestamp}.docx`;
    const pdfPath = `outputs/output_${timestamp}.pdf`;

    // Chỉnh sửa file DOCX
    // modifyDocx(req.file?.path, modifiedDocxPath);

    res.status(200).json(
      createHttpSuccess({
        message: 'File uploaded and modified successfully',
        data: {
          modifiedDocxPath,
          pdfPath
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

export const applyVar = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, fileName, replacements } = req.body;

  const userFolder = path.join(fsLib.path.archive, userId);
  const inputPath = path.join(userFolder, fileName);

  if (!fs.existsSync(inputPath)) {
    next(new Error('File not found'));
    return;
  }

  // Lưu kết quả
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const outputFile = `${baseName}_modified${ext}`;
  const outputPath = path.join(userFolder, outputFile);

  try {
    modifyDocx(inputPath, outputPath, replacements);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(outputPath), {
      filename: outputFile,
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    const response = await axios.post('http://localhost:8000/upload', formData, {
      headers: {
        ...formData.getHeaders() // Quan trọng: để axios biết multipart/form-data với boundary
      },
      responseType: 'arraybuffer', // **Phải dùng arraybuffer để nhận binary**

      maxContentLength: Infinity, // Tùy chọn cho file lớn
      maxBodyLength: Infinity
    });

    // const response = await fetch('http://localhost:8000/upload', {
    //   method: 'POST',
    //   body: formData as any, // type casting vì fetch trong Node có kiểu chặt hơn
    //   headers: {
    //     ...formData.getHeaders()
    //   }
    // });
    // const buffer = await response.arrayBuffer();

    // Nếu muốn lưu file PDF tạm:
    const pdfBuffer = Buffer.from(response.data);
    fs.writeFileSync(path.join(fsLib.path.archive, userId, 'converted.pdf'), pdfBuffer);
    // Gửi file PDF trực tiếp về client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=converted.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
