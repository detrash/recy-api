import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { Mail } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(mail: Mail) {
    return await this.resend.emails.send(mail);
  }
}
