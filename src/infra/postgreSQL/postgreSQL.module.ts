import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMQueryRunnerFactory } from "src/infra/postgreSQL/postgreSQLConnectionFactory";
import { PostgreSQLPseudoAdapter } from "./postgresqlPseudoAdapter";
import { PseudoEntity } from "./pseudoEntity";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        // TODO: check useFactory method
        TypeOrmModule.forFeature([PseudoEntity]),
        ConfigModule.forFeature(),
    ],
    providers: [
        TypeORMQueryRunnerFactory,
        PostgreSQLPseudoAdapter
    ]
})
export class PostgreSQLModule {};