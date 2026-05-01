package grpc

import (
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	sqlclientv1 "github.com/sql-client/sql-api/gen/sqlclient/v1"
	"github.com/sql-client/sql-api/internal/history"
	"github.com/sql-client/sql-api/internal/sqlexecutor"
)

func internalError(operation string, err error) error {
	return status.Errorf(codes.Internal, "%s: %s", operation, err.Error())
}

func newHistoryEntry(sql string, result *sqlexecutor.Result, execErr error) history.Entry {
	entry := history.Entry{
		SQL:     sql,
		Success: execErr == nil,
	}

	if execErr != nil {
		entry.Error = execErr.Error()
		return entry
	}

	entry.RowsCount = result.RowsCount
	entry.DurationMS = result.DurationMS
	return entry
}

func protoColumns(columns []sqlexecutor.Column) []*sqlclientv1.Column {
	pbCols := make([]*sqlclientv1.Column, len(columns))
	for i, col := range columns {
		pbCols[i] = &sqlclientv1.Column{
			Name:     col.Name,
			DataType: col.DataType,
		}
	}

	return pbCols
}

func protoRows(rows [][]string) []*sqlclientv1.Row {
	pbRows := make([]*sqlclientv1.Row, len(rows))
	for i, row := range rows {
		pbRows[i] = &sqlclientv1.Row{Values: row}
	}

	return pbRows
}

func protoHistoryEntries(entries []history.Entry) []*sqlclientv1.HistoryEntry {
	pbEntries := make([]*sqlclientv1.HistoryEntry, len(entries))
	for i, e := range entries {
		pbEntries[i] = &sqlclientv1.HistoryEntry{
			Id:         e.ID,
			Sql:        e.SQL,
			Success:    e.Success,
			Error:      e.Error,
			RowsCount:  int32(e.RowsCount),
			DurationMs: e.DurationMS,
			ExecutedAt: e.ExecutedAt.UTC().Format("2006-01-02T15:04:05Z07:00"),
		}
	}

	return pbEntries
}
