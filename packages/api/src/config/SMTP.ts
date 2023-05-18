import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_CONFIG_HOST,
  port: parseInt(process.env.MAIL_CONFIG_PORT),
  // secure: JSON.parse(process.env.MAIL_CONFIG_SECURE),
  auth: {
    user: process.env.MAIL_CONFIG_USER,
    pass: process.env.MAIL_CONFIG_PASS,
  },
});

export default transporter;
