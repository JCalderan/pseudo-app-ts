import { Body, Controller, Post } from '@nestjs/common';
import { Pseudo } from '../domain/pseudo.model';
import { PseudoService } from '../domain/pseudo.service';
import { CreatedPseudoDTO, CreatePseudoDTO } from './pseudo.dto';

@Controller('pseudo')
export class PseudoController {
  constructor(private readonly pseudoService: PseudoService) {}

  @Post()
  async signup(
    @Body() createPseudoDTO: CreatePseudoDTO,
  ): Promise<CreatedPseudoDTO> {
    const pseudo: Pseudo = await this.pseudoService.registerPseudo(
      createPseudoDTO.name,
    );
    return new CreatedPseudoDTO(pseudo.name);
  }
}
