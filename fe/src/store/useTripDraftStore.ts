import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPlace(value: unknown): value is Place {
  if (!isRecord(value) || !isRecord(value.region)) return false;
  return (
    ['id', 'title', 'description', 'updatedAt'].every((key) => typeof value[key] === 'string') &&
    ['NATURE', 'CULTURE', 'FOOD', 'STAY', 'ADVENTURE', 'OTHER'].includes(String(value.category)) &&
    typeof value.region.id === 'string' &&
    typeof value.region.name === 'string' &&
    ['latitude', 'longitude', 'typicalDurationMinutes'].every(
      (key) =>
        value[key] === null || (typeof value[key] === 'number' && Number.isFinite(value[key])),
    ) &&
    ['referencePriceVnd', 'sourceReference'].every(
      (key) => value[key] === null || typeof value[key] === 'string',
    )
  );
}

function readDraft(value: unknown, fallback: TripDraft): TripDraft {
  if (!isRecord(value) || typeof value.name !== 'string' || !Array.isArray(value.places))
    return fallback;
  const places = value.places.filter(isPlace);
  return {
    name: value.name.slice(0, 120),
    places: [...new Map(places.map((place) => [place.id, place])).values()].slice(
      0,
      MAX_DRAFT_STOPS,
    ),
  };
}

export const useTripDraftStore = create<TripDraftStore>()(
  persist(
    (set) => ({
      reset: () =>
        set({
          drafts: {
            demo: { name: 'Một ngày ở Gia Lai', places: [] },
            live: { name: 'Một ngày ở Gia Lai', places: [] },
          },
        }),
      // Only public place snapshots are persisted; account and token data stay separate.
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
    }),
    {
      name: 'gialai:trip-drafts',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch {
            /* The draft remains usable in memory. */
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch {
            /* Storage may be unavailable. */
          }
        },
      })),
      partialize: (state) => ({ drafts: state.drafts }),
      merge: (persisted: unknown, current) => {
        if (!isRecord(persisted) || !isRecord(persisted.drafts)) return current;
        return {
          ...current,
          drafts: {
            demo: readDraft(persisted.drafts.demo, current.drafts.demo),
            live: readDraft(persisted.drafts.live, current.drafts.live),
          },
        };
      },
    },
  ),
);
