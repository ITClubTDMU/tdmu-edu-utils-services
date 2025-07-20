import { Request, Response, NextFunction } from 'express';
import { ErrorKey, TError } from '~/types/http/error';
import { EHttpStatusCode } from '~/types/http';
import { ERROR_HELPER } from '~/utils/error';

export function errorHandler(err: TError | ErrorKey, req: Request, res: Response, next: NextFunction) {
  try {
    const errObj = ERROR_HELPER.isErrorKey(err) ? ERROR_HELPER.getObj(err) : err;
    const statusCode = errObj.statusCode || EHttpStatusCode.INTERNAL_SERVER_ERROR;
    const code = errObj.code || 'UNKNOWN_ERROR';
    const message = errObj.message || ERROR_HELPER.getMessage(ErrorKey.INTERNAL_SERVER_ERROR);

    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }

    res.status(statusCode).json({
      success: false,
      data: null,
      error: {
        message,
        code,
        statusCode
      }
    });
  } catch (error) {
    (error as Error).message = 'Internal Server Error at errorHandler line 27';
    next(error);
  }
}
