import { Injectable, OnModuleInit } from '@nestjs/common';
import { LazyModuleLoader, ModuleRef } from '@nestjs/core';
import { OtherService } from './services/other.service';
import { LazyService } from '../lazy-module/lazy.service';

@Injectable()
export class CatsService implements OnModuleInit {
  private service: OtherService;
  constructor(
    private moduleRef: ModuleRef,
    private lazyModuleLoader: LazyModuleLoader,
  ) {}

  async onModuleInit() {
    this.service = this.moduleRef.get(OtherService);
    const { LazyModule } = await import('../lazy-module/lazy.module');
    const lazymodule = await this.lazyModuleLoader.load(() => LazyModule);
    console.log('--------------ssss------------>', lazymodule.get(LazyService));
    console.log('-------------------------->', this.service);
  }
}
