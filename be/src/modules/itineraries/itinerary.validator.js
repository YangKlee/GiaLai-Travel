import {
  buildGoogleMapsDayRouteUrl,
  buildGoogleMapsDirectionsUrl,
  estimateDefaultRouteLeg,
} from '../../adapters/index.js';

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

      const displayTitle = stop.placeTitle || place.title;
      const arrivesAt = new Date(stop.arrivesAt);
      const departsAt = new Date(stop.departsAt);
      const stopDurationMinutes = Math.round((departsAt.getTime() - arrivesAt.getTime()) / 60000);

      if (stopDurationMinutes < 15) {
        warnings.push(
          `Ngày ${dayNo}, ${displayTitle}: Thời gian ghé thăm (${stopDurationMinutes} phút) quá ngắn, khuyến nghị tối thiểu 20-30 phút.`,
        );
      }

      // Only check opening hours when the stop is an actual visit to the DB place (same title)
      const isDirectDbPlaceVisit =
        !stop.placeTitle || stop.placeTitle.toLowerCase() === place.title.toLowerCase();

      if (isDirectDbPlaceVisit) {
        const vnArrives = new Date(arrivesAt.getTime() + 7 * 3600000);
        const vnDeparts = new Date(departsAt.getTime() + 7 * 3600000);
        const weekday = vnArrives.getUTCDay();

        const openingHours = place.openingHours || [];
        const dayHours = openingHours.find((h) => h.weekday === weekday);

        if (openingHours.length > 0) {
          if (!dayHours) {
            warnings.push(
              `Ngày ${dayNo}, ${displayTitle}: Địa điểm có thể không mở cửa vào ${['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][weekday]}.`,
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
                `Ngày ${dayNo}, ${displayTitle}: Khung giờ ghé thăm (${vnArrives.toISOString().slice(11, 16)} - ${vnDeparts.toISOString().slice(11, 16)}) nằm ngoài giờ mở cửa quy định (${dayHours.opensAt || dayHours.opens_at} - ${dayHours.closesAt || dayHours.closes_at}).`,
              );
            }
          }
        }

        // Check temporary closures
        const placeClosures = closuresList.filter(
          (c) => c.place_id === place.id || c.placeId === place.id,
        );
        for (const closure of placeClosures) {
          const closureStart = new Date(closure.starts_at || closure.startsAt);
          const closureEnd = new Date(closure.ends_at || closure.endsAt);
          if (arrivesAt < closureEnd && departsAt > closureStart) {
            violations.push(
              `Ngày ${dayNo}, ${displayTitle}: Địa điểm đang có thông báo tạm dừng đón khách (${closure.reason || 'Bảo trì'}). Nguồn: ${closure.source_reference || closure.sourceReference || 'Sở VHTTDL'}.`,
            );
          }
        }
      }

      // Cost calculation: preserve AI API's estimatedCostVnd if provided, otherwise calculate from DB reference price
      let stopTotalCost;
      if (stop.estimatedCostVnd != null && Number(stop.estimatedCostVnd) >= 0) {
        stopTotalCost = BigInt(Math.round(Number(stop.estimatedCostVnd)));
      } else {
        let stopUnitCost = BigInt(String(place.referencePriceVnd || place.reference_price_vnd || 0));
        if (stop.eventId) {
          const ev = eventsMap.get(stop.eventId);
          if (ev && ev.ticketPriceVnd) {
            stopUnitCost += BigInt(String(ev.ticketPriceVnd));
          }
        }
        stopTotalCost = stopUnitCost * BigInt(partySize);
      }
      calculatedTotalVnd += stopTotalCost;

      // Coordinates: preserve AI API's coordinates if provided, otherwise DB place coordinates
      let fromLat = input.origin.latitude;
      let fromLon = input.origin.longitude;
      let fromLabel = input.origin.label || 'Điểm xuất phát';
      if (prevStop) {
        const prevPlace = placesMap.get(prevStop.placeId);
        fromLat =
          prevStop.latitude != null
            ? Number(prevStop.latitude)
            : Number(prevPlace?.latitude ?? input.origin.latitude);
        fromLon =
          prevStop.longitude != null
            ? Number(prevStop.longitude)
            : Number(prevPlace?.longitude ?? input.origin.longitude);
        fromLabel = prevStop.placeTitle || prevPlace?.title || 'Điểm trước';
      }

      const toLat =
        stop.latitude != null ? Number(stop.latitude) : Number(place.latitude);
      const toLon =
        stop.longitude != null ? Number(stop.longitude) : Number(place.longitude);

      const existingLeg = (day.legs || []).find((l) => l.toStopSequence === stop.sequenceNo);

      const legEstimate = existingLeg
        ? {
            distanceMeters: existingLeg.distanceMeters,
            durationSeconds: existingLeg.durationSeconds,
            transportMode: existingLeg.transportMode || input.transportMode,
            provider: existingLeg.provider || 'ai-google-maps-route',
            sourceReference: existingLeg.sourceReference || 'Lộ trình AI & Google Maps',
            estimatedCostVnd: existingLeg.estimatedCostVnd ?? 0,
          }
        : routingAdapter && typeof routingAdapter.estimateDefaultLeg === 'function'
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

      const legDepartsEpochMs = prevStop
        ? new Date(prevStop.departsAt).getTime()
        : arrivesAt.getTime() - legEstimate.durationSeconds * 1000;

      validatedLegs.push({
        fromStopSequence: prevStop ? prevStop.sequenceNo : null,
        toStopSequence: stop.sequenceNo,
        fromLabel: existingLeg?.fromLabel || fromLabel,
        toLabel: existingLeg?.toLabel || displayTitle,
        fromLatitude: fromLat,
        fromLongitude: fromLon,
        toLatitude: toLat,
        toLongitude: toLon,
        departsAt: existingLeg?.departsAt || new Date(legDepartsEpochMs).toISOString(),
        arrivesAt: stop.arrivesAt,
        distanceMeters: legEstimate.distanceMeters,
        durationSeconds: legEstimate.durationSeconds,
        transportMode: input.transportMode,
        provider: legEstimate.provider,
        sourceReference: legEstimate.sourceReference,
        estimatedCostVnd: Number(legCost),
        googleMapsDirectionsUrl:
          existingLeg?.googleMapsDirectionsUrl ||
          buildGoogleMapsDirectionsUrl({
            fromLat,
            fromLon,
            toLat,
            toLon,
            transportMode: input.transportMode,
          }),
      });

      validatedStops.push({
        placeId: place.id,
        contentRevisionId: place.revisionId || stop.contentRevisionId || place.content_id || null,
        eventId: stop.eventId || null,
        placeTitle: displayTitle,
        placeCategory: stop.placeCategory || place.category,
        latitude: toLat,
        longitude: toLon,
        activityType:
          stop.activityType ||
          (place.category === 'FOOD' ? 'LUNCH' : place.category === 'STAY' ? 'STAY' : 'VISIT'),
        sequenceNo: stop.sequenceNo,
        arrivesAt: stop.arrivesAt,
        departsAt: stop.departsAt,
        estimatedCostVnd: Number(stopTotalCost),
        bestTimeToVisit: stop.bestTimeToVisit || place.bestTimeToVisit || place.best_time_to_visit || null,
        note: stop.note || null,
      });

      prevStop = stop;
    }

    validatedDays.push({
      dayNumber: dayNo,
      travelDate,
      daySummary: day.daySummary || null,
      googleMapsDayRouteUrl:
        day.googleMapsDayRouteUrl ||
        buildGoogleMapsDayRouteUrl({
          origin: input.origin,
          stops: validatedStops,
          transportMode: input.transportMode,
        }),
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
