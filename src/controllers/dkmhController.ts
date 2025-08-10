import { NextFunction, Request, Response } from 'express';
import { handleFetchResponse } from '~/utils/handleDkmhResponse';
import { createHttpSuccess } from '~/utils/createHttpResponse';
import { EHttpStatusCode } from '~/types/http';

const BASE_DKMH_URL = 'https://dkmh.tdmu.edu.vn/api';

const getAccessToken = (req: Request) => {
  const authHeader = req.headers['dkmh-authorization'] ?? '';
  return typeof authHeader === 'string' ? authHeader.split(' ')[1] : '';
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { access_token } = req.body;
    console.log(' MM ', access_token);
    const url = `${BASE_DKMH_URL}/auth/login`;
    const body = `username=user@gw&password={{password}}&grant_type=password`.replace('{{password}}', access_token);

    const obj = {
      username: 'user@gw',
      password: access_token,
      uri: 'https://dkmh.tdmu.edu.vn/#/home'
    };

    // Bước 1: JSON.stringify
    const jsonString = JSON.stringify(obj);

    // Bước 2: encode Base64 URL-safe
    const base64 = btoa(jsonString) // <- dùng trong trình duyệt
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // xóa dấu "=" ở cuối (URL-safe)

    const response = await fetch(BASE_DKMH_URL + '/pn-signin?code=' + base64 + '&gopage=&mgr=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const dataJson = await response.json();
    const result = handleFetchResponse<{ access_token: string }>({
      ...dataJson,
      data: dataJson
    });

    console.log('zz result', result);
    res.status(EHttpStatusCode.OK).json(createHttpSuccess(result));
  } catch (err) {
    next(err);
  }
};

export const tkbTuanHocKy = async (req: Request, res: Response, next: NextFunction) => {
  const { hoc_ky } = req.body;
  const access_token = getAccessToken(req);
  console.log(access_token);
  const url = `${BASE_DKMH_URL}/sch/w-locdstkbtuanusertheohocky`;
  const payload = {
    filter: {
      hoc_ky: hoc_ky ?? 20242,
      ten_hoc_ky: ''
    },
    additional: {
      paging: {
        limit: 3,
        page: 1
      },
      ordering: [
        {
          name: null,
          order_type: null
        }
      ]
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(payload)
    });

    const data = handleFetchResponse(await response.json());
    res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
};

export const ketQuaHocTap = async (req: Request, res: Response, next: NextFunction) => {
  const { hoc_ky } = req.body;
  const access_token = getAccessToken(req);

  const url = `${BASE_DKMH_URL}/dkmh/w-inketquahoctap`;
  const payload = {
    hoc_ky: hoc_ky ?? 20241
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(payload)
    });

    const data = handleFetchResponse(await response.json());
    res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
};

export const getDSThongBao = async (req: Request, res: Response, next: NextFunction) => {
  const access_token = getAccessToken(req);
  const url = `https://dkmh.tdmu.edu.vn/api/web/w-locdschucnang`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    }
  });

  const data = handleFetchResponse(await response.json());
  res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
};

export const studentInfo = async (req: Request, res: Response, next: NextFunction) => {
  const access_token = getAccessToken(req);

  const url = `${BASE_DKMH_URL}/dkmh/w-locsinhvieninfo`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    });

    const data = handleFetchResponse(await response.json());
    res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
};

export const getHocKy = async (req: Request, res: Response, next: NextFunction) => {
  const { payload } = req.body;
  const access_token = getAccessToken(req);

  const url = `${BASE_DKMH_URL}/sch/w-locdshockytkbuser`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(payload)
    });
    const json = await response.json();
    console.log(json);
    const data = handleFetchResponse(json);
    res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
};
