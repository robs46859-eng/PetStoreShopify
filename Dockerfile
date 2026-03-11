FROM node:24-slim

WORKDIR /app/web

# Install all dependencies (including devDeps — needed for the Shopify CLI + mini-oxygen runtime)
COPY web/package*.json ./
RUN npm install

# Copy source and build the Hydrogen storefront
COPY web/ ./
RUN npm run build

ENV PORT=8080
EXPOSE 8080

# `shopify hydrogen preview` uses @shopify/mini-oxygen to run the built
# dist/worker.js — this is the correct self-hosted runtime for Hydrogen.
CMD ["npx", "shopify", "hydrogen", "preview", "--port", "8080", "--host", "0.0.0.0"]
