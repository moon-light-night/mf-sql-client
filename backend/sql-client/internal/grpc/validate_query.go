package grpc

import (
	"context"

	sqlclientv1 "github.com/sql-client/sql-api/gen/sqlclient/v1"
	"github.com/sql-client/sql-api/internal/sqlvalidator"
)

func (h *Handler) ValidateQuery(_ context.Context, req *sqlclientv1.ValidateQueryRequest) (*sqlclientv1.ValidateQueryResponse, error) {
	if err := sqlvalidator.Validate(req.GetSql()); err != nil {
		return &sqlclientv1.ValidateQueryResponse{
			Valid:   false,
			Message: err.Error(),
		}, nil
	}

	return &sqlclientv1.ValidateQueryResponse{Valid: true}, nil
}