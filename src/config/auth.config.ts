import { registerAs } from '@nestjs/config';
import { AuthConfig } from './types/auth-config.type';

export default registerAs<AuthConfig>('auth', () => {
  return {
    secret: process.env.AUTH_JWT_SECRET,
    accessTokenExpires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
    saltRounds: process.env.SALT_ROUNDS,
  };
});
