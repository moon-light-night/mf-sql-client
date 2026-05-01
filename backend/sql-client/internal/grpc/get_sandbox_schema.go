package grpc

import (
	"context"

	sqlclientv1 "github.com/sql-client/sql-api/gen/sqlclient/v1"
)

func (h *Handler) GetSandboxSchema(ctx context.Context, _ *sqlclientv1.GetSandboxSchemaRequest) (*sqlclientv1.GetSandboxSchemaResponse, error) {
	rows, err := h.sandboxDB.Query(ctx,
		`SELECT table_name, column_name, data_type
		 FROM information_schema.columns
		 WHERE table_schema = 'public'
		 ORDER BY table_name, ordinal_position`,
	)
	if err != nil {
		return nil, internalError("schema query failed", err)
	}
	defer rows.Close()

	tableMap := make(map[string]*sqlclientv1.TableInfo)
	tableOrder := []string{}

	for rows.Next() {
		var tableName, colName, dataType string
		if err := rows.Scan(&tableName, &colName, &dataType); err != nil {
			return nil, internalError("scan schema row", err)
		}
		if _, exists := tableMap[tableName]; !exists {
			tableMap[tableName] = &sqlclientv1.TableInfo{TableName: tableName}
			tableOrder = append(tableOrder, tableName)
		}
		tableMap[tableName].Columns = append(tableMap[tableName].Columns, &sqlclientv1.Column{
			Name:     colName,
			DataType: dataType,
		})
	}

	tables := make([]*sqlclientv1.TableInfo, 0, len(tableOrder))
	for _, name := range tableOrder {
		tables = append(tables, tableMap[name])
	}

	return &sqlclientv1.GetSandboxSchemaResponse{Tables: tables}, nil
}