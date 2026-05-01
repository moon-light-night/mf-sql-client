package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	AppDBDSN    string
	SandboxDBDSN string
	GRPCPort    int
	QueryTimeoutMS int64
	MaxRows     int
}

func Load() (*Config, error) {
	cfg := &Config{
		AppDBDSN:       requireEnv("APP_DB_DSN"),
		SandboxDBDSN:   requireEnv("SANDBOX_DB_DSN"),
		GRPCPort:       9090,
		QueryTimeoutMS: 5000,
		MaxRows:        500,
	}

	if port := os.Getenv("GRPC_PORT"); port != "" {
		p, err := strconv.Atoi(port)
		if err != nil {
			return nil, fmt.Errorf("invalid GRPC_PORT: %w", err)
		}
		cfg.GRPCPort = p
	}

	if ms := os.Getenv("QUERY_TIMEOUT_MS"); ms != "" {
		t, err := strconv.ParseInt(ms, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid QUERY_TIMEOUT_MS: %w", err)
		}
		cfg.QueryTimeoutMS = t
	}

	if rows := os.Getenv("MAX_ROWS"); rows != "" {
		r, err := strconv.Atoi(rows)
		if err != nil {
			return nil, fmt.Errorf("invalid MAX_ROWS: %w", err)
		}
		cfg.MaxRows = r
	}

	return cfg, nil
}

func requireEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		return ""
	}
	return v
}
