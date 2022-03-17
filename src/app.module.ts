import { Module } from '@nestjs/common';
import { MealsModule } from './meals/meals.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SenderModule } from './sender/sender.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MealsModule,
    ScheduleModule.forRoot(),
    SenderModule,
    ConfigModule.forRoot({
      envFilePath: ['.development.env', '.production.env'],
    }),
  ],
})
export class AppModule {}
