# Deploying to Coolify

This guide covers how to deploy the AI for Nurses India platform to Coolify using GitHub.

## Prerequisites
- A Coolify instance running on your server.
- GitHub repository with the project code.
- A PostgreSQL database (can be managed by Coolify).

## Step 1: Create a Resource
1. Log in to your Coolify dashboard.
2. Click on **Projects** and select or create a project.
3. Click **+ New Resource** -> **Public Repository** or **Private Repository** (GitHub).
4. Select your repository and the branch (e.g., `main`).

## Step 2: Configure the Application
1. **Build Pack**: Select **Docker** (recommended) or **Nixpacks**.
   - If using **Docker**, it will automatically use the `Dockerfile` in the root.
   - If using **Nixpacks**, ensure you add a `PRE_BUILD` command to run `npx prisma generate`.
2. **Ports**: Ensure the internal port is set to `3000`.
3. **Domain**: Set your production domain (e.g., `https://ai.nursesindia.org`).

## Step 3: Database Setup
You have two options for the database:

### Option A: Managed by Coolify
1. Go to **New Resource** -> **Databases** -> **PostgreSQL**.
2. Create the database.
3. Once created, copy the **Internal Connection String**.
4. In your Application settings, add an environment variable `DATABASE_URL` and paste the connection string.

### Option B: External Database
Add the `DATABASE_URL` environment variable with your external connection string (e.g., Supabase, Neon).

## Step 4: Environment Variables
Add the following required environment variables in the Coolify application settings:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | A random 32+ character string for Auth.js |
| `AUTH_URL` | Your production URL (e.g., `https://ai.nursesindia.org`) |
| `NEXT_PUBLIC_APP_URL` | Same as `AUTH_URL` |
| `GEMINI_API_KEY` | Your Google AI Studio API Key |
| `APP_ENV` | Set to `production` |

*Refer to `.env.example` for optional variables like Redis, Razorpay, and Email.*

## Step 5: Database Migrations
To run migrations automatically during deployment:
1. In the **Deployment** settings of your Coolify application, find the **Pre-deployment command** or **Build command** section.
2. Add the following command:
   ```bash
   npx prisma migrate deploy
   ```
   *Note: If using Docker, you might want to run this in a separate job or as part of the startup script.*

## Step 6: Health Checks
Coolify automatically performs health checks. Since this is a Next.js app, the default check on `/` should work. If you want a specific health check, you can point it to `/api/health` (if implemented).

## Step 7: Deploy
Click **Deploy** and wait for the build to finish. Coolify will provide a live log of the build and deployment process.

---

### Troubleshooting
- **Prisma Client Issues**: If you see "Prisma Client not found", ensure `npx prisma generate` was run during the build stage.
- **Environment Variables**: If the app fails to start, double-check that all required variables from `.env.example` are present.
- **Build Memory**: Next.js builds can be memory-intensive. Ensure your server has at least 2GB of RAM.
