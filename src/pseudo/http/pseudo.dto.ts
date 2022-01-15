import { IsString } from 'class-validator';

export class CreatePseudoDTO {
  @IsString()
  name: string;
}

export class CreatedPseudoDTO {
  @IsString()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
