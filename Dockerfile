FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

RUN deno install

# Compile the main app
RUN deno cache src/index.ts

# Run the app
CMD ["deno", "run", "-A", "src/index.ts"]
