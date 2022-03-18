import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { FetchResponseDto } from './dto/fetch-response.dto';
import { SenderService } from '../sender/sender.service';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { MealsSendListEntity } from './entity/meals-send-list.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MealsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly senderService: SenderService,
    @InjectRepository(MealsSendListEntity)
    private readonly mealsSendListEntityRepository: Repository<MealsSendListEntity>,
  ) {}

  public async register(email: string) {
    const query = await this.mealsSendListEntityRepository.save({
      email,
    });
    return query.createdAt;
  }

  public async changeSuspendStatus(email: string) {
    const findQuery = await this.mealsSendListEntityRepository.findOne({
      where: {
        email,
      },
    });
    if (!findQuery) {
      throw new Error('invalid email');
    }
    await this.mealsSendListEntityRepository.update(
      {
        email: findQuery.email,
      },
      {
        suspend: !findQuery.suspend,
      },
    );
    return { suspend: findQuery.suspend };
  }

  public async findAllEmails() {
    const query = await this.mealsSendListEntityRepository.find({
      where: {
        suspend: false,
      },
    });
    return query.map((v) => v.email);
  }

  public async render(date: string) {
    const response = await this.fetch(date);
    if (!response) return null;
    return (
      `<style>body { font-family: serif } .main { text-align: center; }</style><body><header><img alt="ajous logo" width="128" src="https://ajous-10.s3.ap-northeast-2.amazonaws.com/public/ajous2.svg" /><br>
      <span style="font-style: italic">Ajous Meals sent.</span><hr></header><div class="main">` +
      Object.values(response).join('<br>') +
      `</div></body>`
    );
  }

  public async fetch(date: string): Promise<FetchResponseDto | null> {
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
    const p018Text = response.data['p018Text'];
    return Object.values(p018Text).length === 0 ? null : p018Text;
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM, {
    timeZone: 'Asia/Seoul',
  })
  public async routine() {
    const date = DateTime.local().setZone('Asia/Seoul').toFormat('yyyyMMdd');
    const content = await this.render(date);
    if (!content) return false;
    return this.senderService.sender(
      await this.findAllEmails(),
      'Ajous Meals',
      'meals@ajous.ga',
      `${date} Meal Notice.`,
      content,
    );
  }
}
