#!/bin/bash
set -e

docker image build -t dcc-runner-dcc_help_testing dcc-runner/

npm run dev

# In prod, do this instead:
# docker compose up --build -d

