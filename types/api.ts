export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
}

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface TagRequest {
  label: string;
  color: string;
}

export type ClaimStatus =
  | "UNKNOWN"
  | "SUBMITTED"
  | "APPROVED"
  | "PAYMENT_FAILED"
  | "PAID"
  | "FINISHED"
  | "REJECTED"
  | "WITHDRAW";

export type Currency = "CHF" | "USD" | "EUR" | "CNY" | "GBP";

export interface PayoutInfo {
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  swift?: string;
  routingNumber?: string;
  bankAddress?: string;
}

export interface Photo {
  id: string;
  bucket?: string;
  key: string;
  uploadedAt?: string;
}

export interface Claim {
  id: string;
  title: string;
  description?: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  amount?: number;
  currency?: Currency;
  recipient?: string;
  expenseAt?: string;
  payout?: PayoutInfo | null;
  photos?: Photo[];
  tags?: Tag[];
}

export interface AuditEvent {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  occurredAt: string;
  data?: Record<string, unknown> | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
