import { Test, TestingModule } from '@nestjs/testing';
import { GuardedValue } from '../utils/guard';
import { Pseudo } from './pseudo';

describe('Pseudo', () => {
  describe('Pseudo.of', () => {
    it('should return a succeeded GuardedValue<Pseudo> from a valid input string', () => {
      // Given
      const aStringValue = 'ABC';

      // When
      const aValidPSeudo: GuardedValue<Pseudo> = Pseudo.of(aStringValue);

      // Then
      expect(aValidPSeudo.succeeded()).toBe(true);
      // Poor Demeter
      expect(aValidPSeudo.getValue().getValue()).toBe(aStringValue);
      expect(aValidPSeudo.getReason()).toBe(null);
    });
  });

  describe('Pseudo.of', () => {
    it('should return a failed GuardedValue<Pseudo> from an invalid input string', () => {
      // Given
      const aStringValue = 'ABCE';

      // When
      const anInvalidPseudo: GuardedValue<Pseudo> = Pseudo.of(aStringValue);

      // Then
      expect(anInvalidPseudo.succeeded()).toBe(false);
      expect(anInvalidPseudo.getValue().getValue()).toBe(aStringValue);
      expect(anInvalidPseudo.getReason()).toBe("Pseudo should contains only 3 upper Characters (/^[A-Z]{3}$/g)");
    });
  });
});
