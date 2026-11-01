import { initializeModel } from '../model-runtime.js';
import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _AdCampaigns from  "./ad_campaigns.js";
import _AdImpressions from  "./ad_impressions.js";
import _AggregateMetrics from  "./aggregate_metrics.js";
import _AiRequestSources from  "./ai_request_sources.js";
import _AiRequests from  "./ai_requests.js";
import _AudioGuides from  "./audio_guides.js";
import _AuditLogs from  "./audit_logs.js";
import _AuthRefreshTokens from  "./auth_refresh_tokens.js";
import _AuthSessions from  "./auth_sessions.js";
import _BehaviorEvents from  "./behavior_events.js";
import _BookingStatusHistory from  "./booking_status_history.js";
import _Bookings from  "./bookings.js";
import _ChatConversations from  "./chat_conversations.js";
import _ChatMessages from  "./chat_messages.js";
import _Commissions from  "./commissions.js";
import _ConditionObservations from  "./condition_observations.js";
import _ConfigVersions from  "./config_versions.js";
import _Consents from  "./consents.js";
import _ContentItems from  "./content_items.js";
import _ContentMedia from  "./content_media.js";
import _ContentRevisions from  "./content_revisions.js";
import _ContentTranslations from  "./content_translations.js";
import _Entitlements from  "./entitlements.js";
import _Events from  "./events.js";
import _ExternalSources from  "./external_sources.js";
import _ExternalSyncRuns from  "./external_sync_runs.js";
import _IssueReports from  "./issue_reports.js";
import _Itineraries from  "./itineraries.js";
import _ItineraryDays from  "./itinerary_days.js";
import _ItineraryLegs from  "./itinerary_legs.js";
import _ItineraryRevisions from  "./itinerary_revisions.js";
import _ItineraryStops from  "./itinerary_stops.js";
import _MediaAssets from  "./media_assets.js";
import _Notifications from  "./notifications.js";
import _OfflineDownloads from  "./offline_downloads.js";
import _OfflinePackageAssets from  "./offline_package_assets.js";
import _OfflinePackages from  "./offline_packages.js";
import _PartnerMembers from  "./partner_members.js";
import _Partners from  "./partners.js";
import _PasswordResetTokens from  "./password_reset_tokens.js";
import _PaymentAttempts from  "./payment_attempts.js";
import _PlaceClosures from  "./place_closures.js";
import _PlaceOpeningHours from  "./place_opening_hours.js";
import _Places from  "./places.js";
import _PlanVersions from  "./plan_versions.js";
import _Plans from  "./plans.js";
import _PrivacyRequests from  "./privacy_requests.js";
import _PurchaseOrders from  "./purchase_orders.js";
import _Referrals from  "./referrals.js";
import _Refunds from  "./refunds.js";
import _Regions from  "./regions.js";
import _RewardGrants from  "./reward_grants.js";
import _RewardPrograms from  "./reward_programs.js";
import _Roles from  "./roles.js";
import _ServiceSlots from  "./service_slots.js";
import _Services from  "./services.js";
import _UserRegionScopes from  "./user_region_scopes.js";
import _UserRoles from  "./user_roles.js";
import _Users from  "./users.js";
import _Wards from  "./wards.js";

