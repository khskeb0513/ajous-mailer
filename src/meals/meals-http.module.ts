import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { HttpModule } from '@nestjs/axios';
import { SenderModule } from '../sender/sender.module';
import { MealsModule } from './meals.module';

@Module({
  controllers: [MealsController],
  providers: [MealsService],
  imports: [HttpModule, SenderModule, MealsModule],
  exports: [MealsService],
})
export class MealsHttpModule {}
