import { Entity, Column, PrimaryColumn } from 'typeorm';
import {Matches} from 'class-validator';
import { PSEUDO_MATCH_REGEXP } from 'src/domain/pseudo/pseudo';

/*
    Debatable: Entities being tightly coupled to the serialization process, 
    I decided to separate them from their domain module.
    Ie: this class is tightly coupled to TypeORM and PostgreSQL
*/
@Entity({
    name: 'pseudonymes'
})
export class PseudoEntity {
    @PrimaryColumn()
    @Matches(PSEUDO_MATCH_REGEXP)
    name: string;
}