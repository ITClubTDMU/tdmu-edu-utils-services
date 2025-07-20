import { NextFunction, Request, Response } from 'express';
import { handleFetchResponse } from '~/utils/handleDkmhResponse';
import { createHttpSuccess } from '~/utils/createHttpResponse';
import { EHttpStatusCode } from '~/types/http';

const BASE_DKMH_URL = 'https://dkmh.tdmu.edu.vn/api';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { access_token } = req.body;

    const url = `${BASE_DKMH_URL}/auth/login`;
    const body = `username=user@gw&password={{password}}&grant_type=password`.replace('{{password}}', access_token);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });

    const data = handleFetchResponse(await response.json());

    res.status(EHttpStatusCode.OK).json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
};

export const tkbTuanHocKy = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, hoc_ky } = req.body;

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
  const { access_token, hoc_ky } = req.body;

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
  const { access_token } = req.body;
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
  const { access_token } = req.body;

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
  const { access_token } = req.body;

  const url = `${BASE_DKMH_URL}/sch/w-locdshockytkbuser`;
  const payload = {
    filter: {
      is_tieng_anh: null
    },
    additional: {
      paging: {
        limit: 100,
        page: 1
      },
      ordering: [
        {
          name: 'hoc_ky',
          order_type: 1
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
