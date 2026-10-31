// Known stock placeholders from the original seed; these are not photos of the named places.
const samplePaths = new Set([
  '/photo-1507525428034-b723cf961d3e',
  '/photo-1506744038136-46273834b3fb',
  '/photo-1544735716-392fe2489ffa',
  '/photo-1534447677768-be436bb09401',
  '/photo-1517457373958-b7bdd4587205',
  '/photo-1432405972618-c60b0225b8f9',
  '/photo-1434725039720-aaad6dd32dfe',
  '/photo-1448375240586-882707db888b',
  '/photo-1464822759023-fed622ff2c3b',
  '/photo-1470071459604-3b5ec3a7fe05',
  '/photo-1513836279014-a89f7a76ae86',
  '/photo-1509316975850-ff9c5deb0cd9',
  '/photo-1518495973542-4542c06a5843',
  '/photo-1500530855697-b586d89ba3ee',
  '/photo-1519681393784-d120267933ba',
  '/photo-1469854523086-cc02fe5d8800',
  '/photo-1515238152791-8216bfdf89a7',
  '/photo-1544551763-46a013bb70d5',
  '/photo-1519046904884-53103b34b206',
  '/photo-1548013146-72479768bada',
  '/photo-1565008447742-97f6f38c985c',
  '/photo-1569154941061-e231b4725ef1',
  '/photo-1548625361-195fe57876a3',
  '/photo-1510312305653-8ed496efae75',
  '/photo-1477959858617-67f30bc75b82',
  '/photo-1514525253161-7a46d19cd819',
  '/photo-1470240731273-7821a6eeb6bd',
  '/photo-1461896836934-ffe607ba8211',
  '/photo-1501339847302-ac426a4a7cbb',
  '/photo-1555597673-b21d5c935865',
  '/photo-1504674900247-0877df9cc836',
]);

export function catalogImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url, 'https://local.invalid');
    if (parsed.hostname === 'images.unsplash.com' && samplePaths.has(parsed.pathname)) return null;
    return ['http:', 'https:'].includes(parsed.protocol) ? url : null;
  } catch {
    return null;
  }
}
