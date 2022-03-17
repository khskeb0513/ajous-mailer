import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { HttpModule } from '@nestjs/axios';
import { SenderModule } from '../sender/sender.module';

@Module({
  controllers: [MealsController],
  providers: [MealsService],
  imports: [HttpModule, SenderModule],
})
export class MealsModule {}
