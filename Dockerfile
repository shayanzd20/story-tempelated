# Includes Chromium/WebKit/Firefox + all required Linux libs
FROM mcr.microsoft.com/playwright:v1.55.0-jammy

WORKDIR /app

# Install deps
COPY package*.json ./
# use ci if you have a lockfile; otherwise fall back to install
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# App code
COPY . .

# Render will set PORT; default fallback
ENV PORT=10000
EXPOSE 10000

# Start your server
CMD ["node", "server.js"]
