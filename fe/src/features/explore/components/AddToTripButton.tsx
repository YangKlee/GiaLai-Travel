import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MAX_DRAFT_STOPS, useTripDraftStore } from '@/store/useTripDraftStore';
import type { Dataset, Place } from '../types/catalog';

export function AddToTripButton({ dataset, place }: { dataset: Dataset; place: Place }) {
  const added = useTripDraftStore((state) =>
    state.drafts[dataset].places.some((item) => item.id === place.id),
  );
  const full = useTripDraftStore((state) => state.drafts[dataset].places.length >= MAX_DRAFT_STOPS);
  const add = useTripDraftStore((state) => state.add);
  return (
    <Button
      variant={added ? 'secondary' : 'primary'}
      disabled={added || full}
      onClick={() => add(dataset, place)}
      aria-label={`${added ? 'Đã chọn' : 'Thêm vào chuyến đi:'} ${place.title}`}
    >
      {added ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
      {added ? 'Đã chọn' : full ? 'Đã đủ 12 điểm' : 'Thêm vào chuyến đi'}
    </Button>
  );
}
