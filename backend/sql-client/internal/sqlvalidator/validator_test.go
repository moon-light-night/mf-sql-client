package sqlvalidator

import "testing"

func TestValidate(t *testing.T) {
	cases := []struct {
		name    string
		sql     string
		wantErr bool
	}{
		{"valid select", "SELECT * FROM customers", false},
		{"valid select with limit", "SELECT id, name FROM products LIMIT 10", false},
		{"empty query", "", true},
		{"insert rejected", "INSERT INTO customers VALUES (1)", true},
		{"drop rejected", "DROP TABLE customers", true},
		{"delete rejected", "DELETE FROM customers", true},
		{"update rejected", "UPDATE customers SET name='x'", true},
		{"alter rejected", "ALTER TABLE customers ADD COLUMN age int", true},
		{"multiple statements", "SELECT 1; SELECT 2", true},
		{"non-select", "SHOW TABLES", true},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			err := Validate(c.sql)
			if c.wantErr && err == nil {
				t.Errorf("expected error, got nil")
			}
			if !c.wantErr && err != nil {
				t.Errorf("unexpected error: %v", err)
			}
		})
	}
}
