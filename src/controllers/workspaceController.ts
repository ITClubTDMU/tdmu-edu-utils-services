import { Request, Response, NextFunction } from 'express';
import { sbdb } from '~/lib/supabase';
import { BUCKET_NAME } from '~/constants';
import { decode } from 'base64-arraybuffer';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';
import { ErrorKey } from '~/types/http/error';

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) {
      throw createHttpErr(ErrorKey.MISSING_KEY, 'Missing "file" key');
    }

    const bucket = BUCKET_NAME.WORKSPACES;
    const fileBase64 = decode(file.buffer.toString('base64'));

    const { error } = await sbdb.storage.from(bucket).upload(file.originalname, fileBase64, {
      contentType: file.mimetype
    });

    if (error) {
      throw error;
    }

    const { data: resData } = sbdb.storage.from(bucket).getPublicUrl(file.originalname);

    res.json(createHttpSuccess({ path: file.originalname, url: resData.publicUrl }));
  } catch (err) {
    next(err);
  }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { path } = req.body;
    const bucket = BUCKET_NAME.WORKSPACES;
    console.log('PATH', path);
    const { error } = await sbdb.storage.from(bucket).remove([path]);

    if (error) throw error;

    res.json(createHttpSuccess({ success: true }));
  } catch (err) {
    next(err);
  }
}

export async function updateFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { path } = req.body;
    const file = req.file;
    if (!file) {
      throw createHttpErr(ErrorKey.MISSING_KEY, 'Missing "file" key');
    }
    console.log('PATH', path);
    console.log('FILE', file);
    const bucket = BUCKET_NAME.WORKSPACES;
    const fileBase64 = decode(file.buffer.toString('base64'));
    const { error } = await sbdb.storage.from(bucket).update(path, fileBase64, {
      contentType: file.mimetype
    });

    if (error) throw error;

    res.json(createHttpSuccess({ success: true }));
  } catch (err) {
    next(err);
  }
}
