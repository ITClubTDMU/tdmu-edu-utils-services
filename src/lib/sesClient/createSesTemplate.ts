import { SESClient, CreateTemplateCommand, CreateTemplateCommandInput } from '@aws-sdk/client-ses'; // ES Modules import
import { sesClient } from '../sesClient';

const createTemplateCommand = (template: CreateTemplateCommandInput) => {
  return new CreateTemplateCommand(template);
};

const createSesTemplate = async (template: CreateTemplateCommandInput) => {
  const templateCommand = createTemplateCommand(template);

  try {
    return await sesClient.send(templateCommand);
  } catch (e: any) {
    if (e['Error']['Code'] == 'AlreadyExistsException') console.error(`This template already exists.`);
    else {
      console.error(e);
      throw e;
    }
  }
};

export default createSesTemplate;
