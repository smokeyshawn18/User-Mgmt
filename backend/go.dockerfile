FROM golang:1.22.2 AS builder
WORKDIR /app

COPY . .

# Download and install dependencies
RUN go get -d -v ./...

# Build the Go app
RUN go build -o api .

EXPOSE 8000

CMD ["./api"]
