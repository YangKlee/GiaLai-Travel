import { demoAudioGuides, demoEvents, demoPlaces, demoServices } from './places.js';

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

export function createDemoCatalogRepository(
  places = demoPlaces,
  { audioGuides = demoAudioGuides, events = demoEvents, services = demoServices } = {},
) {
  return {
    dataset: 'demo',
    async list(query) {
      const data = places.filter(
        (place) =>
          (!query.q || normalize(place.title).includes(normalize(query.q))) &&
          (!query.category || place.category === query.category) &&
          (!query.regionId || place.region.id === query.regionId) &&
          (query.minPrice === undefined ||
            (place.referencePriceVnd !== null &&
              BigInt(place.referencePriceVnd) >= BigInt(query.minPrice))) &&
          (query.maxPrice === undefined ||
            (place.referencePriceVnd !== null &&
              BigInt(place.referencePriceVnd) <= BigInt(query.maxPrice))),
      );
      data.sort((a, b) => {
        if (query.sort === 'price-asc' && a.referencePriceVnd !== b.referencePriceVnd) {
          if (a.referencePriceVnd === null) return 1;
          if (b.referencePriceVnd === null) return -1;
          return BigInt(a.referencePriceVnd) < BigInt(b.referencePriceVnd) ? -1 : 1;
        }
        return a.title.localeCompare(b.title, 'vi') || a.id.localeCompare(b.id);
      });
      return {
        data: data
          .slice((query.page - 1) * query.pageSize, query.page * query.pageSize)
          .map(
            ({
              openingHours: _hours,
              closures: _closures,
              audioGuides: _audio,
              events: _events,
              services: _services,
              ...place
            }) => place,
          ),
        total: data.length,
      };
    },
    async findById(id) {
      return places.find((place) => place.id === id) ?? null;
    },
    async catalog() {
      return {
        categoryCodes: [...new Set(places.map((place) => place.category))],
        regions: [...new Map(places.map((place) => [place.region.id, place.region])).values()],
      };
    },
    async findAudioGuidesByPlaceId(placeId) {
      const place = places.find((item) => item.id === placeId);
      if (!place) return null;
      return audioGuides.filter((guide) => guide.placeId === placeId);
    },
    async listEvents(query) {
      const filtered = events.filter(
        (ev) =>
          (!query.placeId || ev.placeId === query.placeId) &&
          (!query.regionId || ev.region.id === query.regionId) &&
          (!query.status || ev.eventStatus === query.status) &&
          (!query.q || normalize(ev.title).includes(normalize(query.q))),
      );
      return {
        data: filtered.slice((query.page - 1) * query.pageSize, query.page * query.pageSize),
        total: filtered.length,
      };
    },
    async findEventById(id) {
      return events.find((ev) => ev.id === id) ?? null;
    },
    async listServices(query) {
      const filtered = services.filter(
        (svc) =>
          svc.active &&
          (!query.placeId || svc.placeId === query.placeId) &&
          (!query.serviceType || svc.serviceType === query.serviceType) &&
          (!query.q || normalize(svc.title).includes(normalize(query.q))),
      );
      return {
        data: filtered.slice((query.page - 1) * query.pageSize, query.page * query.pageSize),
        total: filtered.length,
      };
    },
    async findServiceById(id) {
      return services.find((svc) => svc.id === id && svc.active) ?? null;
    },
  };
}
