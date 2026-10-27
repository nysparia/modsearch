// Retrieval depth, the one ranking knob an engine API exposes rather than
// derives. Tavily is the only engine that forwards it today.
//
// It exists as a setting because the choice is not cosmetic. `basic` ranks by
// literal term overlap: a query whose words happen to name another domain
// ("terminal" the shipping terminal, "notes" the senior notes, "release" the
// press release) comes back as confidently ranked noise, and every result after
// the first is already below any sensible cutoff. `advanced` runs the semantic
// pass instead and costs more credits per search. The engine cannot pick well
// on the user's behalf, so the user picks.
//
// This module is a leaf: no imports, so the config layer and the provider can
// both read it without either owning the other.

export const SEARCH_DEPTHS = ['basic', 'advanced', 'fast', 'ultra'] as const;

export type SearchDepth = (typeof SEARCH_DEPTHS)[number];

/** What Tavily applies when the setting is absent or the file says nothing. */
export const DEFAULT_SEARCH_DEPTH: SearchDepth = 'basic';

/**
 * A known depth, trimmed and lowercased, or undefined for anything else.
 * Callers decide whether an unknown value is a fallback or an error: the CLI
 * refuses it at write time, while an engine receiving one from a hand-edited
 * file names it instead of silently searching shallower than asked.
 */
export function parseSearchDepth(value: unknown): SearchDepth | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  return (SEARCH_DEPTHS as readonly string[]).includes(normalized)
    ? (normalized as SearchDepth)
    : undefined;
}
