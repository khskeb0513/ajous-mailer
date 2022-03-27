import { Module } from '@nestjs/common';
import { MealsHttpModule } from './meals/meals-http.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SenderModule } from './sender/sender.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsSendListEntity } from './meals/entity/meals-send-list.entity';
import { AssignmentsModule } from './assignments/assignments.module';
import { GlobalModule } from './global/global.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [
    MealsHttpModule,
    ScheduleModule.forRoot(),
    SenderModule,
    ConfigModule.forRoot({
      envFilePath: ['.development.env', '.production.env'],
      validate,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env['DB_HOST'],
      port: parseInt(process.env['DB_PORT'], 10),
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_NAME'],
      entities: [MealsSendListEntity],
      synchronize: true,
    }),
    AssignmentsModule,
    GlobalModule,
    LibraryModule,
  ],
})
export class AppModule {}
