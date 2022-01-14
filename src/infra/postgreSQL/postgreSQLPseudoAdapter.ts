import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pseudo } from "src/domain/pseudo/pseudo";
import { FailedTransaction, FinishedTransaction, PseudoAdapter, StartedTransaction } from "src/domain/pseudo/pseudoAdapter";
import { QueryRunner, Repository } from "typeorm";
import { TypeORMQueryRunnerFactory } from "./postgreSQLConnectionFactory";
import { PseudoEntity } from "./pseudoEntity";


@Injectable()
export class PostgreSQLPseudoAdapter implements PseudoAdapter {
    private pseudoRepository: Repository<PseudoEntity>;
    private queryRunnerFactory: TypeORMQueryRunnerFactory;
    private queryRunner: QueryRunner;

    constructor(
        @InjectRepository(PseudoEntity) pseudoRepository: Repository<PseudoEntity>,
        queryRunnerFactory: TypeORMQueryRunnerFactory
    ) {
        this.pseudoRepository = pseudoRepository;
        this.queryRunnerFactory = queryRunnerFactory;
        this.queryRunner = null;
    }

    async find(pseudo: Pseudo): Promise<Pseudo> {
        try {
            const existingPSeudo: PseudoEntity = await this.pseudoRepository.findOne({"name": pseudo.getName()});
            return existingPSeudo !== undefined ? Pseudo.of(existingPSeudo.name) : undefined;
        } catch(error) {
            // TODO: use logger
            return Promise.reject(error);
        }
    }
   
    async findLastRegisteredPseudo(): Promise<Pseudo> {
        try {
            const results: PseudoEntity[] = await this.pseudoRepository.find({
                order: {"name": "DESC"},
                take: 1
            });
            if(results.length > 0) {
                const lastRegisteredPseudo: PseudoEntity = results[0];
                return Pseudo.of(lastRegisteredPseudo.name);
            }
            return undefined;
        } catch (error) {
            // TODO: use logger
            return Promise.reject(error);
        }
    }
    
    async save(pseudo: Pseudo): Promise<Pseudo> {
        try {
            const pseudoToSave: PseudoEntity = this.pseudoRepository.create({name: pseudo.getName()});
            await this.pseudoRepository.save(pseudoToSave);
            return pseudo;
        } catch (error) {
            // TODO: use logger
            return Promise.reject(error);
        }
    }
    
    async startTransaction(): Promise<StartedTransaction> {
        this.queryRunner = this.queryRunnerFactory.getQueryRunner();
        // being lazy here, making this class statefull
        // not sure how this will interact with nestjs DI :/
        // can't wrap my head around hexagonal architecture with transactions in nestjs :'(
        return this;
    }
    
    async commitTransaction(): Promise<FailedTransaction | FinishedTransaction> {
        this.queryRunner.commitTransaction();
        return this;
    }

    async rollbackTransaction(): Promise<FinishedTransaction> {
        this.queryRunner.rollbackTransaction();
        return this;
    }
    
    async closeTransaction() {
        this.queryRunner.release();
        return this;
    }
}