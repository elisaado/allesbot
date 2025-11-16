FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs allesbot
USER allesbot

RUN deno install

# Compile the main app
RUN deno cache src/index.ts

# Run the app with env var, read, and network permissions
CMD ["deno", "run", "-E", "-R", "-N", "src/index.ts"]
