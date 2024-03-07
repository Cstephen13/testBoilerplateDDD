import { Module } from '@nestjs/common';
import { LazyController } from './lazy.controller';
import { LazyService } from './lazy.service';

@Module({
  providers: [LazyService],
  controllers: [LazyController],
})
export class LazyModule {}
