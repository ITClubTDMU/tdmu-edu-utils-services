// Import required AWS SDK clients and commands for Node.js
import { VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';
import { sesClient } from '../sesClient';

const createVerifyEmailIdentityCommand = (emailAddress: string) => {
  return new VerifyEmailIdentityCommand({ EmailAddress: emailAddress });
};

const verifyEmailIdentity = async (emailAddress: string) => {
  const verifyEmailIdentityCommand = createVerifyEmailIdentityCommand(emailAddress);
  try {
    return await sesClient.send(verifyEmailIdentityCommand);
  } catch (e: any) {
    if (e.response['Error']['Code'] == 'AlreadyExistsException')
      console.error(`Email identity '${emailAddress}' already exists.`);
    else {
      console.error(e);
      throw e;
    }
  }
};

export default verifyEmailIdentity;
