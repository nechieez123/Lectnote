# Lectnote — API Contracts

> Version: v0.2 (draft) · Owners: Iloka and Jeovani

Draft contracts for the Lectnote REST API. Every endpoint is tied to a use case (UC) and its business rules (RN). The decisions D-01 to D-07 from `business-rules.md` are applied (see section 11).

## 1. Conventions

- **Base path:** `/api`. All bodies are JSON unless the endpoint says `multipart/form-data`.
- **Field names:** camelCase. **Dates:** ISO 8601, UTC (`2026-10-19T14:30:00Z`).
- **Authentication:** every endpoint except `GET /api/hello`, `GET /api/study-groups`, `POST /api/auth/register` and `POST /api/auth/login` requires the header `Authorization: Bearer <token>` (RN-01).
- **Error body:** `{ "error": "short message" }`.
- **Status codes:**

| Code | Meaning |
|------|---------|
| 200 | OK, with a body |
| 201 | Created |
| 204 | OK, no body |
| 400 | Invalid data (for example, empty text) |
| 401 | Missing or invalid session |
| 403 | No permission or no access |
| 404 | Object not found |
| 409 | Conflict (already exists, or not in the right state) |
| 413 | File too large |
| 415 | Unsupported file format |

## 2. Health check

### GET /api/hello
Public. Used by the frontend Hello World.

- **200:** `{ "message": "Hello from Lectnote API", "studyGroups": 0 }`

## 3. Authentication (UC-01, RN-01)

### GET /api/study-groups
Public. List of study groups, used by the registration form.

- **200:** `[ { "id": 1, "name": "ИДБ-24-05" } ]`

### POST /api/auth/register
- **Request:** `{ "fullName": "...", "email": "...", "password": "...", "studyGroupId": 1 }`
- **201:** `{ "id": 7, "fullName": "...", "email": "...", "studyGroupId": 1 }`
- **Errors:** 400 invalid data · 409 e-mail already registered
- **Note:** the password is stored only as a hash and never returned.

### POST /api/auth/login
- **Request:** `{ "email": "...", "password": "..." }`
- **200:** `{ "token": "...", "user": { "id": 7, "fullName": "...", "studyGroupId": 1 } }`
- **Errors:** 401 invalid credentials

### POST /api/auth/logout
- **204:** the session is invalidated
- **Errors:** 401

## 4. Courses and lessons (UC-02, RN-02)

All data is limited to the study group of the authenticated user.

### GET /api/courses
- **200:** `[ { "id": 1, "title": "Databases" } ]`
- **Errors:** 403 the user has no study group

### POST /api/courses
- **Request:** `{ "title": "Databases" }`
- **201:** `{ "id": 1, "title": "Databases" }`
- **Errors:** 400 empty title · 403 no study group

### GET /api/courses/{courseId}/lessons
- **200:** `[ { "id": 3, "courseId": 1, "topic": "Normalization", "lessonDate": "2026-10-12" } ]`
- **Errors:** 404 course not found or belongs to another group

### POST /api/courses/{courseId}/lessons
- **Request:** `{ "topic": "Normalization", "lessonDate": "2026-10-12" }`
- **201:** the created lesson
- **Errors:** 400 invalid data · 404 course not found

## 5. Notes (UC-03, RN-03)

### POST /api/notes
- **Request:** `{ "lessonId": 3, "title": "Lecture 5" }`
- **201:** `{ "id": 10, "lessonId": 3, "authorId": 7, "title": "Lecture 5", "createdAt": "..." }`
- **Errors:** 400 empty title · 404 lesson not found
- **Note:** the author is taken from the session.

### GET /api/notes
Notes the user can access (own and shared). Optional filter: `?lessonId=3`.

- **200:** `[ { "id": 10, "lessonId": 3, "title": "Lecture 5", "authorId": 7, "myPermission": "author", "updatedAt": "..." } ]`
- `myPermission` is `author`, `read`, `comment` or `edit`.

### GET /api/notes/{noteId}
- **200:** `{ "id": 10, "lessonId": 3, "title": "Lecture 5", "authorId": 7, "myPermission": "author", "createdAt": "...", "updatedAt": "..." }`
- **Errors:** 403 no access · 404 not found

### DELETE /api/notes/{noteId}
Author only (UC-11, RN-06).

- **204:** the note is deleted together with its blocks, comments, collaborators and notifications
- **Errors:** 401 · 403 not the author · 404 not found

## 6. Audio and transcription (UC-04, UC-05, RN-04, RN-05)

### POST /api/lessons/{lessonId}/audio
- **Request:** `multipart/form-data`, fields `file` and `language` (`ru`, `en` or `fr`)
- **201:** `{ "audioRecordingId": 4, "transcriptionJobId": 9, "status": "Pending" }`
- **Errors:** 400 missing or unsupported language · 404 lesson not found · 413 file too large · 415 unsupported format · 500 upload failure
- **Note:** accepted formats are MP3, M4A and WAV; the maximum size is 100 MB (D-01). A rejected file creates no records.

### GET /api/transcription-jobs/{jobId}
Used by the frontend to show the processing state.

