import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
// import { router } from "./routes";
import { config } from './config';
import { routerV1 } from './routes/v1';
import { errorHandler } from './middlewares/errorHandler';
import { ErrorKey } from './types/http/error';
import { createHttpErr } from './utils/createHttpResponse';
import { ensureDir } from './utils/esureDir';

import fsLib from './lib/fs';
import path from 'path';
import { sbdb } from './lib/supabase';

ensureDir('public');
ensureDir(fsLib.path.archive);

// global.__basedir = __dirname;
const app = express();

// cấu hình CORS
const corsOptions = {
  origin: [
    'http://localhost:3000', // React/Next.js local
    'https://yourdomain.com', // domain production
    'http://192.168.43.5:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/' + fsLib.path.archive, express.static(path.join(__dirname, '../archive')));

app.use(cors(corsOptions));

app.use('/api/v1', routerV1);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/test', (req, res) => {
  throw createHttpErr(ErrorKey.AUTH_REQUIRED, 'Missing access_token');
});

app.use(errorHandler);

// import OpenAI from 'openai';
// const client = new OpenAI();

// app.get('/test-chat', async (req: Request, res: Response) => {
//   const response = await client.responses.create({
//     model: 'gpt-4.1',
//     input: 'Write a one-sentence bedtime story about a unicorn.'
//   });

//   console.log(response.output_text);
//   res.status(200).json({
//     message: "OK"
//   })
// });

app.listen(config.port, () => {

  console.log(`Server running on port ${config.port}`);
  fetch("https://dkmh.tdmu.edu.vn/api/pn-signin?code=eyJ1c2VybmFtZSI6InVzZXJAZ3ciLCJwYXNzd29yZCI6InlhMjkuYTBBUzNINk54WnpVdVlWbEFvNWtTRGR6QjNZY1hGbFU5ZUdsckw2QXBLNWJzWTRZQXJUSklUYUd6SFRWQ1dZVXU2aTU4UjBtb0diTFJHYVczc3Vtem1QWXF3cnRoRkpYWmduMjU3UFB0SXFnS2E3bXY3bFhDcVBjbm9YQ204cG4zUFg0bS1kZm5xNUktZTVZelBkWUIzYm44UnZrNW5WdXZvbHdBRWs4UlZReWU3WTJHcmJJTnFidE9jSFNWaG5FWXdybGV5YzhrMklBYUNnWUtBYVFTQVJjU0ZRSEdYMk1pZzJlOTBxb0xkejNaWkdXNDhiVjROQTAyMDkiLCJ1cmkiOiJodHRwczovL2RrbWgudGRtdS5lZHUudm4vIy9ob21lIn0%3D&gopage=&mgr=1", { redirect: "manual" })
  .then(res => {
    console.log(res.status);       // thường là 302
    console.log(res.headers.get("location")); 
  });
});
// dkmh signIn
// static signIn(De, e, t="#/", et=!1, Tt="") {
//   this.signInErrorMsg = "";
//   const Pt = new URL(window.location.href.toLowerCase());
//   let xn = JSON.stringify({
//       username: De,
//       password: e,
//       uri: Pt.origin + Pt.pathname + t
//   });
//   xn = encodeURIComponent(v.toBase64(xn)),
//   window.open(`${N.apiPrefix}pn-signin?code=${xn}&gopage=${Tt}&mgr=${et ? "1" : "0"}`, "_self")
// }