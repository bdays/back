# BDAY

Документация к API `http://domain/docs`

### Запуск проекта

Перед запуском проекта надо создать `.env` файл в директории проекта (все нужные ключи, для проекта указаны в .env.example).

Для запуска проекта необходим docker и docker-compose.

Запускается командой:
```shell script
docker-compose up --build
```
**Для перевода в режим PRODUCTION заменить в Dockerfile "start:dev" на "start"**

Для автоматического форматирования кода можно использовать команду:
```shell script
npm run prettier
```

Для запуска миграций надо использовать команду:
```shell script
docker exec -it bday-back npm run db:migrate
```

```shell script
docker exec -it bday-back npm run db:seed
```