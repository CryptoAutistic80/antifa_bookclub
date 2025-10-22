# Containerized deployment guide

GitHub Pages no longer hosts this project. Instead, we deploy the complete container stack—NestJS API, Next.js frontend, and
supporting services—behind a reverse proxy or container platform such as Fly.io, Railway, or a self-managed VPS. The following
recipe publishes multi-arch Docker images and rolls them out with Docker Compose.

## 1. Prepare environment variables

Copy the example files and customize values for production credentials:

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Populate each file with production URLs, MongoDB credentials, and any third-party secrets before building.

## 2. Build production images

```bash
# Build and tag images locally
pnpm exec nx run backend:docker-build
pnpm exec nx run frontend:docker-build
```

To publish them to a registry, retag with your registry namespace and push:

```bash
docker tag antifa_bookclub-backend:latest ghcr.io/YOUR_ORG/backend:latest
docker tag antifa_bookclub-frontend:latest ghcr.io/YOUR_ORG/frontend:latest
docker push ghcr.io/YOUR_ORG/backend:latest
docker push ghcr.io/YOUR_ORG/frontend:latest
```

Most registries also support `docker compose build --push` for a single-step workflow.

## 3. Deploy with Docker Compose

On the target server (or via a GitHub Actions deploy job):

```bash
# Copy compose file and env values
rsync -av docker-compose.yml .env apps/backend/.env apps/frontend/.env.local user@server:/opt/antifa-bookclub/

# On the server
cd /opt/antifa-bookclub
docker compose pull   # or docker compose build if building remotely
docker compose up -d
```

The frontend exposes HTTP traffic on `${FRONTEND_PORT:-3000}` and proxies API requests to `${NEXT_PUBLIC_API_URL}`. The backend
listens on `${BACKEND_PORT:-3000}` inside the container and publishes `${BACKEND_PORT_HOST:-3001}` to the host by default.

## 4. Configure HTTPS and DNS

Place the stack behind a TLS terminator such as Caddy, Traefik, or nginx. Point your DNS records at the host running the
containers and configure the proxy to forward traffic to the frontend service. The API is available under `/api` relative to the
frontend origin.

## 5. Keep deployments repeatable

- Commit all Docker and Nx changes so images rebuild deterministically.
- Use versioned image tags (`backend:v2024-04-01`) in `docker-compose.yml` when promoting to staging or production.
- Automate deployments with CI/CD by chaining the build job with `docker compose up --detach` or your platform’s release step.
