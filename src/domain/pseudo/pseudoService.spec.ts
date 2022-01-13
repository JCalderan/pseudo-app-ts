import { Test, TestingModule } from '@nestjs/testing';
import { PseudoService } from './pseudoService';
import { GuardedValue } from '../utils/guard';
import { Pseudo } from './pseudo';
import { PseudoAdapter } from './pseudoAdapter';

describe('PseudoService', () => {
  describe('Pseudo.registerPseudo', () => {
    it('should return a succeeded GuardedValue<Pseudo> from a valid input string', () => {
      // Given
      const aStringValue = 'ANY';
      const aPseudoAdapterImpl: PseudoAdapter = {
        // TODO: make creation of pseudo simpler
        saveWithCurrentValueOrWithNextAvailable: (_) => Pseudo.of(aStringValue) 
      };
      const pseudoService: PseudoService = new PseudoService(aPseudoAdapterImpl);

      // When
      const aSavedPseudo: GuardedValue<Pseudo> = pseudoService.registerPseudo(aStringValue);

      // Then
      expect(aSavedPseudo.succeeded()).toBe(true);
      expect(aSavedPseudo.getValue().getValue()).toBe(aStringValue);
      expect(aSavedPseudo.getReason()).toBe(null);
    });

    it('should return a succeeded GuardedValue<Pseudo> from an already taken input string', () => {
        // Given
        const aStringUnavailable = 'ANY';
        const anotherStringAvailable = "ANV"
        const aPseudoAdapterImpl: PseudoAdapter = {
          saveWithCurrentValueOrWithNextAvailable: (_) => Pseudo.of(anotherStringAvailable) 
        };
        const pseudoService: PseudoService = new PseudoService(aPseudoAdapterImpl);
  
        // When
        const aSavedPseudo: GuardedValue<Pseudo> = pseudoService.registerPseudo(aStringUnavailable);
  
        // Then
        expect(aSavedPseudo.succeeded()).toBe(true);
        expect(aSavedPseudo.getValue().getValue()).toBe(anotherStringAvailable);
        expect(aSavedPseudo.getReason()).toBe(null);
      });

      it('should return a failed GuardedValue<Pseudo> from an invalid input String', () => {
        // Given
        const aStringValue = 'ANYTHING';
        const aPseudoAdapterImpl: PseudoAdapter = {
            saveWithCurrentValueOrWithNextAvailable: (_) => Pseudo.of(aStringValue) 
        };
        const pseudoService: PseudoService = new PseudoService(aPseudoAdapterImpl);

        // When
        const aSavedPseudo: GuardedValue<Pseudo> = pseudoService.registerPseudo(aStringValue);

        // Then
        expect(aSavedPseudo.succeeded()).toBe(false);
        expect(aSavedPseudo.getValue().getValue()).toBe(aStringValue);
        expect(aSavedPseudo.getReason()).toBe("");
      });
  });
  
});
