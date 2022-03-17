import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';

@Module({
  providers: [SenderService]
})
export class SenderModule {}
