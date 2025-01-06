import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'tyreek.ankunding@ethereal.email',
      pass: 'VtVJRgDCUdWvxYNGKF'
  }
});
