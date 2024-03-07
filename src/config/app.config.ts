import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    environment: process.env.APP_ENV || 'development',
    port: process.env.APP_PORT || 3000,
  };
});
