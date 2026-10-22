# Lectnote — Requirements

> Version: v1.0 (draft) · Owner: Jeovani

## 1. Change control

No button, field, label, endpoint, or table is added to the project without a reference to a requirement (`RF-xx`) and a use case (`UC-xx`).
If a matching ID does not exist in the approved model, the element is **not** created: a change request is opened instead.

**Change request:** create a GitHub issue with the `model-change` label. The team lead (Iloka) decides. If the change affects the model, its version is raised to `v1.1` and everyone is notified in the team chat.

## 2. Actors

| Actor | Description |
|-------|-------------|
| Student | Authenticated user who belongs to a study group (`StudyGroup`). |
| Note Author | The Student who created the note (or uploaded the audio). The only one who manages sharing. |
| Collaborator | A classmate with access to the note (read, comment, or edit). |
| System | Automated processes: transcription and notification delivery. |

> The Note Author is a Student acting on their own note; "Student" and "Author" are therefore not separate accounts, only roles.

## 3. Functional requirements

| ID | Requirement | Use cases | Entities | Rules |
|----|-------------|-----------|----------|-------|
| RF-01 | The student registers, logs in, and logs out. | UC-01 | User, StudyGroup | RN-01 |
| RF-02 | The student creates and views the courses and lessons of their study group. | UC-02 | Course, Lesson, StudyGroup | RN-02 |
| RF-03 | The student creates a note linked to a lesson. | UC-03 | Note, Lesson, User | RN-03 |
| RF-04 | The student uploads an audio recording of a lesson. | UC-04 | AudioRecording, Lesson, User | RN-04 |
| RF-05 | The system transcribes the audio and stores the processing state. | UC-05 | TranscriptionJob, Transcription, AudioRecording | RN-05 |
| RF-06 | The student views the transcription and organizes it into text blocks. | UC-06 | Transcription, Note, NoteBlock | RN-03 |
| RF-07 | The student edits blocks and highlights important concepts. | UC-07 | NoteBlock, Note | RN-03, RN-07, RN-09 |
| RF-08 | The author shares a note with classmates and sets access permissions. | UC-08 | Note, NoteCollaborator, User | RN-03, RN-06 |
| RF-09 | A classmate leaves a comment on a specific block of a note. | UC-09 | Comment, NoteBlock, User | RN-07, RN-08 |
| RF-10 | The system sends a notification when transcription finishes. Notification on transcription failure depends on D-02. | UC-05, UC-10 | Notification, TranscriptionJob | RN-10 |
| RF-11 | The system notifies when a classmate edits a note. | UC-07, UC-10 | Notification, Note | RN-10 |
| RF-12 | The student views notifications and marks them as read. | UC-10 | Notification | RN-10 |

## 4. Non-functional requirements

| ID | Requirement | Use cases | Entities | Rules |
|----|-------------|-----------|----------|-------|
| RNF-01 | The application starts with `docker compose up` on a laptop with 8 GB of RAM. | — | — | — |
| RNF-02 | For expected errors (invalid audio, transcription failure, missing permission), a clear message is displayed. | UC-04, UC-05, UC-08 | — | RN-04, RN-05, RN-07 |

## 5. Open decisions affecting requirements

To be decided at the 16.10 meeting and recorded in `business-rules.md`.

| Decision | Affected requirements |
|----------|-----------------------|
| D-01 Accepted audio formats and maximum file size | RF-04, RNF-02 |
| D-02 On transcription failure: is the author notified? Can they re-upload? | RF-05, RF-10, RNF-02 |
| D-03 When a block is deleted: are its comments deleted or archived? | RF-09 |
| D-04 Simultaneous edits to the same block: last write wins or conflict warning? | RF-07 |
| D-05 Shared note: visible only to invited users or to the whole study group? | RF-08 |
| D-06 Transcription languages (Russian, Portuguese, others) | RF-05 |
| D-07 Notifications in-app only or also by e-mail? | RF-10, RF-11, RF-12 |

## 6. Approval checklist

- [ ] Every RF has at least one UC.
- [ ] Every UC uses only entities present in the ERD.
- [ ] Every entity serves at least one requirement.
- [ ] Every decision D-01 to D-07 has a recorded answer.
