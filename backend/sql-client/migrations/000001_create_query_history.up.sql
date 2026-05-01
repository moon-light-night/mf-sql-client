CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS query_history (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    sql          TEXT        NOT NULL,
    success      BOOLEAN     NOT NULL DEFAULT false,
    error        TEXT,
    rows_count   INTEGER     NOT NULL DEFAULT 0,
    duration_ms  BIGINT      NOT NULL DEFAULT 0,
    executed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_query_history_executed_at
    ON query_history (executed_at DESC);

CREATE TABLE IF NOT EXISTS saved_queries (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT        NOT NULL,
    sql        TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
