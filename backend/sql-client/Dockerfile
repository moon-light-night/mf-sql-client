FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /sql-api ./cmd/server

FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata netcat-openbsd

WORKDIR /app
COPY --from=builder /sql-api .

EXPOSE 9090

CMD ["/app/sql-api"]
