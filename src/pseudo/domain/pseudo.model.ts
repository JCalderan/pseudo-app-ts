import { Matches, validateSync, ValidationError } from 'class-validator';
import { Entity, PrimaryColumn } from 'typeorm';

export const PSEUDO_MATCH_REGEXP = /^[A-Z]{3}$/;

@Entity('pseudonymes.pseudo')
export class Pseudo {
  @PrimaryColumn()
  @Matches(PSEUDO_MATCH_REGEXP, {
    message: `Pseudo should contains only 3 upper Characters (${PSEUDO_MATCH_REGEXP})`,
  })
  name: string;

  // use a factory method to avoid throwing in constructor
  public static of(value: string): Pseudo {
    const pseudo: Pseudo = new Pseudo(value);
    const errors: ValidationError[] = validateSync(pseudo);
    if (errors.length == 0) return pseudo;
    throw new Error(`Invalid Pseudo: ${errors[0].constraints.matches}`);
  }

  private constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}
