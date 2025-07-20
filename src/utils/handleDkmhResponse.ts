import { ErrorKey, TResponseDKMH } from '~/types/http';
import { createHttpErr } from './createHttpResponse';

function handleFetchResponse<T>(data: TResponseDKMH<T>) {
  if (data.result === false) {
    if (data.code === 400 && data.message === 'expired')
      throw createHttpErr(ErrorKey.DKMH_EXPIRED_TOKEN, 'The token is expired');

    throw {
      code: data.code,
      message: data.message ?? 'Unknown error from remote server'
    };
  }
  return data.data as T;
}

export { handleFetchResponse };
