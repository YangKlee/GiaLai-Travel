import { AppError } from '../../shared/app-error.js';
import { paginationMeta } from '../../shared/pagination.js';
import { categoryNames } from './catalog.schema.js';

export function createCatalogService(repository) {
  async function read(work) {
    try {
      return await work();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        503,
        'CATALOG_UNAVAILABLE',
        'Chưa tải được danh mục. Vui lòng thử lại sau.',
      );
    }
  }
  const dataset = repository.dataset;
  return {
    list: (query) =>
      read(async () => {
        const { data, total } = await repository.list(query);
        return { data, meta: paginationMeta(query, total), dataset };
      }),
    detail: (id) =>
      read(async () => {
        const data = await repository.findById(id);
        if (!data) throw new AppError(404, 'PLACE_NOT_FOUND', 'Địa điểm không còn khả dụng.');
        return { data, dataset };
      }),
    catalog: () =>
      read(async () => {
        const { categoryCodes, regions } = await repository.catalog();
        return {
          data: {
            categories: categoryCodes.map((code) => ({ code, name: categoryNames[code] })),
            regions,
          },
          dataset,
        };
      }),
    placeAudioGuides: (placeId) =>
      read(async () => {
        const data = await repository.findAudioGuidesByPlaceId(placeId);
        if (!data) throw new AppError(404, 'PLACE_NOT_FOUND', 'Địa điểm không còn khả dụng.');
        return { data, dataset };
      }),
    listEvents: (query) =>
      read(async () => {
        const { data, total } = await repository.listEvents(query);
        return { data, meta: paginationMeta(query, total), dataset };
      }),
    eventDetail: (id) =>
      read(async () => {
        const data = await repository.findEventById(id);
        if (!data) throw new AppError(404, 'EVENT_NOT_FOUND', 'Sự kiện không còn khả dụng.');
        return { data, dataset };
      }),
    listServices: (query) =>
      read(async () => {
        const { data, total } = await repository.listServices(query);
        return { data, meta: paginationMeta(query, total), dataset };
      }),
    serviceDetail: (id) =>
      read(async () => {
        const data = await repository.findServiceById(id);
        if (!data) throw new AppError(404, 'SERVICE_NOT_FOUND', 'Dịch vụ không còn khả dụng.');
        return { data, dataset };
      }),
  };
}
