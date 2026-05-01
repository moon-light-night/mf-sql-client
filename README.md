# SQL Client

SQL Client для безопасного выполнения пользовательских SQL-запросов

## Технологии

- Frontend: Vue 3 + Vite + TypeScript + Pinia + Tailwind + PrimeVue
- Микрофронтенды: Module Federation
- Backend: Go + gRPC
- Прокси: Envoy (gRPC-Web)
- БД:
  - `sqlclient_app` — метаданные приложения и история запросов
  - `sqlclient_sandbox` — песочница для пользовательских SQL-запросов

## Структура репозитория

```text
sql-client/
  backend/
    migrations/
      init-db/
    sql-client/
      cmd/server/
      gen/
      internal/
      migrations/
  frontend/
    apps/
      host/
      sql-workbench/
    packages/
      api/
      frontend-config/
      types/
  infra/
    envoy/
  docs/
    README.md
    c4-context.md
    c4-container.md
    erd.md
    sequence-diagrams.md
  proto/
  docker-compose.yml
  Makefile
```

## Архитектурная документация

- Общий индекс документации: [docs/README.md](docs/README.md)
- C4 Context: [docs/c4-context.md](docs/c4-context.md)
- C4 Container: [docs/c4-container.md](docs/c4-container.md)
- ERD баз данных: [docs/erd.md](docs/erd.md)
- Sequence diagrams: [docs/sequence-diagrams.md](docs/sequence-diagrams.md)

## Быстрый старт

1. Подготовить переменные окружения:

```bash
cp .env.example .env
```

2. Установить зависимости:

```bash
make install
```

3. Запустить весь стек:

```bash
make up
```

4. Открыть сервис в браузере:

- Host UI: http://localhost:5173

Остановка:

```bash
make down
```

## Основные команды Make

- `make install` — установка npm/go зависимостей
- `make up` — запуск всех сервисов Docker Compose
- `make down` — остановка сервисов
- `make restart` — перезапуск сервисов
- `make logs` — просмотр логов
- `make frontend-dev` — локальный запуск frontend dev-серверов
- `make frontend-build` — сборка frontend-приложений
- `make backend-run` — запуск go-бекенда локально
- `make backend-test` — запуск тестов go-бекенда
- `make proto-gen` — генерация go/TS кода из proto
- `make db-reset CONFIRM_RESET=1` — полный сброс БД
- `make db-migrate-up` — применение миграций app DB
- `make db-migrate-down` — откат последней миграции app DB

## Module Federation

- `host` (порт `5173`) подключает remote `sql-workbench` (порт `5174`)
- Точка входа remote: `http://localhost:5174/assets/remoteEntry.js`
- В Docker remote собирается и запускается через `preview`, host работает в dev-режиме

## Базы данных

- `app DB` (`sqlclient_app`) хранит историю запросов (`query_history`)
- `sandbox DB` (`sqlclient_sandbox`) содержит demo-таблицы (`customers`, `products`, `orders`, `order_items`, `payments`)
- Пользовательские SQL-запросы выполняются только в sandbox DB

## Генерация Proto

```bash
make proto-gen
```

Результат:
- go: `backend/sql-client/gen/sqlclient/v1/*`
- TypeScript: `frontend/packages/api/src/gen/sqlclient/v1/*`
