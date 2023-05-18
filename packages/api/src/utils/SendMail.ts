import transporter from "../config/SMTP";

export function sendMail(to: string, subject: string, text: string) {
  transporter.sendMail(
    {
      from: process.env.MAIL_CONFIG_USER,
      to,
      subject,
      text,
    },
    (error, info) => {
      if (error) {
        return process.exit(1);
      }

      transporter.close();
    }
  );
}
