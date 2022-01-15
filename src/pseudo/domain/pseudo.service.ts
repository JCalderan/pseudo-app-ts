import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { TypeORMQueryRunnerFactory } from '../postgres/postgres.connectionFactory';
import { NoPseudoAvailableError } from './pseudo.exception';
import { Pseudo } from './pseudo.model';
import { computeNextPseudo, computePreviousPseudo } from './pseudo.utils';

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

  async registerPseudo(stringValue: string): Promise<Pseudo> {
    let pseudo: Pseudo;
    const queryRunner: QueryRunner = this.queryRunnerFactory.getQueryRunner();
    try {
      await queryRunner.startTransaction();
      const existingPseudo: Pseudo = await this.findByName(stringValue);
      if (existingPseudo !== undefined) {
        pseudo = await this.findAvailablePseudo();
        if (pseudo === undefined) throw new NoPseudoAvailableError(stringValue);
        await this.updateAdjacentPseudo(pseudo);
      } else {
        pseudo = Pseudo.of(
          stringValue,
          computePreviousPseudo(stringValue),
          computeNextPseudo(stringValue),
        );
      }
      pseudo = await this.pseudoRepository.save(pseudo);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return Promise.reject(error);
    } finally {
      await queryRunner.release();
    }
    return pseudo;
  }

  private async findAvailablePseudo(): Promise<Pseudo> {
    let availablePseudo: Pseudo;
    const aPseudoWithPrevValueAvailable: Pseudo =
      await this.findPseudoWithPreviousAvailable();
    if (aPseudoWithPrevValueAvailable) {
      const availablePseudoValue: string =
        aPseudoWithPrevValueAvailable.previous_value;
      availablePseudo = Pseudo.of(
        availablePseudoValue,
        computePreviousPseudo(availablePseudoValue),
        aPseudoWithPrevValueAvailable.name,
      );
      availablePseudo.next_value_used = true;
      return availablePseudo;
    }
    const aPseudoWithNextValueAvailable: Pseudo =
      await this.findPseudoWithNextValueAvailable();
    if (aPseudoWithNextValueAvailable) {
      const availablePseudoValue: string =
        aPseudoWithNextValueAvailable.next_value;
      availablePseudo = Pseudo.of(
        availablePseudoValue,
        aPseudoWithNextValueAvailable.name,
        computeNextPseudo(availablePseudoValue),
      );
      availablePseudo.previous_value_used = true;
      return availablePseudo;
    }
  }

  private async updateAdjacentPseudo(pseudo: Pseudo) {
    const previousPseudo: Pseudo = await this.findByName(pseudo.previous_value);
    if (previousPseudo) {
      previousPseudo.next_value_used = true;
      await this.pseudoRepository.save(previousPseudo);
    }
    const nextPseudo: Pseudo = await this.findByName(pseudo.next_value);
    if (nextPseudo) {
      nextPseudo.previous_value_used = true;
      await this.pseudoRepository.save(nextPseudo);
    }
  }

  private async findByName(name: string): Promise<Pseudo> {
    try {
      return await this.pseudoRepository.findOne(name);
    } catch (error) {
      // TODO: use logger
      return Promise.reject(error);
    }
  }

  private async findPseudoWithNextValueAvailable(): Promise<Pseudo> {
    try {
      const availablePseudoResults: Pseudo[] = await this.pseudoRepository.find(
        {
          where: [{ next_value_used: 0 }],
          take: 1,
        },
      );
      return availablePseudoResults.length
        ? availablePseudoResults[0]
        : undefined;
    } catch (error) {
      // TODO: use logger
      return Promise.reject(error);
    }
  }

  private async findPseudoWithPreviousAvailable(): Promise<Pseudo> {
    try {
      const availablePseudoResults: Pseudo[] = await this.pseudoRepository.find(
        {
          where: [{ previous_value_used: 0 }],
          take: 1,
        },
      );
      return availablePseudoResults.length
        ? availablePseudoResults[0]
        : undefined;
    } catch (error) {
      // TODO: use logger
      return Promise.reject(error);
    }
  }
}
