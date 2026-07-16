import { expect, test } from "bun:test";
import {
  benchmarkTokenSavings,
  observedTurnTokens,
  sessionTotalTokens,
} from "../../../app/src/conversation/token-savings";

test("projects only published agent benchmarks from exact session totals", () => {
  expect(sessionTotalTokens({ total_tokens: 504 })).toBe(504);
  expect(sessionTotalTokens({ total_tokens: 0 })).toBe(0);
  expect(observedTurnTokens({ turns: { "runtime-1": 120 } }, "runtime-1.message")).toBe(120);
  expect(benchmarkTokenSavings("balanced", 504)).toEqual({
    rate: 0.496,
    savedTokens: 496,
    codexEquivalent: 1000,
  });
  expect(benchmarkTokenSavings("custom", 504)).toBeUndefined();
  expect(observedTurnTokens({ turns: {} }, "runtime-1.message")).toBeUndefined();
});
