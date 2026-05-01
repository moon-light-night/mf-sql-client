package grpc

import (
	"github.com/jackc/pgx/v5/pgxpool"

	sqlclientv1 "github.com/sql-client/sql-api/gen/sqlclient/v1"
)

type Handler struct {
	sqlclientv1.SqlClientServiceServer
	appDB     *pgxpool.Pool
	sandboxDB *pgxpool.Pool
	timeoutMS int64
	maxRows   int
}

func NewHandler(appDB, sandboxDB *pgxpool.Pool, timeoutMS int64, maxRows int) *Handler {
	return &Handler{
		appDB:     appDB,
		sandboxDB: sandboxDB,
		timeoutMS: timeoutMS,
		maxRows:   maxRows,
	}
}
