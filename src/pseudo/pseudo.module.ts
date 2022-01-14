import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PseudoService } from 'src/pseudo/domain/pseudo.service';
import { TypeORMQueryRunnerFactory } from 'src/pseudo/postgres/postgres.connectionFactory';
import { PseudoController } from './http/pseudo.controller';
import { Pseudo } from './domain/pseudo.model';
import db_config from 'src/pseudo/postgres/postgres.configuration';

@Module({
  imports: [
    ConfigModule.forFeature(db_config),
    TypeOrmModule.forFeature([Pseudo]),
  ],
  providers: [TypeORMQueryRunnerFactory, PseudoService],
  controllers: [PseudoController],
})
export class PseudoModule {}
