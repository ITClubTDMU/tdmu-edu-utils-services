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

function checkUserInGroups(user_id: string, groups: { key: string; users: string[] }[]) {
  return groups.some((group) => group.key === 'staff' && group.users.includes(user_id));
}

const STAFF_ID = 'a0a43d68-f36d-4408-af6c-5e23e617b575';

export const handlerWorkflowMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user_id);
  try {
    const groups = [
      {
        key: 'admin',
        users: ['63d096e7-f493-4c0d-b138-3b13e24cfdd7']
      },
      {
        key: 'staff',
        users: [STAFF_ID]
      },
      {
        key: 'user',
        users: ['63d096e7-f493-4c0d-b138-3b13e24cfdd7']
      }
    ];

    // if (!checkUserInGroups(req.user_id!, groups)) {
    //   throw createHttpErr(ErrorKey.FORBIDDEN, 'You are not authorized to access this resource');
    // }

    next();
  } catch (error) {
    next(error);
  }
};
