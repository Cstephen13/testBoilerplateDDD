import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthLoginDto } from './dto/auth-login-dto';
import { CreateUserDto } from '../user/presentation/dto/create-user.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: AuthLoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: CreateUserDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('access-token')
  async getAccessToken(@Body() tokenDto: TokenDto) {
    return await this.authService.getAccessToken(tokenDto.refreshToken);
  }
}
