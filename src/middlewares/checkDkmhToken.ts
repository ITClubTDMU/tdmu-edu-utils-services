import { Request, Response, NextFunction } from 'express';
import { resError } from '~/utils/responseFormat';

export const checkDkmhToken = (req: Request, res: Response, next: NextFunction) => {
  const { access_token } = req.body;

  if (!access_token) {
    res.status(404).json(resError('Missing access_token', 404));
    return;
  }

  // Nếu có thể thêm bước kiểm tra hợp lệ thì thêm tại đây (ví dụ decode JWT, regex, v.v.)

  next();
};
