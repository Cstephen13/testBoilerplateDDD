import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly helloMessage: string;

  constructor() {
    this.helloMessage = 'Hello World!';
  }

  getHello(): string {
    return this.helloMessage;
  }
}
