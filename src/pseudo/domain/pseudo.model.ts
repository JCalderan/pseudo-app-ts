import { Matches, validateSync, ValidationError } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { InvalidPseudoError } from './pseudo.exception';

export const PSEUDO_MATCH_REGEXP = /^[A-Z]{3}$/;

@Entity('pseudonymes.pseudo')
export class Pseudo {
  @PrimaryColumn()
  @Matches(PSEUDO_MATCH_REGEXP, {
    message: `Pseudo should contains only 3 upper Characters (${PSEUDO_MATCH_REGEXP})`,
  })
  name: string;

  @Column()
  @Matches(PSEUDO_MATCH_REGEXP, {
    message: `Pseudo should contains only 3 upper Characters (${PSEUDO_MATCH_REGEXP})`,
  })
  next_value: string;

  @Column({ default: false })
  next_value_used: boolean;

  @Column()
  @Matches(PSEUDO_MATCH_REGEXP, {
    message: `Pseudo should contains only 3 upper Characters (${PSEUDO_MATCH_REGEXP})`,
  })
  previous_value: string;

  @Column({ default: false })
  previous_value_used: boolean;

  // use a factory method to avoid throwing in constructor
  public static of(
    value: string,
    previous_value: string,
    next_value: string,
  ): Pseudo {
    const pseudo: Pseudo = new Pseudo(value, previous_value, next_value);
    const errors: ValidationError[] = validateSync(pseudo);
    if (errors.length == 0) return pseudo;
    throw new InvalidPseudoError(value, errors[0].constraints.matches);
  }

  private constructor(
    name: string,
    previous_value: string,
    next_value: string,
  ) {
    this.name = name;
    this.previous_value = previous_value;
    this.next_value = next_value;
    this.previous_value_used = false;
    this.next_value_used = false;
  }

  getName(): string {
    return this.name;
  }
}
