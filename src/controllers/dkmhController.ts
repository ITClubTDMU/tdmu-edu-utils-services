import { Request, Response } from 'express';
import { resError, resSuccess } from '~/utils/responseFormat';

const BASE_DKMH_URL = 'https://dkmh.tdmu.edu.vn/api';

export const login = async (req: Request, res: Response) => {
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

  const data = await response.json();

  res.status(200).json(resSuccess(data, 'login dkmh successfully, 200'));
};

export const tkbTuanHocKy = async (req: Request, res: Response) => {
  const { access_token } = req.body;

  const url = `${BASE_DKMH_URL}/sch/w-locdstkbtuanusertheohocky`;
  const payload = {
    filter: {
      hoc_ky: 20242,
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

    const data = await response.json();
    res.status(200).json(resSuccess(data.data, 'tkbTuanHocKy fetched successfully', 200));
  } catch (err) {
    console.error('Error fetching tkbTuanHocKy:', err);
    res.status(500).json(resError('Failed to fetch tkbTuanHocKy', 500));
  }
};
