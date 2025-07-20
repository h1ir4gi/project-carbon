#!/bin/bash
set -e

cd dcc-runner
# docker compose down 
docker compose build # build the image on boot
# docker compose up -d # dont need this anymore since we only want to start the container on server request

# cleanup() {
#   echo -e "\nStopping Docker container..."
#   (cd dcc-runner && docker compose down)
#   exit
# }
# trap cleanup SIGINT SIGTERM # no longer needed, again, since the containers boot up automatically

cd ..

npm run dev

# cleanup
