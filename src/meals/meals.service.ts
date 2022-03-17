import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { FetchResponseDto } from './dto/fetch-response.dto';
import { SenderService } from '../sender/sender.service';
import { DateTime } from 'luxon';

@Injectable()
export class MealsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly senderService: SenderService,
  ) {}

  public async fetch(date: string): Promise<FetchResponseDto> {
    const params = {
      categoryId: 221,
      yyyymmdd: date,
    };
    const response = await lastValueFrom(
      this.httpService.post(
        'https://mportal.ajou.ac.kr/portlet/p018/p018Text.ajax',
        params,
      ),
    );
    return response.data['p018Text'];
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    timeZone: 'Asia/Seoul',
  })
  public async routine() {
    const date = DateTime.local().setZone('Asia/Seoul').toFormat('yyyyMMdd');
    const response = await this.fetch(date);
    const content =
      '<img alt="ajous logo" width="128" src="https://ajous-10.s3.ap-northeast-2.amazonaws.com/public/ajous2.svg" /><br>' +
      '<span>Ajous Meals sent.</span><br><hr>' +
      Object.values(response).join('<br>');
    return this.senderService.sender(
      ['h5k@ajou.ac.kr'],
      'Ajous Meals',
      'meals@ajous.ga',
      `${date} Meal Notice.`,
      [content],
    );
  }
}
