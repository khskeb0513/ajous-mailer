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
    const date = DateTime.local().setZone('Asia/Tokyo').toFormat('yyyyMMdd');
    const response = await this.fetch(date);
    const content =
      '<img alt="ajous logo" width="128" src="https://ajous-10.s3.ap-northeast-2.amazonaws.com/public/ajous-logo.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECkaDmFwLW5vcnRoZWFzdC0yIkYwRAIgYxweFlg%2FCSqPoBt4dLHPwpZ8q%2B3TjAevB6eXYd5m09ACIFrV5LKjVxtp3oT44Cv4AkLWkcMsuM9nvMmnhCtsAi9KKu0CCKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjUyMjUyMjgwNDE1Igw%2B134Y44SWTUQfVa4qwQILs%2Btim21N%2BqnjRXCqsQPgyM2hq16Y%2FAyS3Ytx5Ydn%2F1urYBBRcq%2FcB4a6KHWPOz%2Fsuz4wxyafWAZgm3E3RbXdy35TjT8MZqZ%2BsxdLzckMKnrxWrmgvITs%2BoOrTXL%2Flmrt8OlFwfRPhUDGx6%2FKra8CkScRGzXt3dL%2FQz5ZMKn7kYmruYtaVwksguFWU%2FFLTdhDGceLLOrJ5IFFH2cIszOzLasqvh8l44z6%2FeQNt10z9OwG%2FreVuTY5vKyaEHkf9WiolEzloPqf%2BFzGklbWPBQRtMLUCMaPOYWrbb6AWPe07u1zxMQbktjU3eTaTPB4MV8dfmdhfxkXiSY9E%2F06d2rIVnWuS0Tp93w%2FJIfTBoPWdQrn8FVf4PMIKYMqp%2Fr3QarNy%2BBGtNmC8K7kUx8p%2FUBgSuK97cJ3XxZrrwOOgorDN%2Fwwl%2B3LkQY6tALMHlMtdTgwSkfZItAHOrUFSteM80G7WYBP6sHxwaZ6RYrOqJIVrO4AOMCsvtUcwPsPCvybfWT6%2FjC5xTUPhOtheNu4A%2FL%2BJbU8izJIbGFOq%2BK%2BeMl9GML24t3l%2Fwozgm1UlEWmQy0jEQOAUyhoT41jy1KCVY2EnegZ1R56WyuwhTwAQDSmDMw4IJrX5GKi%2F8y8fdHRjx%2BZhSk1R1SXxbuI9r2YtHVNW7E3jWGok4wscdQPzdOn%2BttNPVKi6fWz70sjUy5LpLM3BkcKef92IOw8wGWj14eOGaaWo8TyQZHDhSqmvHiDCHqv41DpHA66as%2B80Uo4B4mzl0fQBO0fxjDL3i%2FwfLIz4JGX9AUxBakT86TMFZaCVAE6KrAYgLKITgXGyR9eEbbiTK8vzRB%2FuCGsEE%2FMcg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220317T085946Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Credential=ASIATVO3IKZPUQ6T3722%2F20220317%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=61a387e6d54bd1da202ab04b0f14cbaf44dd3db6ca544869baa38287130792fa" /><br>' +
      '<span>Ajous Meals sent.</span><br><hr>' +
      Object.values(response).join('<br>');
    console.log(content);
    return this.senderService.sender(
      ['h5k@ajou.ac.kr'],
      'Ajous Meals',
      'meals@ajous.ga',
      `${date} Meal Notice.`,
      [content],
    );
  }
}
