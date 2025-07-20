import { ErrorKey, TError, TResponse } from '~/types/http';
import { ERROR_HELPER } from './error';

export const createHttpErr = (err: ErrorKey | TError, message?: string) => {
  const errObj = ERROR_HELPER.isErrorKey(err) ? ERROR_HELPER.getObj(err) : err;

  const customMessage = message ? errObj.message + ' : ' + message : errObj.message;
  return {
    ...errObj,
    message: customMessage
  };
};

export const createHttpSuccess = <T = any>(data: T): TResponse<T> => {
  return {
    data,
    success: true,
    error: null
  };
};
