# ERD — SQL Client Databases

ERD для двух баз данных проекта `SQL Client`: `app DB` и `sandbox DB`

## Общая диаграмма

```mermaid
erDiagram
    QUERY_HISTORY {
        UUID id PK
        TEXT sql
        BOOLEAN success
        TEXT error
        INTEGER rows_count
        BIGINT duration_ms
        TIMESTAMPTZ executed_at
    }

    SAVED_QUERIES {
        UUID id PK
        TEXT name
        TEXT sql
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    CUSTOMERS {
        SERIAL id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR city
        TIMESTAMPTZ created_at
    }

    PRODUCTS {
        SERIAL id PK
        VARCHAR name
        VARCHAR category
        NUMERIC price
        INTEGER stock_quantity
        TIMESTAMPTZ created_at
    }

    ORDERS {
        SERIAL id PK
        INTEGER customer_id FK
        VARCHAR status
        NUMERIC total_amount
        TIMESTAMPTZ created_at
    }

    ORDER_ITEMS {
        SERIAL id PK
        INTEGER order_id FK
        INTEGER product_id FK
        INTEGER quantity
        NUMERIC unit_price
        NUMERIC total_price
    }

    PAYMENTS {
        SERIAL id PK
        INTEGER order_id FK
        NUMERIC amount
        VARCHAR method
        VARCHAR status
        TIMESTAMPTZ paid_at
    }

    CUSTOMERS ||--o{ ORDERS : places
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : referenced_by
    ORDERS ||--o{ PAYMENTS : paid_by
```

## App DB

Используется для метаданных приложения

### Таблицы

#### `query_history`
- `id` — PK, `UUID`
- `sql` — текст выполненного запроса
- `success` — флаг успешного выполнения
- `error` — текст ошибки
- `rows_count` — количество строк в результате
- `duration_ms` — длительность выполнения
- `executed_at` — время выполнения

Дополнительно:
- индекс `idx_query_history_executed_at` по `executed_at DESC`

#### `saved_queries`
- `id` — PK, `UUID`
- `name` — имя сохранённого запроса
- `sql` — текст запроса
- `created_at` — дата создания
- `updated_at` — дата обновления

Связей между таблицами `app DB` нет

## Sandbox DB

Используется для пользовательских SQL-запросов и demo-данных

### Связи

- `customers 1:N orders`
- `orders 1:N order_items`
- `products 1:N order_items`
- `orders 1:N payments`

### Таблицы

#### `customers`
- `id` — PK
- `name`
- `email` — уникальное поле
- `city`
- `created_at`

#### `products`
- `id` — PK
- `name`
- `category`
- `price`
- `stock_quantity`
- `created_at`

#### `orders`
- `id` — PK
- `customer_id` — FK → `customers.id`
- `status`
- `total_amount`
- `created_at`

#### `order_items`
- `id` — PK
- `order_id` — FK → `orders.id`
- `product_id` — FK → `products.id`
- `quantity`
- `unit_price`
- `total_price`

#### `payments`
- `id` — PK
- `order_id` — FK → `orders.id`
- `amount`
- `method`
- `status`
- `paid_at`

## Особенности

`App DB` и `Sandbox DB` логически и физически разделены. Прямых FK-связей между этими БД нет
