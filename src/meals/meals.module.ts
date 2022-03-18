import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsSendListEntity } from './entity/meals-send-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealsSendListEntity])],
  exports: [TypeOrmModule],
})
export class MealsModule {}
