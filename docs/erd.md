# Lectnote — ERD

Conceptual model: 12 entities. Real-world objects: User, StudyGroup, Course, Lesson, AudioRecording, Transcription, Note, NoteBlock, Comment, Notification. Service entities: TranscriptionJob, NoteCollaborator.

```mermaid
erDiagram
    STUDY_GROUP ||--o{ USER : "has members"
    STUDY_GROUP ||--o{ COURSE : "owns"
    COURSE ||--o{ LESSON : "contains"
    LESSON ||--o{ NOTE : "has notes"
    USER ||--o{ NOTE : "authors"
    LESSON ||--o{ AUDIO_RECORDING : "has recordings"
    USER ||--o{ AUDIO_RECORDING : "uploads"
    AUDIO_RECORDING ||--o{ TRANSCRIPTION_JOB : "processed by"
    TRANSCRIPTION_JOB ||--o| TRANSCRIPTION : "produces"
    NOTE ||--o{ NOTE_BLOCK : "consists of"
    USER ||--o{ NOTE_BLOCK : "last changed by"
    NOTE ||--o{ NOTE_COLLABORATOR : "shared through"
    USER ||--o{ NOTE_COLLABORATOR : "has access"
    NOTE_BLOCK ||--o{ COMMENT : "receives"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ NOTIFICATION : "receives"

    STUDY_GROUP {
        bigint id PK
        string name
        datetime created_at
    }
    USER {
        bigint id PK
        string full_name
        string email
        string password_hash
        bigint study_group_id FK
        datetime created_at
    }
    COURSE {
        bigint id PK
        bigint study_group_id FK
        string title
    }
    LESSON {
        bigint id PK
        bigint course_id FK
        string topic
        date lesson_date
    }
    NOTE {
        bigint id PK
        bigint lesson_id FK
        bigint author_id FK
        string title
        datetime created_at
        datetime updated_at
    }
    AUDIO_RECORDING {
        bigint id PK
        bigint lesson_id FK
        bigint uploaded_by FK
        string file_path
        string file_format
        bigint size_bytes
        datetime uploaded_at
    }
    TRANSCRIPTION_JOB {
        bigint id PK
        bigint audio_recording_id FK
        string status
        string error_message
        datetime created_at
        datetime finished_at
    }
    TRANSCRIPTION {
        bigint id PK
        bigint transcription_job_id FK
        string text
        string language
        datetime created_at
    }
    NOTE_BLOCK {
        bigint id PK
        bigint note_id FK
        int position
        string content
        boolean is_highlighted
        bigint changed_by FK
        datetime changed_at
    }
    NOTE_COLLABORATOR {
        bigint id PK
        bigint note_id FK
        bigint user_id FK
        string permission
    }
    COMMENT {
        bigint id PK
        bigint note_block_id FK
        bigint author_id FK
        string text
        datetime created_at
    }
    NOTIFICATION {
        bigint id PK
        bigint user_id FK
        bigint note_id FK
        string type
        string message
        boolean is_read
        datetime created_at
    }
```

## Open points

- **D-02:** one audio recording can have several transcription jobs, so a failed job can be retried.
- **D-03:** comments are deleted together with their block.
- **D-04:** the model has no version attribute, so the last saved edit wins.
- **D-06:** `language` is stored in `Transcription`; where the value comes from is still undecided.
