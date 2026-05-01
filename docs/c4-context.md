# C4 Context — SQL Client

Context-level схема системы `SQL Client`

```mermaid
C4Context
title SQL Client — C4 Context Diagram

Person(user, "Пользователь", "Пишет SQL-запросы, запускает их и просматривает историю")

System(sql_client, "SQL Client", "Веб-приложение для безопасного выполнения пользовательских SQL-запросов в sandbox-среде")

System_Ext(app_db, "App Database", "PostgreSQL", "Хранит историю запросов и служебные данные приложения")
System_Ext(sandbox_db, "Sandbox Database", "PostgreSQL", "Содержит demo-данные и принимает пользовательские SQL-запросы")

Rel(user, sql_client, "Использует интерфейс для валидации, запуска SQL и просмотра истории", "HTTPS")
Rel(sql_client, app_db, "Сохраняет и читает историю запросов", "SQL/TCP")
Rel(sql_client, sandbox_db, "Выполняет и анализирует SQL-запросы", "SQL/TCP")
```

## Особенности

- `Пользователь` работает с системой через веб-интерфейс
- `SQL Client` предоставляет сценарии валидации SQL, выполнения запросов, просмотра схемы БД и истории
- `App Database` используется для хранения истории выполнения запросов
- `Sandbox Database` используется как изолированная БД, в которой выполняются пользовательские запросы
