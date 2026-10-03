import nodemailer, { type SendMailOptions } from "nodemailer";

let transporter: nodemailer.Transporter | undefined;

export async function sendEmail(options: SendMailOptions) {
  const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_SENDER } = process.env;
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error("EMAIL_USER and EMAIL_PASSWORD must be configured");
  }

  transporter ??= nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
  });

  return transporter.sendMail({ ...options, from: EMAIL_SENDER || EMAIL_USER });
}
