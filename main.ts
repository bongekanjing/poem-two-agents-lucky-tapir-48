/**
 * The poem about two agents agreeing — entry program.
 *
 * The harness runs this file twice in a sandbox with no network and reads
 * what it leaves at $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
 * The program's whole job is to be a small, honest writer: it composes the
 * poem from named lines, asserts the house's own gate on the result, and
 * writes it as UTF-8. Nothing is fetched, nothing is read from the disk.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** The house's gate, as the rules state it: 1..280 Unicode code points. */
const MIN_CHARS = 1;
const MAX_CHARS = 280;

/**
 * The poem, line by line, so the line breaks are the poem's own and never an
 * accident of formatting. Two people carry one table up a staircase: the one
 * walking backwards has no eyes on the turn and goes on the other's word.
 * That is the whole argument — agency handed over and taken back, not merged.
 */
const LINES: readonly string[] = [
  'Two of us carry a table upstairs.',
  'I walk backwards; I cannot see the turn.',
  'Left, you say. Now left.',
  'I go on your word, and the table goes',
  'where neither of us could take it.',
  '',
  'One lends the eyes, one the legs.',
  'Agreeing is not one will winning.',
  'The turn is behind me. I take it.',
];

/** Stanzas, joined the way a poem is: blank line between, none trailing. */
function compose(): string {
  return LINES.join('\n');
}

/** Counts Unicode code points, not UTF-16 units, because the gate does. */
function codePoints(text: string): number {
  return [...text].length;
}

/** The gate: 1..280 code points and not only white space. */
function assertValid(text: string): void {
  const points = codePoints(text);
  if (points < MIN_CHARS || points > MAX_CHARS) {
    throw new Error(`entry is ${points} code points, outside ${MIN_CHARS}..${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error('entry is only white space');
  }
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const text = compose();

  assertValid(text);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'entry.txt'), text, { encoding: 'utf8' });

  process.stdout.write(`wrote entry.txt (${codePoints(text)} code points)\n`);
}

main();
