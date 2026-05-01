# C4 Container — SQL Client

Container-level схема системы `SQL Client`

```mermaid
C4Container
title SQL Client — C4 Container Diagram

Person(user, "Пользователь", "Запускает SQL-запросы и просматривает историю выполнения")

System_Boundary(sql_client, "SQL Client") {
	Container(host, "Host UI", "Vue 3 + Vite + TypeScript", "Основной shell интерфейса: роутинг, layout, history page, загрузка remote-модуля")
	Container(workbench, "SQL Workbench UI", "Vue 3 + TypeScript + Pinia + Tailwind + PrimeVue", "Редактор SQL, запуск и валидация запросов, просмотр схемы sandbox БД и результатов")
	Container(envoy, "Envoy", "Envoy Proxy + gRPC-Web", "Принимает HTTP/gRPC-Web запросы из браузера и проксирует их в backend по gRPC")
	Container(backend, "SQL API", "Go + gRPC", "Валидирует SQL, выполняет запросы в sandbox БД, возвращает схему БД и сохраняет историю")
	ContainerDb(app_db, "App DB", "PostgreSQL 16", "Хранит метаданные приложения и таблицу query_history")
	ContainerDb(sandbox_db, "Sandbox DB", "PostgreSQL 16", "Изолированная demo-БД, в которой выполняются пользовательские SQL-запросы")
}

Rel(user, host, "Открывает и использует веб-интерфейс", "HTTP/Browser")
Rel(host, workbench, "Загружает remote-приложение", "Module Federation / HTTP")
Rel(host, envoy, "Запрашивает историю запросов", "gRPC-Web / HTTP")
Rel(workbench, envoy, "Валидирует и выполняет SQL, получает схему sandbox БД, обновляет историю", "gRPC-Web / HTTP")
Rel(envoy, backend, "Проксирует браузерные вызовы", "gRPC / HTTP2")
Rel(backend, app_db, "Читает и записывает историю запросов", "SQL / TCP")
Rel(backend, sandbox_db, "Выполняет и анализирует пользовательские SQL-запросы", "SQL / TCP")
```

## Контейнеры

- **Host UI** — контейнер-оболочка, который поднимает основной интерфейс и подключает remote `sql-workbench` через Module Federation
- **SQL Workbench UI** — основной рабочий экран для SQL editor, schema explorer, результатов выполнения и части сценариев работы с историей
- **Envoy** — слой совместимости для браузера, конвертирующий `gRPC-Web` в обычный `gRPC` backend-сервиса
- **SQL API** — backend на Go, который реализует методы `ValidateQuery`, `ExecuteQuery`, `GetSandboxSchema` и `ListQueryHistory`
- **App DB** — отдельная PostgreSQL БД для истории и служебных данных приложения
- **Sandbox DB** — отдельная PostgreSQL БД с demo-данными, куда направляются пользовательские SQL-запросы

## Основной сценарий взаимодействия

1. Пользователь открывает `Host UI`
2. `Host UI` загружает remote `SQL Workbench UI`
3. UI вызывает backend через `Envoy` по `gRPC-Web`
4. `SQL API` валидирует и исполняет SQL только в `Sandbox DB`
5. Результаты и метаданные выполнения возвращаются в UI
6. История выполнения сохраняется в `App DB`
