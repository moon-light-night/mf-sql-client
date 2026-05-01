package grpc

import (
	"context"
	"log"

	"google.golang.org/grpc/status"
	"google.golang.org/grpc/codes"

	sqlclientv1 "github.com/sql-client/sql-api/gen/sqlclient/v1"
	"github.com/sql-client/sql-api/internal/history"
	"github.com/sql-client/sql-api/internal/sqlexecutor"
	"github.com/sql-client/sql-api/internal/sqlvalidator"
)

func (h *Handler) ExecuteQuery(ctx context.Context, req *sqlclientv1.ExecuteQueryRequest) (*sqlclientv1.ExecuteQueryResponse, error) {
	sql := req.GetSql()

	if err := sqlvalidator.Validate(sql); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validation failed: %s", err.Error())
	}

	result, execErr := sqlexecutor.Execute(ctx, h.sandboxDB, sql, h.timeoutMS, h.maxRows)
	entry := newHistoryEntry(sql, result, execErr)
	if saveErr := history.Save(ctx, h.appDB, entry); saveErr != nil {
		log.Printf("failed to save history: %v", saveErr)
	}

	if execErr != nil {
		return nil, internalError("execution failed", execErr)
	}

	return &sqlclientv1.ExecuteQueryResponse{
		Columns:    protoColumns(result.Columns),
		Rows:       protoRows(result.Rows),
		RowsCount:  int32(result.RowsCount),
		DurationMs: result.DurationMS,
	}, nil
}