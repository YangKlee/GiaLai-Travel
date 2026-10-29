import assert from 'node:assert/strict';
import { test } from 'node:test';
import { paginationMeta, paginationSchema } from '../src/shared/pagination.js';
import { validate } from '../src/shared/validation.js';

test('Express query validation retains getter and reports invalid pagination', () => {
  const req = { get query() { return { page: '2', pageSize: '10' }; } };
  let nextError;
  validate(paginationSchema, 'query')(req, {}, (error) => { nextError = error; });
  assert.equal(nextError, undefined);
  assert.deepEqual(req.validated.query, { page: 2, pageSize: 10 });
  assert.equal(req.query.page, '2');
  assert.deepEqual(paginationMeta(req.validated.query, 21), { page: 2, pageSize: 10, total: 21, totalPages: 3 });
  for (const query of [{ page: '0' }, { pageSize: '101' }, { page: '1.5' }]) {
    validate(paginationSchema, 'query')({ query }, {}, (error) => { nextError = error; });
    assert.equal(nextError.status, 422);
    assert.equal(nextError.code, 'VALIDATION_ERROR');
    assert.ok(nextError.fields.length > 0);
  }
});
