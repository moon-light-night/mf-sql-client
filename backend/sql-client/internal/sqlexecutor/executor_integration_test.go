package sqlexecutor

import (
	"context"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func integrationEnabled() bool {
	return os.Getenv("INTEGRATION_DB") == "1"
}

func sandboxDSN() string {
	if dsn := os.Getenv("SANDBOX_DB_DSN"); dsn != "" {
		return dsn
	}
	return "postgres://sandbox_user:sandbox_secret@localhost:5434/sqlclient_sandbox?sslmode=disable"
}

func appDSN() string {
	if dsn := os.Getenv("APP_DB_DSN"); dsn != "" {
		return dsn
	}
	return "postgres://sqlclient:sqlclient_secret@localhost:5433/sqlclient_app?sslmode=disable"
}

func openPool(t *testing.T, dsn string) *pgxpool.Pool {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		t.Fatalf("open pool: %v", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		t.Fatalf("ping pool: %v", err)
	}
	return pool
}

func TestExecute_Integration(t *testing.T) {
	if !integrationEnabled() {
		t.Skip("set INTEGRATION_DB=1 to run integration tests")
	}

	t.Run("executes valid SELECT against sandbox DB", func(t *testing.T) {
		pool := openPool(t, sandboxDSN())
		defer pool.Close()

		res, err := Execute(context.Background(), pool, "SELECT id, name FROM customers ORDER BY id LIMIT 2", 5000, 500)
		if err != nil {
			t.Fatalf("execute failed: %v", err)
		}
		if len(res.Columns) != 2 {
			t.Fatalf("expected 2 columns, got %d", len(res.Columns))
		}
		if res.RowsCount == 0 {
			t.Fatalf("expected non-empty rows")
		}
	})

	t.Run("does not execute sandbox query against app DB", func(t *testing.T) {
		pool := openPool(t, appDSN())
		defer pool.Close()

		_, err := Execute(context.Background(), pool, "SELECT * FROM customers", 5000, 500)
		if err == nil {
			t.Fatalf("expected error querying sandbox table from app db")
		}
	})

	t.Run("respects timeout", func(t *testing.T) {
		pool := openPool(t, sandboxDSN())
		defer pool.Close()

		_, err := Execute(context.Background(), pool, "SELECT pg_sleep(1)", 100, 500)
		if err == nil {
			t.Fatalf("expected timeout error")
		}
	})

	t.Run("limits result size", func(t *testing.T) {
		pool := openPool(t, sandboxDSN())
		defer pool.Close()

		res, err := Execute(context.Background(), pool, "SELECT generate_series(1,100)", 5000, 10)
		if err != nil {
			t.Fatalf("execute failed: %v", err)
		}
		if res.RowsCount != 10 {
			t.Fatalf("expected 10 rows, got %d", res.RowsCount)
		}
	})

	t.Run("handles SQL errors", func(t *testing.T) {
		pool := openPool(t, sandboxDSN())
		defer pool.Close()

		_, err := Execute(context.Background(), pool, "SELECT * FROM definitely_missing_table", 5000, 500)
		if err == nil {
			t.Fatalf("expected sql error")
		}
		if !strings.Contains(strings.ToLower(err.Error()), "error") {
			t.Fatalf("unexpected error text: %v", err)
		}
	})
}
