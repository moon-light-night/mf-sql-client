package sqlexecutor

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Column struct {
	Name     string
	DataType string
}

type Result struct {
	Columns    []Column
	Rows       [][]string
	RowsCount  int
	DurationMS int64
}

func Execute(ctx context.Context, pool *pgxpool.Pool, sql string, timeoutMS int64, maxRows int) (*Result, error) {
	start := time.Now()

	timeoutDur := time.Duration(timeoutMS) * time.Millisecond
	ctx, cancel := context.WithTimeout(ctx, timeoutDur)
	defer cancel()

	conn, err := pool.Acquire(ctx)
	if err != nil {
		return nil, fmt.Errorf("acquire connection: %w", err)
	}
	defer conn.Release()

	tx, err := conn.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin transaction: %w", err)
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	if _, err := tx.Exec(ctx, "SET TRANSACTION READ ONLY"); err != nil {
		return nil, fmt.Errorf("set read only: %w", err)
	}

	if _, err := tx.Exec(ctx, fmt.Sprintf("SET LOCAL statement_timeout = %d", timeoutMS)); err != nil {
		return nil, fmt.Errorf("set statement_timeout: %w", err)
	}

	rows, err := tx.Query(ctx, sql)
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}
	defer rows.Close()

	fields := rows.FieldDescriptions()
	cols := make([]Column, len(fields))
	for i, f := range fields {
		cols[i] = Column{
			Name:     string(f.Name),
			DataType: oidTypeName(f.DataTypeOID),
		}
	}

	var resultRows [][]string
	for rows.Next() {
		if len(resultRows) >= maxRows {
			break
		}
		vals, err := rows.Values()
		if err != nil {
			return nil, fmt.Errorf("read row: %w", err)
		}
		strRow := make([]string, len(vals))
		for i, v := range vals {
			if v == nil {
				strRow[i] = ""
			} else {
				strRow[i] = fmt.Sprintf("%v", v)
			}
		}
		resultRows = append(resultRows, strRow)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return &Result{
		Columns:    cols,
		Rows:       resultRows,
		RowsCount:  len(resultRows),
		DurationMS: time.Since(start).Milliseconds(),
	}, nil
}

func oidTypeName(oid uint32) string {
	switch oid {
	case 16:
		return "boolean"
	case 20:
		return "bigint"
	case 21:
		return "smallint"
	case 23:
		return "integer"
	case 25:
		return "text"
	case 700:
		return "real"
	case 701:
		return "double precision"
	case 1043:
		return "varchar"
	case 1082:
		return "date"
	case 1114:
		return "timestamp"
	case 1184:
		return "timestamptz"
	case 1700:
		return "numeric"
	case 2950:
		return "uuid"
	default:
		return fmt.Sprintf("oid:%d", oid)
	}
}
