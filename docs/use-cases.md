# Lectnote — Use Cases

> Version: v1.1 (draft) · Owner: Jeovani

The errors and alternatives below define the **error states of the screens** (frontend) and the **API error responses** (backend).
Items marked **(D-xx)** refer to a decision recorded in `business-rules.md`.

## Overview

| ID | Actor | Use case | Requirements |
|----|-------|----------|--------------|
| UC-01 | Student | Register, log in, and log out | RF-01 |
| UC-02 | Student | Manage courses and lessons | RF-02 |
| UC-03 | Author | Create a note | RF-03 |
| UC-04 | Author | Upload audio | RF-04, RNF-02 |
| UC-05 | System | Transcribe audio | RF-05, RF-10, RNF-02 |
| UC-06 | Author | Split a transcription into blocks | RF-06 |
| UC-07 | Author or Collaborator | Edit blocks and highlight concepts | RF-07, RF-11 |
| UC-08 | Author | Share a note | RF-08, RNF-02 |
| UC-09 | Collaborator | Comment on a block | RF-09 |
| UC-10 | Student | View notifications | RF-10, RF-11, RF-12 |
| UC-11 | Author or Collaborator | Delete a note, a block, or a collaborator | RF-13, RNF-02 |

---

## UC-01 — Register, log in, and log out

- **Actor:** Student
- **Requirements:** RF-01
- **Entities:** User, StudyGroup
- **Rules:** RN-01
- **Precondition:** none for registration/login; an active session to log out.
- **Postcondition:** account created, session opened, or session closed.

**Main scenario**
1. The student enters e-mail and password.
2. The system creates the account (storing only the password hash) or opens a session.
3. The student accesses the application, authenticated.

**Alternatives and errors**
- **A1 — Log out:** the student ends the session and the system invalidates it.
- **E1 —** E-mail already registered.
- **E2 —** Invalid credentials.

---

## UC-02 — Manage courses and lessons

- **Actor:** Student
- **Requirements:** RF-02
- **Entities:** Course, Lesson, StudyGroup
- **Rules:** RN-02
- **Precondition:** authenticated student who belongs to a study group.
- **Postcondition:** course and/or lesson created or selected, visible only to members of the group.

**Main scenario**
1. The student creates or selects a course of their study group.
2. The student creates or selects a lesson of that course.
3. The system displays the group's courses and lessons.

**Alternatives and errors**
- **E1 —** Lesson without a course.
- **E2 —** The student does not belong to any group.

---

## UC-03 — Create a note

- **Actor:** Author
- **Requirements:** RF-03
- **Entities:** Note, Lesson, User
- **Rules:** RN-03
- **Precondition:** authenticated student; existing lesson.
- **Postcondition:** note created, linked to the lesson, with the student as author.

**Main scenario**
1. The author selects the lesson.
2. The author enters a title.
3. The system creates the note.

**Alternatives and errors**
- **E1 —** Empty title.
- **E2 —** The lesson does not exist.

---

## UC-04 — Upload audio

- **Actor:** Author
- **Requirements:** RF-04, RNF-02
- **Entities:** AudioRecording, Lesson, User
- **Rules:** RN-04 (D-01), RN-05 (D-06)
- **Precondition:** authenticated student; existing lesson.
- **Postcondition:** file saved and a transcription job created with status `Pending`.

**Main scenario**
1. The author selects the file, the lesson, and the language of the recording (Russian, English, or French).
2. The system validates format and size.
3. The system saves the file and creates the transcription job (`TranscriptionJob`, `Pending`).

**Alternatives and errors**
- **E1 —** Unsupported format (only MP3, M4A, and WAV are accepted).
- **E2 —** File too large (the limit is 100 MB).
- **E3 —** Upload failure.

---

## UC-05 — Transcribe audio

- **Actor:** System
- **Requirements:** RF-05, RF-10, RNF-02
- **Entities:** TranscriptionJob, Transcription, AudioRecording, Notification
- **Rules:** RN-05 (D-02, D-06), RN-10
- **Precondition:** a transcription job exists with status `Pending`.
- **Postcondition:** job is `Completed` with a `Transcription` created, or `Failed`; author notified.

**Main scenario**
1. The system processes the job (`Pending`).
2. The system saves the transcription text.
3. The system changes the status to `Completed`.
4. The system notifies the author of the recording.

