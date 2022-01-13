import { string } from 'yargs';
import {Guard, Validator, GuardedValue} from '../utils/guard';

const PSEUDO_MATCH_REGEXP: RegExp = /^[A-Z]{3}$/g;

export class Pseudo {
    private readonly value: string;
    private static readonly validators: Array<Validator<string>> = [
        // adding a new predicate based rule is just a "push" to this array
        new Validator(val => PSEUDO_MATCH_REGEXP.test(val),`Pseudo should contains only 3 upper Characters (${PSEUDO_MATCH_REGEXP})`)
    ];

    public static of(value: string) : GuardedValue<Pseudo> {
        const guard = new Guard(value);
        const validatedValue = this.validators
            .reduce((prev: Guard<string>, curr: Validator<string>) => prev.verifyThat(curr), guard)
            .validate();

        return validatedValue.succeeded() ? 
            GuardedValue.validated(new Pseudo(value)) :
            GuardedValue.failed(new Pseudo(value), validatedValue.getReason());
    }

    private constructor(value: string) {
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }
}