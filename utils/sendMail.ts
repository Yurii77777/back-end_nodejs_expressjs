import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendMail = async (mail: MailDataRequired): Promise<boolean> => {
  try {
    await sgMail.send(mail);
    return true;
  } catch (error) {
    console.error('[send_email_error] :::', error.response.body);
    return false;
  }
};
