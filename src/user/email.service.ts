import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "sandbox.smtp.mailtrap.io", //env("EMAIL_SMTP_HOST"),
        port: "2525", //env("EMAIL_SMTP_PORT"),
        auth: {
          user: process.env.EMAIL_USER, //env("EMAIL_SMTP_USER"),
          pass: process.env.EMAIL_APP_PASS, //env("EMAIL_SMTP_PASS"),
        },
    });
  }

  async sendEmail(to: string, name: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to:to,
      subject:"testing purpose",
      text:`Hello ${name}, welcome to our Zoot!`,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', result);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}