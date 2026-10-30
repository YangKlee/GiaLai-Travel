export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}
export interface LoginInput {
  email: string;
  password: string;
}
export interface RegistrationInput extends LoginInput {
  displayName: string;
}
export interface ForgotPasswordInput {
  email: string;
}
export interface ForgotPasswordResponse {
  data: { accepted: true; message: string };
}
export interface ResetPasswordInput {
  token: string;
  password: string;
}
export interface ResetPasswordResponse {
  data: { message: string };
}
export interface SessionResponse {
  data: { accessToken: string; tokenType: 'Bearer'; expiresIn: number; user: AuthUser };
}

export type PreferenceCategoryCode = 'NATURE' | 'CULTURE' | 'FOOD' | 'STAY' | 'ADVENTURE' | 'OTHER';
export type TravelPace = 'RELAXED' | 'BALANCED' | 'INTENSIVE';
export type TravelGroup = 'SOLO' | 'COUPLE' | 'FAMILY' | 'FRIENDS';
export type ConsentPurpose = 'PERSONALIZATION' | 'ADVERTISING';
export type PrivacyRequestType = 'EXPORT' | 'DELETE';
export type PrivacyRequestStatus = 'NEW' | 'VERIFIED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';

export interface UserProfile extends AuthUser {
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  categories: PreferenceCategoryCode[];
  pace: TravelPace;
  travelGroup: TravelGroup;
  dietaryNotes: string | null;
}

export interface PreferenceCatalogOption<T extends string> {
  code: T;
  name: string;
}

export interface PreferenceCatalog {
  categories: PreferenceCatalogOption<PreferenceCategoryCode>[];
  paces: PreferenceCatalogOption<TravelPace>[];
  travelGroups: PreferenceCatalogOption<TravelGroup>[];
}

export interface ConsentDecision {
  id: string;
  purpose: ConsentPurpose;
  decisionNo: number;
  granted: boolean;
  policyVersion: string;
  decidedAt: string;
}

export interface ConsentCurrentItem {
  purpose: ConsentPurpose;
  title: string;
  description: string;
  policyVersion: string;
  decisionNo: number;
  granted: boolean;
  decidedAt: string | null;
}

export interface ConsentState {
  current: ConsentCurrentItem[];
  history: ConsentDecision[];
}

export interface PrivacyRequestItem {
  id: string;
  requestType: PrivacyRequestType;
  status: PrivacyRequestStatus;
  verifiedAt: string | null;
  completedAt: string | null;
  slaDueAt: string | null;
  resultNote: string | null;
  downloadPath: string | null;
  createdAt: string;
}

export interface PrivacyRetentionSummary {
  activeBookingsCount: number;
  historicalBookingsCount: number;
  slaDays: number;
  policyNote: string;
}

export interface PrivacyRequestListState {
  requests: PrivacyRequestItem[];
  retentionSummary: PrivacyRetentionSummary;
}

export interface PrivacyExportPackage {
  requestId: string;
  exportedAt: string;
  expiresAt: string;
  subject: {
    id: string;
    email: string;
    displayName: string;
    phone: string | null;
    roles: string[];
    preferences: UserPreferences;
    createdAt: string;
  };
  consents: ConsentDecision[];
  itineraries: Array<{ id: string; name: string; createdAt: string }>;
  bookings: Array<{ id: string; status: string; totalVnd: string; createdAt: string }>;
  issueReports: Array<{ id: string; category: string; status: string; createdAt: string }>;
  privacyRequests: PrivacyRequestItem[];
}

export interface AccountLoaderData {
  profile: UserProfile;
  preferences: { preferences: UserPreferences; catalog: PreferenceCatalog };
  consents: ConsentState;
  privacy: PrivacyRequestListState;
}
