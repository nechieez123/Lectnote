# Lectnote — Business Rules and Decisions

> Version: v1.0 (draft) · Owners: Jeovani and Iloka

The backend enforces every rule; the frontend shows its consequences (disabled buttons, error messages, empty states).

Every rule needs at least one verification test.

HTTP codes are suggestions for the API contract and can be adjusted by the backend.

Rules that depend on a decision reference it as (D-xx). Items marked PROPOSAL are suggestions for the 16.10 meeting, not decisions.

## 1. Rules overview

| ID | Rule (short) | Requirements | Use cases | Entities | Decision |
|----|--------------|--------------|-----------|----------|----------|
| RN-01 | Authentication required; password stored only as a hash | RF-01 | UC-01 | User | — |
| RN-02 | Courses and lessons belong to a study group and are visible only to its members | RF-02 | UC-02 | Course, Lesson, StudyGroup | — |
| RN-03 | Every note has an author; only the author and collaborators with permission can view it | RF-03, RF-06, RF-07, RF-08 | UC-03, UC-06, UC-07, UC-08 | Note, NoteCollaborator | — |
| RN-04 | Only audio files with the accepted formats and size are allowed | RF-04, RNF-02 | UC-04 | AudioRecording | D-01 |
| RN-05 | Transcription job goes from Pending to Completed or Failed; Transcription exists only when Completed | RF-05, RNF-02 | UC-05 | TranscriptionJob, Transcription | D-02, D-06 |
| RN-06 | Only the author can grant access, remove collaborators, or delete the note | RF-08 | UC-08 | Note, NoteCollaborator | D-05 |
| RN-07 | Commenting requires comment or edit permission; editing blocks requires edit permission | RF-07, RF-09, RNF-02 | UC-07, UC-09 | NoteCollaborator, NoteBlock, Comment | D-04 |
| RN-08 | Each comment belongs to exactly one block and stores author and creation date | RF-09 | UC-09 | Comment, NoteBlock | D-03 |
| RN-09 | Block order is preserved; every edit records who and when | RF-07 | UC-07 | NoteBlock | — |
| RN-10 | Transcription completion notifies the recording's author; note edits notify the author and collaborators except the editor | RF-10, RF-11, RF-12 | UC-05, UC-07, UC-10 | Notification | D-02, D-07 |

## 2. Rule details

### RN-01 — Authentication and passwords

**Rule:** Only authenticated users can use the API; passwords are stored only as a hash.

**Backend enforces:** all endpoints except registration and login require a valid session/token; the password is never stored or returned in plain text.

**Frontend shows:** redirect to login when the session is missing or expired.

**Errors:** no valid session → `401`.

**Tests:**
1. A request without a token to a protected endpoint returns `401`.
2. The stored password value differs from the submitted password and is a hash.

### RN-02 — Group ownership of courses and lessons

**Rule:** Courses and lessons belong to a study group and are visible only to members of that group.

**Backend enforces:** every course/lesson query is filtered by the authenticated user's study group.

**Frontend shows:** only the group's courses and lessons; message when the student has no group.

**Errors:** access to another group's data → `403` / `404`.

**Tests:**
1. A user of group B cannot list or read courses/lessons of group A.
2. A user without a group receives the "no group" error.

### RN-03 — Note authorship and visibility

**Rule:** Every note has an author. Only the author and collaborators with the corresponding permission can view it. Permissions: read, comment, edit.

**Backend enforces:** the author is set from the session on creation and cannot be null; access to a note and its blocks is checked against author or `NoteCollaborator`.

**Frontend shows:** notes the user can access; "no access" state otherwise.

**Errors:** no access → `403`.

**Tests:**
1. A user with no relation to the note gets `403`.
2. A collaborator with read permission can view the note.
3. Creating a note stores the authenticated user as author.

### RN-04 — Accepted audio files

**Rule:** Only MP3, M4A and WAV files up to 100 MB are accepted (D-01).

**Backend enforces:** validates format and size before saving the file or creating the transcription job.

**Frontend shows:** clear message for unsupported format, file too large, or upload failure.

**Errors:** unsupported format → `415`; file too large → `413`.

**Tests:**
1. An unsupported file is rejected and no `AudioRecording` or `TranscriptionJob` is created.
2. A file above the limit is rejected.
3. A valid file creates both records with status `Pending`.

**Decision (D-01):** see section 3.

### RN-05 — Transcription job lifecycle

**Rule:** A transcription job moves from `Pending` to `Completed` or `Failed`. A `Transcription` object is created only when the status is `Completed` (D-02, D-06).

**Backend enforces:** allowed transitions are only `Pending → Completed` and `Pending → Failed`; on failure, the error message is stored in the job.

**Frontend shows:** status of the job (processing, ready, failed) and the error message on failure.

**Tests:**
1. A successful job ends as `Completed` with exactly one `Transcription`.
2. A failed job ends as `Failed` with an error message and no `Transcription`.
3. A `Completed` or `Failed` job cannot return to `Pending`.

### RN-06 — Sharing and deleting (author only)

**Rule:** Only the author can grant access to a note, remove collaborators, or delete the note (D-05).

**Backend enforces:** the sharing/removal/deletion endpoints compare the authenticated user with the note's author; collaborators cannot change access, even with edit permission.

**Frontend shows:** sharing controls only to the author.

**Errors:** request from a non-author → `403`; access already granted → `409`; user not found → `404`.

**Tests:**
1. A collaborator with edit permission cannot share the note.
2. The author can grant access and the record is created with the chosen permission.
3. Granting the same access twice returns an error.

### RN-07 — Permissions for commenting and editing

**Rule:** Commenting requires comment or edit permission. Editing blocks requires edit permission (D-04).

