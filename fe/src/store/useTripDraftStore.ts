import { create } from 'zustand';
import type { Dataset, Place } from '@/features/explore/types/catalog';

export const MAX_DRAFT_STOPS = 12;
interface TripDraft {
  name: string;
  places: Place[];
}
interface TripDraftStore {
  drafts: Record<Dataset, TripDraft>;
  add: (dataset: Dataset, place: Place) => void;
  remove: (dataset: Dataset, id: string) => void;
  move: (dataset: Dataset, id: string, direction: -1 | 1) => void;
  rename: (dataset: Dataset, name: string) => void;
  reset: () => void;
}

export const useTripDraftStore = create<TripDraftStore>((set) => ({
  reset: () =>
    set({
      drafts: {
        demo: { name: 'Một ngày ở Gia Lai', places: [] },
        live: { name: 'Một ngày ở Gia Lai', places: [] },
      },
    }),
  // Public snapshots only; in memory, cleared on page reload. No account or token data.
  drafts: {
    demo: { name: 'Một ngày ở Gia Lai', places: [] },
    live: { name: 'Một ngày ở Gia Lai', places: [] },
  },
  add: (dataset, place) =>
    set((state) => {
      const draft = state.drafts[dataset];
      if (
        draft.places.length >= MAX_DRAFT_STOPS ||
        draft.places.some((item) => item.id === place.id)
      )
        return state;
      return {
        drafts: { ...state.drafts, [dataset]: { ...draft, places: [...draft.places, place] } },
      };
    }),
  remove: (dataset, id) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [dataset]: {
          ...state.drafts[dataset],
          places: state.drafts[dataset].places.filter((place) => place.id !== id),
        },
      },
    })),
  move: (dataset, id, direction) =>
    set((state) => {
      const draft = state.drafts[dataset];
      const index = draft.places.findIndex((place) => place.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= draft.places.length) return state;
      const places = [...draft.places];
      [places[index], places[target]] = [places[target], places[index]];
      return { drafts: { ...state.drafts, [dataset]: { ...draft, places } } };
    }),
  rename: (dataset, name) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [dataset]: { ...state.drafts[dataset], name: name.slice(0, 100) },
      },
    })),
}));
