#!/bin/sh
set -e

# TODO: add code to fetch model and do any other setup etc.
MODEL="E4B:Q4_K_M"

# ollama serve &

# until curl -sf http://ollama:11434/v1/models; do
#     echo "waiting for ollama..."
#     sleep 0.5
# done

ollama() {
    # shellcheck disable=SC2068
    docker exec project-carbon-ollama-1 ollama $@
}


if ! ollama list | grep -q "^$MODEL\$"; then
    ollama create $MODEL -f /root/.ollama/$MODEL/Modelfile
fi


exec node server.js
