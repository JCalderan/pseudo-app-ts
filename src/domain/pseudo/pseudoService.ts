import { Injectable } from '@nestjs/common';
import { Pseudo } from './pseudo';
import { PseudoAdapter } from './pseudoAdapter';

@Injectable()
export class PseudoService {
    private readonly pseudoAdapter: PseudoAdapter;
    
    constructor(pseudoAdapter: PseudoAdapter) {
        this.pseudoAdapter = pseudoAdapter;
    }
    
    private computeNextAvailablePseudo(previousValue: string): string {
        // the algorithm assumes values will be guessed incrementally from db, until "ZZZ" is found
        if (previousValue == "ZZZ") {
            throw new Error("All possible values seems to be taken.");
        }
        const tokens = [...previousValue];
        const toReplace: (string | number)[] = tokens
            // reverse token order, as the algorithm will update the last one first (ie: AAA => AAB)
            .reverse()
            .map((token, idx) => [token, idx])
            .find(tuple => tuple[0] != "Z");
        
        // could use array.splice, but prefer to stay "immutable"
        return tokens
            // replace token with next letter
            .map((token, idx) => idx == toReplace[1] ? String.fromCharCode(token.charCodeAt(0) + 1): token)
            // put back tokens in the right order
            .reverse()
            .join("");
    }
    
    async registerPseudo(stringValue: string): Promise<Pseudo> {
        let pseudo: Pseudo;
        try {
            pseudo = Pseudo.of(stringValue)
            await this.pseudoAdapter.startTransaction();
            const existingPseudo: Pseudo = await this.pseudoAdapter.find(pseudo);
            if(existingPseudo) {
                const lastRegisteredPseudo: Pseudo = await this.pseudoAdapter.findLastRegisteredPseudo();
                // only one computation here, as the transaction should ensure we don't get stale reads from db
                const nextAvailablePseudoValue: string = this.computeNextAvailablePseudo(lastRegisteredPseudo.getName());
                pseudo = Pseudo.of(nextAvailablePseudoValue);
            }
            const savedPseudo: Pseudo = await this.pseudoAdapter.save(pseudo);
            await this.pseudoAdapter.commitTransaction();
        } catch (error) {
            await this.pseudoAdapter.rollbackTransaction();
            return Promise.reject(error);
        } finally {
            await this.pseudoAdapter.closeTransaction();
        }

        return pseudo;
    }
}
