import { errTypes, TError, ErrorKey } from './error';

export enum EHttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  AUTH_REQUIRED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export type TResponse<T = unknown> = {
  success: boolean;
  data: T | null;
  error: TError | null;
};

export type TResponseDKMH<T = any> = {
  result: boolean;
  message: string;
  code: number;
  data?: T;
};

export { errTypes, ErrorKey, TError };
