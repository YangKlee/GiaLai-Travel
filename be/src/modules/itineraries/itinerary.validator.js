import { AppError } from '../../shared/app-error.js';
import { estimateDefaultRouteLeg } from '../../adapters/index.js';

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = Number(parts[0] || 0);
  const m = Number(parts[1] || 0);
  return h * 60 + m;
}

export function validateProposalSchedule({
  input,
  days,
  placesMap = new Map(),
  eventsMap = new Map(),
  closuresList = [],
  routingAdapter,
}) {
  const warnings = [];
  const violations = [];
  const partySize = Number(input.partySize || 1);
  const totalBudgetVnd = BigInt(String(input.totalBudgetVnd || 0));

  let calculatedTotalVnd = 0n;
  const validatedDays = [];

  const baseDate = new Date(`${input.startDate}T00:00:00.000Z`);

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayNo = day.dayNumber ?? i + 1;
    const expectedDateStr = new Date(baseDate.getTime() + (dayNo - 1) * 86400000)
      .toISOString()
      .slice(0, 10);

    const travelDate = day.travelDate || expectedDateStr;
    if (travelDate !== expectedDateStr) {
      warnings.push(
        `Ngày ${dayNo} có ngày di chuyển (${travelDate}) khác với ngày tính toán từ ngày khởi hành (${expectedDateStr}).`,
      );
    }

    const validatedStops = [];
    const validatedLegs = [];
    let prevStop = null;

    for (let s = 0; s < (day.stops || []).length; s++) {
      const stop = day.stops[s];
      const place = placesMap.get(stop.placeId);
      if (!place) {
        violations.push(
          `Ngày ${dayNo}, Điểm dừng #${stop.sequenceNo}: Không tìm thấy thông tin địa điểm (ID: ${stop.placeId}).`,
        );
        continue;
      }

      const arrivesAt = new Date(stop.arrivesAt);
      const departsAt = new Date(stop.departsAt);
      const stopDurationMinutes = Math.round((departsAt.getTime() - arrivesAt.getTime()) / 60000);

      if (stopDurationMinutes < 15) {
        warnings.push(
          `Ngày ${dayNo}, ${place.title}: Thời gian ghé thăm (${stopDurationMinutes} phút) quá ngắn, khuyến nghị tối thiểu 20-30 phút.`,
        );
      }

      // Check Vietnam Time (UTC+7) for opening hours
      const vnArrives = new Date(arrivesAt.getTime() + 7 * 3600000);
      const vnDeparts = new Date(departsAt.getTime() + 7 * 3600000);
      const weekday = vnArrives.getUTCDay(); // 0 is Sunday, 1 is Monday...

      const openingHours = place.openingHours || [];
      const dayHours = openingHours.find((h) => h.weekday === weekday);

      if (openingHours.length > 0) {
        if (!dayHours) {
          warnings.push(
            `Ngày ${dayNo}, ${place.title}: Địa điểm có thể không mở cửa vào ${['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][weekday]}.`,
          );
        } else {
          const arriveMins = vnArrives.getUTCHours() * 60 + vnArrives.getUTCMinutes();
          const departMins = vnDeparts.getUTCHours() * 60 + vnDeparts.getUTCMinutes();
          const openMins = parseTimeToMinutes(dayHours.opensAt || dayHours.opens_at);
          const closeMins = parseTimeToMinutes(dayHours.closesAt || dayHours.closes_at);

          const crosses = Boolean(dayHours.crossesMidnight || dayHours.crosses_midnight);
          let isWithinOpenHours = false;
          if (!crosses) {
            isWithinOpenHours = arriveMins >= openMins && departMins <= closeMins;
          } else {
            isWithinOpenHours = arriveMins >= openMins || departMins <= closeMins;
          }

          if (!isWithinOpenHours) {
            warnings.push(
              `Ngày ${dayNo}, ${place.title}: Khung giờ ghé thăm (${vnArrives.toISOString().slice(11, 16)} - ${vnDeparts.toISOString().slice(11, 16)}) nằm ngoài giờ mở cửa quy định (${dayHours.opensAt || dayHours.opens_at} - ${dayHours.closesAt || dayHours.closes_at}).`,
            );
          }
        }
      }

      // Check temporary closures
      const placeClosures = closuresList.filter((c) => c.place_id === place.id || c.placeId === place.id);
      for (const closure of placeClosures) {
        const closureStart = new Date(closure.starts_at || closure.startsAt);
        const closureEnd = new Date(closure.ends_at || closure.endsAt);
        if (arrivesAt < closureEnd && departsAt > closureStart) {
          violations.push(
            `Ngày ${dayNo}, ${place.title}: Địa điểm đang có thông báo tạm dừng đón khách (${closure.reason || 'Bảo trì'}). Nguồn: ${closure.source_reference || closure.sourceReference || 'Sở VHTTDL'}.`,
          );
        }
      }

      // Cost calculation
      let stopUnitCost = BigInt(String(place.referencePriceVnd || place.reference_price_vnd || 0));
      if (stop.eventId) {
        const ev = eventsMap.get(stop.eventId);
        if (ev && ev.ticketPriceVnd) {
          stopUnitCost += BigInt(String(ev.ticketPriceVnd));
        }
      }
      const stopTotalCost = stopUnitCost * BigInt(partySize);
      calculatedTotalVnd += stopTotalCost;

      // Leg travel validation
      let fromLat = input.origin.latitude;
      let fromLon = input.origin.longitude;
      if (prevStop) {
        const prevPlace = placesMap.get(prevStop.placeId);
        if (prevPlace) {
          fromLat = Number(prevPlace.latitude);
          fromLon = Number(prevPlace.longitude);
        }
      }

      const toLat = Number(place.latitude);
      const toLon = Number(place.longitude);

      const legEstimate = routingAdapter
        ? routingAdapter.estimateDefaultLeg
          ? routingAdapter.estimateDefaultLeg({
              fromLat,
              fromLon,
              toLat,
              toLon,
              transportMode: input.transportMode,
            })
          : estimateDefaultRouteLeg({
              fromLat,
              fromLon,
              toLat,
              toLon,
              transportMode: input.transportMode,
            })
        : estimateDefaultRouteLeg({
            fromLat,
            fromLon,
            toLat,
            toLon,
            transportMode: input.transportMode,
          });

      if (prevStop) {
        const prevDepartsAt = new Date(prevStop.departsAt);
        const availableTransitSeconds = Math.round(
          (arrivesAt.getTime() - prevDepartsAt.getTime()) / 1000,
        );

        if (availableTransitSeconds < 0) {
          violations.push(
            `Ngày ${dayNo}, Điểm dừng #${stop.sequenceNo}: Thời gian đến (${arrivesAt.toISOString()}) sớm hơn thời gian rời điểm trước (${prevDepartsAt.toISOString()}) - bị chồng lấn thời gian.`,
          );
        } else if (availableTransitSeconds < legEstimate.durationSeconds) {
          const reqMinutes = Math.ceil(legEstimate.durationSeconds / 60);
          const actualMinutes = Math.floor(availableTransitSeconds / 60);
          warnings.push(
            `Ngày ${dayNo}, Điểm #${prevStop.sequenceNo} → #${stop.sequenceNo}: Thời gian di chuyển thực tế (${actualMinutes} phút) ít hơn thời gian ước tính tối thiểu (${reqMinutes} phút cho ${Math.round(legEstimate.distanceMeters / 1000)} km).`,
          );
        }
      }

      const legCost = BigInt(String(legEstimate.estimatedCostVnd || 0));
      calculatedTotalVnd += legCost;

      validatedLegs.push({
        fromStopSequence: prevStop ? prevStop.sequenceNo : null,
        toStopSequence: stop.sequenceNo,
        distanceMeters: legEstimate.distanceMeters,
        durationSeconds: legEstimate.durationSeconds,
        transportMode: input.transportMode,
        provider: legEstimate.provider,
        sourceReference: legEstimate.sourceReference,
        estimatedCostVnd: Number(legCost),
      });

      validatedStops.push({
        placeId: place.id,
        contentRevisionId: place.revisionId || stop.contentRevisionId || place.content_id,
        eventId: stop.eventId || null,
        placeTitle: place.title,
        sequenceNo: stop.sequenceNo,
        arrivesAt: stop.arrivesAt,
        departsAt: stop.departsAt,
        estimatedCostVnd: Number(stopTotalCost),
        note: stop.note || null,
      });

      prevStop = stop;
    }

    validatedDays.push({
      dayNumber: dayNo,
      travelDate,
      stops: validatedStops,
      legs: validatedLegs,
    });
  }

  // Budget comparison
  if (calculatedTotalVnd > totalBudgetVnd) {
    const diff = calculatedTotalVnd - totalBudgetVnd;
    warnings.push(
      `Tổng chi phí ước tính (${calculatedTotalVnd.toString()} VND) vượt ngân sách dự kiến (${totalBudgetVnd.toString()} VND) là ${diff.toString()} VND. Vui lòng giảm số điểm thu phí hoặc tối ưu phương tiện.`,
    );
  }

  const isValid = violations.length === 0;

  return {
    isValid,
    estimatedTotalVnd: calculatedTotalVnd.toString(),
    budgetVnd: totalBudgetVnd.toString(),
    warnings,
    violations,
    days: validatedDays,
  };
}
