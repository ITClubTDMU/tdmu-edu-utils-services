import { NextFunction, Request, Response } from 'express';
import { sbdb } from '~/lib/supabase';
import { EHttpStatusCode, ErrorKey } from '~/types/http';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';

export const getSemesters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await sbdb.from('semesters').select('*');
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    }
    res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const getWeeksInSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { semesterId } = req.body;
    const { data, error } = await sbdb.from('timetable_weeks').select('*').eq('semester_id', semesterId);
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    }
    res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const getTimeTableData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, start_date, end_date } = req.body;
    let query = sbdb.from('timetable').select('*').eq('user_id', user_id);

    if (start_date && end_date) {
      query = query.gte('class_date', new Date(start_date).toISOString());
      query = query.lte('class_date', new Date(end_date).toISOString());
    }

    const { data, error } = await query;
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    }
    res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};
