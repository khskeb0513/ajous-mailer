import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { SenderModule } from '../sender/sender.module';
import { MealsModule } from './meals.module';

@Module({
  controllers: [MealsController],
  providers: [MealsService],
  imports: [SenderModule, MealsModule],
  exports: [MealsService],
})
export class MealsHttpModule {}
