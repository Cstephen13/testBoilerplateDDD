import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Public } from '../auth/decorators/public.decorator';
import { OtherService } from './services/other.service';

@Controller('cats')
export class CatsController {
  constructor(
    private catsService: CatsService,
    private otherService: OtherService,
  ) {}
  @Public()
  @Get()
  sayRequest() {
    //console.log(this.catsService.request);
    console.log(this.catsService.onModuleInit());
  }
}
