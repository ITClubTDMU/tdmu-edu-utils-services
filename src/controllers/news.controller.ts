import { NextFunction, Request, Response } from 'express';
import { config } from '~/config';
import { BUCKET_NAME } from '~/constants';
import { sbdb } from '~/lib/supabase';
import { ErrorKey } from '~/types/http';
import { TPageProfile } from '~/types/news';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';

export async function getNewsFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const { dateRange, type } = req.body;
    const query = sbdb
      .from('facebook_posts')
      .select('*')
      .eq('type', type ?? 'other')
      .order('converted_time', { ascending: false });

    if (dateRange.from) {
      query.gte('converted_time', dateRange.from);
    }
    if (dateRange.to) {
      query.lte('converted_time', dateRange.to);
    }

    const { data, error } = await query;
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }

    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function getPageProfiles(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await sbdb.from('rss_profiles').select('*');
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }
    const results = (data ?? []).reduce((acc: Record<string, TPageProfile>, item: TPageProfile) => {
      acc[item.short_name] = item;
      return acc;
    }, {});
    res.json(createHttpSuccess(results));
  } catch (err) {
    next(err);
  }
}

export async function getPostImages(req: Request, res: Response, next: NextFunction) {
  try {
    const { post_id } = req.body;
    const path = `posts/${post_id}`;
    const { data, error } = await sbdb.storage.from(BUCKET_NAME.RSS_INFO).list(path);
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }

    const prefixImgUrl = config.prefixPublicStoragePath + '/' + BUCKET_NAME.RSS_INFO + '/' + path + '/';

    res.json(createHttpSuccess(data.map((item) => prefixImgUrl + item.name)));
  } catch (err) {
    next(err);
  }
}
