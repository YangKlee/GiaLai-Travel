import type { OfflineManifestData, SavedItineraryDetail } from './itineraries';
import { getItineraryOfflineManifest, getMyItinerary } from './itineraries';

export interface OfflineItineraryPackage {
  userId: string;
  itineraryId: string;
  packageVersion: number;
  name: string;
  daysCount: number;
  partySize: number;
  totalBudgetVnd: string;
  estimatedTotalVnd: string;
  downloadedAt: string;
  checksumSha256: string;
  sizeBytes: number;
  manifest: OfflineManifestData;
  detail: SavedItineraryDetail;
}

export type DownloadProgressStep = 'MANIFEST' | 'DETAIL' | 'VERIFYING' | 'STORING';

const DB_NAME = 'gialai_offline_db';
const DB_VERSION = 1;
const STORE_ACTIVE = 'active_packages';
const STORE_STAGING = 'staging_packages';

// Fallback memory cache for headless/unsupported IndexedDB environments
const memoryActive = new Map<string, OfflineItineraryPackage>();
const memoryStaging = new Map<string, OfflineItineraryPackage>();

function getCompoundKey(userId: string, itineraryId: string): string {
  return `${userId}:${itineraryId}`;
}

function hasIndexedDb(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!hasIndexedDb()) {
      reject(new Error('INDEXED_DB_UNAVAILABLE'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_ACTIVE)) {
        db.createObjectStore(STORE_ACTIVE, { keyPath: ['userId', 'itineraryId'] });
      }
      if (!db.objectStoreNames.contains(STORE_STAGING)) {
        db.createObjectStore(STORE_STAGING, { keyPath: ['userId', 'itineraryId'] });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IDB_OPEN_FAILED'));
  });
}

/**
 * Atomic download for an itinerary package:
 * 1. Fetch manifest and detail.
 * 2. Put into staging store.
 * 3. Verify integrity (manifest checksum present).
 * 4. Commit atomically from staging to active store.
 * 5. Clean up staging store.
 * Any interruption leaves active store unmodified.
 */
export async function downloadItineraryForOffline(
  userId: string,
  itineraryId: string,
  onProgress?: (step: DownloadProgressStep, percent: number) => void,
): Promise<OfflineItineraryPackage> {
  if (!userId || !itineraryId) {
    throw new Error('Thiếu thông tin người dùng hoặc mã chuyến đi để tải gói ngoại tuyến.');
  }

  onProgress?.('MANIFEST', 25);
  const manifestRes = await getItineraryOfflineManifest(itineraryId);
  const manifest = manifestRes.data;

  onProgress?.('DETAIL', 60);
  const detail = await getMyItinerary(itineraryId);

  onProgress?.('VERIFYING', 80);
  if (!manifest.checksum) {
    throw new Error('Gói dữ liệu không có mã băm toàn vẹn (checksum). Hủy tải để đảm bảo an toàn.');
  }

  const payloadString = JSON.stringify({ manifest, detail });
  const estimatedSizeBytes = new TextEncoder().encode(payloadString).length;

  const pkg: OfflineItineraryPackage = {
    userId,
    itineraryId,
    packageVersion: detail.lockVersion,
    name: detail.name,
    daysCount: detail.revision?.daysCount ?? 1,
    partySize: detail.revision?.partySize ?? 1,
    totalBudgetVnd: detail.revision?.totalBudgetVnd ?? '0',
    estimatedTotalVnd: detail.revision?.estimatedTotalVnd ?? '0',
    downloadedAt: new Date().toISOString(),
    checksumSha256: manifest.checksum,
    sizeBytes: estimatedSizeBytes,
    manifest,
    detail,
  };

  onProgress?.('STORING', 90);

  // Attempt storage in IndexedDB, fall back to memory
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_STAGING], 'readwrite');
      const store = tx.objectStore(STORE_STAGING);
      const req = store.put(pkg);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Atomic promotion: put into active and remove from staging in single transaction
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_ACTIVE, STORE_STAGING], 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);

      const activeStore = tx.objectStore(STORE_ACTIVE);
      const stagingStore = tx.objectStore(STORE_STAGING);

      activeStore.put(pkg);
      stagingStore.delete([userId, itineraryId]);
    });
  } catch {
    // Memory fallback
    const key = getCompoundKey(userId, itineraryId);
    memoryStaging.set(key, pkg);
    memoryActive.set(key, pkg);
    memoryStaging.delete(key);
  }

  onProgress?.('STORING', 100);
  return pkg;
}

export async function getOfflineItinerary(
  userId: string,
  itineraryId: string,
): Promise<OfflineItineraryPackage | null> {
  if (!userId || !itineraryId) return null;

  try {
    const db = await openDatabase();
    return await new Promise<OfflineItineraryPackage | null>((resolve) => {
      const tx = db.transaction([STORE_ACTIVE], 'readonly');
      const store = tx.objectStore(STORE_ACTIVE);
      const req = store.get([userId, itineraryId]);
      req.onsuccess = () => resolve((req.result as OfflineItineraryPackage) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    const key = getCompoundKey(userId, itineraryId);
    return memoryActive.get(key) || null;
  }
}

export async function listOfflineItineraries(userId: string): Promise<OfflineItineraryPackage[]> {
  if (!userId) return [];

  try {
    const db = await openDatabase();
    return await new Promise<OfflineItineraryPackage[]>((resolve) => {
      const tx = db.transaction([STORE_ACTIVE], 'readonly');
      const store = tx.objectStore(STORE_ACTIVE);
      const req = store.getAll();
      req.onsuccess = () => {
        const all = (req.result as OfflineItineraryPackage[]) || [];
        resolve(all.filter((item) => item.userId === userId));
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return Array.from(memoryActive.values()).filter((item) => item.userId === userId);
  }
}

export async function deleteOfflineItinerary(userId: string, itineraryId: string): Promise<void> {
  if (!userId || !itineraryId) return;

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_ACTIVE, STORE_STAGING], 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore(STORE_ACTIVE).delete([userId, itineraryId]);
      tx.objectStore(STORE_STAGING).delete([userId, itineraryId]);
    });
  } catch {
    const key = getCompoundKey(userId, itineraryId);
    memoryActive.delete(key);
    memoryStaging.delete(key);
  }
}

/**
 * Purges all offline storage belonging to a user (invoked on logout to prevent
 * multi-user snapshot leakage on shared devices).
 */
export async function purgeUserOfflineData(userId?: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_ACTIVE, STORE_STAGING], 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);

      const activeStore = tx.objectStore(STORE_ACTIVE);
      const stagingStore = tx.objectStore(STORE_STAGING);

      if (!userId) {
        activeStore.clear();
        stagingStore.clear();
      } else {
        const req = activeStore.getAll();
        req.onsuccess = () => {
          const items = (req.result as OfflineItineraryPackage[]) || [];
          for (const item of items) {
            if (item.userId === userId) {
              activeStore.delete([item.userId, item.itineraryId]);
              stagingStore.delete([item.userId, item.itineraryId]);
            }
          }
        };
      }
    });
  } catch {
    if (!userId) {
      memoryActive.clear();
      memoryStaging.clear();
    } else {
      for (const [key, item] of memoryActive.entries()) {
        if (item.userId === userId) memoryActive.delete(key);
      }
      for (const [key, item] of memoryStaging.entries()) {
        if (item.userId === userId) memoryStaging.delete(key);
      }
    }
  }
}
