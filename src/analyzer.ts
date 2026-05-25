import { MISLEADING_PATTERNS, MANIPULATION_PATTERNS } from "./patterns";

export interface Violation {
  phrase: string;
  category: "misleading" | "manipulation";
  startIndex: number;
  endIndex: number;
}

export interface AnalysisResult {
  misleadingViolations: Violation[];
  manipulationViolations: Violation[];
  hasViolations: boolean;
  highlightedText: string;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findMatches(
  text: string,
  patterns: string[],
  category: "misleading" | "manipulation"
): Violation[] {
  const violations: Violation[] = [];
  const textLower = text.toLowerCase();

  // Sort patterns by length descending so longer patterns match first
  const sortedPatterns = [...patterns].sort((a, b) => b.length - a.length);

  for (const pattern of sortedPatterns) {
    const patternLower = pattern.toLowerCase();
    const regex = new RegExp(escapeRegex(patternLower), "gi");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(textLower)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // Check if this range overlaps with an existing violation
      const overlaps = violations.some(
        (v) => start < v.endIndex && end > v.startIndex
      );

      if (!overlaps) {
        violations.push({
          phrase: pattern,
          category,
          startIndex: start,
          endIndex: end,
        });
      }
    }
  }

  return violations;
}

export function analyzeText(text: string): AnalysisResult {
  const misleadingViolations = findMatches(
    text,
    MISLEADING_PATTERNS,
    "misleading"
  );
  const manipulationViolations = findMatches(
    text,
    MANIPULATION_PATTERNS,
    "manipulation"
  );

  const allViolations = [...misleadingViolations, ...manipulationViolations];
  const hasViolations = allViolations.length > 0;

  // Build highlighted text
  const highlightedText = buildHighlightedText(text, allViolations);

  return {
    misleadingViolations,
    manipulationViolations,
    hasViolations,
    highlightedText,
  };
}

function buildHighlightedText(text: string, violations: Violation[]): string {
  if (violations.length === 0) return text;

  // Sort by startIndex
  const sorted = [...violations].sort((a, b) => a.startIndex - b.startIndex);

  // Merge overlapping ranges
  const merged: { start: number; end: number; category: string }[] = [];
  for (const v of sorted) {
    if (
      merged.length > 0 &&
      v.startIndex <= merged[merged.length - 1].end
    ) {
      merged[merged.length - 1].end = Math.max(
        merged[merged.length - 1].end,
        v.endIndex
      );
    } else {
      merged.push({
        start: v.startIndex,
        end: v.endIndex,
        category: v.category,
      });
    }
  }

  let result = "";
  let lastEnd = 0;

  for (const range of merged) {
    result += escapeHtml(text.slice(lastEnd, range.start));
    const categoryClass =
      range.category === "misleading" ? "hl-misleading" : "hl-manipulation";
    result += `<mark class="${categoryClass}">${escapeHtml(
      text.slice(range.start, range.end)
    )}</mark>`;
    lastEnd = range.end;
  }

  result += escapeHtml(text.slice(lastEnd));
  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
