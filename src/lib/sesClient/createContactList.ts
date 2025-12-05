// Import required AWS SDK clients and commands for Node.js
import { CreateContactListCommand, CreateContactListCommandInput } from '@aws-sdk/client-sesv2';
import { sesClient } from '../sesClient';

const createCreateContactListCommand = (input: CreateContactListCommandInput) => {
  return new CreateContactListCommand(input);
};

const createContactList = async (input: CreateContactListCommandInput) => {
  const createContactListCommand = createCreateContactListCommand(input);
  try {
    return await sesClient.send(createContactListCommand);
  } catch (e: any) {
    if (e.response['Error']['Code'] == 'AlreadyExistsException') console.error(`This Contact List already exists.`);
    else {
      console.error(e);
      throw e;
    }
  }
};

export default createContactList;
