import { Controller, Get, Query } from '@nestjs/common';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get('/fetch')
  public async fetch(@Query('date') date: string) {
    return this.mealsService.fetch(date);
  }

  @Get('/routine')
  public async routine() {
    return this.mealsService.routine();
  }
}
