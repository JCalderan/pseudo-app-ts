export class CreatePseudoDTO {
  name: string;
}

export class CreatedPseudoDTO {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
