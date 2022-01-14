import { Body, Controller, Post } from '@nestjs/common';
import { Pseudo } from 'src/pseudo/domain/pseudo.model';
import { PseudoService } from 'src/pseudo/domain/pseudo.service';

class CreatePseudoDTO {
  name: string
}

@Controller('pseudo')
export class PseudoController {
  constructor(private readonly pseudoService: PseudoService) {}

  @Post()
  async signup(@Body() createPseudoDTO: CreatePseudoDTO): Promise<Pseudo> {
    const pseudo: Pseudo = await this.pseudoService.registerPseudo(createPseudoDTO.name);
    return pseudo;
  }
}
