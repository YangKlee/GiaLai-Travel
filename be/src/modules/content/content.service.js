import { createHash, randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { appendAudit } from '../../shared/audit.js';
import { paginationMeta } from '../../shared/pagination.js';
import { resolveNow, serializeUtc } from '../../shared/time.js';
import { validateKindPayload } from './content.schema.js';
import { createContentRepository } from './content.repository.js';
import { createR2Storage } from '../../adapters/r2-storage.js';

function requireAdmin(actor) {
  if (!actor || !Array.isArray(actor.roles) || !actor.roles.includes('ADMIN')) {
    throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền truy cập khu vực quản trị nội dung.');
  }
}

function verifyMediaContent(buffer, mimeType) {
  if (buffer.length === 0) {
    throw new AppError(422, 'INVALID_MEDIA_CONTENT', 'Tệp tải lên rỗng.');
  }
  const headText = buffer.subarray(0, Math.min(256, buffer.length)).toString('utf8').toLowerCase();
  if (
    headText.includes('<script') ||
    headText.includes('<!doctype html') ||
    headText.includes('<html') ||
    headText.includes('<?php') ||
    (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a)
  ) {
    throw new AppError(
      422,
      'INVALID_MEDIA_CONTENT',
      'Nội dung tệp chứa mã thực thi hoặc kịch bản bị từ chối.',
    );
  }
  if (mimeType === 'image/png') {
    const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    if (buffer.length < 4 || !buffer.subarray(0, 4).equals(pngMagic)) {
      throw new AppError(422, 'INVALID_MEDIA_CONTENT', 'Nội dung tệp không khớp định dạng PNG.');
    }
  } else if (mimeType === 'image/jpeg') {
    if (buffer.length < 3 || buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
      throw new AppError(422, 'INVALID_MEDIA_CONTENT', 'Nội dung tệp không khớp định dạng JPEG.');
    }
  } else if (mimeType === 'application/pdf') {
    if (!headText.startsWith('%pdf-')) {
      throw new AppError(422, 'INVALID_MEDIA_CONTENT', 'Nội dung tệp không khớp định dạng PDF.');
    }
  } else if (mimeType === 'audio/wav') {
    if (buffer.length < 12 || buffer.subarray(0, 4).toString('ascii') !== 'RIFF') {
      throw new AppError(422, 'INVALID_MEDIA_CONTENT', 'Nội dung tệp không khớp định dạng WAV.');
    }
  }
}

function mediaAssetDto(row) {
  const plain = row.get ? row.get({ plain: true }) : row;
  return {
    id: plain.id,
    storageKey: plain.storage_key,
    mediaType: plain.media_type,
    mimeType: plain.mime_type,
    byteSize: Number(plain.byte_size),
    sha256Hex: Buffer.isBuffer(plain.sha256) ? plain.sha256.toString('hex') : String(plain.sha256),
    sourceReference: plain.source_reference,
    licenseNote: plain.license_note,
    offlineAllowed: Boolean(plain.offline_allowed),
    uploadedBy: plain.uploaded_by,
    createdAt: serializeUtc(plain.created_at),
  };
}

function parsePayload(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
}

function serializeContentItem(instance) {
  const row = instance.get ? instance.get({ plain: true }) : instance;
  const revisions = [...(row.content_revisions ?? [])]
    .sort((a, b) => Number(b.revision_no) - Number(a.revision_no))
    .map((rev) => {
      const translations = rev.content_translations ?? [];
      const vi = translations.find((t) => t.language_code === 'vi') ?? translations[0] ?? null;
      return {
        id: rev.id,
        contentId: rev.content_id,
        revisionNo: Number(rev.revision_no),
        status: rev.status,
        sourceReference: rev.source_reference ?? null,
        title: vi?.title ?? '',
        body: vi?.body ?? '',
        transcript: vi?.transcript ?? null,
        audioAssetId: vi?.audio_asset_id ?? null,
        payload: parsePayload(rev.payload),
        submittedBy: rev.submitted_by,
        reviewedBy: rev.reviewed_by ?? null,
        reviewedAt: rev.reviewed_at ? serializeUtc(rev.reviewed_at) : null,
        rejectionReason: rev.rejection_reason ?? null,
        createdAt: serializeUtc(rev.created_at),
      };
    });
  const publishedRevision =
    revisions.find((r) => r.id === row.published_revision_id) ?? null;
  const latestRevision = revisions[0] ?? null;
  const projectionId =
    row.place?.id ??
    row.audio_guide?.id ??
    row.event?.id ??
    row.partner?.id ??
    row.service?.id ??
    null;

  return {
    id: row.id,
    kind: row.kind,
    visibility: row.visibility,
    publishedRevisionId: row.published_revision_id ?? null,
    projectionId,
    title: publishedRevision?.title || latestRevision?.title || row.id,
    latestStatus: latestRevision?.status ?? 'DRAFT',
    createdBy: row.created_by,
    createdAt: serializeUtc(row.created_at),
    updatedAt: serializeUtc(row.updated_at),
    revisions,
  };
}

export function createContentService(database, { clock, r2Storage } = {}) {
  const repository = createContentRepository(database);
  const storage = r2Storage || createR2Storage();

  async function safe(work) {
    try {
      return await work();
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error?.name === 'SequelizeUniqueConstraintError') {
        throw new AppError(409, 'CONTENT_CONFLICT', 'Dữ liệu nội dung hoặc tài nguyên bị trùng khóa.');
      }
      throw new AppError(
        503,
        'CONTENT_UNAVAILABLE',
        'Hệ thống quản trị nội dung đang tạm gián đoạn. Vui lòng thử lại sau.',
      );
    }
  }

  function ensureValidPayloadForKind(kind, payload) {
    const issues = [];
    validateKindPayload(kind, payload, {
      addIssue(issue) {
        issues.push({
          field: issue.path.join('.'),
          message: issue.message,
        });
      },
    });
    if (issues.length > 0) {
      throw new AppError(422, 'VALIDATION_ERROR', 'Dữ liệu thuộc tính chuyên biệt không hợp lệ.', issues);
    }
  }

  return {
    listMeta: (actor) =>
      safe(async () => {
        requireAdmin(actor);
        const [regions, partners, places, mediaAssets] = await Promise.all([
          repository.listRegions(),
          repository.findPartners(),
          repository.findPlaces(),
          repository.listMediaAssets(),
        ]);
        return {
          data: {
            regions: regions.map((r) => ({ id: r.id, name: r.name, code: r.code })),
            partners: partners.map((p) => {
              const plain = p.get({ plain: true });
              const rev = plain.content?.published_revision;
              const title = rev?.content_translations?.[0]?.title ?? `Đối tác ${plain.id.slice(0, 8)}`;
              return { id: plain.id, contentId: plain.content_id, status: plain.status, title };
            }),
            places: places.map((pl) => {
              const plain = pl.get({ plain: true });
              const rev = plain.content?.published_revision;
              const title = rev?.content_translations?.[0]?.title ?? `Địa điểm ${plain.id.slice(0, 8)}`;
              return {
                id: plain.id,
                contentId: plain.content_id,
                category: plain.category,
                regionId: plain.region_id,
                title,
              };
            }),
            mediaAssets: mediaAssets.map(mediaAssetDto),
          },
        };
      }),

    createMediaAsset: (actor, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        let byteSize = input.byteSize;
        let sha256Buffer;
        if (input.contentBase64) {
          const buffer = Buffer.from(input.contentBase64, 'base64');
          verifyMediaContent(buffer, input.mimeType);
          byteSize = buffer.length;
          sha256Buffer = createHash('sha256').update(buffer).digest();
        } else {
          sha256Buffer = Buffer.from(input.sha256Hex, 'hex');
        }
        const now = resolveNow(clock);
        return database.transaction(async (transaction) => {
          const created = await repository.createMediaAsset(
            {
              id: randomUUID(),
              storage_key: input.storageKey,
              media_type: input.mediaType,
              mime_type: input.mimeType,
              byte_size: byteSize,
              sha256: sha256Buffer,
              source_reference: input.sourceReference,
              license_note: input.licenseNote,
              offline_allowed: Boolean(input.offlineAllowed),
              uploaded_by: actor.user.id,
              created_at: now,
            },
            transaction,
          );
          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'MEDIA_ASSET_CREATE',
            targetType: 'MEDIA_ASSET',
            targetId: created.id,
            requestId,
            metadata: { mediaType: input.mediaType, mimeType: input.mimeType, byteSize },
          });
          return { data: mediaAssetDto(created) };
        });
      }),

    listContents: (actor, query) =>
      safe(async () => {
        requireAdmin(actor);
        const { rows, total } = await repository.listContents(query);
        return {
          data: rows.map(serializeContentItem),
          meta: paginationMeta(query, total),
        };
      }),

    getContent: (actor, id) =>
      safe(async () => {
        requireAdmin(actor);
        const item = await repository.contentById(id);
        if (!item) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Không tìm thấy mục nội dung.');
        return { data: serializeContentItem(item) };
      }),

    createContent: (actor, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        return database.transaction(async (transaction) => {
          if (input.audioAssetId) {
            const asset = await repository.mediaAssetById(input.audioAssetId, transaction);
            if (!asset || asset.media_type !== 'AUDIO') {
              throw new AppError(422, 'INVALID_AUDIO_ASSET', 'Tệp âm thanh đính kèm không tồn tại.');
            }
          }
          const contentId = randomUUID();
          const revisionId = randomUUID();
          await repository.createContentItem(
            {
              id: contentId,
              kind: input.kind,
              visibility: 'DRAFT',
              published_revision_id: null,
              created_by: actor.user.id,
              created_at: now,
              updated_at: now,
            },
            transaction,
          );
          await repository.createRevision(
            {
              id: revisionId,
              content_id: contentId,
              revision_no: 1,
              status: input.submitImmediately ? 'PENDING' : 'DRAFT',
              source_reference: input.sourceReference ?? null,
              payload: input.payload ?? {},
              submitted_by: actor.user.id,
              created_at: now,
            },
            transaction,
          );
          await repository.createTranslation(
            {
              revision_id: revisionId,
              language_code: 'vi',
              title: input.title,
              body: input.body,
              transcript: input.transcript ?? null,
              audio_asset_id: input.audioAssetId ?? null,
            },
            transaction,
          );
          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'CONTENT_ITEM_CREATE',
            targetType: 'CONTENT_ITEM',
            targetId: contentId,
            requestId,
            metadata: { kind: input.kind, revisionId, status: input.submitImmediately ? 'PENDING' : 'DRAFT' },
          });
          const full = await repository.contentById(contentId, transaction);
          return { data: serializeContentItem(full) };
        });
      }),

    createRevision: (actor, contentId, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        return database.transaction(async (transaction) => {
          const locked = await repository.lockContentItem(contentId, transaction);
          if (!locked) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Không tìm thấy mục nội dung.');
          ensureValidPayloadForKind(locked.kind, input.payload ?? {});
          if (input.audioAssetId) {
            const asset = await repository.mediaAssetById(input.audioAssetId, transaction);
            if (!asset || asset.media_type !== 'AUDIO') {
              throw new AppError(422, 'INVALID_AUDIO_ASSET', 'Tệp âm thanh đính kèm không tồn tại.');
            }
          }
          const existingRevisions = await repository.revisionsByContent(contentId, transaction);
          const nextRevisionNo =
            existingRevisions.reduce((max, rev) => Math.max(max, Number(rev.revision_no)), 0) + 1;
          const revisionId = randomUUID();
          await repository.createRevision(
            {
              id: revisionId,
              content_id: contentId,
              revision_no: nextRevisionNo,
              status: input.submitImmediately ? 'PENDING' : 'DRAFT',
              source_reference: input.sourceReference ?? null,
              payload: input.payload ?? {},
              submitted_by: actor.user.id,
              created_at: now,
            },
            transaction,
          );
          await repository.createTranslation(
            {
              revision_id: revisionId,
              language_code: 'vi',
              title: input.title,
              body: input.body,
              transcript: input.transcript ?? null,
              audio_asset_id: input.audioAssetId ?? null,
            },
            transaction,
          );
          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'CONTENT_REVISION_CREATE',
            targetType: 'CONTENT_REVISION',
            targetId: revisionId,
            requestId,
            metadata: { contentId, revisionNo: nextRevisionNo },
          });
          const full = await repository.contentById(contentId, transaction);
          return { data: serializeContentItem(full) };
        });
      }),

    submitRevision: (actor, contentId, revisionId, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        return database.transaction(async (transaction) => {
          const locked = await repository.lockContentItem(contentId, transaction);
          if (!locked) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Không tìm thấy mục nội dung.');
          const rev = await repository.revisionById(contentId, revisionId, transaction, true);
          if (!rev) throw new AppError(404, 'REVISION_NOT_FOUND', 'Không tìm thấy phiên bản nội dung.');
          if (rev.status !== 'DRAFT') {
            throw new AppError(
              409,
              'INVALID_REVISION_STATE',
              'Chỉ phiên bản ở trạng thái DRAFT mới có thể gửi duyệt.',
            );
          }
          await rev.update({ status: 'PENDING' }, { transaction });
          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'CONTENT_REVISION_SUBMIT',
            targetType: 'CONTENT_REVISION',
            targetId: rev.id,
            requestId,
          });
          const full = await repository.contentById(contentId, transaction);
          return { data: serializeContentItem(full) };
        });
      }),

    reviewRevision: (actor, contentId, revisionId, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        return database.transaction(async (transaction) => {
          const locked = await repository.lockContentItem(contentId, transaction);
          if (!locked) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Không tìm thấy mục nội dung.');
          const rev = await repository.revisionById(contentId, revisionId, transaction, true);
          if (!rev) throw new AppError(404, 'REVISION_NOT_FOUND', 'Không tìm thấy phiên bản nội dung.');
          if (!['DRAFT', 'PENDING'].includes(rev.status)) {
            throw new AppError(
              409,
              'REVISION_IMMUTABLE',
              'Phiên bản đã duyệt hoặc đã từ chối là bất biến, không thể duyệt lại.',
            );
          }

          if (input.decision === 'REJECT') {
            await rev.update(
              {
                status: 'REJECTED',
                reviewed_by: actor.user.id,
                reviewed_at: now,
                rejection_reason: input.rejectionReason,
              },
              { transaction },
            );
            await appendAudit(database, transaction, {
              actorId: actor.user.id,
              action: 'CONTENT_REVISION_REJECT',
              targetType: 'CONTENT_REVISION',
              targetId: rev.id,
              requestId,
              metadata: { contentId, revisionNo: Number(rev.revision_no) },
            });
            const full = await repository.contentById(contentId, transaction);
            return { data: serializeContentItem(full) };
          }

          const effectiveSource = (input.sourceReference ?? rev.source_reference ?? '').trim();
          if (!effectiveSource) {
            throw new AppError(
              422,
              'SOURCE_REQUIRED',
              'Cần cung cấp nguồn tham chiếu xác minh (sourceReference) trước khi công bố.',
              [{ field: 'sourceReference', message: 'Nguồn xác minh là bắt buộc khi duyệt công bố.' }],
            );
          }
          const payload = parsePayload(rev.payload);
          ensureValidPayloadForKind(locked.kind, payload);

          await rev.update(
            {
              status: 'PUBLISHED',
              source_reference: effectiveSource,
              reviewed_by: actor.user.id,
              reviewed_at: now,
              rejection_reason: null,
            },
            { transaction },
          );
          const projection = await repository.syncProjection(locked, rev, payload, now, transaction);
          await locked.update(
            {
              published_revision_id: rev.id,
              visibility: 'PUBLIC',
              updated_at: now,
            },
            { transaction },
          );
          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'CONTENT_REVISION_APPROVE',
            targetType: 'CONTENT_REVISION',
            targetId: rev.id,
            requestId,
            metadata: {
              contentId,
              revisionNo: Number(rev.revision_no),
              projectionType: projection.projectionType,
              projectionId: projection.projectionId,
            },
          });
          const full = await repository.contentById(contentId, transaction);
          return { data: serializeContentItem(full) };
        });
      }),

    updateVisibility: (actor, contentId, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        return database.transaction(async (transaction) => {
          const locked = await repository.lockContentItem(contentId, transaction);
          if (!locked) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Không tìm thấy mục nội dung.');
          if (input.visibility === 'PUBLIC' && !locked.published_revision_id) {
            throw new AppError(
              409,
              'UNPUBLISHED_CONTENT',
              'Mục nội dung chưa có phiên bản được duyệt công bố.',
            );
          }
          await locked.update(
            {
              visibility: input.visibility,
              updated_at: now,
            },
            { transaction },
          );
          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'CONTENT_VISIBILITY_UPDATE',
            targetType: 'CONTENT_ITEM',
            targetId: locked.id,
            requestId,
            metadata: { visibility: input.visibility },
          });
          const full = await repository.contentById(contentId, transaction);
          return { data: serializeContentItem(full) };
        });
      }),

    addPlaceClosure: (actor, placeId, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        return database.transaction(async (transaction) => {
          const place = await repository.placeById(placeId, transaction);
          if (!place) throw new AppError(404, 'PLACE_NOT_FOUND', 'Không tìm thấy địa điểm.');
          const closure = await repository.createPlaceClosure(
            {
              id: randomUUID(),
              place_id: placeId,
              starts_at: new Date(input.startsAt),
              ends_at: new Date(input.endsAt),
              reason: input.reason,
              source_reference: input.sourceReference,
              recorded_by: actor.user.id,
              created_at: now,
            },
            transaction,
          );
          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'PLACE_CLOSURE_CREATE',
            targetType: 'PLACE_CLOSURE',
            targetId: closure.id,
            requestId,
            metadata: { placeId },
          });
          return {
            data: {
              id: closure.id,
              placeId: closure.place_id,
              startsAt: serializeUtc(closure.starts_at),
              endsAt: serializeUtc(closure.ends_at),
              reason: closure.reason,
              sourceReference: closure.source_reference,
            },
          };
        });
      }),

    uploadR2: (actor, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const buffer = Buffer.from(input.contentBase64, 'base64');
        const uploadResult = await storage.uploadImage({
          buffer,
          mimeType: input.mimeType,
          originalName: input.fileName,
          folder: input.folder || 'events',
        });
        await appendAudit(database, null, {
          actorId: actor.user.id,
          action: 'ADMIN_R2_UPLOAD',
          targetType: 'MEDIA_ASSET',
          targetId: uploadResult.key,
          requestId,
          metadata: {
            fileName: input.fileName,
            mimeType: input.mimeType,
            provider: uploadResult.provider,
            byteSize: uploadResult.byteSize,
          },
        });
        return { data: uploadResult };
      }),

    listAdminPlaces: (actor, query) =>
      safe(async () => {
        requireAdmin(actor);
        const { rows, total } = await repository.listAdminPlaces(query);
        return {
          data: rows,
          meta: paginationMeta(query, total),
        };
      }),

    getAdminPlace: (actor, id) =>
      safe(async () => {
        requireAdmin(actor);
        const place = await repository.getAdminPlaceById(id);
        if (!place) throw new AppError(404, 'PLACE_NOT_FOUND', 'Không tìm thấy địa điểm.');
        return { data: place };
      }),

    createAdminPlace: (actor, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        const {
          Places,
          Regions,
          ContentItems,
          ContentRevisions,
          ContentTranslations,
          PlaceOpeningHours,
        } = database.models;
        const region = await Regions.findByPk(input.regionId);
        if (!region) throw new AppError(422, 'INVALID_REGION', 'Vùng địa lý không tồn tại.');

        return database.transaction(async (transaction) => {
          const contentId = randomUUID();
          const revisionId = randomUUID();
          const placeId = randomUUID();

          await ContentItems.create(
            {
              id: contentId,
              kind: 'PLACE',
              visibility: 'PUBLIC',
              published_revision_id: revisionId,
              created_by: actor.user.id,
              created_at: now,
              updated_at: now,
            },
            { transaction },
          );

          const payload = {
            regionId: input.regionId,
            category: input.category,
            latitude: Number(input.latitude),
            longitude: Number(input.longitude),
            referencePriceVnd: input.referencePriceVnd ? String(input.referencePriceVnd) : null,
            typicalDurationMinutes: input.typicalDurationMinutes
              ? Number(input.typicalDurationMinutes)
              : null,
            bannerUrl: input.bannerUrl || null,
            imageUrl: input.imageUrl || input.bannerUrl || null,
            openingHours: input.openingHours || [],
          };

          await ContentRevisions.create(
            {
              id: revisionId,
              content_id: contentId,
              revision_no: 1,
              status: 'PUBLISHED',
              source_reference: input.sourceReference || 'https://gialai.gov.vn/diem-den',
              payload,
              submitted_by: actor.user.id,
              reviewed_by: actor.user.id,
              reviewed_at: now,
              created_at: now,
            },
            { transaction },
          );

          await ContentTranslations.create(
            {
              revision_id: revisionId,
              language_code: 'vi',
              title: input.title,
              body: input.description,
            },
            { transaction },
          );

          await Places.create(
            {
              id: placeId,
              content_id: contentId,
              region_id: input.regionId,
              category: input.category,
              latitude: input.latitude,
              longitude: input.longitude,
              reference_price_vnd: input.referencePriceVnd
                ? String(input.referencePriceVnd)
                : null,
              typical_duration_minutes: input.typicalDurationMinutes
                ? Number(input.typicalDurationMinutes)
                : null,
              updated_at: now,
            },
            { transaction },
          );

          if (Array.isArray(input.openingHours) && input.openingHours.length > 0) {
            await PlaceOpeningHours.bulkCreate(
              input.openingHours.map((item) => ({
                id: randomUUID(),
                place_id: placeId,
                weekday: item.weekday,
                opens_at: item.opensAt.length === 5 ? `${item.opensAt}:00` : item.opensAt,
                closes_at: item.closesAt.length === 5 ? `${item.closesAt}:00` : item.closesAt,
                crosses_midnight: Boolean(item.crossesMidnight),
              })),
              { transaction },
            );
          }

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ADMIN_PLACE_CREATE',
            targetType: 'PLACE',
            targetId: placeId,
            requestId,
            metadata: { title: input.title, category: input.category, regionId: input.regionId },
          });

          const created = await repository.getAdminPlaceById(placeId, transaction);
          return { data: created };
        });
      }),

    updateAdminPlace: (actor, id, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        const {
          Places,
          Regions,
          ContentItems,
          ContentRevisions,
          ContentTranslations,
          PlaceOpeningHours,
        } = database.models;

        return database.transaction(async (transaction) => {
          const place = await Places.findByPk(id, { transaction });
          if (!place) throw new AppError(404, 'PLACE_NOT_FOUND', 'Không tìm thấy địa điểm.');

          if (input.regionId) {
            const region = await Regions.findByPk(input.regionId, { transaction });
            if (!region) throw new AppError(422, 'INVALID_REGION', 'Vùng địa lý không tồn tại.');
            place.region_id = input.regionId;
          }
          if (input.category) place.category = input.category;
          if (input.latitude !== undefined) place.latitude = input.latitude;
          if (input.longitude !== undefined) place.longitude = input.longitude;
          if (input.referencePriceVnd !== undefined) {
            place.reference_price_vnd = input.referencePriceVnd
              ? String(input.referencePriceVnd)
              : null;
          }
          if (input.typicalDurationMinutes !== undefined) {
            place.typical_duration_minutes = input.typicalDurationMinutes
              ? Number(input.typicalDurationMinutes)
              : null;
          }
          place.updated_at = now;
          await place.save({ transaction });

          const contentItem = await ContentItems.findByPk(place.content_id, { transaction });
          if (contentItem) {
            await contentItem.update({ updated_at: now }, { transaction });

            const rev = contentItem.published_revision_id
              ? await ContentRevisions.findByPk(contentItem.published_revision_id, {
                  transaction,
                })
              : await ContentRevisions.findOne({
                  where: { content_id: contentItem.id },
                  order: [['revision_no', 'DESC']],
                  transaction,
                });

            if (rev) {
              const oldPayload = parsePayload(rev.payload);
              const newPayload = {
                ...oldPayload,
                regionId: place.region_id,
                category: place.category,
                latitude: Number(place.latitude),
                longitude: Number(place.longitude),
                referencePriceVnd: place.reference_price_vnd,
                typicalDurationMinutes: place.typical_duration_minutes,
                bannerUrl:
                  input.bannerUrl !== undefined
                    ? input.bannerUrl || null
                    : oldPayload.bannerUrl,
                imageUrl:
                  input.imageUrl !== undefined
                    ? input.imageUrl || null
                    : input.bannerUrl !== undefined
                      ? input.bannerUrl || null
                      : oldPayload.imageUrl,
              };
              if (input.openingHours !== undefined) newPayload.openingHours = input.openingHours;

              await rev.update(
                {
                  payload: newPayload,
                  ...(input.sourceReference ? { source_reference: input.sourceReference } : {}),
                },
                { transaction },
              );

              const trans = await ContentTranslations.findOne({
                where: { revision_id: rev.id, language_code: 'vi' },
                transaction,
              });
              if (trans) {
                await trans.update(
                  {
                    ...(input.title ? { title: input.title } : {}),
                    ...(input.description ? { body: input.description } : {}),
                  },
                  { transaction },
                );
              }
            }
          }

          if (input.openingHours !== undefined) {
            await PlaceOpeningHours.destroy({ where: { place_id: id }, transaction });
            if (Array.isArray(input.openingHours) && input.openingHours.length > 0) {
              await PlaceOpeningHours.bulkCreate(
                input.openingHours.map((item) => ({
                  id: randomUUID(),
                  place_id: id,
                  weekday: item.weekday,
                  opens_at: item.opensAt.length === 5 ? `${item.opensAt}:00` : item.opensAt,
                  closes_at: item.closesAt.length === 5 ? `${item.closesAt}:00` : item.closesAt,
                  crosses_midnight: Boolean(item.crossesMidnight),
                })),
                { transaction },
              );
            }
          }

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ADMIN_PLACE_UPDATE',
            targetType: 'PLACE',
            targetId: id,
            requestId,
            metadata: { placeId: id, title: input.title },
          });

          const updated = await repository.getAdminPlaceById(id, transaction);
          return { data: updated };
        });
      }),

    deleteAdminPlace: (actor, id, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const {
          Places,
          Events,
          Services,
          AudioGuides,
          ContentItems,
          ContentRevisions,
          ContentTranslations,
          PlaceOpeningHours,
          PlaceClosures,
        } = database.models;

        const place = await Places.findByPk(id);
        if (!place) throw new AppError(404, 'PLACE_NOT_FOUND', 'Không tìm thấy địa điểm.');

        const eventsCount = await Events.count({ where: { place_id: id } });
        if (eventsCount > 0) {
          throw new AppError(
            409,
            'PLACE_HAS_EVENTS',
            `Không thể xóa địa điểm này vì có ${eventsCount} sự kiện liên kết. Vui lòng chuyển hoặc xóa các sự kiện trước.`,
          );
        }

        const servicesCount = Services ? await Services.count({ where: { place_id: id } }) : 0;
        if (servicesCount > 0) {
          throw new AppError(
            409,
            'PLACE_HAS_SERVICES',
            `Không thể xóa địa điểm vì có ${servicesCount} dịch vụ liên kết.`,
          );
        }

        const audioCount = AudioGuides ? await AudioGuides.count({ where: { place_id: id } }) : 0;
        if (audioCount > 0) {
          throw new AppError(
            409,
            'PLACE_HAS_AUDIO',
            `Không thể xóa địa điểm vì có ${audioCount} bài thuyết minh âm thanh liên kết.`,
          );
        }

        return database.transaction(async (transaction) => {
          await PlaceOpeningHours.destroy({ where: { place_id: id }, transaction });
          await PlaceClosures.destroy({ where: { place_id: id }, transaction });
          await Places.destroy({ where: { id }, transaction });

          const contentId = place.content_id;
          if (contentId) {
            const revs = await ContentRevisions.findAll({
              where: { content_id: contentId },
              transaction,
            });
            const revIds = revs.map((r) => r.id);
            if (revIds.length > 0) {
              await ContentTranslations.destroy({
                where: { revision_id: revIds },
                transaction,
              });
              await ContentRevisions.destroy({ where: { content_id: contentId }, transaction });
            }
            await ContentItems.destroy({ where: { id: contentId }, transaction });
          }

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ADMIN_PLACE_DELETE',
            targetType: 'PLACE',
            targetId: id,
            requestId,
          });

          return { data: { id, success: true, message: 'Đã xóa địa điểm thành công.' } };
        });
      }),

    listAdminEvents: (actor, query) =>
      safe(async () => {
        requireAdmin(actor);
        const { rows, total } = await repository.listAdminEvents(query);
        return {
          data: rows,
          meta: paginationMeta(query, total),
        };
      }),

    getAdminEvent: (actor, id) =>
      safe(async () => {
        requireAdmin(actor);
        const event = await repository.getAdminEventById(id);
        if (!event) throw new AppError(404, 'EVENT_NOT_FOUND', 'Không tìm thấy sự kiện.');
        return { data: event };
      }),

    createAdminEvent: (actor, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        const { Places, Events, ContentItems, ContentRevisions, ContentTranslations } =
          database.models;

        const place = await Places.findByPk(input.placeId);
        if (!place) throw new AppError(422, 'PLACE_NOT_FOUND', 'Địa điểm tổ chức không tồn tại.');

        return database.transaction(async (transaction) => {
          const contentId = randomUUID();
          const revisionId = randomUUID();
          const eventId = randomUUID();

          await ContentItems.create(
            {
              id: contentId,
              kind: 'EVENT',
              visibility: 'PUBLIC',
              published_revision_id: revisionId,
              created_by: actor.user.id,
              created_at: now,
              updated_at: now,
            },
            { transaction },
          );

          const payload = {
            placeId: input.placeId,
            startsAt: input.startsAt,
            endsAt: input.endsAt,
            eventStatus: input.eventStatus || 'SCHEDULED',
            bannerUrl: input.bannerUrl || null,
            imageUrl: input.imageUrl || input.bannerUrl || null,
          };

          await ContentRevisions.create(
            {
              id: revisionId,
              content_id: contentId,
              revision_no: 1,
              status: 'PUBLISHED',
              source_reference: input.sourceReference || 'https://baogialai.com.vn/su-kien',
              payload,
              submitted_by: actor.user.id,
              reviewed_by: actor.user.id,
              reviewed_at: now,
              created_at: now,
            },
            { transaction },
          );

          await ContentTranslations.create(
            {
              revision_id: revisionId,
              language_code: 'vi',
              title: input.title,
              body: input.description,
            },
            { transaction },
          );

          await Events.create(
            {
              id: eventId,
              content_id: contentId,
              place_id: input.placeId,
              starts_at: new Date(input.startsAt),
              ends_at: new Date(input.endsAt),
              event_status: input.eventStatus || 'SCHEDULED',
            },
            { transaction },
          );

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ADMIN_EVENT_CREATE',
            targetType: 'EVENT',
            targetId: eventId,
            requestId,
            metadata: {
              title: input.title,
              placeId: input.placeId,
              eventStatus: input.eventStatus,
            },
          });

          const created = await repository.getAdminEventById(eventId, transaction);
          return { data: created };
        });
      }),

    updateAdminEvent: (actor, id, input, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const now = resolveNow(clock);
        const { Places, Events, ContentItems, ContentRevisions, ContentTranslations } =
          database.models;

        return database.transaction(async (transaction) => {
          const event = await Events.findByPk(id, { transaction });
          if (!event) throw new AppError(404, 'EVENT_NOT_FOUND', 'Không tìm thấy sự kiện.');

          if (input.placeId) {
            const place = await Places.findByPk(input.placeId, { transaction });
            if (!place)
              throw new AppError(422, 'PLACE_NOT_FOUND', 'Địa điểm tổ chức không tồn tại.');
            event.place_id = input.placeId;
          }
          if (input.startsAt) event.starts_at = new Date(input.startsAt);
          if (input.endsAt) event.ends_at = new Date(input.endsAt);
          if (input.eventStatus) event.event_status = input.eventStatus;
          await event.save({ transaction });

          const contentItem = await ContentItems.findByPk(event.content_id, { transaction });
          if (contentItem) {
            await contentItem.update({ updated_at: now }, { transaction });

            const rev = contentItem.published_revision_id
              ? await ContentRevisions.findByPk(contentItem.published_revision_id, {
                  transaction,
                })
              : await ContentRevisions.findOne({
                  where: { content_id: contentItem.id },
                  order: [['revision_no', 'DESC']],
                  transaction,
                });

            if (rev) {
              const oldPayload = parsePayload(rev.payload);
              const newPayload = {
                ...oldPayload,
                placeId: event.place_id,
                startsAt: serializeUtc(event.starts_at),
                endsAt: serializeUtc(event.ends_at),
                eventStatus: event.event_status,
                bannerUrl:
                  input.bannerUrl !== undefined
                    ? input.bannerUrl || null
                    : oldPayload.bannerUrl,
                imageUrl:
                  input.imageUrl !== undefined
                    ? input.imageUrl || null
                    : input.bannerUrl !== undefined
                      ? input.bannerUrl || null
                      : oldPayload.imageUrl,
              };

              await rev.update(
                {
                  payload: newPayload,
                  ...(input.sourceReference ? { source_reference: input.sourceReference } : {}),
                },
                { transaction },
              );

              const trans = await ContentTranslations.findOne({
                where: { revision_id: rev.id, language_code: 'vi' },
                transaction,
              });
              if (trans) {
                await trans.update(
                  {
                    ...(input.title ? { title: input.title } : {}),
                    ...(input.description ? { body: input.description } : {}),
                  },
                  { transaction },
                );
              }
            }
          }

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ADMIN_EVENT_UPDATE',
            targetType: 'EVENT',
            targetId: id,
            requestId,
            metadata: { eventId: id, title: input.title },
          });

          const updated = await repository.getAdminEventById(id, transaction);
          return { data: updated };
        });
      }),

    deleteAdminEvent: (actor, id, requestId) =>
      safe(async () => {
        requireAdmin(actor);
        const { Events, ContentItems, ContentRevisions, ContentTranslations, ItineraryStops } =
          database.models;

        const event = await Events.findByPk(id);
        if (!event) throw new AppError(404, 'EVENT_NOT_FOUND', 'Không tìm thấy sự kiện.');

        return database.transaction(async (transaction) => {
          if (ItineraryStops) {
            await ItineraryStops.update(
              { event_id: null },
              { where: { event_id: id }, transaction },
            );
          }

          await Events.destroy({ where: { id }, transaction });

          const contentId = event.content_id;
          if (contentId) {
            const revs = await ContentRevisions.findAll({
              where: { content_id: contentId },
              transaction,
            });
            const revIds = revs.map((r) => r.id);
            if (revIds.length > 0) {
              await ContentTranslations.destroy({
                where: { revision_id: revIds },
                transaction,
              });
              await ContentRevisions.destroy({ where: { content_id: contentId }, transaction });
            }
            await ContentItems.destroy({ where: { id: contentId }, transaction });
          }

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ADMIN_EVENT_DELETE',
            targetType: 'EVENT',
            targetId: id,
            requestId,
          });

          return { data: { id, success: true, message: 'Đã xóa sự kiện thành công.' } };
        });
      }),
  };
}
