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
  req.user_id =  'a0a43d68-f36d-4408-af6c-5e23e617b575';
  next();
  // const authHeader = req.headers['authorization'];
  // if (!authHeader) {
  //   throw createHttpErr(ErrorKey.AUTH_REQUIRED, 'Missing Authorization');
  // }

  // try {
  //   const token = authHeader.split(' ')[1];
  //   const decoded = await sb.verifySupabaseJWT(token);

  //   console.log('userId ', decoded.sub);

  //   req.user = undefined;

  //   req.user_id = decoded.sub ?? '63d096e7-f493-4c0d-b138-3b13e24cfdd7';
  //   next();
  // } catch (error) {
  //   console.error('authMiddleware error: ', error);
  //   throw createHttpErr(ErrorKey.AUTH_REQUIRED, 'Invalid Authorization');
  // }
};
