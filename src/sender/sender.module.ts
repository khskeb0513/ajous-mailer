import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [SenderService],
  imports: [HttpModule],
  exports: [SenderService],
})
export class SenderModule {}
