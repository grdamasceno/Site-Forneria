const PT_MONTHS: Record<string, string> = {
  janeiro: "01", fevereiro: "02", março: "03", abril: "04", maio: "05", junho: "06",
  julho: "07", agosto: "08", setembro: "09", outubro: "10", novembro: "11", dezembro: "12",
};

/** Parses "28 de março de 2026" into "2026-03-28" (ISO 8601). Returns undefined if it doesn't match. */
export function ptDateToIso(ptDate: string): string | undefined {
  const m = ptDate.match(/^(\d{1,2}) de (\p{L}+) de (\d{4})$/u);
  if (!m) return undefined;
  const month = PT_MONTHS[m[2].toLowerCase()];
  if (!month) return undefined;
  return `${m[3]}-${month}-${m[1].padStart(2, "0")}`;
}
