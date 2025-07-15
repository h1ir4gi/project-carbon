#!/bin/sh

# $1 = source file path
# $2 = stdin file path

# Compile the source code, redirect stderr to a file
gcc -o /app/program "$1" 2> /app/compile_errors.txt
COMPILE_STATUS=$?

if [ $COMPILE_STATUS -ne 0 ]; then
  # Compilation failed — output errors but do NOT exit with failure code
  cat /app/compile_errors.txt
  exit 0  # Return 0 so docker run succeeds
fi

# Compile succeeded — run the program with timeout, pass stdin
timeout 5s /app/program < "$2"
TIMEOUT_STATUS=$?

if [ $TIMEOUT_STATUS -eq 124 ]; then
  # 124 is the exit code timeout returns on timeout
  echo "TIMEOUT"
  exit 0
fi

exit 0