- **200:** `{ "id": 9, "audioRecordingId": 4, "status": "Completed", "errorMessage": null, "createdAt": "...", "finishedAt": "...", "transcriptionId": 5 }`
- `status` is `Pending`, `Completed` or `Failed`. `errorMessage` is filled only for `Failed`. `transcriptionId` exists only for `Completed`.
- **Errors:** 403 no access · 404 not found

### GET /api/transcriptions/{transcriptionId}
- **200:** `{ "id": 5, "text": "...", "language": "ru", "createdAt": "..." }`
- **Errors:** 403 no access · 404 not found
- **Note:** the language is the one chosen at upload (D-06).

### POST /api/audio/{audioRecordingId}/retry (D-02)
Creates a new transcription job for a recording whose last job is `Failed`, without a new upload.

- **201:** `{ "transcriptionJobId": 12, "status": "Pending" }`
- **Errors:** 404 not found · 409 the last job is not `Failed`

## 7. Blocks (UC-06, UC-07, RN-03, RN-07, RN-09)

### GET /api/notes/{noteId}/blocks
Blocks in their stored order.

- **200:** `[ { "id": 21, "position": 1, "content": "...", "isHighlighted": false, "changedBy": 7, "changedAt": "..." } ]`
- **Errors:** 403 no access · 404 note not found

### POST /api/notes/{noteId}/blocks
Creates blocks, for example from a transcription split into parts.

- **Request:** `{ "transcriptionId": 5, "blocks": [ { "content": "First part" }, { "content": "Second part" } ] }`
- **201:** the list of created blocks with their `position`
- **Errors:** 403 no edit permission · 404 note not found · 409 the transcription is not `Completed`
- **Note:** `transcriptionId` is optional (for blocks written by hand).

### PUT /api/notes/{noteId}/blocks/{blockId}
- **Request:** `{ "content": "new text", "isHighlighted": true }` (both fields optional)
- **200:** the updated block (`changedBy` and `changedAt` set by the server)
- **Errors:** 403 no edit permission · 404 not found
- **Note:** when two people edit the same block, the last saved version wins (D-04).
- **Side effect:** notifications for the author and collaborators, except the editor (RN-10).

### DELETE /api/notes/{noteId}/blocks/{blockId}
Requires edit permission (UC-11, RN-07). The comments of the block are deleted with it (D-03).

- **204**
- **Errors:** 401 · 403 no edit permission · 404 not found

## 8. Sharing (UC-08, RN-06)

### GET /api/study-group/members
Classmates the author can share with.

- **200:** `[ { "id": 8, "fullName": "..." } ]`

### GET /api/notes/{noteId}/collaborators
- **200:** `[ { "userId": 8, "fullName": "...", "permission": "comment" } ]`
- **Errors:** 403 not the author · 404 note not found

### POST /api/notes/{noteId}/collaborators
- **Request:** `{ "userId": 8, "permission": "comment" }` (`read`, `comment` or `edit`)
- **201:** `{ "userId": 8, "permission": "comment" }`
- **Errors:** 400 invalid permission · 403 not the author · 404 user not found · 409 access already granted

### DELETE /api/notes/{noteId}/collaborators/{userId}
- **204**
- **Errors:** 403 not the author · 404 not found

## 9. Comments (UC-09, RN-07, RN-08)

### GET /api/blocks/{blockId}/comments
- **200:** `[ { "id": 30, "authorId": 8, "authorName": "...", "text": "...", "createdAt": "..." } ]`
- **Errors:** 403 no access · 404 block not found

### POST /api/blocks/{blockId}/comments
- **Request:** `{ "text": "Please add an example" }`
- **201:** the created comment (`authorId` and `createdAt` set by the server)
- **Errors:** 400 empty text · 403 no comment permission · 404 block not found

## 10. Notifications (UC-10, RN-10)

### GET /api/notifications
Optional filter: `?unreadOnly=true`.

- **200:** `[ { "id": 50, "type": "TranscriptionCompleted", "message": "...", "noteId": 10, "isRead": false, "createdAt": "..." } ]`
- `type` is `TranscriptionCompleted`, `TranscriptionFailed` or `NoteEdited`.
- An empty list is a valid answer.

### PATCH /api/notifications/{id}/read
- **204**
- **Errors:** 404 not found (including notifications of other users)

### PATCH /api/notifications/read-all
- **204**

## 11. Applied decisions

| Decision | Effect on the contracts |
|----------|-------------------------|
| D-01 | `POST /api/lessons/{lessonId}/audio` accepts MP3, M4A and WAV, up to 100 MB |
| D-02 | A failed transcription notifies the author (`TranscriptionFailed`); the retry endpoint is part of the API |
| D-03 | `DELETE .../blocks/{blockId}` also deletes the block's comments |
| D-04 | `PUT .../blocks/{blockId}`: the last saved version wins, there is no 409 conflict |
| D-06 | The audio upload has a `language` field (`ru`, `en`, `fr`) |
| D-07 | Notifications are in-app only, so there are no e-mail settings |
| Deleting | `DELETE /api/notes/{noteId}` and `DELETE .../blocks/{blockId}` were added (RF-13, UC-11) |
