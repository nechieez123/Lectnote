# Lectnote — Frontend/API integration audit

Date: 2026-10-22

## Frontend delivered

The web UI has been switched from the local demo store to an API-first client. It calls the paths described in `docs/api-contracts.md`, attaches `Authorization: Bearer <token>` when a session token exists, sends JSON with camelCase fields, sends audio as `multipart/form-data`, handles `204 No Content`, and displays API errors rather than silently pretending that a mutation succeeded.

Implemented in the UI: login/register, course and lesson creation/listing, note creation/listing, block creation/edit/highlight, audio upload and transcription-job status, notifications/read state, responsive navigation, API status and empty/error states. The API client also defines methods for collaborators and comments so the remaining UI flows can be completed without changing the HTTP conventions.

## Critical integration finding

The current backend in `api/Lectnote.Api/Program.cs` implements only `GET /api/hello`. It defines only `StudyGroup` and `AppDbContext.StudyGroups`. It does **not** currently implement registration/login/logout, `GET /api/study-groups`, courses, lessons, notes, blocks, audio, transcription jobs, collaborators, comments, or notifications. Therefore the corresponding UI flows cannot work against the current backend until these routes are implemented. The UI intentionally reports those API errors and does not fall back to fabricated local data.

## Required backend/database work before an end-to-end demo

1. Implement the endpoints from `docs/api-contracts.md` and make response JSON match the documented shapes exactly.
2. Implement the entities and EF Core relationships in `docs/erd.md` and `docs/schema.sql`; currently the EF model/migration only covers `study_groups`.
3. Add secure password hashing, token/session validation and authorization policies. Every protected endpoint must derive the current user from the validated token; never trust a user ID supplied by the browser.
4. Configure CORS for the actual frontend origin when frontend and API are hosted separately. For Docker, the frontend uses the Nginx `/api` proxy to `api:8080`.
5. Configure `VITE_API_BASE_URL` only when the API is hosted at a different origin. For local Vite development, configure `API_PROXY_TARGET` in `web/.env.local` to the backend URL.
6. Decide and record D-01 (audio formats/size), D-02 (failed transcription/retry), D-04 (concurrent edit behavior), D-06 (language source), and D-07 (notification channels). The frontend cannot decide business rules that belong to the team/model.
7. Add API integration tests for 200/201/204 and expected 400/401/403/404/409/413/415 responses; verify that group isolation and note permissions are enforced server-side.

## Data/contract mismatches to resolve

- `docs/api-contracts.md` documents `GET /api/study-groups`, but `Program.cs` currently only exposes `/api/hello`.
- The OpenAPI/documentation is a draft; make it the single source of truth and update it alongside controller/minimal API implementation.
- The notes list contract includes `myPermission` and `updatedAt`; ensure these fields are computed from the authenticated user and stored collaboration records.
- `GET /api/notes/{noteId}/blocks` returns `changedBy` as an identifier in the contract. The frontend treats it as an ID, not a display name.
- Audio formats/size and transcription retry remain pending decisions; server validation must be authoritative, even if the browser's file picker filters formats.
- `docs/schema.sql` is explicitly a draft; generate/maintain the production schema through EF Core migrations rather than manually applying the draft SQL.

## Run and verify

```bash
cd web
npm ci
cp .env.example .env.local
# Set API_PROXY_TARGET to the reachable backend URL in .env.local
npm run dev
```

Before presenting an end-to-end demo, verify that every UI route used in the demonstration has a real backend endpoint and persistent database behavior. A successful `/api/hello` health check alone does not mean the other API features are implemented.
