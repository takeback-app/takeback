import { sendMail } from "../../utils/SendMail";

interface Props {
  mail: string;
}

class TestSendMailsUseCase {
  async execute({ mail }: Props) {
    sendMail(
      mail,
      "TAKEBACK - TEST SEND MAIL",
      "CONGRATULATIONS, TAKE BACK EMAILS ARE BEING SENT SUCCESSFULLY!"
    );

    return "Send mail test";
  }
}

export { TestSendMailsUseCase };
