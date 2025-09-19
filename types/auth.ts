export interface ClientSession {
  subject: string | null;
  scopes: string[];
  expiresAt: string | null;
}
