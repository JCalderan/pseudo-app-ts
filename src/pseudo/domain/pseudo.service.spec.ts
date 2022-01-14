import { PseudoService } from './pseudo.service';
import { Pseudo, PSEUDO_MATCH_REGEXP } from './pseudo.model';
import { PseudoAdapter } from './pseudoAdapter';

const mockPseudoAdatper = (
    saveFn: (pseudo: Pseudo) => Promise<Pseudo>,
    findFn: (pseudo: Pseudo) => Promise<Pseudo>, 
    findLastRegisteredPseudoFn: () => Promise<Pseudo>): PseudoAdapter => {
    return {
        // TODO: make creation of pseudo simpler
        save: saveFn,
        find: findFn,
        findLastRegisteredPseudo: findLastRegisteredPseudoFn,
        // Noop transaction workflow
        startTransaction: () => Promise.resolve(null),
        commitTransaction: () => Promise.resolve(null),
        rollbackTransaction: () => Promise.resolve(null),
        closeTransaction: () => Promise.resolve(null),
    };
}

describe('PseudoService', () => {
  describe('Pseudo.registerPseudo', () => {
    it('should return a Pseudo from a valid input string', async () => {
      // Given
      const aStringValue = 'ANY';
      const aPseudoAdapterThatSaveAnyPseudo: PseudoAdapter = mockPseudoAdatper(
        (_) => Promise.resolve(_),
        (_) => Promise.resolve(undefined),
        () => Promise.resolve(undefined)
      );
      const pseudoService: PseudoService = new PseudoService(aPseudoAdapterThatSaveAnyPseudo);

      // When
      const aSavedPseudo: Pseudo = await pseudoService.registerPseudo(aStringValue);

      // Then
      expect(aSavedPseudo.getName()).toBe(aStringValue);
    });

    it('should return a succeeded GuardedValue<Pseudo> from an already taken input string', async () => {
        // Given
        const aStringUnavailable = 'ANX';
        const lastRegisteredPseudo = "ANY"
        const aPseudoAdapterThatResolveAnUnavailablePseudo: PseudoAdapter = mockPseudoAdatper(
            (_) => Promise.resolve(_),
            (_) => Promise.resolve(Pseudo.of(aStringUnavailable)),
            () => Promise.resolve(Pseudo.of(lastRegisteredPseudo))
        );
        const pseudoService: PseudoService = new PseudoService(aPseudoAdapterThatResolveAnUnavailablePseudo);
  
        // When
        const aSavedPseudo: Pseudo = await pseudoService.registerPseudo(aStringUnavailable);
  
        // Then
        expect(aSavedPseudo.getName()).toBe("ANZ");
      });

      it('should throw an Error when creating a Pseudo from an invalid input String', async () => {
        // Given
        const aStringValue = 'ANYTHING';
        const aPseudoAdapterThatSaveAnyPseudo: PseudoAdapter = mockPseudoAdatper(
            (_) => Promise.resolve(_),
            (_) => Promise.resolve(undefined),
            () => Promise.resolve(undefined)
        );
        const pseudoService: PseudoService = new PseudoService(aPseudoAdapterThatSaveAnyPseudo);

        // When
        const pseudoRegistration = () => pseudoService.registerPseudo(aStringValue);
        
        // Then
        // Must check jest to find how to extract error message from arrays
        await expect(pseudoRegistration).rejects.toBeInstanceOf(Error);
      });
  });
});
