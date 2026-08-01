# Design system

## Thesis

Provenance: the product exists to give answers you can trace to their sources. The
one bold move is the grounding rail in the answer view; everything else stays
quiet and instrument-like.

## Tokens

Colors are CSS variables in `globals.css`, themed for light and dark and consumed
through Tailwind (`bg-background`, `text-muted-foreground`, and so on). A single
iris primary carries interaction. A reserved amber `cite` token is used only for
citation markers and their source cards, never decoratively.

## Type

Bricolage Grotesque for display, Inter for body, JetBrains Mono for data (scores,
ids, chunk ordinals, counts), loaded via `next/font`.

## Primitives

Radix-based components in `src/components/ui`: button, input, textarea, label,
card, badge (with a `cite` variant), dialog, select, dropdown menu, tooltip,
separator, avatar, table, skeleton, toast, plus small helpers (spinner, kbd,
empty state). Each is a thin, styled wrapper kept consistent by the token set.

## Motion

Restrained: fades and short slide-ups on overlays, a shimmer on skeletons, a
pulsing caret while an answer streams, and a live pulse on the ingestion monitor.
Nothing gratuitous.

## Accessibility

Semantic HTML, focus-visible rings on interactive elements, dialog titles for
screen readers (including the command palette), keyboard navigation in the
palette, and status conveyed by text and shape, not color alone.
