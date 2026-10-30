import type { LoaderFunctionArgs } from 'react-router-dom';
import { getCatalog, getPlace, getPlaces } from '@/services/catalog';

const filterKeys = new Set([
  'q',
  'category',
  'regionId',
  'minPrice',
  'maxPrice',
  'sort',
  'page',
  'pageSize',
]);

export async function exploreLoader({ request }: LoaderFunctionArgs) {
  const query = new URLSearchParams();
  for (const [key, value] of new URL(request.url).searchParams) {
    if (filterKeys.has(key) && value.trim()) query.append(key, value);
  }
  if (!query.has('pageSize')) query.set('pageSize', '6');
  const [catalog, places] = await Promise.all([
    getCatalog(request.signal),
    getPlaces(query, request.signal),
  ]);
  return { catalog, places };
}

export async function placeLoader({ params, request }: LoaderFunctionArgs) {
  return getPlace(params.id ?? '', request.signal);
}

export async function tripsLoader({ request }: LoaderFunctionArgs) {
  const { dataset } = await getCatalog(request.signal);
  return { dataset };
}
