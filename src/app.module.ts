import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./pseudo/postgres/postgres.typeOrmConfig.service";
import { PseudoModule } from "./pseudo/pseudo.module";


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    PseudoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
