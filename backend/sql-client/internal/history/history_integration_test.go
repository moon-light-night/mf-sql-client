package history

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func integrationEnabled() bool {
	return os.Getenv("INTEGRATION_DB") == "1"
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

func TestSaveAndList_Integration(t *testing.T) {
	if !integrationEnabled() {
		t.Skip("set INTEGRATION_DB=1 to run integration tests")
	}

	pool := openPool(t, appDSN())
	defer pool.Close()

	ctx := context.Background()
	err := Save(ctx, pool, Entry{
		SQL:        "SELECT 1",
		Success:    true,
		Error:      "",
		RowsCount:  1,
		DurationMS: 2,
	})
	if err != nil {
		t.Fatalf("save failed: %v", err)
	}

	entries, total, err := List(ctx, pool, 10, 0)
	if err != nil {
		t.Fatalf("list failed: %v", err)
	}
	if total < 1 {
		t.Fatalf("expected total >= 1, got %d", total)
	}
	if len(entries) == 0 {
		t.Fatalf("expected at least one history entry")
	}
}
