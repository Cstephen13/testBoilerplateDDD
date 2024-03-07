import { Injectable } from '@nestjs/common';
import { ConfigService } from './dynamic-test/config.service';

@Injectable()
export class AppService {
  private readonly helloMessage: string;

  constructor(configService: ConfigService) {
    this.helloMessage = configService.get('HELLO_MESSAGE');
  }

  getHello(): string {
    return this.helloMessage;
  }
}
