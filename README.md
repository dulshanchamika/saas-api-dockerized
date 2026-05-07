# SaaS Application

This application is fully Dockerized and utilizes **Neon Database**. It uses the `neon_local` proxy for development (creating ephemeral database branches) and connects directly to the serverless Neon Cloud Database in production.

## Environment Variables

### Development (`.env.development`)
This file should contain credentials to start your application and `neon-local` in your local development environment.
It requires your Neon API Key and Project ID to dynamically branch from your main database.

```env
PORT=3000
NODE_ENV=development

# Points to the neon-local proxy in the Docker network
DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb?sslmode=require

# Neon Local Credentials
NEON_API_KEY=<your_neon_api_key>
NEON_PROJECT_ID=<your_neon_project_id>
PARENT_BRANCH_ID=main
```

### Production (`.env.production`)
This file is used for deploying to a production server. It connects securely and directly to the Neon Cloud database without any local proxy.

```env
PORT=3000
NODE_ENV=production

# Points directly to the serverless Neon Cloud DB
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require&channel_binding=require
```

---

## 🚀 Running the Application Locally (Development)

In development, we use `docker-compose.dev.yml`. This starts both your Node.js application and the `neon-local` proxy side-by-side. 
When `neon-local` starts, it automatically creates an **ephemeral branch** of your database (based on `PARENT_BRANCH_ID`), allowing you to test without affecting production data. This ephemeral branch is automatically deleted when you shut down the container.

### Step 1: Prepare the environment
Ensure `.env.development` is populated with your Neon API key and project ID. 

### Step 2: Start the application
You can start the environment using the provided helper script:
```bash
./setup-docker.sh
```

Or you can use docker-compose manually:
```bash
docker compose -f docker-compose.dev.yml up --build
```

The application uses a volume mount for your source code, meaning any changes you make to your local code will automatically trigger a hot reload.

---

## 🚢 Deploying the Application (Production)

In production, we do not need the `neon-local` proxy container. The app connects directly to the remote Neon Database using the `DATABASE_URL` specified in `.env.production`.

### Step 1: Prepare the environment
Ensure your `.env.production` file has the actual Neon Cloud connection string.

### Step 2: Start the production container
Deploy the application using `docker-compose.prod.yml`:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This will run the built production-ready container (`npm start`) with memory and CPU limits configured for stability.
