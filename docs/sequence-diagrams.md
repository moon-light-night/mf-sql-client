# Sequence Diagrams — SQL Client

Набор sequence-диаграмм для ключевых пользовательских сценариев в `SQL Client`

## 1) Выполнение SQL-запроса (Validate + Execute + Save History)

```mermaid
sequenceDiagram
    autonumber
    actor U as Пользователь
    participant WB as SQL Workbench UI
    participant E as Envoy (gRPC-Web)
    participant API as SQL API (Go gRPC)
    participant SDB as Sandbox DB
    participant ADB as App DB

    U->>WB: Нажимает Run SQL
    WB->>E: ValidateQuery(sql)
    E->>API: gRPC ValidateQuery
    API->>API: sqlvalidator.Validate(sql)

    alt SQL невалидный
        API-->>E: valid=false, message
        E-->>WB: Validation error
        WB-->>U: Показывает ошибку валидации
    else SQL валидный
        API-->>E: valid=true
        E-->>WB: OK

        WB->>E: ExecuteQuery(sql)
        E->>API: gRPC ExecuteQuery
        API->>API: sqlvalidator.Validate(sql)
        API->>SDB: sqlexecutor.Execute(sql)

        alt Ошибка выполнения
            SDB-->>API: error
            API->>ADB: history.Save(failed entry)
            API-->>E: execution failed
            E-->>WB: error
            WB-->>U: Показывает execution error
        else Успешное выполнение
            SDB-->>API: rows, columns, duration
            API->>ADB: history.Save(success entry)
            API-->>E: ExecuteQueryResponse
            E-->>WB: result
            WB-->>U: Показывает таблицу результатов

            WB->>E: ListQueryHistory(limit, offset=0)
            E->>API: gRPC ListQueryHistory
            API->>ADB: history.List(limit, offset)
            ADB-->>API: entries + total
            API-->>E: ListQueryHistoryResponse
            E-->>WB: history page
            WB-->>U: Обновляет панель истории
        end
    end
```

## 2) Загрузка схемы sandbox БД

```mermaid
sequenceDiagram
    autonumber
    actor U as Пользователь
    participant WB as SQL Workbench UI
    participant E as Envoy (gRPC-Web)
    participant API as SQL API (Go gRPC)
    participant SDB as Sandbox DB

    U->>WB: Открывает Schema Explorer
    WB->>WB: loadSchema()

    alt Схема уже в store
        WB-->>U: Использует кэш в памяти
    else Схемы нет
        WB->>E: GetSandboxSchema()
        E->>API: gRPC GetSandboxSchema
        API->>SDB: SELECT information_schema.columns
        SDB-->>API: table_name, column_name, data_type
        API->>API: Группирует по таблицам
        API-->>E: GetSandboxSchemaResponse
        E-->>WB: tables[]
        WB-->>U: Показывает список таблиц и колонок
    end
```

## 3) Просмотр истории запросов (Host History page)

```mermaid
sequenceDiagram
    autonumber
    actor U as Пользователь
    participant H as Host UI (HistoryPage)
    participant E as Envoy (gRPC-Web)
    participant API as SQL API (Go gRPC)
    participant ADB as App DB

    U->>H: Открывает Query History
    H->>H: loadHistory(isInitial=true)
    H->>E: ListQueryHistory(limit, offset=0)
    E->>API: gRPC ListQueryHistory
    API->>ADB: history.List(limit, offset)
    ADB-->>API: entries + total
    API-->>E: ListQueryHistoryResponse
    E-->>H: entries + total
    H-->>U: Показывает первую страницу

    U->>H: Скроллит вниз
    H->>H: offset += pageSize
    H->>E: ListQueryHistory(limit, offset)
    E->>API: gRPC ListQueryHistory
    API->>ADB: history.List(limit, offset)
    ADB-->>API: next entries + total
    API-->>E: ListQueryHistoryResponse
    E-->>H: next entries + total
    H-->>U: Добавляет строки в таблицу
```

## Примечание

Во всех browser-сценариях клиент общается с backend через `Envoy` по `gRPC-Web`; сам backend работает по `gRPC` и обращается к `App DB`/`Sandbox DB` напрямую
