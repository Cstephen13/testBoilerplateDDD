import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { OtherService } from './services/other.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService, OtherService],
})
export class CatsModule {}
