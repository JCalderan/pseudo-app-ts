import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log(this.configService);
    console.log('db password: ' + this.configService.get('db_password'));
    return {
      type: 'postgres',
      autoLoadEntities: true,
      host: this.configService.get('db_host'),
      port: this.configService.get<number>('db_port'),
      username: this.configService.get('db_userName'),
      password: this.configService.get('db_password'),
      database: this.configService.get('db_name'),
      synchronize: true,
    };
  }
}
