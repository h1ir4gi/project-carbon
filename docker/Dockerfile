# Use lightweight Alpine Linux image
FROM alpine:latest

# Install gcc, bash, coreutils (for timeout), and make (optional)
RUN apk add --no-cache gcc musl-dev bash coreutils make

# Copy your script into the container
COPY compile_and_run.sh /app/compile_and_run.sh

# Make sure the script is executable
RUN chmod +x /app/compile_and_run.sh

# Set working directory
WORKDIR /app

# Default command (optional)
CMD ["/bin/sh"]
