import { Injectable } from '@nestjs/common';
import { GuardedValue } from '../utils/guard';
import { Pseudo } from './pseudo';
import { PseudoAdapter } from './pseudoAdapter';

@Injectable()
export class PseudoService {
  private readonly pseudoAdapter: PseudoAdapter;

  constructor(pseudoAdapter: PseudoAdapter) {
    this.pseudoAdapter = pseudoAdapter;
  }

  registerPseudo(pseudo: string): GuardedValue<Pseudo> {
    const guardedPseudo: GuardedValue<Pseudo> = Pseudo.of(pseudo);
    // TODO: implement custom exceptions
    if (!guardedPseudo.succeeded()) throw new Error(`An error occured while creating the pseudo ${pseudo}: ${guardedPseudo.getReason()}`);

    const savedPseudo: GuardedValue<Pseudo> = this.pseudoAdapter.saveWithCurrentValueOrWithNextAvailable(guardedPseudo.getValue());
    if(!savedPseudo.succeeded()) throw new Error(`An error occured while creating the pseudo ${pseudo}: ${savedPseudo.getReason()}`);
    
    return savedPseudo;
  }
}
