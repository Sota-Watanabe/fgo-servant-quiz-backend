# FGO Servant Quiz Backend

Backend for the Fate/Grand Order servant quiz application. The service fetches
servant data from the local Atlas Academy dump and the public Atlas Academy API
to deliver quiz questions (skill/profile) and servant option lists to the
frontend. The project targets Google Cloud Run and documents its API via
Swagger/OpenAPI.

## Features

- Serves quiz endpoints for random servant skill and profile questions.
- Provides servant option data sourced from `data/basic_servant.json`.
- Combines local dumps with live Atlas Academy API calls (`https://api.atlasacademy.io`) using the Interactor/Service/Gateway layers.
- Generates OpenAPI definitions for client integrations.
- Supports Vertex AI (Gemini) access through a dedicated gateway.

## Architecture

Requests flow through a clean layered structure:

`Controller → Interactor → Service → Gateway → Data Source → DTO → Response`

- **Controller layer**: HTTP endpoints (`QuizController`, `ServantsController`) with Swagger decorators.
- **Interactor layer** (`src/interactors`): Orchestrates dump access and API calls to build response DTOs.
- **Service layer** (`src/services`): Infrastructure concerns such as reading the local dump and calling external APIs.
- **Gateway layer** (`src/gateways`): Axios and Vertex AI clients. Atlas Academy responses are optionally dumped into `data/` for debugging.
- **DTOs** (`src/dto`): Define outward-facing response models and Atlas Academy types.

Refer to the project instructions in this repository for deeper architectural guidance.

## Prerequisites

- Node.js 18 (matches the Docker runtime) and npm.
- Access to the Atlas Academy API (public, no key required).
- (Optional) Google Cloud Vertex AI project and service account key for local runs that rely on Gemini models.
- (Optional) MySQL 8 instance if you enable the persistence features described in `DATABASE.md`.

## Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy the sample environment file and fill in the values that apply to your environment:

   ```bash
   cp .env.example .env
   ```

   | Variable | Purpose | Notes |
   | --- | --- | --- |
   | `NODE_ENV` | Nest runtime mode | `development` locally, `production` in Cloud Run |
   | `PORT` | Port the Nest app listens on | Defaults to `8888`; Cloud Run injects `PORT` |
   | `FRONTEND_URL` | Allowed CORS origin in production | Keep the local origin when developing |
   | `VERTEX_AI_*` | Vertex AI project, location, model, credentials | `VERTEX_AI_CREDENTIALS_FILE` is only needed locally when not using Workload Identity |
   | `DB_*` | MySQL connection settings | See `DATABASE.md` for defaults and Docker snippets |

   The checked-in `.env` shows a working local baseline.

3. (Optional) Start a local MySQL instance (see the Docker command in `DATABASE.md`) if you plan to exercise database features.

## Running the Application

- Development with hot-reload:

  ```bash
  npm run start:dev
  ```

- Production build and run:

  ```bash
  npm run build
  npm run start:prod
  ```

- Simple one-off launch (no watch):

  ```bash
  npm run dev
  ```

The server listens on `http://localhost:8888` by default. Swagger UI is served at `http://localhost:8888/api`.

## API Documentation

- Interactive docs: run the server and open Swagger UI at `/api`.
- Generate OpenAPI spec (writes `openapi.json` to the project root):

  ```bash
  npm run generate:openapi
  ```

See `API_DOCS.md` for endpoint summaries and usage notes.

## Quality and Tooling

- Linting: `npm run lint`
- Formatting: `npm run format`
- Unit tests: `npm run test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:cov`

`jest --passWithNoTests` is enabled, so empty suites will not fail CI while you expand coverage.

## Deployment

- The repository is configured for Google Cloud Run with a multi-stage Docker build (`Dockerfile`).
- `.github/workflows/deploy.yml` builds and pushes an image to Artifact Registry, then deploys it to Cloud Run using Workload Identity Federation.
- Required GitHub secrets for the workflow are described in `DEPLOY.md`. Ensure `FRONTEND_URL` is set so CORS is enforced in production.
- Cloud Run deploys with `NODE_ENV=production` and uses service account-based authentication to call Vertex AI (no local credentials file required).

## Additional Documentation

- `API_DOCS.md`: Endpoint behavior and OpenAPI generation steps.
- `DEPLOY.md`: Cloud Run deployment and GitHub Actions secrets.
- `DATABASE.md`: Database configuration, Docker snippets, and repository usage tips.
- `data/`: Contains `basic_servant.json` (Atlas Academy dump) and optional debug artifacts from gateways.

Feel free to extend the Interactor + Service + Gateway pattern when introducing new features to keep the boundaries consistent.
