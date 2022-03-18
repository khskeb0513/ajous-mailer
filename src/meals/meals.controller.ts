import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MealsService } from './meals.service';
import { IsDevelopmentGuard } from '../auth/is-development.guard';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get('/fetch')
  public async fetch(@Query('date') date: string) {
    return this.mealsService.fetch(date);
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

  @Get('/findAllEmails')
  @UseGuards(IsDevelopmentGuard)
  public async findAllEmails() {
    return this.mealsService.findAllEmails();
  }
}
