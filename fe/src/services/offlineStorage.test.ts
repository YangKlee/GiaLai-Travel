import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteOfflineItinerary,
  downloadItineraryForOffline,
  getOfflineItinerary,
  listOfflineItineraries,
  purgeUserOfflineData,
} from './offlineStorage';
import * as itineraryServices from './itineraries';

describe('offlineStorage service', () => {
  const mockUserId = 'usr_tourist_1';
  const mockItineraryId = 'itin_offline_test';

  const mockManifest: itineraryServices.OfflineManifestData = {
    manifestVersion: '1.0',
    packageId: mockItineraryId,
    itineraryName: 'Chuyến Pleiku 2N1D',
    startDate: '2026-11-01',
    daysCount: 2,
    partySize: 2,
    totalBudgetVnd: '3000000',
    transportMode: 'MOTORBIKE',
    origin: { latitude: 13.98, longitude: 108.0, label: 'Pleiku' },
    days: [],
    checksum: 'abc123mockhash',
    generatedAt: '2026-10-30T10:00:00.000Z',
  };

  const mockDetail: itineraryServices.SavedItineraryDetail = {
    id: mockItineraryId,
    ownerId: mockUserId,
    name: 'Chuyến Pleiku 2N1D',
    lockVersion: 2,
    currentRevisionId: 'rev_1',
    createdAt: '2026-10-30T09:00:00.000Z',
    updatedAt: '2026-10-30T10:00:00.000Z',
    revision: {
      id: 'rev_1',
      revisionNo: 1,
      validatedAt: '2026-10-30T09:00:00.000Z',
      isValid: true,
      aiRequestId: null,
      warnings: [],
      violations: [],
      estimatedTotalVnd: '2800000',
      startDate: '2026-11-01',
      daysCount: 2,
      partySize: 2,
      totalBudgetVnd: '3000000',
      origin: { latitude: 13.98, longitude: 108.0, label: 'Pleiku' },
      transportMode: 'MOTORBIKE',
      preferences: { categories: ['NATURE'], pace: 'BALANCED' },
      days: [
        {
          id: 'day_1',
          dayNumber: 1,
          travelDate: '2026-11-01',
          stops: [
            {
              id: 'stop_1',
              sequenceNo: 1,
              placeId: 'poi_1',
              placeTitle: 'Biển Hồ T’Nưng',
              arrivesAt: '2026-11-01T08:00:00.000Z',
              departsAt: '2026-11-01T10:00:00.000Z',
              estimatedCostVnd: 20000,
            },
          ],
          legs: [],
        },
      ],
    },
  };

  beforeEach(async () => {
    vi.restoreAllMocks();
    await purgeUserOfflineData();
  });

  it('tải nguyên tử (atomic) thành công gói offline và lưu vào storage', async () => {
    vi.spyOn(itineraryServices, 'getItineraryOfflineManifest').mockResolvedValue({ data: mockManifest });
    vi.spyOn(itineraryServices, 'getMyItinerary').mockResolvedValue(mockDetail);

    const steps: string[] = [];
    const pkg = await downloadItineraryForOffline(mockUserId, mockItineraryId, (step) => {
      steps.push(step);
    });

    expect(pkg.name).toBe('Chuyến Pleiku 2N1D');
    expect(pkg.checksumSha256).toBe('abc123mockhash');
    expect(pkg.packageVersion).toBe(2);
    expect(steps).toContain('MANIFEST');
    expect(steps).toContain('DETAIL');
    expect(steps).toContain('STORING');

    const retrieved = await getOfflineItinerary(mockUserId, mockItineraryId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('Chuyến Pleiku 2N1D');
    expect(retrieved?.detail.revision?.days[0].stops[0].placeTitle).toBe('Biển Hồ T’Nưng');
  });

  it('từ chối tải nếu manifest thiếu checksum và không lưu vào active storage', async () => {
    const invalidManifest = { ...mockManifest, checksum: '' };
    vi.spyOn(itineraryServices, 'getItineraryOfflineManifest').mockResolvedValue({ data: invalidManifest });
    vi.spyOn(itineraryServices, 'getMyItinerary').mockResolvedValue(mockDetail);

    await expect(
      downloadItineraryForOffline(mockUserId, mockItineraryId),
    ).rejects.toThrow('Gói dữ liệu không có mã băm toàn vẹn');

    const notFound = await getOfflineItinerary(mockUserId, mockItineraryId);
    expect(notFound).toBeNull();
  });

  it('liệt kê và xóa gói offline của người dùng', async () => {
    vi.spyOn(itineraryServices, 'getItineraryOfflineManifest').mockResolvedValue({ data: mockManifest });
    vi.spyOn(itineraryServices, 'getMyItinerary').mockResolvedValue(mockDetail);

    await downloadItineraryForOffline(mockUserId, mockItineraryId);

    const listBefore = await listOfflineItineraries(mockUserId);
    expect(listBefore).toHaveLength(1);

    await deleteOfflineItinerary(mockUserId, mockItineraryId);

    const listAfter = await listOfflineItineraries(mockUserId);
    expect(listAfter).toHaveLength(0);
  });

  it('dọn dẹp sạch toàn bộ dữ liệu offline khi người dùng đăng xuất (purgeUserOfflineData)', async () => {
    vi.spyOn(itineraryServices, 'getItineraryOfflineManifest').mockResolvedValue({ data: mockManifest });
    vi.spyOn(itineraryServices, 'getMyItinerary').mockResolvedValue(mockDetail);

    await downloadItineraryForOffline(mockUserId, mockItineraryId);
    expect(await listOfflineItineraries(mockUserId)).toHaveLength(1);

    await purgeUserOfflineData(mockUserId);
    expect(await listOfflineItineraries(mockUserId)).toHaveLength(0);
  });
});
