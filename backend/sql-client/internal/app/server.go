package app

import (
	"context"
	"fmt"

	grpchandler "github.com/sql-client/sql-api/internal/grpc"
	"github.com/sql-client/sql-api/internal/config"
	"github.com/sql-client/sql-api/internal/postgres"
	sqlclientv1 "github.com/sql-client/sql-api/gen/sqlclient/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func NewServer(cfg *config.Config) (*grpc.Server, error) {
	ctx := context.Background()

	appDB, err := postgres.Connect(ctx, cfg.AppDBDSN)
	if err != nil {
		return nil, fmt.Errorf("connect app DB: %w", err)
	}

	sandboxDB, err := postgres.Connect(ctx, cfg.SandboxDBDSN)
	if err != nil {
		return nil, fmt.Errorf("connect sandbox DB: %w", err)
	}

	handler := grpchandler.NewHandler(appDB, sandboxDB, cfg.QueryTimeoutMS, cfg.MaxRows)

	srv := grpc.NewServer()

	sqlclientv1.RegisterSqlClientServiceServer(srv, handler)

	reflection.Register(srv)

	return srv, nil
}
