import { beforeEach, expect, it } from 'vitest';
import { MAX_DRAFT_STOPS, useTripDraftStore } from './useTripDraftStore';
import { placeFixture } from '@/services/__fixtures__/catalog';

beforeEach(() =>
  useTripDraftStore.setState({
    drafts: {
      demo: { name: 'Demo', places: [] },
      live: { name: 'Live', places: [] },
    },
  }),
);

it('ngăn thêm trùng và giữ riêng bản nháp demo với dữ liệu thật', () => {
  const { add } = useTripDraftStore.getState();
  add('demo', placeFixture);
  add('demo', placeFixture);
  expect(useTripDraftStore.getState().drafts.demo.places).toHaveLength(1);
  expect(useTripDraftStore.getState().drafts.live.places).toHaveLength(0);
});

it('đổi thứ tự đúng điểm, không làm mất dữ liệu tại biên và tôn trọng giới hạn', () => {
  const { add, move, remove } = useTripDraftStore.getState();
  for (let i = 0; i < MAX_DRAFT_STOPS + 1; i++) add('demo', { ...placeFixture, id: String(i) });
  expect(useTripDraftStore.getState().drafts.demo.places).toHaveLength(MAX_DRAFT_STOPS);
  move('demo', '0', -1);
  expect(useTripDraftStore.getState().drafts.demo.places[0].id).toBe('0');
  move('demo', '0', 1);
  expect(
    useTripDraftStore
      .getState()
      .drafts.demo.places.slice(0, 2)
      .map((place) => place.id),
  ).toEqual(['1', '0']);
  move('demo', 'absent', 1);
  remove('demo', '0');
  expect(useTripDraftStore.getState().drafts.demo.places.some((place) => place.id === '0')).toBe(
    false,
  );
});

it('khôi phục bản nháp đã lưu và bỏ qua điểm hỏng hoặc trùng', async () => {
  useTripDraftStore.getState().add('live', placeFixture);
  useTripDraftStore.getState().rename('live', 'Cuối tuần');
  const saved = localStorage.getItem('gialai:trip-drafts');
  useTripDraftStore.getState().reset();
  localStorage.setItem('gialai:trip-drafts', saved!);
  await useTripDraftStore.persist.rehydrate();
  expect(useTripDraftStore.getState().drafts.live).toEqual({
    name: 'Cuối tuần',
    places: [placeFixture],
  });
  localStorage.setItem(
    'gialai:trip-drafts',
    JSON.stringify({
      version: 1,
      state: {
        drafts: {
          live: { name: 'Đã lưu', places: [placeFixture, placeFixture, { id: 'broken' }] },
          demo: null,
        },
      },
    }),
  );
  await useTripDraftStore.persist.rehydrate();
  expect(useTripDraftStore.getState().drafts.live.places).toEqual([placeFixture]);
});

it('dữ liệu lưu lỗi không làm mất bản nháp đang dùng', async () => {
  useTripDraftStore.getState().add('demo', placeFixture);
  localStorage.setItem('gialai:trip-drafts', '{broken');
  await useTripDraftStore.persist.rehydrate();
  expect(useTripDraftStore.getState().drafts.demo.places).toEqual([placeFixture]);
});
