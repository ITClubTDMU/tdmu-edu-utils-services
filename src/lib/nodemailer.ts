import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'minhnv155@gmail.com',
    pass: process.env.GOOGLE_APP_PASSWORD
  }
});

export default transporter;
