import { EHttpStatusCode } from "./status";

export enum ErrorKey {
  BAD_REQUEST = 'BAD_REQUEST',
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_ERROR_KEY = 'INVALID_ERROR_KEY',
  DKMH_EXPIRED_TOKEN = 'DKMH_EXPIRED_TOKEN',
  DKMH_LOGIN_FAILED = 'DKMH_LOGIN_FAILED',
  DB_ERROR = 'DB_ERROR',
  MISSING_KEY = 'MISSING_KEY'
}

export const errTypes = {
  BAD_REQUEST: {
    status: 400,
    statusCode: EHttpStatusCode.BAD_REQUEST,
    message: 'Bad Request'
  },
  AUTH_REQUIRED: {
    status: 401,
    statusCode: EHttpStatusCode.AUTH_REQUIRED,
    message: 'Authentication Required'
  },
  FORBIDDEN: {
    status: 403,
    statusCode: EHttpStatusCode.FORBIDDEN,
    message: 'Forbidden'
  },
  NOT_FOUND: {
    status: 404,
    statusCode: EHttpStatusCode.NOT_FOUND,
    message: 'Not Found'
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error'
  },
  INVALID_ERROR_KEY: {
    status: 500,
    statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'Invalid error key'
  },
  DKMH_EXPIRED_TOKEN: {
    status: 1111,
    statusCode: EHttpStatusCode.AUTH_REQUIRED,
    message: 'DKMH expired token'
  },
  DKMH_LOGIN_FAILED: {
    status: 403,
    statusCode: EHttpStatusCode.FORBIDDEN,
    message: 'DKMH login failed'
  },
  DB_ERROR: {
    status: 500,
    statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'Database error'
  },
  MISSING_KEY: {
    status: 400,
    statusCode: EHttpStatusCode.BAD_REQUEST,
    message: 'Missing key'
  }
} as const;

export type TError = Omit<Error, 'code'> & (typeof errTypes)[keyof typeof errTypes];

// export type TErrorKey = keyof typeof errTypes;
