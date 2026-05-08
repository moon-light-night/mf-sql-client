# SQL Client

SQL Client для безопасного выполнения пользовательских SQL-запросов

## Архитектура

| Сервис       | Технология                                                         |
|--------------|--------------------------------------------------------------------|
| Frontend     | Vue 3 + Vite + TypeScript + Pinia + Tailwind + PrimeVue, Module Federation |
| API          | Go, gRPC                  |
| Database     | Postgres 16                                                        |
| Gateway      | Envoy 1.31.2                                                       |

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

## Переменные окружения

| Категория | Переменная | Значение | Описание |
|-----------|------------|----------|----------|
| **Ports** | `HOST_PORT` | `5173` | Порт для хоста |
| | `WORKBENCH_PORT` | `5174` | Порт для workbench |
| | `ENVOY_PORT` | `8080` | Порт Envoy прокси |
| | `GRPC_PORT` | `9090` | Порт gRPC |
| **App database** | `APP_DB_HOST` | `postgres-app` | Хост БД |
| | `APP_DB_PORT` | `5432` | Порт БД (внутренний) |
| | `APP_DB_HOST_PORT` | `5433` | Порт БД (внешний) |
| | `APP_DB_NAME` | `sqlclient_app` | Имя БД |
| | `APP_DB_USER` | `sqlclient` | Пользователь БД |
| | `APP_DB_PASSWORD` | `change_me` | Пароль БД |
| | `APP_DB_DSN` | `postgres://sqlclient:change_me@postgres-app:5432/sqlclient_app?sslmode=disable` | DSN для подключения |
| **Sandbox database** | `SANDBOX_DB_HOST` | `postgres-sandbox` | Хост sandbox БД |
| | `SANDBOX_DB_PORT` | `5432` | Порт sandbox БД (внутренний) |
| | `SANDBOX_DB_HOST_PORT` | `5434` | Порт sandbox БД (внешний) |
| | `SANDBOX_DB_NAME` | `sqlclient_sandbox` | Имя sandbox БД |
| | `SANDBOX_DB_USER` | `sandbox_user` | Пользователь sandbox БД |
| | `SANDBOX_DB_PASSWORD` | `change_me` | Пароль sandbox БД |
| | `SANDBOX_DB_DSN` | `postgres://sandbox_user:change_me@postgres-sandbox:5432/sqlclient_sandbox?sslmode=disable` | DSN для подключения |
| **SQL execution limits** | `QUERY_TIMEOUT_MS` | `5000` | Таймаут выполнения запроса (мс) |
| | `MAX_ROWS` | `500` | Максимальное количество строк команды для выполнения |
| **Frontend** | `VITE_APP_API_URL` | `http://localhost:8080` | URL API для фронтенда |
| | `VITE_APP_GRPC_WEB_BASE_URL` | `http://localhost:8080` | Base URL для gRPC-web |
| | `VITE_APP_TITLE` | `SQL Client` | Заголовок приложения |

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
