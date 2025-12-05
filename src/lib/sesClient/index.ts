import { SESClient } from '@aws-sdk/client-ses';
import { SESv2Client } from '@aws-sdk/client-sesv2';
// Set the AWS Region.
const REGION = 'ap-southeast-2';
// Create SES service object.
const sesClient = new SESClient({ region: REGION });
const sesClientV2 = new SESv2Client({ region: REGION });

// import verifyEmailIdentity from './verifyEmailIdentity';
import createSesTemplate from './createSesTemplate';
import createContactList from './createContactList';
import sendEmail from './createSendEmail';

declare module '@aws-sdk/client-sesv2' {
  interface SESv2Client {
    createSesTemplate: typeof createSesTemplate;
    createContactList: typeof createContactList;
    sendEmail: typeof sendEmail;
  }
}
declare module '@aws-sdk/client-ses' {
  interface SESClient {
    sendEmail: typeof sendEmail;
  }
}
sesClientV2.createSesTemplate = createSesTemplate;
sesClientV2.createContactList = createContactList;
sesClient.sendEmail = sendEmail;
export { sesClient, sesClientV2 };
