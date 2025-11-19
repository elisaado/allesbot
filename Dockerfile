FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

RUN deno install

# Compile the main app
RUN deno cache src/index.ts

# Run the app with env var, read, and network permissions
CMD ["deno", "run", "-E", "-R", "-N", "-W", "src/index.ts"]
