import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // ví dụ: Anhbuonanhkhocvianhyeuem@gmail.com
    pass: process.env.EMAIL_PASS, // app password
  },
});

export default transporter; 