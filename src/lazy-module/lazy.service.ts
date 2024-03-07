import { Injectable } from '@nestjs/common';

@Injectable()
export class LazyService {
  sayLazy(): void {
    console.log('Hello lazy');
  }
}