export default function initModels(sequelize) {
  const AdCampaigns = initializeModel(_AdCampaigns, sequelize, DataTypes);
  const AdImpressions = initializeModel(_AdImpressions, sequelize, DataTypes);
  const AggregateMetrics = initializeModel(_AggregateMetrics, sequelize, DataTypes);
  const AiRequestSources = initializeModel(_AiRequestSources, sequelize, DataTypes);
  const AiRequests = initializeModel(_AiRequests, sequelize, DataTypes);
  const AudioGuides = initializeModel(_AudioGuides, sequelize, DataTypes);
  const AuditLogs = initializeModel(_AuditLogs, sequelize, DataTypes);
  const AuthRefreshTokens = initializeModel(_AuthRefreshTokens, sequelize, DataTypes);
  const AuthSessions = initializeModel(_AuthSessions, sequelize, DataTypes);
  const BehaviorEvents = initializeModel(_BehaviorEvents, sequelize, DataTypes);
  const BookingStatusHistory = initializeModel(_BookingStatusHistory, sequelize, DataTypes);
  const Bookings = initializeModel(_Bookings, sequelize, DataTypes);
  const ChatConversations = initializeModel(_ChatConversations, sequelize, DataTypes);
  const ChatMessages = initializeModel(_ChatMessages, sequelize, DataTypes);
  const Commissions = initializeModel(_Commissions, sequelize, DataTypes);
  const ConditionObservations = initializeModel(_ConditionObservations, sequelize, DataTypes);
  const ConfigVersions = initializeModel(_ConfigVersions, sequelize, DataTypes);
  const Consents = initializeModel(_Consents, sequelize, DataTypes);
  const ContentItems = initializeModel(_ContentItems, sequelize, DataTypes);
  const ContentMedia = initializeModel(_ContentMedia, sequelize, DataTypes);
  const ContentRevisions = initializeModel(_ContentRevisions, sequelize, DataTypes);
  const ContentTranslations = initializeModel(_ContentTranslations, sequelize, DataTypes);
  const Entitlements = initializeModel(_Entitlements, sequelize, DataTypes);
  const Events = initializeModel(_Events, sequelize, DataTypes);
  const ExternalSources = initializeModel(_ExternalSources, sequelize, DataTypes);
  const ExternalSyncRuns = initializeModel(_ExternalSyncRuns, sequelize, DataTypes);
  const IssueReports = initializeModel(_IssueReports, sequelize, DataTypes);
  const Itineraries = initializeModel(_Itineraries, sequelize, DataTypes);
  const ItineraryDays = initializeModel(_ItineraryDays, sequelize, DataTypes);
  const ItineraryLegs = initializeModel(_ItineraryLegs, sequelize, DataTypes);
  const ItineraryRevisions = initializeModel(_ItineraryRevisions, sequelize, DataTypes);
  const ItineraryStops = initializeModel(_ItineraryStops, sequelize, DataTypes);
  const MediaAssets = initializeModel(_MediaAssets, sequelize, DataTypes);
  const Notifications = initializeModel(_Notifications, sequelize, DataTypes);
  const OfflineDownloads = initializeModel(_OfflineDownloads, sequelize, DataTypes);
  const OfflinePackageAssets = initializeModel(_OfflinePackageAssets, sequelize, DataTypes);
  const OfflinePackages = initializeModel(_OfflinePackages, sequelize, DataTypes);
  const PartnerMembers = initializeModel(_PartnerMembers, sequelize, DataTypes);
  const Partners = initializeModel(_Partners, sequelize, DataTypes);
  const PasswordResetTokens = initializeModel(_PasswordResetTokens, sequelize, DataTypes);
  const PaymentAttempts = initializeModel(_PaymentAttempts, sequelize, DataTypes);
  const PlaceClosures = initializeModel(_PlaceClosures, sequelize, DataTypes);
  const PlaceOpeningHours = initializeModel(_PlaceOpeningHours, sequelize, DataTypes);
  const Places = initializeModel(_Places, sequelize, DataTypes);
  const PlanVersions = initializeModel(_PlanVersions, sequelize, DataTypes);
  const Plans = initializeModel(_Plans, sequelize, DataTypes);
  const PrivacyRequests = initializeModel(_PrivacyRequests, sequelize, DataTypes);
  const PurchaseOrders = initializeModel(_PurchaseOrders, sequelize, DataTypes);
  const Referrals = initializeModel(_Referrals, sequelize, DataTypes);
  const Refunds = initializeModel(_Refunds, sequelize, DataTypes);
  const Regions = initializeModel(_Regions, sequelize, DataTypes);
  const RewardGrants = initializeModel(_RewardGrants, sequelize, DataTypes);
  const RewardPrograms = initializeModel(_RewardPrograms, sequelize, DataTypes);
  const Roles = initializeModel(_Roles, sequelize, DataTypes);
  const ServiceSlots = initializeModel(_ServiceSlots, sequelize, DataTypes);
  const Services = initializeModel(_Services, sequelize, DataTypes);
  const UserRegionScopes = initializeModel(_UserRegionScopes, sequelize, DataTypes);
  const UserRoles = initializeModel(_UserRoles, sequelize, DataTypes);
  const Users = initializeModel(_Users, sequelize, DataTypes);
  const Wards = initializeModel(_Wards, sequelize, DataTypes);

  AiRequests.belongsToMany(ContentRevisions, { as: 'content_revision_id_content_revisions', through: AiRequestSources, foreignKey: "ai_request_id", otherKey: "content_revision_id" });
  ContentRevisions.belongsToMany(AiRequests, { as: 'ai_request_id_ai_requests', through: AiRequestSources, foreignKey: "content_revision_id", otherKey: "ai_request_id" });
  ContentRevisions.belongsToMany(MediaAssets, { as: 'asset_id_media_assets', through: ContentMedia, foreignKey: "revision_id", otherKey: "asset_id" });
  MediaAssets.belongsToMany(ContentRevisions, { as: 'revision_id_content_revisions', through: ContentMedia, foreignKey: "asset_id", otherKey: "revision_id" });
  MediaAssets.belongsToMany(OfflinePackages, { as: 'package_id_offline_packages', through: OfflinePackageAssets, foreignKey: "asset_id", otherKey: "package_id" });
  OfflinePackages.belongsToMany(MediaAssets, { as: 'asset_id_media_assets_offline_package_assets', through: OfflinePackageAssets, foreignKey: "package_id", otherKey: "asset_id" });
  Partners.belongsToMany(Users, { as: 'user_id_users', through: PartnerMembers, foreignKey: "partner_id", otherKey: "user_id" });
  Regions.belongsToMany(Users, { as: 'user_id_users_user_region_scopes', through: UserRegionScopes, foreignKey: "region_id", otherKey: "user_id" });
  Roles.belongsToMany(Users, { as: 'user_id_users_user_roles', through: UserRoles, foreignKey: "role_code", otherKey: "user_id" });
  Users.belongsToMany(Partners, { as: 'partner_id_partners', through: PartnerMembers, foreignKey: "user_id", otherKey: "partner_id" });
  Users.belongsToMany(Regions, { as: 'region_id_regions', through: UserRegionScopes, foreignKey: "user_id", otherKey: "region_id" });
  Users.belongsToMany(Roles, { as: 'role_code_roles', through: UserRoles, foreignKey: "user_id", otherKey: "role_code" });
  AdImpressions.belongsTo(AdCampaigns, { as: "campaign", foreignKey: "campaign_id"});
  AdCampaigns.hasMany(AdImpressions, { as: "ad_impressions", foreignKey: "campaign_id"});
  AiRequestSources.belongsTo(AiRequests, { as: "ai_request", foreignKey: "ai_request_id"});
  AiRequests.hasMany(AiRequestSources, { as: "ai_request_sources", foreignKey: "ai_request_id"});
  ChatMessages.belongsTo(AiRequests, { as: "ai_request", foreignKey: "ai_request_id"});
  AiRequests.hasMany(ChatMessages, { as: "chat_messages", foreignKey: "ai_request_id"});
  ItineraryRevisions.belongsTo(AiRequests, { as: "ai_request", foreignKey: "ai_request_id"});
  AiRequests.hasMany(ItineraryRevisions, { as: "itinerary_revisions", foreignKey: "ai_request_id"});
  AuthRefreshTokens.belongsTo(AuthSessions, { as: "session", foreignKey: "session_id"});
  AuthSessions.hasMany(AuthRefreshTokens, { as: "auth_refresh_tokens", foreignKey: "session_id"});
  BookingStatusHistory.belongsTo(Bookings, { as: "booking", foreignKey: "booking_id"});
  Bookings.hasMany(BookingStatusHistory, { as: "booking_status_histories", foreignKey: "booking_id"});
  Commissions.belongsTo(Bookings, { as: "booking", foreignKey: "booking_id"});
  Bookings.hasOne(Commissions, { as: "commission", foreignKey: "booking_id"});
  PaymentAttempts.belongsTo(Bookings, { as: "booking", foreignKey: "booking_id"});
  Bookings.hasMany(PaymentAttempts, { as: "payment_attempts", foreignKey: "booking_id"});
  Refunds.belongsTo(Bookings, { as: "booking", foreignKey: "booking_id"});
  Bookings.hasMany(Refunds, { as: "refunds", foreignKey: "booking_id"});
  ChatMessages.belongsTo(ChatConversations, { as: "conversation", foreignKey: "conversation_id"});
  ChatConversations.hasMany(ChatMessages, { as: "chat_messages", foreignKey: "conversation_id"});
  AggregateMetrics.belongsTo(ConfigVersions, { as: "config_version", foreignKey: "config_version_id"});
  ConfigVersions.hasMany(AggregateMetrics, { as: "aggregate_metrics", foreignKey: "config_version_id"});
  ConditionObservations.belongsTo(ConfigVersions, { as: "config_version", foreignKey: "config_version_id"});
  ConfigVersions.hasMany(ConditionObservations, { as: "condition_observations", foreignKey: "config_version_id"});
  AdImpressions.belongsTo(Consents, { as: "consent", foreignKey: "consent_id"});
  Consents.hasMany(AdImpressions, { as: "ad_impressions", foreignKey: "consent_id"});
  BehaviorEvents.belongsTo(Consents, { as: "consent", foreignKey: "consent_id"});
  Consents.hasMany(BehaviorEvents, { as: "behavior_events", foreignKey: "consent_id"});
  AdCampaigns.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasMany(AdCampaigns, { as: "ad_campaigns", foreignKey: "content_id"});
  AudioGuides.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasOne(AudioGuides, { as: "audio_guide", foreignKey: "content_id"});
  BehaviorEvents.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasMany(BehaviorEvents, { as: "behavior_events", foreignKey: "content_id"});
  ContentRevisions.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasMany(ContentRevisions, { as: "content_revisions", foreignKey: "content_id"});
  Events.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasOne(Events, { as: "event", foreignKey: "content_id"});
  IssueReports.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasMany(IssueReports, { as: "issue_reports", foreignKey: "content_id"});
  Partners.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasOne(Partners, { as: "partner", foreignKey: "content_id"});
  Places.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasOne(Places, { as: "place", foreignKey: "content_id"});
  Services.belongsTo(ContentItems, { as: "content", foreignKey: "content_id"});
  ContentItems.hasOne(Services, { as: "service", foreignKey: "content_id"});
  AiRequestSources.belongsTo(ContentRevisions, { as: "content_revision", foreignKey: "content_revision_id"});
  ContentRevisions.hasMany(AiRequestSources, { as: "ai_request_sources", foreignKey: "content_revision_id"});
  ContentItems.belongsTo(ContentRevisions, { as: "published_revision", foreignKey: "published_revision_id"});
  ContentRevisions.hasMany(ContentItems, { as: "published_revision_content_items", foreignKey: "published_revision_id"});
  ContentMedia.belongsTo(ContentRevisions, { as: "revision", foreignKey: "revision_id"});
  ContentRevisions.hasMany(ContentMedia, { as: "content_media", foreignKey: "revision_id"});
  ContentTranslations.belongsTo(ContentRevisions, { as: "revision", foreignKey: "revision_id"});
  ContentRevisions.hasMany(ContentTranslations, { as: "content_translations", foreignKey: "revision_id"});
  ItineraryStops.belongsTo(ContentRevisions, { as: "content_revision", foreignKey: "content_revision_id"});
  ContentRevisions.hasMany(ItineraryStops, { as: "itinerary_stops", foreignKey: "content_revision_id"});
  OfflineDownloads.belongsTo(Entitlements, { as: "entitlement", foreignKey: "entitlement_id"});
  Entitlements.hasMany(OfflineDownloads, { as: "offline_downloads", foreignKey: "entitlement_id"});
  ItineraryStops.belongsTo(Events, { as: "event", foreignKey: "event_id"});
  Events.hasMany(ItineraryStops, { as: "itinerary_stops", foreignKey: "event_id"});
  ConditionObservations.belongsTo(ExternalSources, { as: "source", foreignKey: "source_id"});
  ExternalSources.hasMany(ConditionObservations, { as: "condition_observations", foreignKey: "source_id"});
  Events.belongsTo(ExternalSources, { as: "external_source", foreignKey: "external_source_id"});
  ExternalSources.hasMany(Events, { as: "events", foreignKey: "external_source_id"});
  ExternalSyncRuns.belongsTo(ExternalSources, { as: "source", foreignKey: "source_id"});
  ExternalSources.hasMany(ExternalSyncRuns, { as: "external_sync_runs", foreignKey: "source_id"});
  IssueReports.belongsTo(IssueReports, { as: "duplicate_of_issue_report", foreignKey: "duplicate_of"});
  IssueReports.hasMany(IssueReports, { as: "issue_reports", foreignKey: "duplicate_of"});
  RewardGrants.belongsTo(IssueReports, { as: "issue_report", foreignKey: "issue_report_id"});
  IssueReports.hasMany(RewardGrants, { as: "reward_grants", foreignKey: "issue_report_id"});
  AiRequests.belongsTo(Itineraries, { as: "itinerary", foreignKey: "itinerary_id"});
  Itineraries.hasMany(AiRequests, { as: "ai_requests", foreignKey: "itinerary_id"});
  ItineraryRevisions.belongsTo(Itineraries, { as: "itinerary_itinerary", foreignKey: "itinerary_id"});
  Itineraries.hasMany(ItineraryRevisions, { as: "itinerary_revisions", foreignKey: "itinerary_id"});
  ItineraryStops.belongsTo(ItineraryDays, { as: "day", foreignKey: "day_id"});
  ItineraryDays.hasMany(ItineraryStops, { as: "itinerary_stops", foreignKey: "day_id"});
  Itineraries.belongsTo(ItineraryRevisions, { as: "id_itinerary_revision", foreignKey: "id"});
  ItineraryRevisions.hasOne(Itineraries, { as: "itinerary", foreignKey: "id"});
  Itineraries.belongsTo(ItineraryRevisions, { as: "current_revision", foreignKey: "current_revision_id"});
  ItineraryRevisions.hasMany(Itineraries, { as: "current_revision_itineraries", foreignKey: "current_revision_id"});
  ItineraryDays.belongsTo(ItineraryRevisions, { as: "revision", foreignKey: "revision_id"});
  ItineraryRevisions.hasMany(ItineraryDays, { as: "itinerary_days", foreignKey: "revision_id"});
  OfflineDownloads.belongsTo(ItineraryRevisions, { as: "itinerary_revision", foreignKey: "itinerary_revision_id"});
  ItineraryRevisions.hasMany(OfflineDownloads, { as: "offline_downloads", foreignKey: "itinerary_revision_id"});
  ItineraryLegs.belongsTo(ItineraryStops, { as: "day", foreignKey: "day_id"});
  ItineraryStops.hasMany(ItineraryLegs, { as: "itinerary_legs", foreignKey: "day_id"});
  ItineraryLegs.belongsTo(ItineraryStops, { as: "to_stop", foreignKey: "to_stop_id"});
  ItineraryStops.hasMany(ItineraryLegs, { as: "to_stop_itinerary_legs", foreignKey: "to_stop_id"});
  ItineraryLegs.belongsTo(ItineraryStops, { as: "from_stop", foreignKey: "from_stop_id"});
  ItineraryStops.hasMany(ItineraryLegs, { as: "from_stop_itinerary_legs", foreignKey: "from_stop_id"});
  ContentMedia.belongsTo(MediaAssets, { as: "asset", foreignKey: "asset_id"});
  MediaAssets.hasMany(ContentMedia, { as: "content_media", foreignKey: "asset_id"});
  ContentTranslations.belongsTo(MediaAssets, { as: "audio_asset", foreignKey: "audio_asset_id"});
  MediaAssets.hasMany(ContentTranslations, { as: "content_translations", foreignKey: "audio_asset_id"});
  OfflinePackageAssets.belongsTo(MediaAssets, { as: "asset", foreignKey: "asset_id"});
  MediaAssets.hasMany(OfflinePackageAssets, { as: "offline_package_assets", foreignKey: "asset_id"});
  OfflineDownloads.belongsTo(OfflinePackages, { as: "package", foreignKey: "package_id"});
  OfflinePackages.hasMany(OfflineDownloads, { as: "offline_downloads", foreignKey: "package_id"});
  OfflinePackageAssets.belongsTo(OfflinePackages, { as: "package", foreignKey: "package_id"});
  OfflinePackages.hasMany(OfflinePackageAssets, { as: "offline_package_assets", foreignKey: "package_id"});
  AdCampaigns.belongsTo(Partners, { as: "partner", foreignKey: "partner_id"});
  Partners.hasMany(AdCampaigns, { as: "ad_campaigns", foreignKey: "partner_id"});
  Entitlements.belongsTo(Partners, { as: "partner", foreignKey: "partner_id"});
  Partners.hasMany(Entitlements, { as: "entitlements", foreignKey: "partner_id"});
  PartnerMembers.belongsTo(Partners, { as: "partner", foreignKey: "partner_id"});
  Partners.hasMany(PartnerMembers, { as: "partner_members", foreignKey: "partner_id"});
  PurchaseOrders.belongsTo(Partners, { as: "partner", foreignKey: "partner_id"});
  Partners.hasMany(PurchaseOrders, { as: "purchase_orders", foreignKey: "partner_id"});
  Services.belongsTo(Partners, { as: "partner", foreignKey: "partner_id"});
  Partners.hasMany(Services, { as: "services", foreignKey: "partner_id"});
  Refunds.belongsTo(PaymentAttempts, { as: "payment_attempt", foreignKey: "payment_attempt_id"});
  PaymentAttempts.hasMany(Refunds, { as: "refunds", foreignKey: "payment_attempt_id"});
  AudioGuides.belongsTo(Places, { as: "place", foreignKey: "place_id"});
  Places.hasMany(AudioGuides, { as: "audio_guides", foreignKey: "place_id"});
  ConditionObservations.belongsTo(Places, { as: "place", foreignKey: "place_id"});
  Places.hasMany(ConditionObservations, { as: "condition_observations", foreignKey: "place_id"});
  Events.belongsTo(Places, { as: "place", foreignKey: "place_id"});
  Places.hasMany(Events, { as: "events", foreignKey: "place_id"});
  ItineraryStops.belongsTo(Places, { as: "place", foreignKey: "place_id"});
  Places.hasMany(ItineraryStops, { as: "itinerary_stops", foreignKey: "place_id"});
  PlaceClosures.belongsTo(Places, { as: "place", foreignKey: "place_id"});
  Places.hasMany(PlaceClosures, { as: "place_closures", foreignKey: "place_id"});
  PlaceOpeningHours.belongsTo(Places, { as: "place", foreignKey: "place_id"});
  Places.hasMany(PlaceOpeningHours, { as: "place_opening_hours", foreignKey: "place_id"});
  Services.belongsTo(Places, { as: "place", foreignKey: "place_id"});
  Places.hasMany(Services, { as: "services", foreignKey: "place_id"});
  Entitlements.belongsTo(PlanVersions, { as: "plan_version", foreignKey: "plan_version_id"});
  PlanVersions.hasMany(Entitlements, { as: "entitlements", foreignKey: "plan_version_id"});
  PurchaseOrders.belongsTo(PlanVersions, { as: "plan_version", foreignKey: "plan_version_id"});
  PlanVersions.hasMany(PurchaseOrders, { as: "purchase_orders", foreignKey: "plan_version_id"});
  PlanVersions.belongsTo(Plans, { as: "plan", foreignKey: "plan_id"});
  Plans.hasMany(PlanVersions, { as: "plan_versions", foreignKey: "plan_id"});
  Entitlements.belongsTo(PurchaseOrders, { as: "purchase_order", foreignKey: "purchase_order_id"});
  PurchaseOrders.hasOne(Entitlements, { as: "entitlement", foreignKey: "purchase_order_id"});
  PaymentAttempts.belongsTo(PurchaseOrders, { as: "purchase_order", foreignKey: "purchase_order_id"});
  PurchaseOrders.hasMany(PaymentAttempts, { as: "payment_attempts", foreignKey: "purchase_order_id"});
  RewardGrants.belongsTo(Referrals, { as: "referral", foreignKey: "referral_id"});
  Referrals.hasMany(RewardGrants, { as: "reward_grants", foreignKey: "referral_id"});
  AggregateMetrics.belongsTo(Regions, { as: "region", foreignKey: "region_id"});
  Regions.hasMany(AggregateMetrics, { as: "aggregate_metrics", foreignKey: "region_id"});
  BehaviorEvents.belongsTo(Regions, { as: "region", foreignKey: "region_id"});
  Regions.hasMany(BehaviorEvents, { as: "behavior_events", foreignKey: "region_id"});
  OfflinePackages.belongsTo(Regions, { as: "region", foreignKey: "region_id"});
  Regions.hasMany(OfflinePackages, { as: "offline_packages", foreignKey: "region_id"});
  Places.belongsTo(Regions, { as: "region", foreignKey: "region_id"});
  Regions.hasMany(Places, { as: "places", foreignKey: "region_id"});
  Places.belongsTo(Wards, { as: "ward", foreignKey: "ward_id"});
  Wards.hasMany(Places, { as: "places", foreignKey: "ward_id"});
  Wards.belongsTo(Regions, { as: "region", foreignKey: "region_id"});
  Regions.hasMany(Wards, { as: "wards", foreignKey: "region_id"});
  Regions.belongsTo(Regions, { as: "parent", foreignKey: "parent_id"});
  Regions.hasMany(Regions, { as: "regions", foreignKey: "parent_id"});
  UserRegionScopes.belongsTo(Regions, { as: "region", foreignKey: "region_id"});
  Regions.hasMany(UserRegionScopes, { as: "user_region_scopes", foreignKey: "region_id"});
  Entitlements.belongsTo(RewardGrants, { as: "reward_grant", foreignKey: "reward_grant_id"});
  RewardGrants.hasOne(Entitlements, { as: "entitlement", foreignKey: "reward_grant_id"});
  Referrals.belongsTo(RewardPrograms, { as: "program", foreignKey: "program_id"});
  RewardPrograms.hasMany(Referrals, { as: "referrals", foreignKey: "program_id"});
  RewardGrants.belongsTo(RewardPrograms, { as: "program", foreignKey: "program_id"});
  RewardPrograms.hasMany(RewardGrants, { as: "reward_grants", foreignKey: "program_id"});
  UserRoles.belongsTo(Roles, { as: "role_code_role", foreignKey: "role_code"});
  Roles.hasMany(UserRoles, { as: "user_roles", foreignKey: "role_code"});
  Bookings.belongsTo(ServiceSlots, { as: "service", foreignKey: "service_id"});
  ServiceSlots.hasMany(Bookings, { as: "bookings", foreignKey: "service_id"});
  Bookings.belongsTo(ServiceSlots, { as: "slot", foreignKey: "slot_id"});
  ServiceSlots.hasMany(Bookings, { as: "slot_bookings", foreignKey: "slot_id"});
  ServiceSlots.belongsTo(Services, { as: "service", foreignKey: "service_id"});
  Services.hasMany(ServiceSlots, { as: "service_slots", foreignKey: "service_id"});
  AdImpressions.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(AdImpressions, { as: "ad_impressions", foreignKey: "user_id"});
  AiRequests.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(AiRequests, { as: "ai_requests", foreignKey: "user_id"});
  AuditLogs.belongsTo(Users, { as: "actor", foreignKey: "actor_id"});
  Users.hasMany(AuditLogs, { as: "audit_logs", foreignKey: "actor_id"});
  AuthSessions.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(AuthSessions, { as: "auth_sessions", foreignKey: "user_id"});
  BehaviorEvents.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(BehaviorEvents, { as: "behavior_events", foreignKey: "user_id"});
  BookingStatusHistory.belongsTo(Users, { as: "actor", foreignKey: "actor_id"});
  Users.hasMany(BookingStatusHistory, { as: "booking_status_histories", foreignKey: "actor_id"});
  Bookings.belongsTo(Users, { as: "customer", foreignKey: "customer_id"});
  Users.hasMany(Bookings, { as: "bookings", foreignKey: "customer_id"});
  Bookings.belongsTo(Users, { as: "reviewed_by_user", foreignKey: "reviewed_by"});
  Users.hasMany(Bookings, { as: "reviewed_by_bookings", foreignKey: "reviewed_by"});
  ChatConversations.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(ChatConversations, { as: "chat_conversations", foreignKey: "user_id"});
  ConfigVersions.belongsTo(Users, { as: "approved_by_user", foreignKey: "approved_by"});
  Users.hasMany(ConfigVersions, { as: "config_versions", foreignKey: "approved_by"});
  Consents.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Consents, { as: "consents", foreignKey: "user_id"});
  ContentItems.belongsTo(Users, { as: "created_by_user", foreignKey: "created_by"});
  Users.hasMany(ContentItems, { as: "content_items", foreignKey: "created_by"});
  ContentRevisions.belongsTo(Users, { as: "submitted_by_user", foreignKey: "submitted_by"});
  Users.hasMany(ContentRevisions, { as: "content_revisions", foreignKey: "submitted_by"});
  ContentRevisions.belongsTo(Users, { as: "reviewed_by_user", foreignKey: "reviewed_by"});
  Users.hasMany(ContentRevisions, { as: "reviewed_by_content_revisions", foreignKey: "reviewed_by"});
  Entitlements.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Entitlements, { as: "entitlements", foreignKey: "user_id"});
  IssueReports.belongsTo(Users, { as: "reporter", foreignKey: "reporter_id"});
  Users.hasMany(IssueReports, { as: "issue_reports", foreignKey: "reporter_id"});
  IssueReports.belongsTo(Users, { as: "assignee", foreignKey: "assignee_id"});
  Users.hasMany(IssueReports, { as: "assignee_issue_reports", foreignKey: "assignee_id"});
  Itineraries.belongsTo(Users, { as: "owner", foreignKey: "owner_id"});
  Users.hasMany(Itineraries, { as: "itineraries", foreignKey: "owner_id"});
  ItineraryRevisions.belongsTo(Users, { as: "created_by_user", foreignKey: "created_by"});
  Users.hasMany(ItineraryRevisions, { as: "itinerary_revisions", foreignKey: "created_by"});
  MediaAssets.belongsTo(Users, { as: "uploaded_by_user", foreignKey: "uploaded_by"});
  Users.hasMany(MediaAssets, { as: "media_assets", foreignKey: "uploaded_by"});
  Notifications.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Notifications, { as: "notifications", foreignKey: "user_id"});
  OfflineDownloads.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(OfflineDownloads, { as: "offline_downloads", foreignKey: "user_id"});
  PartnerMembers.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(PartnerMembers, { as: "partner_members", foreignKey: "user_id"});
  PasswordResetTokens.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(PasswordResetTokens, { as: "password_reset_tokens", foreignKey: "user_id"});
  PlaceClosures.belongsTo(Users, { as: "recorded_by_user", foreignKey: "recorded_by"});
  Users.hasMany(PlaceClosures, { as: "place_closures", foreignKey: "recorded_by"});
  PlanVersions.belongsTo(Users, { as: "approved_by_user", foreignKey: "approved_by"});
  Users.hasMany(PlanVersions, { as: "plan_versions", foreignKey: "approved_by"});
  PrivacyRequests.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(PrivacyRequests, { as: "privacy_requests", foreignKey: "user_id"});
  PurchaseOrders.belongsTo(Users, { as: "buyer", foreignKey: "buyer_id"});
  Users.hasMany(PurchaseOrders, { as: "purchase_orders", foreignKey: "buyer_id"});
  Referrals.belongsTo(Users, { as: "referred", foreignKey: "referred_id"});
  Users.hasMany(Referrals, { as: "referrals", foreignKey: "referred_id"});
  Referrals.belongsTo(Users, { as: "referrer", foreignKey: "referrer_id"});
  Users.hasMany(Referrals, { as: "referrer_referrals", foreignKey: "referrer_id"});
  RewardGrants.belongsTo(Users, { as: "beneficiary", foreignKey: "beneficiary_id"});
  Users.hasMany(RewardGrants, { as: "reward_grants", foreignKey: "beneficiary_id"});
  UserRegionScopes.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(UserRegionScopes, { as: "user_region_scopes", foreignKey: "user_id"});
  UserRoles.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(UserRoles, { as: "user_roles", foreignKey: "user_id"});

  return {
    AdCampaigns,
    AdImpressions,
    AggregateMetrics,
    AiRequestSources,
    AiRequests,
    AudioGuides,
    AuditLogs,
    AuthRefreshTokens,
    AuthSessions,
    BehaviorEvents,
    BookingStatusHistory,
    Bookings,
    ChatConversations,
    ChatMessages,
    Commissions,
    ConditionObservations,
    ConfigVersions,
    Consents,
    ContentItems,
    ContentMedia,
    ContentRevisions,
    ContentTranslations,
    Entitlements,
    Events,
    ExternalSources,
    ExternalSyncRuns,
    IssueReports,
    Itineraries,
    ItineraryDays,
    ItineraryLegs,
    ItineraryRevisions,
    ItineraryStops,
    MediaAssets,
    Notifications,
    OfflineDownloads,
    OfflinePackageAssets,
    OfflinePackages,
    PartnerMembers,
    Partners,
    PasswordResetTokens,
    PaymentAttempts,
    PlaceClosures,
    PlaceOpeningHours,
    Places,
    PlanVersions,
    Plans,
    PrivacyRequests,
    PurchaseOrders,
    Referrals,
    Refunds,
    Regions,
    RewardGrants,
    RewardPrograms,
    Roles,
    ServiceSlots,
    Services,
    UserRegionScopes,
    UserRoles,
    Users,
    Wards,
  };
}
