import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PseudoService } from "src/pseudo/domain/pseudo.service";
import { TypeORMQueryRunnerFactory } from "src/pseudo/postgres/postgres.connectionFactory";
import { PostgreSQLPseudoAdapter } from "src/pseudo/postgres/postgres.pseudo.adapter";
import { PseudoEntity } from "src/pseudo/postgres/postgres.pseudo.entity";
import db_config from "src/pseudo/postgres/postgres.configuration";

@Module({
    imports: [
        ConfigModule.forFeature(db_config),
        TypeOrmModule.forFeature([PseudoEntity]),
    ],
    providers: [
        {
            // workaround: nestjs can't inject using interface only, so we use Symbols to dertermine which implementation to use.
            provide: "PSEUDO_ADAPTER",
            useValue: PostgreSQLPseudoAdapter
        },
        TypeORMQueryRunnerFactory,
        PseudoService
    ],
})
export class PseudoModule {};