import { Controller, Get } from '@nestjs/common';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get('/fetch')
  public async fetch() {
    return this.mealsService.fetch();
  }

  @Get('/routine')
  public async routine() {
    return this.mealsService.routine();
  }
}
