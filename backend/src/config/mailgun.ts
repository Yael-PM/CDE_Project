import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { env } from './env';

const mailgun = new Mailgun(FormData);

export const mg = mailgun.client({
  username: 'api',
  key: env.MAILGUN_API_KEY,
  url: env.MAILGUN_REGION === 'EU'
    ? 'https://api.eu.mailgun.net'
    : 'https://api.mailgun.net'
});
