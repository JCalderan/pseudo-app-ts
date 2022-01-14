import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';

@Injectable()
export class TypeORMQueryRunnerFactory {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  getQueryRunner(): QueryRunner {
    return this.connection.createQueryRunner();
  }
}
