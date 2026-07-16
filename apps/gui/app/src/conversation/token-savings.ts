const BENCHMARK_SAVINGS = {
  balanced: 0.496,
  direct: 0.835,
} as const;

export function sessionTotalTokens(tokens: unknown): number | undefined {
  if (!tokens || typeof tokens !== "object") return;
  const total = (tokens as Record<string, unknown>).total_tokens;
  return typeof total === "number" && Number.isFinite(total) && total >= 0 ? total : undefined;
}

export function observedTurnTokens(tokens: unknown, messageId: string): number | undefined {
  if (!tokens || typeof tokens !== "object") return;
  const turns = (tokens as Record<string, unknown>).turns;
  if (!turns || typeof turns !== "object") return;
  const runtimeId = messageId.endsWith(".message") ? messageId.slice(0, -8) : messageId;
  const total = (turns as Record<string, unknown>)[runtimeId];
  return typeof total === "number" && Number.isFinite(total) && total > 0 ? total : undefined;
}

export function benchmarkTokenSavings(agent: string | null | undefined, turaTokens: number) {
  const rate = BENCHMARK_SAVINGS[agent?.trim().toLowerCase() as keyof typeof BENCHMARK_SAVINGS];
  if (!rate || !Number.isFinite(turaTokens) || turaTokens <= 0) return;
  const codexEquivalent = Math.round(turaTokens / (1 - rate));
  return {
    rate,
    savedTokens: Math.max(0, codexEquivalent - turaTokens),
    codexEquivalent,
  };
}

export function formatTokenCount(tokens: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(tokens);
}
