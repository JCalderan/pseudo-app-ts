export function computeNextPseudo(pseudoValue: string): string {
  if (pseudoValue == 'ZZZ') return 'AAA';
  return computePseudoValue(pseudoValue, true);
}

export function computePreviousPseudo(pseudoValue: string): string {
  if (pseudoValue == 'AAA') return 'ZZZ';
  return computePseudoValue(pseudoValue, false);
}

function computePseudoValue(pseudoValue: string, next_value: boolean): string {
  const limitToken: string = next_value ? 'Z' : 'A';
  const incremental_value: number = next_value ? 1 : -1;
  const tokens = [...pseudoValue];
  const toReplace: (string | number)[] = tokens
    // reverse token order, as the algorithm will update the last one first (ie: AAA => AAB or ZZZ => ZZY)
    .reverse()
    .map((token, idx) => [token, idx])
    .find((tuple) => tuple[0] != limitToken);

  // could have used array.splice
  return (
    tokens
      // replace token with next letter
      .map((token, idx) =>
        idx == toReplace[1]
          ? String.fromCharCode(token.charCodeAt(0) + incremental_value)
          : token,
      )
      // put back tokens in the right order
      .reverse()
      .join('')
  );
}
