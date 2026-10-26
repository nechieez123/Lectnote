-- Lectnote: initial data (runs once, after schema.sql, on an empty database)
INSERT INTO study_groups (name) VALUES ('ИДБ-24-05') ON CONFLICT DO NOTHING;
