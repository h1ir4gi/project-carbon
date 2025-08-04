#!/bin/bash
set -e
cd dcc-runner
docker image build -t dcc-runner-dcc_help_testing . # build the image on boot
cd ..

docker compose up --build -d

