import assert from 'node:assert/strict';
import { test } from 'node:test';
import { effectiveEventStatus } from '../src/shared/event-status.js';
import { createDemoCatalogRepository } from '../demo/catalog.repository.js';
import { demoEvents } from '../demo/places.js';

test('event expiry respects offsets, end boundary and cancellation', () => {
  const end = '2026-10-31T12:00:00+07:00';
  const now = Date.parse('2026-10-31T05:00:00Z');
  assert.equal(effectiveEventStatus('SCHEDULED', end, now - 1), 'SCHEDULED');
  assert.equal(effectiveEventStatus('SCHEDULED', end, now), 'COMPLETED');
  assert.equal(effectiveEventStatus('CANCELLED', end, now), 'CANCELLED');
});

test('expired events are filtered before pagination and detail agrees', async () => {
  const event = { ...demoEvents[0], endsAt: '2000-01-01T00:00:00Z', eventStatus: 'SCHEDULED' };
  const repo = createDemoCatalogRepository(undefined, { events: [event] });
  const completed = await repo.listEvents({ status: 'COMPLETED', page: 1, pageSize: 1 });
  assert.equal(completed.total, 1);
  assert.equal(completed.data[0].eventStatus, 'COMPLETED');
  assert.equal((await repo.listEvents({ status: 'SCHEDULED', page: 1, pageSize: 1 })).total, 0);
  assert.equal((await repo.findEventById(event.id)).eventStatus, 'COMPLETED');
});
