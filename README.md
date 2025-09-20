# ACSSZ EzClaim Admin

## Overview
This Next.js dashboard is the operational cockpit for the ACSSZ EzClaim reimbursement system. Administrators review submissions, manage taxonomy, and monitor audit activity to keep the student association's finances accurate without manual spreadsheets.

## Highlights
- Secure login with JWT session cookies and middleware-protected routes
- Claims overview with filtering, sorting, and status transitions (including payment failure handling)
- Tag lifecycle management and audit event explorer powered by presigned API calls
- Responsive layout with mobile-friendly navigation for on-the-go approvals

## Getting Started
```bash
pnpm install
pnpm dev
```
Set `API_BASE_URL` (or `NEXT_PUBLIC_API_BASE_URL`) if the backend does not run on `http://localhost:8080`.

## License
Licensed under the Do What The Fuck You Want To Public License (WTFPL). See [`LICENCE`](LICENCE).
