import { InvalidPseudoError } from './pseudo.exception';
import { Pseudo } from './pseudo.model';

describe('Pseudo', () => {
  describe('Pseudo.of', () => {
    it('should return a Pseudo valid name / previousValue / nextValue', () => {
      // Given
      // When
      const aValidPSeudo: Pseudo = Pseudo.of('AAB', 'AAA', 'AAC');

      // Then
      expect(aValidPSeudo.name).toBe('AAB');
      expect(aValidPSeudo.previous_value).toBe('AAA');
      expect(aValidPSeudo.next_value).toBe('AAC');
      expect(aValidPSeudo.previous_value_used).toBe(false);
      expect(aValidPSeudo.next_value_used).toBe(false);
    });
  });

  it('should return a Pseudo from an invalid name', () => {
    // Given
    // When
    const anInvalidPseudoCreation = () => Pseudo.of('ABCD', 'ABC', 'AAB');

    // Then
    expect(anInvalidPseudoCreation).toThrow(Error);
  });

  it('should return a Pseudo from an invalid previous_value', () => {
    // Given
    // When
    const anInvalidPseudoCreation = () => Pseudo.of('AAA', 'ABCD', 'AAB');

    // Then
    expect(anInvalidPseudoCreation).toThrow(Error);
  });

  it('should return a Pseudo from an invalid nextValue', () => {
    // Given
    // When
    const anInvalidPseudoCreation = () => Pseudo.of('AAA', 'ABC', 'AABC');

    // Then
    expect(anInvalidPseudoCreation).toThrow(InvalidPseudoError);
  });
});
