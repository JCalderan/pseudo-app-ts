import { Body, Controller, Post } from '@nestjs/common';
import {
  InvalidPseudoError,
  NoPseudoAvailableError,
} from '../domain/pseudo.exception';
import { Pseudo } from '../domain/pseudo.model';
import { PseudoService } from '../domain/pseudo.service';
import { CreatedPseudoDTO, CreatePseudoDTO } from './pseudo.dto';
import {
  InvalidPseudoHTTPError,
  NoPseudoAvailableHTTPError,
} from './pseudo.exception';
import { ValidationPipe } from './pseudo.validationPipe';

@Controller('pseudo')
export class PseudoController {
  constructor(private readonly pseudoService: PseudoService) {}

  @Post()
  async signup(
    @Body(new ValidationPipe()) createPseudoDTO: CreatePseudoDTO,
  ): Promise<CreatedPseudoDTO> {
    try {
      const pseudo: Pseudo = await this.pseudoService.registerPseudo(
        createPseudoDTO.name,
      );
      return new CreatedPseudoDTO(pseudo.name);
    } catch (error) {
      if (error instanceof InvalidPseudoError)
        throw new InvalidPseudoHTTPError(error);
      if (error instanceof NoPseudoAvailableError)
        throw new NoPseudoAvailableHTTPError(error);
      throw error;
    }
  }
}