**Alternatives and errors**
- **E1 — Processing failure:** the status becomes `Failed`, with an error message, and the author is notified (D-02). The author can retry without uploading the file again.

---

## UC-06 — Split a transcription into blocks

- **Actor:** Author
- **Requirements:** RF-06
- **Entities:** Transcription, Note, NoteBlock
- **Rules:** RN-03
- **Precondition:** transcription with status `Completed`; existing note.
- **Postcondition:** blocks (`NoteBlock`) created in order and linked to the note.

**Main scenario**
1. The author opens the transcription.
2. The author splits it into text blocks.
3. The system links the blocks to the note, preserving their order.

**Alternatives and errors**
- **E1 —** The transcription is still `Pending`.

---

## UC-07 — Edit blocks and highlight concepts

- **Actor:** Author or Collaborator
- **Requirements:** RF-07, RF-11
- **Entities:** NoteBlock, Note, Notification
- **Rules:** RN-03, RN-07 (D-04), RN-09, RN-10
- **Precondition:** user has edit permission on the note.
- **Postcondition:** block updated with a record of who changed it and when; other participants notified.

**Main scenario**
1. The user changes a block's text or marks a concept as important.
2. The system saves the change, recording who made it and when.
3. The system notifies the author and collaborators, except the user who made the change.

**Alternatives and errors**
- **E1 —** No edit permission.
- **E2 —** Another user changed the same block at the same time: the last saved version wins (D-04).

---

## UC-08 — Share a note

- **Actor:** Author
- **Requirements:** RF-08, RNF-02
- **Entities:** Note, NoteCollaborator, User
- **Rules:** RN-03, RN-06 (D-05)
- **Precondition:** the requester is the author of the note.
- **Postcondition:** `NoteCollaborator` record created with the chosen permission.

**Main scenario**
1. The author selects classmates from the study group.
2. The author sets the permission: read, comment, or edit.
3. The system records the access.

**Alternatives and errors**
- **E1 —** The user does not exist.
- **E2 —** Access has already been granted.
- **E3 —** The request does not come from the author.

---

## UC-09 — Comment on a block

- **Actor:** Collaborator
- **Requirements:** RF-09
- **Entities:** Comment, NoteBlock, User
- **Rules:** RN-07, RN-08 (D-03)
- **Precondition:** comment or edit permission on the note.
- **Postcondition:** comment created, linked to a single block, with author and date.

**Main scenario**
1. The collaborator selects a block.
2. The collaborator writes a comment.
3. The system saves the comment with author and date.

**Alternatives and errors**
- **E1 —** No comment permission.
- **E2 —** Empty text.

---

## UC-10 — View notifications

- **Actor:** Student
- **Requirements:** RF-10, RF-11, RF-12
- **Entities:** Notification
- **Rules:** RN-10 (D-07)
- **Precondition:** authenticated student.
- **Postcondition:** notifications displayed; the selected ones are marked as read.

**Main scenario**
1. The student opens the notification list.
2. The student reviews the notifications.
3. The student marks them as read.

**Alternatives and errors**
- **E1 —** Empty list.

---

## UC-11 — Delete a note, a block, or a collaborator

- **Actor:** Author (note, collaborator) or Collaborator with edit permission (block)
- **Requirements:** RF-13, RNF-02
- **Entities:** Note, NoteBlock, Comment, NoteCollaborator, Notification
- **Rules:** RN-06, RN-07, RN-08 (D-03)
- **Precondition:** the requester is the author of the note (to delete the note or remove a collaborator), or has edit permission on the note (to delete a block).
- **Postcondition:** the selected object is deleted together with its dependent records. Deleting a note also deletes its blocks, comments, collaborators, and notifications about it. Deleting a block deletes its comments (D-03). Audio recordings and transcriptions of the lesson are kept.

**Main scenario**
1. The user selects a note, a block, or a collaborator to delete.
2. The system asks for confirmation.
3. The user confirms.
4. The system deletes the object and its dependent records.

**Alternatives and errors**
- **E1 —** The user cancels at the confirmation step: nothing is deleted.
- **E2 —** The request does not come from the author (note, collaborator) or the user has no edit permission (block).
- **E3 —** The object does not exist.
