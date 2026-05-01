# Frontend SQL Client

Frontend построен на архитектуре микрофронтендов: `host` + `remote` (`sql-workbench`) + общие пакеты в `packages`

## Дерево frontend

```text
frontend/
  apps/
    host/
    sql-workbench/
  packages/
    api/
    frontend-config/
    types/
```

## Приложения

### apps/host

Host-приложение:
- поднимает основную навигацию и layout
- загружает remote `sql-workbench` через Module Federation
- содержит страницу истории запросов (`History`) и общую тему

Основные файлы:
- `src/layouts/DefaultLayout.vue` — sidebar + контейнер страниц
- `src/pages/WorkbenchPage.vue` — точка монтирования remote
- `src/pages/HistoryPage.vue` — история запросов
- `vite.config.ts` — federation-конфиг host

### apps/sql-workbench

Remote-приложение SQL Workbench:
- редактор SQL
- валидация и выполнение запросов
- таблица результатов
- обзор схемы БД
- локальная история запросов и статус выполнения

Основные файлы:
- `src/app/WorkbenchApp.vue` — корневой контейнер remote
- `src/components/*` — UI-компоненты рабочей области
- `src/stores/*` — состояние Workbench
- `vite.config.ts` — federation-конфиг remote

## Общие пакеты (`packages`)

### packages/api

Клиентский слой API:
- generated gRPC-Web клиент из proto
- transport
- composable-обертки для вызовов backend

### packages/frontend-config

Общая конфигурация frontend:
- чтение и нормализация `VITE_APP_*` переменных
- централизованный экспорт runtime-конфига

### packages/types

Общие TypeScript-типы:
- DTO/модели запросов и ответов
- типы истории, схемы и результатов запросов
- контракты, которые используются в приложениях и API-пакете

## Локальная разработка

Из корня репозитория:

```bash
make frontend-dev
```

## Проверки

```bash
npm run lint
npm run lint:fix
npm run checkTypes

npm run typecheck --workspace=frontend/apps/host
npm run typecheck --workspace=frontend/apps/sql-workbench
npm run typecheck --workspace=frontend/packages/api
npm run typecheck --workspace=frontend/packages/frontend-config
npm run typecheck --workspace=frontend/packages/types

npm run test --workspace=frontend/apps/sql-workbench
npm run test --workspace=frontend/packages/api
```
