// Compare instants; ISO timestamps carry their offset, independent of server timezone.
export function effectiveEventStatus(status, endsAt, now = Date.now()) {
  if (status === 'CANCELLED' || status === 'COMPLETED') return status;
  const end = new Date(endsAt).getTime();
  return Number.isFinite(end) && end <= now ? 'COMPLETED' : status;
}
