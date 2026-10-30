export type Dataset = 'live' | 'demo';
export type Category = 'NATURE' | 'CULTURE' | 'FOOD' | 'STAY' | 'ADVENTURE' | 'OTHER';
export interface Region {
  id: string;
  name: string;
}
export interface Place {
  id: string;
  title: string;
  description: string;
  category: Category;
  region: Region;
  latitude: number | null;
  longitude: number | null;
  referencePriceVnd: string | null;
  typicalDurationMinutes: number | null;
  sourceReference: string | null;
  updatedAt: string;
}
export interface OpeningHour {
  weekday: number;
  opensAt: string;
  closesAt: string;
  crossesMidnight: boolean;
}
export interface PlaceDetail extends Place {
  openingHours: OpeningHour[];
}
export interface CatalogResponse {
  data: { categories: { code: Category; name: string }[]; regions: Region[] };
  dataset: Dataset;
}
export interface PlacesResponse {
  data: Place[];
  dataset: Dataset;
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}
export interface PlaceResponse {
  data: PlaceDetail;
  dataset: Dataset;
}

export const CATEGORY_NAMES: Record<Category, string> = {
  NATURE: 'Thiên nhiên',
  CULTURE: 'Văn hóa',
  FOOD: 'Ẩm thực',
  STAY: 'Lưu trú',
  ADVENTURE: 'Trải nghiệm',
  OTHER: 'Khác',
};
