export class InvalidPseudoError extends Error {
  constructor(pseudoValue: string, reason: string) {
    super(`Invalid pseudo '${pseudoValue}' : ${reason}`);
  }
}

export class NoPseudoAvailableError extends Error {
  constructor(pseudoValue: string) {
    super(
      `Unable to create Pseudo ${pseudoValue}: pseudo already exists and no other pseudo is available`,
    );
  }
}
