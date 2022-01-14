import { Pseudo } from './pseudo.model';

describe('Pseudo', () => {
  describe('Pseudo.of', () => {
    it('should return a Pseudo from a valid input string', () => {
      // Given
      const aStringValue = 'ABC';

      // When
      const aValidPSeudo: Pseudo = Pseudo.of(aStringValue);

      // Then
      expect(aValidPSeudo.getName()).toBe(aStringValue);
    });
  });

  describe('Pseudo.of', () => {
    it('should return a Pseudo from an invalid input string', () => {
      // Given
      const aStringValue = 'ABCE';

      // When
      const anInvalidPseudoCreation = () => Pseudo.of(aStringValue);

      // Then
      expect(anInvalidPseudoCreation).toThrow(Error);
    });
  });
});
