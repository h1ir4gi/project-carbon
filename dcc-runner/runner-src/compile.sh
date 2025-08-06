#!/bin/bash
set -Eeuo pipefail

SOURCE_FILE="/home/nonroot/main.c"
STDIN_FILE="/home/nonroot/stdin"
OUT_FILE="/home/nonroot/out"

SAFE_CFLAGS="-std=c11 -Wall -Wextra -Werror -fno-asm -fno-gnu-inline-asm -fno-gnu89-inline -fno-builtin -fno-delete-null-pointer-checks"

read -r json

echo "$json" | jq -r '.source' > $SOURCE_FILE
echo "$json" | jq -r '.stdin' > $STDIN_FILE

PROGRAM_OUTPUT="/home/nonroot/program_output.txt"
PROGRAM_ERRORS="/home/nonroot/program_errors.txt"

COMPILE_ERRORS="/home/nonroot/compile_errors.txt"

get_log_file() {
    saved_json="${XDG_CACHE_HOME-$HOME/.cache}/dcc.json"

    if  [ ! -r "$saved_json" ] || [ ! -s "$saved_json" ]; then
        echo 'Something went wrong. You may have exceeded your prcoess/memory allocation.' 1>&2
        exit 1
    fi
    echo "$saved_json"
}

# This could be done outside the image.
generate_prompt() {
    log_file="$(get_log_file)"
    /opt/dcc-help/lib/query.py --dryrun < "$log_file" || exit 1
}

# Try to compile
# shellcheck disable=SC2086
if ! dcc $SAFE_CFLAGS "$SOURCE_FILE" -o "$OUT_FILE" 2>"$COMPILE_ERRORS"; then
    generate_prompt | jq  -cRs --rawfile error "$COMPILE_ERRORS" '{
        "status": "compile",
        "error": $error,
        "prompt": .
    }'
    exit 0
fi

# Try to run
if ! timeout  -k 2s 5s "$OUT_FILE" < "$STDIN_FILE" > "$PROGRAM_OUTPUT" 2>"$PROGRAM_ERRORS"; then
    # Catch timeout:
    if [ "$?" -eq 124  ]; then
        echo 'Program exceeded time limit.' 1>&2
        exit 1
    fi

    generate_prompt | jq  -cRs --rawfile error "$PROGRAM_ERRORS" --rawfile output "$PROGRAM_OUTPUT" '{
        "status": "runtime",
        "error": $error,
        "output": $output,
        "prompt": .
    }'
    exit 0
fi

jq -cRs '{
    "status": "success", # success
    "output": .
}' "$PROGRAM_OUTPUT"