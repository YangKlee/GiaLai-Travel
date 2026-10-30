import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parse } from 'yaml';

test('OpenAPI parses and every local reference resolves', () => {
  const contract = parse(readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'));
  const operations = new Set();
  for (const path of Object.values(contract.paths)) {
    for (const operation of Object.values(path)) {
      assert.ok(!operations.has(operation.operationId));
      operations.add(operation.operationId);
      assert.ok(operation.responses);
    }
  }
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (value.$ref) {
      assert.ok(value.$ref.startsWith('#/'));
      const target = value.$ref.slice(2).split('/').reduce((node, key) => node?.[key], contract);
      assert.ok(target, value.$ref);
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(contract);
});
