PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY,
    application_type TEXT NOT NULL
        CHECK (application_type IN ('competitor', 'tribune')),
    first_name TEXT NOT NULL
        CHECK (length(trim(first_name)) BETWEEN 2 AND 80),
    last_name TEXT NOT NULL
        CHECK (length(trim(last_name)) BETWEEN 2 AND 80),
    email TEXT NOT NULL
        CHECK (email LIKE '%_@_%._%'),
    phone TEXT NOT NULL
        CHECK (length(trim(phone)) BETWEEN 10 AND 20),
    institution TEXT,
    department TEXT,
    team_name TEXT,
    consent INTEGER NOT NULL
        CHECK (consent IN (0, 1)),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_type_status
    ON applications (application_type, status);

CREATE INDEX IF NOT EXISTS idx_applications_email
    ON applications (email);
