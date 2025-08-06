#!/bin/bash
set -e

docker image build --target base -t dcc-help:base dcc-help/
docker image build -t dcc-runner dcc-runner/

npm run dev

# In prod, do this instead:
# docker compose up --build -d

