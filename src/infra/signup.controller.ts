import { Controller, Get } from '@nestjs/common';
import { PseudoService } from '../domain/app.service';

@Controller('signup')
export class SignupController {
  constructor(private readonly appService: PseudoService) {}

  @Get()
  signup(): string {
    return this.appService.signup();
  }
}
