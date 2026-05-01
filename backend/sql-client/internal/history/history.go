package history

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Entry struct {
	ID          string
	SQL         string
	Success     bool
	Error       string
	RowsCount   int
	DurationMS  int64
	ExecutedAt  time.Time
}

func Save(ctx context.Context, pool *pgxpool.Pool, e Entry) error {
	_, err := pool.Exec(ctx,
		`INSERT INTO query_history (sql, success, error, rows_count, duration_ms)
		 VALUES ($1, $2, $3, $4, $5)`,
		e.SQL, e.Success, e.Error, e.RowsCount, e.DurationMS,
	)
	if err != nil {
		return fmt.Errorf("insert query_history: %w", err)
	}
	return nil
}

func List(ctx context.Context, pool *pgxpool.Pool, limit, offset int) ([]Entry, int, error) {
	if limit <= 0 {
		limit = 50
	}

	rows, err := pool.Query(ctx,
		`SELECT id, sql, success, COALESCE(error, ''), rows_count, duration_ms, executed_at
		 FROM query_history
		 ORDER BY executed_at DESC
		 LIMIT $1 OFFSET $2`,
		limit, offset,
	)
	if err != nil {
		return nil, 0, fmt.Errorf("query history: %w", err)
	}
	defer rows.Close()

	var entries []Entry
	for rows.Next() {
		var e Entry
		if err := rows.Scan(
			&e.ID, &e.SQL, &e.Success, &e.Error,
			&e.RowsCount, &e.DurationMS, &e.ExecutedAt,
		); err != nil {
			return nil, 0, fmt.Errorf("scan history row: %w", err)
		}
		entries = append(entries, e)
	}

	var total int
	if err := pool.QueryRow(ctx, `SELECT COUNT(*) FROM query_history`).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("count history: %w", err)
	}

	return entries, total, nil
}
