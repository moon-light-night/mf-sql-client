package sqlvalidator

import (
	"fmt"
	"regexp"
	"strings"
)

var blockedKeywords = []string{
	"DROP", "DELETE", "UPDATE", "INSERT", "ALTER",
	"TRUNCATE", "CREATE", "GRANT", "REVOKE", "COPY",
}

var semicolonRe = regexp.MustCompile(`;\s*\S`)

func Validate(sql string) error {
	trimmed := strings.TrimSpace(sql)
	if trimmed == "" {
		return fmt.Errorf("query is empty")
	}

	upper := strings.ToUpper(trimmed)

	if !strings.HasPrefix(upper, "SELECT") {
		return fmt.Errorf("only SELECT queries are allowed")
	}

	for _, kw := range blockedKeywords {
		pattern := `\b` + kw + `\b`
		matched, _ := regexp.MatchString(pattern, upper)
		if matched {
			return fmt.Errorf("query contains forbidden keyword: %s", kw)
		}
	}

	withoutTrailingSemicolon := strings.TrimRight(trimmed, " \t\n;")
	if semicolonRe.MatchString(withoutTrailingSemicolon) {
		return fmt.Errorf("multiple statements are not allowed")
	}

	return nil
}
