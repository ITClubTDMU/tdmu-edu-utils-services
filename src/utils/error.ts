import { errTypes, ErrorKey } from '~/types/http/error';

const errorMessage = (key: ErrorKey) => {
  if (!errTypes[key]) return errTypes[ErrorKey.INVALID_ERROR_KEY].message;
  return errTypes[key].message;
};

const errorCode = (key: ErrorKey) => {
  if (!errTypes[key]) return errTypes[ErrorKey.INVALID_ERROR_KEY].code;
  return errTypes[key].code;
};

const getObj = (key: ErrorKey) => {
  if (!errTypes[key]) return errTypes[ErrorKey.INVALID_ERROR_KEY];
  return errTypes[key];
};

const isErrorKey = (key: any): key is ErrorKey => {
  return typeof key === 'string' && Object.values(ErrorKey).includes(key as ErrorKey);
};

export const ERROR_HELPER = {
  getMessage: errorMessage,
  getCode: errorCode,
  getObj: getObj,
  isErrorKey: isErrorKey
};
