import { QueryData } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import { config } from '~/config';
import { BUCKET_NAME } from '~/constants';
import { sbdb } from '~/lib/supabase';
import { ErrorKey } from '~/types/http';
import { TPageProfile } from '~/types/news';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';

export async function getNewsFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const { dateRange, type, searchQuery = '', isShownFavoriteOnly = false, lastDateTime = '', limit = 20 } = req.body;
    // join wwith rss_profiles
    const query = sbdb
      .from('facebook_posts')
      .select('*, page_info:rss_profiles!short_name (short_name, name, avatar, url)');

    query.order('converted_time', { ascending: false });
    query.eq('is_pinned', false);
    if (dateRange.from) {
      query.gte('converted_time', dateRange.from);
    }
    if (dateRange.to) {
      query.lt('converted_time', dateRange.to);
    }

    if (lastDateTime) {
      const date = new Date(lastDateTime);
      query.lt('converted_time', date.toISOString());
    }
    // check 7 days  to now
    // set hour and minute to 0
    const sevenDaysAgo = dayjs().subtract(13, 'day').startOf('day').toISOString();
    query.gte('converted_time', sevenDaysAgo);
    if (lastDateTime) {
      const date = new Date(lastDateTime);
      query.lt('converted_time', date.toISOString());
    }

    if (searchQuery) {
      const safeQuery = searchQuery.replaceAll(',', String.raw`\,`);
      const q = `"%${searchQuery}%"`;

      query.or([`title.ilike.${q}`, `content.ilike.${q}`, `summarization.ilike.${q}`].join(','));

      // query.or(`title.ilike.%${safeQuery}%,content.ilike.%${safeQuery}%,`);
    }

    if (isShownFavoriteOnly) {
      const { data: favoriteProfilesData } = await sbdb
        .from('profiles_rss_favorites')
        .select('*')
        .eq('user_id', req.user_id ?? '')
        .eq('status', true);
      if (favoriteProfilesData) {
        query.in('short_name', favoriteProfilesData.map((item) => item.profile_short_name) ?? []);
      }
    }

    if (type && !type.includes('all') && !type.includes('tất cả')) {
      query.overlaps(
        'tags',
        type
          .split(',')
          .map((item: string) => item.toLowerCase().trim())
          .filter((item: string) => item)
      );
    }

    query.limit(5);
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

    const { data: favoriteProfilesData } = await sbdb
      .from('profiles_rss_favorites')
      .select('*')
      .eq('user_id', req.user_id ?? '')
      .eq('status', true);

    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }
    const results = (data ?? []).reduce(
      (acc: Record<string, TPageProfile & { favorite_status: boolean }>, item: TPageProfile) => {
        acc[item.short_name] = {
          ...item,
          favorite_status:
            favoriteProfilesData?.some(
              (favoriteProfile) =>
                favoriteProfile.profile_short_name === item.short_name && favoriteProfile.status === true
            ) ?? false
        };
        return acc;
      },
      {}
    );
    res.json(createHttpSuccess(results));
  } catch (err) {
    next(err);
  }
}

export async function getPostImages(req: Request, res: Response, next: NextFunction) {
  try {
    const { post_id } = req.params;
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

export async function getPagesInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await sbdb.from('rss_profiles').select('*');
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }
    res.json(createHttpSuccess(data ?? []));
  } catch (err) {
    next(err);
  }
}

export async function getFavoriteProfiles(req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user_id!;

    const favoriteProfilesQuery = sbdb
      .from('profiles_rss_favorites')
      .select(
        `
      *,
      rss_profile:rss_profiles!profile_short_name (
        short_name,
        name,
        avatar,
        url
      )
    `
      )
      .eq('user_id', user_id)
      .eq('status', true)
      .order('profile_short_name', { ascending: true })
      .limit(30);

    type FavoriteProfiles = QueryData<typeof favoriteProfilesQuery>;
    const { data: favoriteProfilesData, error: favoriteProfilesError } = await favoriteProfilesQuery;
    if (favoriteProfilesError) throw createHttpErr(ErrorKey.DB_ERROR, favoriteProfilesError.message);

    res.json(createHttpSuccess(favoriteProfilesData));
  } catch (err) {
    next(err);
  }
}

export async function addFavoriteProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { profileShortName } = req.params;
    const user_id = req.user_id!;
    const { data, error } = await sbdb
      .from('profiles_rss_favorites')
      .upsert(
        { user_id, profile_short_name: profileShortName, status: true, created_at: new Date().toISOString() },
        { onConflict: 'user_id,profile_short_name' }
      );

    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }
    res.json(createHttpSuccess(data ?? []));
  } catch (err) {
    next(err);
  }
}

export async function removeFavoriteProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { profileShortName } = req.params;
    const user_id = req.user_id!;
    const { data, error } = await sbdb
      .from('profiles_rss_favorites')
      .update({ status: false })
      .eq('user_id', user_id)
      .eq('profile_short_name', profileShortName);
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }
    res.json(createHttpSuccess(data ?? []));
  } catch (err) {
    next(err);
  }
}

export async function getTagsNews(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await sbdb.from('scraped_post_tags').select('*');
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }
    res.json(createHttpSuccess(data ?? []));
  } catch (err) {
    next(err);
  }
}

export async function getPinnedNews(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await sbdb
      .from('facebook_posts')
      .select(
        `*,
        
        page_info:rss_profiles!short_name (
          short_name,
          name,
          avatar,
          url
        )
        `
      )
      .eq('is_pinned', true)
      .order('converted_time', { ascending: false });
    if (error) {
      throw createHttpErr(ErrorKey.DB_ERROR, JSON.stringify(error));
    }
    res.json(createHttpSuccess(data ?? []));
  } catch (err) {
    next(err);
  }
}
