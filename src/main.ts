import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(configService.get<number>('config.port'), '0.0.0.0', () => {
    Logger.log(
      `app listening at ${configService.get<number>('config.port')} with env ${configService.get<number>(
        'config.environment',
      )}`,
      'main.ts',
    );
  });
}
bootstrap();
