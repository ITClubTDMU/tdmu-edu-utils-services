import { NextFunction, Request, Response } from 'express';
import { sbdb } from '~/lib/supabase';
import { ErrorKey } from '~/types/http';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';

export async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { q = '', limit = 5 } = req.query;
    if (!q || typeof q !== 'string')
      throw createHttpErr(ErrorKey.BAD_REQUEST, 'Search term is required');
    if (q.length < 3) throw createHttpErr(ErrorKey.BAD_REQUEST, 'Search term must be at least 3 characters');

    const { data, error } = await sbdb
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${q}%`)
      .limit(Number(limit));

    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}


export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}