import { NextFunction, Request, Response } from 'express';
import { sbdb } from '~/lib/supabase';
import { ErrorKey } from '~/types/http';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';

export async function getLocations(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await sbdb.from('locations').select('*').order('id');
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}
