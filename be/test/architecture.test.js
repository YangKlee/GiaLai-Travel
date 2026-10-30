import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    return entry.isDirectory() ? files(url) : entry.name.endsWith('.js') ? [url] : [];
  });
}

test('business modules and shared services use model APIs rather than manual queries', () => {
  for (const path of [...files(new URL('../src/modules/', import.meta.url)), ...files(new URL('../src/shared/', import.meta.url))]) {
    const source = readFileSync(path, 'utf8');
    assert.doesNotMatch(source, /\.(?:query|execute)\s*\(/, path.pathname);
    assert.doesNotMatch(source, /\bliteral\s*\(/, path.pathname);
  }
});
