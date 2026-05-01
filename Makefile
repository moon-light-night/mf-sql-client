ifneq (,$(wildcard ./.env))
  include .env
  export
endif

APP_DB_HOST_PORT     ?= 5433
SANDBOX_DB_HOST_PORT ?= 5434
MIGRATIONS_DIR       := backend/sql-client/migrations

.PHONY: help install dev up down restart logs \
        frontend-dev frontend-build \
        backend-run backend-test \
        proto-gen \
        db-reset db-migrate-up db-migrate-down

help:
	@echo ""
	@echo "  SQL Client - available commands"
	@echo ""
	@echo "  install          Install all dependencies"
	@echo "  up               Start all services via Docker Compose"
	@echo "  down             Stop all services"
	@echo "  restart          Restart all services"
	@echo "  logs             Show logs of all services"
	@echo ""
	@echo "  frontend-dev     Start frontend dev servers"
	@echo "  frontend-build   Build all frontend applications"
	@echo ""
	@echo "  backend-run      Run go backend locally"
	@echo "  backend-test     Run go backend tests"
	@echo ""
	@echo "  proto-gen        Generate clients from proto contracts"
	@echo ""
	@echo "  db-reset         Reset volume and restart databases"
	@echo "  db-migrate-up    Apply migrations to app DB"
	@echo "  db-migrate-down  Rollback the last migration of app DB"
	@echo ""

install:
	npm install
	go -C backend/sql-client mod download
	go -C backend/sql-client mod verify

up:
	docker compose up -d --build

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d --build

logs:
	docker compose logs -f

frontend-dev:
	@echo "Run remote sql-workbench $(WORKBENCH_PORT)..."
	npm run dev --workspace=frontend/apps/sql-workbench &
	@echo "Run host $(HOST_PORT)..."
	npm run dev --workspace=frontend/apps/host

frontend-build:
	npm run generate --workspace=frontend/packages/api
	npm run typecheck --workspace=frontend/packages/frontend-config --if-present
	npm run typecheck --workspace=frontend/packages/types --if-present
	npm run build --workspace=frontend/apps/sql-workbench
	npm run build --workspace=frontend/apps/host

backend-run:
	cd backend/sql-client && go run ./cmd/server

backend-test:
	cd backend/sql-client && go test ./...

proto-gen:
	@mkdir -p backend/sql-client/gen
	PATH=$$PATH:$$(go env GOPATH)/bin protoc \
	  --proto_path=proto \
	  --go_out=backend/sql-client/gen \
	  --go_opt=paths=source_relative \
	  --go-grpc_out=backend/sql-client/gen \
	  --go-grpc_opt=paths=source_relative,require_unimplemented_servers=false \
	  proto/sqlclient/v1/sql_client.proto
	npm run generate --workspace=frontend/packages/api
	@echo "Done: backend/sql-client/gen/sqlclient/v1/"

db-reset:
	@if [ "$(CONFIRM_RESET)" != "1" ]; then \
	  echo "Database reset without confirmation is forbidden."; \
	  echo "Run: make db-reset CONFIRM_RESET=1"; \
	  exit 1; \
	fi
	docker compose down -v
	docker compose up -d --build postgres-app postgres-sandbox
	@echo "Waiting for databases to be ready..."
	@sleep 5
	@docker compose ps postgres-app postgres-sandbox

db-migrate-up:
	docker run --rm \
	  --network sql-client_sql-client-net \
	  -v "$(PWD)/$(MIGRATIONS_DIR):/migrations" \
	  migrate/migrate \
	  -path /migrations \
	  -database "postgres://$(APP_DB_USER):$(APP_DB_PASSWORD)@postgres-app:5432/$(APP_DB_NAME)?sslmode=disable" \
	  up

db-migrate-down:
	docker run --rm \
	  --network sql-client_sql-client-net \
	  -v "$(PWD)/$(MIGRATIONS_DIR):/migrations" \
	  migrate/migrate \
	  -path /migrations \
	  -database "postgres://$(APP_DB_USER):$(APP_DB_PASSWORD)@postgres-app:5432/$(APP_DB_NAME)?sslmode=disable" \
	  down 1
