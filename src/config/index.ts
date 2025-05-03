import dotenv from 'dotenv';
// import nodemailer from 'nodemailer'

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

// Create a transporter for sending emails
// export const transporter = nodemailer.createTransport({
//   service: process.env.SERVICE_EMAIL,
//   auth: {
//     user: process.env.USER_AUTH,
//     pass: process.env.PASS_AUTH
//   }
// })

export const config = {
  port: process.env.PORT || 8087,
  dbUrl: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  logs: {
    // Used by winston logger
    level: process.env.LOG_LEVEL || 'silly'
  },
  api: {
    prefix: '/api'
  },
  emails: {
    // SENDGRID email credentials
    apiKey: process.env.SENDGRID_API_KEY,
    sender: process.env.SENDGRID_SENDER
  }
};

export enum MODES {
  TEST = 'test',
  LOCAL = 'local',
  DEV = 'development',
  PROD = 'production'
}
