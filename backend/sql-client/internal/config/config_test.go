package config

import (
	"os"
	"testing"
)

func TestLoad_WithDefaultsAndRequiredDSN(t *testing.T) {
	t.Setenv("APP_DB_DSN", "postgres://app")
	t.Setenv("SANDBOX_DB_DSN", "postgres://sandbox")
	t.Setenv("GRPC_PORT", "")
	t.Setenv("QUERY_TIMEOUT_MS", "")
	t.Setenv("MAX_ROWS", "")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if cfg.AppDBDSN != "postgres://app" {
		t.Fatalf("unexpected app dsn: %s", cfg.AppDBDSN)
	}
	if cfg.SandboxDBDSN != "postgres://sandbox" {
		t.Fatalf("unexpected sandbox dsn: %s", cfg.SandboxDBDSN)
	}
	if cfg.GRPCPort != 9090 {
		t.Fatalf("expected default grpc port 9090, got %d", cfg.GRPCPort)
	}
	if cfg.QueryTimeoutMS != 5000 {
		t.Fatalf("expected default timeout 5000, got %d", cfg.QueryTimeoutMS)
	}
	if cfg.MaxRows != 500 {
		t.Fatalf("expected default max rows 500, got %d", cfg.MaxRows)
	}
}

func TestLoad_WithCustomValues(t *testing.T) {
	t.Setenv("APP_DB_DSN", "postgres://app")
	t.Setenv("SANDBOX_DB_DSN", "postgres://sandbox")
	t.Setenv("GRPC_PORT", "12345")
	t.Setenv("QUERY_TIMEOUT_MS", "1200")
	t.Setenv("MAX_ROWS", "100")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if cfg.GRPCPort != 12345 || cfg.QueryTimeoutMS != 1200 || cfg.MaxRows != 100 {
		t.Fatalf("unexpected parsed values: %+v", cfg)
	}
}

func TestLoad_InvalidNumericEnv(t *testing.T) {
	t.Setenv("APP_DB_DSN", "postgres://app")
	t.Setenv("SANDBOX_DB_DSN", "postgres://sandbox")

	t.Setenv("GRPC_PORT", "bad")
	if _, err := Load(); err == nil {
		t.Fatalf("expected error for invalid GRPC_PORT")
	}

	t.Setenv("GRPC_PORT", "9090")
	t.Setenv("QUERY_TIMEOUT_MS", "bad")
	if _, err := Load(); err == nil {
		t.Fatalf("expected error for invalid QUERY_TIMEOUT_MS")
	}

	t.Setenv("QUERY_TIMEOUT_MS", "5000")
	t.Setenv("MAX_ROWS", "bad")
	if _, err := Load(); err == nil {
		t.Fatalf("expected error for invalid MAX_ROWS")
	}
}

func TestRequireEnv_EmptyValue(t *testing.T) {
	_ = os.Unsetenv("SOME_KEY")
	if v := requireEnv("SOME_KEY"); v != "" {
		t.Fatalf("expected empty string, got %q", v)
	}
}
