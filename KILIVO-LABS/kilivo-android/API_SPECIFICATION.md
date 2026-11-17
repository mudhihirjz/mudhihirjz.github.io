# KILIVO LABS Mobile API Specification

**Status:** Proposed contract  
**Version:** 1  
**Base path:** `/api/v1`  
**Audience:** Android app and backend implementers

This specification describes the API needed to connect the KILIVO LABS Android
app to company services. It reflects the agreed scope: the app is for company
members only, profile data is read-only, donations use a payment-provider-neutral
checkout, and communication in the first release is announcements and
notifications (not chat).

The current app is an offline UI preview. It uses bundled/sample content to
exercise the member flows; no endpoint below is currently connected to a
production server. Actions that imply server work are labeled as previews and
must not be treated as successful authentication, payment, document download,
or server submission.

## Conventions

- Use HTTPS for all environments outside local development.
- Send and receive JSON as UTF-8 with `Content-Type: application/json`.
- Except for login and token refresh, requests require
  `Authorization: Bearer <access_token>`.
- Use UUID strings for resource IDs and UTC ISO-8601 timestamps.
- List endpoints support `page` (1-based) and `pageSize` (default 20, maximum
  100). Responses include `items` and `pagination`.
- Do not return secrets, password hashes, payment credentials, or another
  member's private data.
- Access is restricted to active company members. Enforce role and ownership
  checks on the server for every request.

### Standard responses

Successful single-resource response:

```json
{
  "data": {
    "id": "uuid",
    "name": "Example"
  }
}
```

Successful list response:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

