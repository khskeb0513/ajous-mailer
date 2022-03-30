import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { IsDevelopmentGuard } from '../auth/is-development.guard';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get('/fetch')
  public async fetch(@Query('date') date: string) {
    return this.mealsService.fetch(date);
  }

  @Get('/render')
  public async render(@Query('date') date: string) {
    if (!date) throw new HttpException('invalid date', 400);
    return this.mealsService.render(date);
  }

  @Get('/routine')
  @UseGuards(IsDevelopmentGuard)
  public async routine() {
    return this.mealsService.routine();
  }

  @Post('/register')
  public async register(@Body('email') email: string) {
    return this.mealsService.register(email);
  }

  @Post('/changeSuspendStatus')
  public async changeSuspendStatus(@Body('email') email: string) {
    return this.mealsService.changeSuspendStatus(email).catch((e) => {
      throw new HttpException(e.message, 400);
    });
  }

  @Get('/findAllEmails')
  @UseGuards(IsDevelopmentGuard)
  public async findAllEmails() {
    return this.mealsService.findAllEmails();
  }
}
