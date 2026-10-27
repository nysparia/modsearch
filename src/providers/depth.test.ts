import { describe, expect, it } from 'vitest';
import { DEFAULT_SEARCH_DEPTH, SEARCH_DEPTHS, parseSearchDepth } from './depth.ts';

describe('search depth vocabulary', () => {
  it('accepts every published level, trimmed and case-folded', () => {
    for (const depth of SEARCH_DEPTHS) {
      expect(parseSearchDepth(` ${depth.toUpperCase()} `)).toBe(depth);
    }
  });

  it('returns undefined for anything else rather than a silent default', () => {
    // The caller decides: the CLI refuses the write, the engine names the
    // value. Returning 'basic' here would hide both.
    for (const value of ['deep', '', '  ', undefined, null, 3, {}]) {
      expect(parseSearchDepth(value)).toBeUndefined();
    }
  });

  it('defaults to the cheapest level', () => {
    expect(DEFAULT_SEARCH_DEPTH).toBe('basic');
  });
});
