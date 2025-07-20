import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
// import { router } from "./routes";
import { config } from './config';
import { routerV1 } from './routes/v1';
import { errorHandler } from './middlewares/errorHandler';
import { ErrorKey } from './types/http/error';

// global.__basedir = __dirname;

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/api/v1', routerV1);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/test', (req, res) => {
  throw ErrorKey.AUTH_REQUIRED;
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
});
