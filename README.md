# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Dockerize
To start first run docker desktop app first, then run:
```bash
docker build . -f Dockerfile -t skinx
docker-compose build
docker-compose up
```
After docker image is runing. Enter Docker container's shell by run a command below but replace "mycontainer" with docker image name that suffix with "api"
```bash
docker exec -it <mycontainer> bash
```
Then run
```bash
bun run db:migrate
```