package grpc

import (
	"context"

	sqlclientv1 "github.com/sql-client/sql-api/gen/sqlclient/v1"
	"github.com/sql-client/sql-api/internal/history"
)

func (h *Handler) ListQueryHistory(ctx context.Context, req *sqlclientv1.ListQueryHistoryRequest) (*sqlclientv1.ListQueryHistoryResponse, error) {
	limit := int(req.GetLimit())
	offset := int(req.GetOffset())

	entries, total, err := history.List(ctx, h.appDB, limit, offset)
	if err != nil {
		return nil, internalError("history query failed", err)
	}

	return &sqlclientv1.ListQueryHistoryResponse{
		Entries: protoHistoryEntries(entries),
		Total:   int32(total),
	}, nil
}