import { expect, it, vi } from 'vitest';
import { clearAuthSession } from './auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useTripDraftStore } from '@/store/useTripDraftStore';
import { placeFixture } from './__fixtures__/catalog';

vi.mock('./offlineStorage', () => ({ purgeUserOfflineData: vi.fn().mockResolvedValue(undefined) }));

it('a failed anonymous session refresh preserves the device draft', () => {
  useAuthStore.setState({ phase: 'anonymous', user: null });
  useTripDraftStore.getState().reset();
  useTripDraftStore.getState().add('live', placeFixture);
  clearAuthSession();
  expect(useTripDraftStore.getState().drafts.live.places).toEqual([placeFixture]);
});
