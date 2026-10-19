-- Lectnote: draft database schema (PostgreSQL)
-- Used to draw the ERD in DBeaver. The final schema will come from EF Core migrations.

CREATE TABLE study_groups (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name      VARCHAR(200) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    study_group_id BIGINT REFERENCES study_groups(id),   -- NULL = user has no group yet (RN-02)
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    study_group_id BIGINT NOT NULL REFERENCES study_groups(id),
    title          VARCHAR(200) NOT NULL
);

CREATE TABLE lessons (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_id    BIGINT NOT NULL REFERENCES courses(id),
    topic        VARCHAR(255) NOT NULL,
    lesson_date  DATE NOT NULL
);

CREATE TABLE notes (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lesson_id   BIGINT NOT NULL REFERENCES lessons(id),
    author_id   BIGINT NOT NULL REFERENCES users(id),    -- RN-03: author cannot be null
    title       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE audio_recordings (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lesson_id     BIGINT NOT NULL REFERENCES lessons(id),              -- UC-04: audio is uploaded for a lesson
    uploaded_by   BIGINT NOT NULL REFERENCES users(id),
    file_path     VARCHAR(500) NOT NULL,
    file_format   VARCHAR(10) NOT NULL,                  -- accepted formats: D-01
    size_bytes    BIGINT NOT NULL,
    uploaded_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transcription_jobs (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    audio_recording_id  BIGINT NOT NULL REFERENCES audio_recordings(id),  -- 1:N, retries allowed (D-02)
    status              VARCHAR(20) NOT NULL DEFAULT 'Pending'
                        CHECK (status IN ('Pending', 'Completed', 'Failed')),
    error_message       TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    finished_at         TIMESTAMP
);

CREATE TABLE transcriptions (
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transcription_job_id  BIGINT NOT NULL UNIQUE REFERENCES transcription_jobs(id),  -- only for Completed jobs (RN-05)
    text                  TEXT NOT NULL,
    language              VARCHAR(10) NOT NULL,          -- source of language: D-06
    created_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE note_blocks (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    note_id         BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    position        INT NOT NULL,                        -- block order (RN-09)
    content         TEXT NOT NULL,
    is_highlighted  BOOLEAN NOT NULL DEFAULT FALSE,
    changed_by      BIGINT REFERENCES users(id),
    changed_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (note_id, position)
);

CREATE TABLE note_collaborators (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    note_id     BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    permission  VARCHAR(10) NOT NULL
                CHECK (permission IN ('read', 'comment', 'edit')),
    UNIQUE (note_id, user_id)                            -- same access cannot be granted twice (RN-06)
);

CREATE TABLE comments (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    note_block_id  BIGINT NOT NULL REFERENCES note_blocks(id) ON DELETE CASCADE,  -- D-03
    author_id      BIGINT NOT NULL REFERENCES users(id),
    text           TEXT NOT NULL CHECK (length(trim(text)) > 0),
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),    -- recipient
    note_id     BIGINT REFERENCES notes(id) ON DELETE CASCADE,
    type        VARCHAR(30) NOT NULL,                    -- e.g. TranscriptionCompleted, NoteEdited
    message     VARCHAR(500) NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
