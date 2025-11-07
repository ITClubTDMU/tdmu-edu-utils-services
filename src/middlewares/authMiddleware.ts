import { Request, Response, NextFunction } from 'express';
import { ErrorKey } from '~/types/http/error';
import { createHttpErr } from '~/utils/createHttpResponse';
import sb from '~/lib/supabase';
import { Profile } from '~/types/profile';

declare module 'express' {
  interface Request {
    user?: Profile;
    user_id?: string;
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw createHttpErr(ErrorKey.AUTH_REQUIRED, 'Missing Authorization');
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = await sb.verifySupabaseJWT(token);

    // console.log('decoded: ', decoded);
    req.user = decoded;
    req.user_id = decoded.sub;
    next();
  } catch (error) {
    console.error('authMiddleware error: ', error);
    throw createHttpErr(ErrorKey.AUTH_REQUIRED, 'Invalid Authorization');
  }
};
