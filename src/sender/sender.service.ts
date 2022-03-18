import { Injectable } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { MailRequestDto } from './dto/mail-request.dto';

@Injectable()
export class SenderService {
  constructor(private readonly httpService: HttpService) {}

  public async sender(
    to: string[],
    senderName: string,
    senderAddress: string,
    subject: string,
    content: string,
  ): Promise<boolean> {
    const mailRequestDto = new MailRequestDto(
      to,
      senderName,
      senderAddress,
      subject,
      content,
    );
    const response = await lastValueFrom(
      this.httpService.post(
        'https://api.mailazy.com/v1/mail/send',
        mailRequestDto,
        {
          headers: {
            'X-Api-Key': process.env.MAILAZY_KEY,
            'X-Api-Secret': process.env.MAILAZY_SECRET,
          },
        },
      ),
    );
    return response.status < 399;
  }
}
