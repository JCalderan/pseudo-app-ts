import { Pseudo } from './pseudo.model';

export interface Transaction {
  startTransaction(): Promise<StartedTransaction>;
}

export interface StartedTransaction {
  commitTransaction(): Promise<FinishedTransaction | FailedTransaction>;
}

export interface FailedTransaction {
  rollbackTransaction(): Promise<FinishedTransaction>;
}

export interface FinishedTransaction {
  closeTransaction();
}

export interface PseudoAdapter
  extends Transaction,
    StartedTransaction,
    FailedTransaction,
    FinishedTransaction {
  find(pseudo: Pseudo): Promise<Pseudo | undefined>;
  findLastRegisteredPseudo(): Promise<Pseudo>;
  save(pseudo: Pseudo): Promise<Pseudo>;
}
