import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { TypeORMQueryRunnerFactory } from '../postgres/postgres.connectionFactory';
import { Pseudo } from './pseudo.model';

@Injectable()
export class PseudoService {
  private pseudoRepository: Repository<Pseudo>;
  private queryRunnerFactory: TypeORMQueryRunnerFactory;

  constructor(
    @InjectRepository(Pseudo) pseudoRepository: Repository<Pseudo>,
    queryRunnerFactory: TypeORMQueryRunnerFactory,
  ) {
    this.pseudoRepository = pseudoRepository;
    this.queryRunnerFactory = queryRunnerFactory;
  }

  private computeNextAvailablePseudo(previousValue: string): string {
    // the algorithm assumes values will be guessed incrementally from db, until "ZZZ" is found
    if (previousValue == 'ZZZ') {
      throw new Error('All possible values seems to be taken.');
    }
    const tokens = [...previousValue];
    const toReplace: (string | number)[] = tokens
      // reverse token order, as the algorithm will update the last one first (ie: AAA => AAB)
      .reverse()
      .map((token, idx) => [token, idx])
      .find((tuple) => tuple[0] != 'Z');

    // could use array.splice, but prefer to stay "immutable"
    return (
      tokens
        // replace token with next letter
        .map((token, idx) =>
          idx == toReplace[1]
            ? String.fromCharCode(token.charCodeAt(0) + 1)
            : token,
        )
        // put back tokens in the right order
        .reverse()
        .join('')
    );
  }

  async registerPseudo(stringValue: string): Promise<Pseudo> {
    let pseudo: Pseudo;
    const queryRunner: QueryRunner = this.queryRunnerFactory.getQueryRunner();
    try {
      await queryRunner.startTransaction();
      pseudo = Pseudo.of(stringValue);
      const existingPseudo: Pseudo = await this.find(pseudo);
      if (existingPseudo) {
        const lastRegisteredPseudo: Pseudo =
          await this.findLastRegisteredPseudo();
        // only one computation here, as the transaction should ensure we don't get stale reads from db
        const nextAvailablePseudoValue: string =
          this.computeNextAvailablePseudo(lastRegisteredPseudo.getName());
        pseudo = Pseudo.of(nextAvailablePseudoValue);
      }
      console.log('saving pseudo');
      pseudo = await this.pseudoRepository.save(pseudo);
      console.log(pseudo);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return Promise.reject(error);
    } finally {
      await queryRunner.release();
    }
    return pseudo;
  }

  async find(pseudo: Pseudo): Promise<Pseudo> {
    try {
      return await this.pseudoRepository.findOne(pseudo.getName());
    } catch (error) {
      // TODO: use logger
      return Promise.reject(error);
    }
  }

  async findLastRegisteredPseudo(): Promise<Pseudo> {
    try {
      const results: Pseudo[] = await this.pseudoRepository.find({
        order: { name: 'DESC' },
        take: 1,
      });
      return results.length ? results[0] : undefined;
    } catch (error) {
      // TODO: use logger
      return Promise.reject(error);
    }
  }
}
