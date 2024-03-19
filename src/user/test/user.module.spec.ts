import { UserModule } from '../user.module';
import { Test } from '@nestjs/testing';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../config/app.config';
import authConfig from '../../config/auth.config';

describe('UserModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, authConfig],
          envFilePath: '.env',
        }),
        InfrastructureModule,
        UserModule,
      ],
    }).compile();

    expect(module).toBeDefined();
  });
});
