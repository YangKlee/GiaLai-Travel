export type Dataset = 'live' | 'demo';
export type Category = 'NATURE' | 'CULTURE' | 'FOOD' | 'STAY' | 'ADVENTURE' | 'OTHER';
export type ServiceType = 'HOMESTAY' | 'EXPERIENCE' | 'GUIDE' | 'RENTAL' | 'OTHER';
export type EventStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
export type ContentKind = 'PLACE' | 'ARTICLE' | 'AUDIO' | 'EVENT' | 'PARTNER' | 'SERVICE';
export type ContentVisibility = 'DRAFT' | 'PUBLIC' | 'HIDDEN';
export type RevisionStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';

export interface Region {
  id: string;
  name: string;
}

export interface Ward {
  id: string;
  regionId: string;
  regionName?: string;
  code: string;
  name: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface Place {
  id: string;
  title: string;
  description: string;
  category: Category;
  region: Region;
  ward?: { id: string; name: string } | null;
  wardId?: string | null;
  latitude: number | null;
  longitude: number | null;
  referencePriceVnd: string | null;
  typicalDurationMinutes: number | null;
  bestTimeToVisit?: string | null;
  sourceReference: string | null;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  updatedAt: string;
}

export interface OpeningHour {
  weekday: number;
  opensAt: string;
  closesAt: string;
  crossesMidnight: boolean;
}

export interface PlaceClosureItem {
  id: string;
  startsAt: string;
  endsAt: string;
  reason: string;
  sourceReference: string;
}

export interface AudioGuideItem {
  id: string;
  placeId: string;
  title: string;
  description: string;
  transcript: string | null;
  languageCode: string;
  audioUrl: string | null;
  premiumOnly: boolean;
  sourceReference: string | null;
}

export interface EventItem {
  id: string;
  placeId: string;
  placeTitle: string;
  region: Region | null;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  eventStatus: EventStatus;
  sourceReference: string | null;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  updatedAt: string;
}

export interface ServiceSlotItem {
  id: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  heldQuantity: number;
  soldQuantity: number;
  availableQuantity: number;
}

export interface ServiceItem {
  id: string;
  placeId: string | null;
  placeTitle: string | null;
  partnerId: string;
  partnerName: string;
  title: string;
  description: string;
  serviceType: ServiceType;
  priceUnit: string;
  unitPriceVnd: string;
  active: boolean;
  sourceReference: string | null;
  updatedAt: string;
  slots: ServiceSlotItem[];
}

export interface PlaceDetail extends Place {
  openingHours: OpeningHour[];
  closures?: PlaceClosureItem[];
  audioGuides?: AudioGuideItem[];
  events?: EventItem[];
  services?: ServiceItem[];
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

export interface EventsResponse {
  data: EventItem[];
  dataset: Dataset;
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface EventDetailResponse {
  data: EventItem;
  dataset: Dataset;
}

export interface ServicesResponse {
  data: ServiceItem[];
  dataset: Dataset;
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface ServiceDetailResponse {
  data: ServiceItem;
  dataset: Dataset;
}

export interface AdminMediaAsset {
  id: string;
  storageKey: string;
  mediaType: 'IMAGE' | 'AUDIO' | 'DOCUMENT';
  mimeType: string;
  byteSize: number;
  sha256Hex: string;
  sourceReference: string;
  licenseNote: string;
  offlineAllowed: boolean;
  uploadedBy: string;
  createdAt: string;
}

export interface AdminContentRevision {
  id: string;
  contentId: string;
  revisionNo: number;
  status: RevisionStatus;
  sourceReference: string | null;
  title: string;
  body: string;
  transcript: string | null;
  audioAssetId: string | null;
  payload: Record<string, unknown>;
  submittedBy: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface AdminContentItem {
  id: string;
  kind: ContentKind;
  visibility: ContentVisibility;
  publishedRevisionId: string | null;
  projectionId: string | null;
  title: string;
  latestStatus: RevisionStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  revisions: AdminContentRevision[];
}

export interface AdminContentMeta {
  regions: Array<{ id: string; name: string; code: string }>;
  wards?: Ward[];
  partners: Array<{ id: string; contentId: string; status: string; title: string }>;
  places: Array<{
    id: string;
    contentId: string;
    category: Category;
    regionId: string;
    title: string;
  }>;
  mediaAssets: AdminMediaAsset[];
}

export const CATEGORY_NAMES: Record<Category, string> = {
  NATURE: 'Thiên nhiên',
  CULTURE: 'Văn hóa',
  FOOD: 'Ẩm thực',
  STAY: 'Lưu trú',
  ADVENTURE: 'Trải nghiệm',
  OTHER: 'Khác',
};

export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  HOMESTAY: 'Lưu trú Homestay',
  EXPERIENCE: 'Trải nghiệm bản địa',
  GUIDE: 'Hướng dẫn viên',
  RENTAL: 'Thuê phương tiện',
  OTHER: 'Dịch vụ khác',
};

export const EVENT_STATUS_NAMES: Record<EventStatus, string> = {
  SCHEDULED: 'Sắp diễn ra',
  CANCELLED: 'Đã hủy / tạm hoãn',
  COMPLETED: 'Đã kết thúc',
};

export interface AdminPlaceItem {
  id: string;
  contentId: string;
  title: string;
  description: string;
  category: Category;
  regionId: string;
  regionName: string;
  wardId?: string | null;
  wardName?: string | null;
  latitude: number;
  longitude: number;
  referencePriceVnd: string | null;
  typicalDurationMinutes: number | null;
  bestTimeToVisit?: string | null;
  bannerUrl: string | null;
  imageUrl: string | null;
  sourceReference: string | null;
  visibility: ContentVisibility;
  openingHours: OpeningHour[];
  updatedAt: string;
}

export interface AdminWardItem {
  id: string;
  regionId: string;
  regionName: string;
  code: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface AdminEventItem {
  id: string;
  contentId: string;
  placeId: string;
  placeTitle: string;
  regionName: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  eventStatus: EventStatus;
  bannerUrl: string | null;
  imageUrl: string | null;
  sourceReference: string | null;
  visibility: ContentVisibility;
  updatedAt: string;
}

export interface AdminR2UploadResult {
  url: string;
  key: string;
  provider: string;
  byteSize: number;
  mimeType: string;
}
