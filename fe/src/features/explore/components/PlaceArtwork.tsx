import { Mountain, Trees, Landmark, Coffee, Tent, Compass } from 'lucide-react';
import type { Category } from '../types/catalog';

const icons = {
  NATURE: Trees,
  CULTURE: Landmark,
  FOOD: Coffee,
  STAY: Tent,
  ADVENTURE: Mountain,
  OTHER: Compass,
};

export function PlaceArtwork({ category, large = false }: { category: Category; large?: boolean }) {
  const Icon = icons[category];
  return (
    <div
      className={`place-art art-${category.toLowerCase()}${large ? ' art-large' : ''}`}
      aria-hidden="true"
    >
      <span className="art-orbit" />
      <span className="art-hill art-hill-back" />
      <span className="art-hill" />
      <Icon size={large ? 96 : 56} strokeWidth={1.1} />
    </div>
  );
}
