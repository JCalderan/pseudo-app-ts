import { Test, TestingModule } from '@nestjs/testing';
import { Guard, Validator, GuardedValue } from './guard';

describe('GuardModule', () => {
  describe('Validator', () => {
    it('should wrap an Error message for a given predicate', () => {
        // Given
        const aPredicate = (value: string) => value.length === 3;
        const anErrorMsg = "boom";

        // When
        const aValidator = new Validator(aPredicate, anErrorMsg);

        // Then
        expect(aValidator.getMessage()).toBe(anErrorMsg);
    });

    it('apply the wrapped predicate to any passed value (validated predicate)', () => {
        // Given
        const aValue: string = "ABC";
        const aPredicate = (value: string) => value.length === 3;
        const anErrorMsg = "boom";
        const aValidator = new Validator(aPredicate, anErrorMsg);

        // When
        const result: boolean = aValidator.validate(aValue);

        // Then
        expect(result).toBe(true);
    });

    it('apply the wrapped predicate to any passed value (failed predicate)', () => {
        // Given
        const aValue: string = "ABC";
        const aPredicate = (value: string) => value.length <= 3;
        const anErrorMsg = "boom";
        const aValidator = new Validator(aPredicate, anErrorMsg);

        // When
        const result: boolean = aValidator.validate(aValue);

        // Then
        expect(result).toBe(true);
    });
  });

  describe('GuardedValue', () => {
    it('should wrap a validated value without any error message', () => {
        // Given
        const aValidatedValue: number = 123;

        // When
        const aGuardedValue = GuardedValue.validated(aValidatedValue);

        // Then
        expect(aGuardedValue.getValue()).toBe(aValidatedValue);
        expect(aGuardedValue.getReason()).toBe(null);
    });

    it('should wrap a failed value with an error message', () => {
        // Given
        const aFailedValue: number = 123;
        const aReason: string = "boom"

        // When
        const aGuardedValue = GuardedValue.failed(aFailedValue, aReason);

        // Then
        expect(aGuardedValue.getValue()).toBe(aFailedValue);
        expect(aGuardedValue.getReason()).toBe(aReason);
    });
  });

  describe('Guard', () => {
    it('should be initialized with a value', () => {
        // Given
        const aValueToBeGuarded: number = 123;

        // When
        const guard = new Guard(aValueToBeGuarded);

        // Then
        expect(guard.getValue()).toBe(aValueToBeGuarded);
    });

    it('should verify all validator until one fail', () => {
        // Given
        const aGuard: Guard<number> = new Guard(1)
            .verifyThat(new Validator(val => val >= 0, "should be >= 0"))
            .verifyThat(new Validator(val => val == 0, "should be == 0"))
            .verifyThat(new Validator(val => val < 0, "should be < 0"));

        // When
        const result: GuardedValue<number> = aGuard.validate();

        // Then
        expect(result.succeeded()).toBe(false);
        expect(result.getReason()).toBe("should be == 0");
    });

    it('should verify all validator if none fail', () => {
        // Given
        const aGuard: Guard<number> = new Guard(1)
            .verifyThat(new Validator(val => val > 0, "should be > 0"))
            .verifyThat(new Validator(val => val < 2, "should be < 2"))
            .verifyThat(new Validator(val => val == 1, "should be == 1"));

        // When
        const result: GuardedValue<number> = aGuard.validate();

        // Then
        expect(result.succeeded()).toBe(true);
        expect(result.getReason()).toBe(null);
    });
  });
});
