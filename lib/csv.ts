/** Génération CSV (séparateur `;` pour Excel FR, BOM UTF-8). */
export function toCsv(rows: Array<Record<string, unknown>>, columns?: string[]): string {
  if (rows.length === 0) return "";
  const headers = columns ?? Object.keys(rows[0]!);

  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const str = value instanceof Date ? value.toISOString() : String(value);
    return `"${str.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  };

  const lines = [headers.join(";")];
  for (const row of rows) {
    lines.push(headers.map((header) => escape(row[header])).join(";"));
  }
  return "\uFEFF" + lines.join("\r\n");
}

export function csvResponse(filename: string, csv: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