**Backend enforces:** permission checked on every comment and block-edit request.

**Frontend shows:** comment box or edit controls only when permitted; "no permission" message otherwise.

**Errors:** missing permission → `403`. A concurrent edit is not an error: the last saved version wins (D-04).

**Tests:**
1. Read permission: cannot comment or edit.
2. Comment permission: can comment, cannot edit.
3. Edit permission: can comment and edit.
4. Two concurrent edits of the same block: the last saved version wins (D-04).

### RN-08 — Comments belong to one block

**Rule:** Each comment belongs to exactly one block and stores its author and creation date. When a block is deleted, its comments are deleted with it (D-03).

**Backend enforces:** a comment requires a valid block, non-empty text, author from the session, and creation date set by the server.

**Frontend shows:** comments attached to their block, with author and date; error on empty text.

**Errors:** empty text → `400`.

**Tests:**
1. A comment without a block is rejected.
2. A saved comment has the block, author, and date.
3. Empty text is rejected.

### RN-09 — Block order and edit history

**Rule:** Block order is preserved. Every edit records who made it and when.

**Backend enforces:** blocks are returned in their stored position; each update sets "changed by" and "change date".

**Frontend shows:** blocks in order; who last changed each block and when.

**Tests:**
1. After saving and reloading, blocks keep their order.
2. After an edit, "changed by" is the editing user and the date is updated.

### RN-10 — Notifications

**Rule:** When transcription completes or fails, the author of the recording is notified (D-02). When a note is edited, the author and collaborators are notified, except the user who made the change. Notifications are shown in the app only (D-07).

**Backend enforces:** notifications are created by the system on the events above; the recipient list excludes the editor.

**Frontend shows:** notification list with read/unread state; empty state.

**Tests:**
1. A completed job creates one notification for the recording's author.
2. An edit by a collaborator notifies the author and the other collaborators, not the editor.
3. Marking a notification as read changes only that notification.
4. A failed job creates one notification for the recording's author.

## 3. Decisions

The team answered a form on 20–21.10 (4 answers). An option with at least 3 of 4 votes is accepted. Ties are decided by the team lead.

| ID | Question | Affects | PROPOSAL | Decision |
|----|----------|---------|----------|----------|
| D-01 | Which audio formats are accepted and what is the maximum file size? | RN-04, RF-04 | Accept common formats (e.g. MP3, WAV, M4A) with a limit that fits the transcription service and the 8 GB RAM target (RNF-01). | MP3, M4A and WAV, maximum size 100 MB. |
| D-02 | If transcription fails (`Failed`), is the author notified and can they upload again? | RN-05, RN-10, RF-10 | Notify the author. The model already allows several jobs per recording (`AudioRecording` 1:N `TranscriptionJob`), so a retry may create a new job without a new upload. | Notify the author. A retry creates a new job without a new upload. |
| D-03 | If a block is deleted, are its comments deleted or archived? | RN-08, RF-09 | Delete together with the block (simplest). See open issue 1 below first. | Delete the comments together with the block. |
| D-04 | If two people edit the same block at once, is the last version saved or is a conflict reported? | RN-07, RF-07 | Last version wins for the MVP, since the ERD has no version attribute. A conflict message would require a new attribute. | The last saved version wins (MVP). |
| D-05 | Is a shared note visible only to users invited by the author, or to the whole study group? | RN-03, RN-06, RF-08 | Only invited users. This is already what RN-03 and RN-06 imply. | Only users invited by the author. |
| D-06 | Which languages are supported for transcription? | RN-05, RF-05 | Fix a short list (e.g. Russian and Portuguese) and store the language in `Transcription`. | Russian, English and French. The language is chosen in the audio upload form. |
| D-07 | Are notifications available only in the app or also by e-mail? | RN-10, RF-10, RF-11, RF-12 | In-app only for the MVP. | In-app only for the MVP (tie 2:2, decided by the team lead). |

### Votes

| ID | Result (4 answers) |
|----|--------------------|
| D-01 formats | MP3 4, M4A 3, WAV 2, OGG 1. WAV got 2 of 4 votes and is accepted by the team lead, because it is a common recording format. |
| D-01 size | 100 MB: 4 |
| D-02 | Notify the author and allow a retry without a new upload: 4 |
| D-03 | Delete with the block: 3, archive: 1 |
| D-04 | Last saved version wins: 3, conflict message: 1 |
| D-05 | Only invited users: 3, the whole study group: 1 |
| D-06 languages | Russian 4, English 4, French 3, Portuguese 2, Spanish 2, Arabic 2, Chinese 1. Languages with fewer than 3 votes are not in the first version and can be added later, because `language` is only a stored value. |
| D-06 source | Chosen in the upload form: 3, automatic detection: 1 |
| D-07 | In-app only: 2, in-app and e-mail: 2 (tie). In-app only is decided by the team lead, because e-mail needs an extra mail service. |
| Deleting notes and blocks | Add a requirement and a use case before v1.0: 4 |

## 4. Open issues

1. **Deleting notes and blocks.** The team decided (4 of 4) to add a requirement and a use case before v1.0. To do: add the requirement and the use case for deleting a note, deleting a block, and removing a collaborator, then add the endpoints to the API contracts. Status: open.
2. **RN-10 wording for failures.** Resolved: a failed transcription notifies the author (D-02).
3. **Source of the transcription language.** Resolved: the language is chosen in the audio upload form (D-06). UC-04 must include this field.

## 5. Approval checklist

- [ ] Every rule RN-01 to RN-10 was reviewed by the four members.
- [ ] Every rule has at least one verification test listed.
- [x] Every decision D-01 to D-07 has a recorded answer.
- [ ] Open issues in section 4 were resolved or explicitly postponed.
