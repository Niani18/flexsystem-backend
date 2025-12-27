import { Body, Controller, Post, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, Roles } from '../shared/decorators.js';
import { LogInDTO } from './dto/user-login.dto.js';
import { ClientRegisterDTO as ClientRegisterDTO, DealerRegisterDTO } from './dto/user-register.dto.js';
import { Role } from './role.enum.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LogInDTO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register-client')
  signUpClient(@Body() signUpDto: ClientRegisterDTO) {
    return this.authService.signUpClient(signUpDto);
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Post('register-dealer')
  signUpDealer(@Body() signUpDto: DealerRegisterDTO) {
    return this.authService.signUpDealer(signUpDto);
  }

}