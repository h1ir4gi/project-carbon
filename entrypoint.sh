#!/bin/sh
set -e

# TODO: add code to fetch model and do any other setup etc.
MODEL="E4B:Q4_K_M"

ollama serve &

until curl -sf http://localhost:11434/v1/models; do
    echo "waiting for ollama..."
    sleep 0.5
done

if ! ollama list | grep -q "^$MODEL\$"; then
    ollama create $MODEL -f /models/$MODEL/Modelfile
fi




exec node server.js
