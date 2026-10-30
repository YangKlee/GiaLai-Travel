// mysql2 dateStrings are UTC DATETIME, including MariaDB microseconds.
export function serializeUtc(value) {
  const date = value instanceof Date ? value : new Date(`${String(value).replace(' ', 'T').replace(/Z$/, '')}Z`);
  if (!Number.isFinite(date.getTime())) throw new TypeError('Invalid UTC datetime');
  return date.toISOString();
}
