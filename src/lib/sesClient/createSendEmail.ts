import { SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';
import { sesClientV2 } from '.';

const sendEmail = async (input: SendEmailCommandInput) => {
  const sendEmailCommand = new SendEmailCommand(input);
  try {
    return await sesClientV2.send(sendEmailCommand);
  } catch (e: any) {
    console.error(e);
    throw e;
  }
};

export default sendEmail;
