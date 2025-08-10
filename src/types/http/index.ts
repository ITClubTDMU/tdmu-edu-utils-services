import { errTypes, TError, ErrorKey } from './error';

import { EHttpStatusCode } from './status';

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

export { errTypes, ErrorKey, TError, EHttpStatusCode };
