import { catalogImageUrl } from '@/utils/catalog-image';
import { useState } from 'react';
import { ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_PATHS } from '@/constants/path';
import { Badge } from '@/components/ui/Badge';
import { formatDuration, formatVnd } from '@/utils/format';
import { CATEGORY_NAMES } from '../types/catalog';
import type { Dataset, Place } from '../types/catalog';
import { PlaceArtwork } from './PlaceArtwork';
import { AddToTripButton } from './AddToTripButton';

export function PlaceCard({ place, dataset }: { place: Place; dataset: Dataset }) {
  const [imgError, setImgError] = useState(false);
  const banner = catalogImageUrl(place.bannerUrl) || catalogImageUrl(place.imageUrl);

  return (
    <article className="place-card">
      <Link
        to={APP_PATHS.place(place.id)}
        tabIndex={-1}
        aria-hidden="true"
        className="place-card-media-link"
      >
        {banner && !imgError ? (
          <div className="place-card-banner">
            <img
              src={banner}
              alt={place.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="place-card-img"
            />
          </div>
        ) : (
          <PlaceArtwork category={place.category} />
        )}
      </Link>
      <div className="place-card-body">
        <Badge>{CATEGORY_NAMES[place.category]}</Badge>
        <h3>
          <Link to={APP_PATHS.place(place.id)}>
            {place.title}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </h3>
        <p className="meta-line">
          <MapPin size={14} aria-hidden="true" />
          {place.region.name}
          <span aria-hidden="true">·</span>
          <Clock3 size={14} aria-hidden="true" />
          {formatDuration(place.typicalDurationMinutes)}
        </p>
        <p className="place-description">{place.description}</p>
        <div className="place-card-bottom">
          <span className="price">{formatVnd(place.referencePriceVnd)}</span>
          <AddToTripButton dataset={dataset} place={place} />
        </div>
      </div>
    </article>
  );
}
