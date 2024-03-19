import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PostgresTypeOrmConfigService } from './database/services/postgres-type-orm-config.service';
import { UserRepository } from './database/repositories/user.repository';
import { UserPort } from './ports/user.port';
import { UserMapper } from './mappers/user.mapper.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: PostgresTypeOrmConfigService,
    }),
  ],
  providers: [UserRepository, UserPort, UserMapper],
  exports: [UserRepository, UserPort, UserMapper],
})
export class InfrastructureModule {}
