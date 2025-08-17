import { Request, Response, NextFunction } from 'express';
import { ErrorKey, TError } from '~/types/http/error';
import { EHttpStatusCode } from '~/types/http';
import { ERROR_HELPER } from '~/utils/error';

export function errorHandler(errObj: TError, req: Request, res: Response, next: NextFunction) {
  try {
    const statusCode = errObj.statusCode || EHttpStatusCode.INTERNAL_SERVER_ERROR;
    const status = errObj.status || 'UNKNOWN_ERROR';
    const message = errObj.message || ERROR_HELPER.getMessage(ErrorKey.INTERNAL_SERVER_ERROR);

    if (process.env.NODE_ENV !== 'production') {
      console.error(errObj);
    }

    res.status(status).json({
      success: false,
      data: null,
      error: {
        message,
        status,
        statusCode
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(errObj);
    }

    (error as Error).message = 'Internal Server Error at errorHandler line 27';
    next(error);
  }
}
