import { computeNextPseudo, computePreviousPseudo } from './pseudo.utils';

describe('pseudo.utils module', () => {
  describe('computeNextPseudo', () => {
    it('should increment the first non-Z character from the end', () => {
      // Given
      const values: string[] = ['AAA', 'AAZ', 'AZZ', 'ZZZ'];

      // When
      const results: string[] = values.map((val) => computeNextPseudo(val));

      // Then
      expect(results).toEqual(['AAB', 'ABZ', 'BZZ', 'AAA']);
    });
  });

  describe('computePreviousPseudo', () => {
    it('should decrement the first non-Z character from the end', () => {
      // Given
      const values: string[] = ['AAA', 'AAZ', 'AZZ', 'ZZZ'];

      // When
      const results: string[] = values.map((val) => computePreviousPseudo(val));

      // Then
      expect(results).toEqual(['ZZZ', 'AAY', 'AZY', 'ZZY']);
    });
  });
});
