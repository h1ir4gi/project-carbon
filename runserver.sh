#!/bin/bash
set -e

cd dcc-runner
docker compose down
docker compose build
docker compose up -d

cleanup() {
  echo -e "\nStopping Docker container..."
  (cd dcc-runner && docker compose down)
  exit
}
trap cleanup SIGINT SIGTERM

cd ..

npm run dev

cleanup