Error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      { "field": "email", "message": "Enter a valid email address." }
    ],
    "requestId": "request-id"
  }
}
```

Use appropriate HTTP status codes: `400` malformed request, `401`
unauthenticated/expired credentials, `403` insufficient role, `404` not found or
not visible to this member, `409` duplicate/conflicting request, `422`
validation failure, `429` rate limit, and `5xx` server/provider failure. Never
return a success-shaped response when an operation failed.

## 1. Authentication and member profile

### `POST /auth/login`

Authenticate a member using email or phone and password.

Request:

```json
{
  "identifier": "member@example.com",
  "password": "member-supplied-password"
}
```

Response includes `accessToken`, `refreshToken`, `tokenType: "Bearer"`,
`expiresInSeconds`, and the read-only member summary. Return a generic
authentication error for an unknown account or incorrect password.

### `POST /auth/refresh`

Exchange a valid refresh token for a new token pair. Rotate refresh tokens and
invalidate the previous refresh token.

```json
{ "refreshToken": "..." }
```

### `POST /auth/logout`

Revoke the presented refresh token. The app should also clear local tokens.

```json
{ "refreshToken": "..." }
```

### `GET /me`

Return the authenticated member's profile. Profile details are read-only in the
mobile app; do not provide a member-facing `PATCH /me` endpoint.

Suggested fields: `id`, `displayName`, `email`, `phone`, `memberNumber`,
`departmentId`, `departmentName`, `role`, `status`, and `avatarUrl`.
Return only fields permitted for the member's role.

### Admin account provisioning

Company administrators create and deactivate member accounts; public
self-registration is not part of this app.

- `POST /admin/members` — create an account with identifier, display name,
  member number, department, role, and an invitation/credential setup method.
- `GET /admin/members` — list and filter members.
- `GET /admin/members/{id}` — read a member record.
- `PATCH /admin/members/{id}/status` — activate or deactivate an account.

These endpoints require an administrator role and must be excluded from
member-level authorization. Prefer a one-time invitation/password-setup flow
over administrators choosing or sharing permanent passwords.

## 2. Company and workspace

All member-facing endpoints below return only information the authenticated
member is allowed to see.

| Method and path | Purpose |
|---|---|
| `GET /members?q=&departmentId=&page=&pageSize=` | Search the company member directory |
| `GET /members/{id}` | View an authorized member's directory profile |
| `GET /organization` | Read the organization structure |
| `GET /me/department` | Read the signed-in member's department/division |
| `GET /me/assignments?status=&page=&pageSize=` | Read the member's assigned work |
| `GET /projects?divisionId=&status=&page=&pageSize=` | Browse authorized projects |
| `GET /projects/{id}` | Read an authorized project |
| `GET /events?from=&to=&page=&pageSize=` | Read meetings and events |
| `GET /events/{id}` | Read an event |
| `GET /documents?q=&category=&page=&pageSize=` | Search authorized documents/resources |
| `GET /documents/{id}` | Read document metadata and a short-lived authorized download URL |

Documents should be delivered through authenticated or short-lived signed URLs;
do not expose private storage buckets or permanent public links.

## 3. Divisions, updates, announcements, and search

| Method and path | Purpose |
|---|---|
| `GET /divisions` | List divisions and summary information |
| `GET /divisions/{id}` | Read division details and services |
| `GET /updates?divisionId=&category=&page=&pageSize=` | Browse updates/articles |
| `GET /updates/{id}` | Read an update |
| `GET /announcements?unreadOnly=&page=&pageSize=` | Browse official company announcements |
| `GET /announcements/{id}` | Read an announcement |
| `GET /search?q=&type=&page=&pageSize=` | Search authorized divisions, services, projects, updates, and announcements |

Use stable IDs and `updatedAt` values so the Android app can cache content and
refresh changes. `type` is a comma-separated allowlisted set; unsupported
types should return `400`.

## 4. Member interests and enquiries

### `POST /me/interests`

Create an enquiry/interest for the authenticated member. The member identity
comes from the token; the app must not submit or modify the member profile name
as part of this operation.

```json
{
  "divisionId": "uuid",
  "serviceId": "uuid",
  "message": "I would like to know more.",
  "contactPreference": "email"
}
```

Return `201` and an interest record with `id`, `status`, and `createdAt`.
Validate that the division/service exists and is visible to the member.

### `GET /me/interests?page=&pageSize=`

Return only the authenticated member's enquiries and their statuses.

## 5. Donations and payment checkout

The first release includes actual payment checkout (not pledge-only). Keep the
integration provider-neutral at the mobile API boundary. The backend owns
provider credentials, payment creation, status verification, refunds, and
webhook processing. The app must never collect or store card numbers, security
codes, provider secrets, or raw payment credentials.

### `POST /donations/checkout-sessions`

Create a donation and a provider checkout session.

```json
{
  "amount": "10000",
  "currency": "TZS",
  "programId": "uuid",
  "returnUrl": "kilivo://donation-result"
}
```

`amount` is a decimal string (not a floating-point JSON number); the backend
defines supported precision and validates minimum/maximum amounts for the
currency. The client cannot set the donor identity: derive it from `/me`.

Response:

```json
{
  "data": {
    "donationId": "uuid",
    "status": "pending",
    "checkoutUrl": "https://payment-provider.example/...",
    "expiresAt": "2026-11-12T12:00:00Z"
  }
}
```

The app opens `checkoutUrl` in a secure browser/custom tab and uses the returned
deep link only to resume the UI. A return/deep link is not proof of payment.

### `GET /me/donations?page=&pageSize=`

Return the authenticated member's donations.

### `GET /donations/{id}`

Return donation status only if the donation belongs to the member or the caller
has an administrative role. Suggested statuses: `pending`, `succeeded`,
`failed`, `cancelled`, `refunded`.

### Backend payment webhooks

The backend exposes a separate provider-specific webhook receiver outside the
mobile API contract. Verify provider signatures, make processing idempotent,
and update donation status from the provider's server-to-server event. Never
trust the app's return URL or a client-submitted "paid" status.

## 6. Notifications and device registration

| Method and path | Purpose |
|---|---|
| `GET /notifications?page=&pageSize=&unreadOnly=` | List notifications for the signed-in member |
| `PATCH /notifications/{id}/read` | Mark an owned notification as read |
| `PUT /me/devices/{deviceId}` | Register/update the member's push token |
| `DELETE /me/devices/{deviceId}` | Remove a device token on logout/uninstall flow |

Suggested registration body:

```json
{
  "platform": "android",
  "pushToken": "provider-token",
  "appVersion": "1.0"
}
```

The push provider is a backend implementation choice. A push payload should
contain a notification ID and minimal display text, not sensitive member data.
Fetching the notification from the API remains authoritative.

## Security and operational requirements

- Store access/refresh tokens using Android's secure storage; do not use
  `SharedPreferences` for authentication secrets.
- Hash passwords with a current, salted password-hashing algorithm on the
  server. Rate-limit login and account-recovery attempts.
- Use short-lived access tokens, revocable/rotating refresh tokens, and server
  authorization checks on every private resource.
- Redact credentials, tokens, personal data, and payment details from logs.
- Apply idempotency keys to donation checkout creation and other retryable
  writes; do not create duplicate charges after timeouts.
- Use server-side pagination and validation. Return a `requestId` for support
  and diagnostics.
- Cache member content only as permitted by company policy. Clear
  member-specific cached data and tokens on logout.
- Provide an explicit offline state in the app. Queue only safe, non-payment
  writes; never retry a payment blindly.

## UI coverage prepared for API integration

The Compose app now has preview screens and navigation for the planned
member-facing API groups:

| API group | Prepared UI |
|---|---|
| `POST /auth/login`, refresh/logout, `GET /me` | Member sign-in, password assistance preview, read-only member profile, and logout route |
| Company/workspace members and organization | Searchable member directory and read-only member details; organization structure |
| Department, assignments, projects | Member department summary, assignments list, projects list and project detail |
| Events and documents | Events list/detail; documents list/detail with a secure-download preview action |
| Divisions, updates, announcements, search | Existing division/update screens, official-announcement list/detail, and cross-content search |
| Interests | Interest form with read-only member identity and a local-only preview confirmation |
| Donation checkout and history | Program/amount selection, payment-method selection, checkout review, explicit no-payment preview, and sample donation statuses |
| Notifications/devices | Notification list, unread badge, and mark-as-read interaction; device registration has no UI because it is an app lifecycle/service operation |

This is **UI readiness only**, not API readiness or integration: login accepts
any non-empty preview values, and sample records are not company data. The
member navigation is visible after the preview sign-in flow. The UI shows
preview/offline notices and empty states, but real loading, network-error,
retry, token-expiry, and payment-return states must be wired to the API client
when integration begins.

## API integration work still required

1. Add a network permission and an HTTP/API client with TLS, timeouts, JSON
   serialization, token refresh, and consistent error handling.
2. Replace preview sign-in with real member authentication, secure token
   storage, logout/session expiry, and route protection before showing member
   data.
3. Replace bundled sample content with API repositories and a deliberate
   cache/offline policy.
4. Bind the prepared members, organization, assignments, projects, events,
   documents, announcements, and search screens to authorized endpoints.
5. Submit interests using the signed-in member identity and retain the
   read-only profile behavior.
6. Replace the checkout preview with checkout-session creation, secure browser
   handoff, server-verified payment status, and real donation history.
7. Load/read notifications from the API and register push tokens through the
   device lifecycle.
8. Wire loading, empty, network-error/retry, unauthorized/session-expired, and
   payment-return states to repository results; current content uses sample
   data and preview notices.

## Open implementation decisions

These do not change the proposed resource contract but must be decided before
production rollout:

- Backend base URL, hosting, database, and deployment environments.
- Exact roles and which members can view each project, event, document, or
  other member's directory details.
- Account invitation and password reset/verification process.
- Payment provider, supported currencies, donation programs, limits, and
  settlement/refund rules.
- Push provider and notification retention policy.
- Data retention, audit-log, privacy, and document-access policies.
