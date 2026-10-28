# Deployment Guide: Pelagia ReefOS (Vercel & Render)

This application is built with **React 19 + TypeScript + Vite + Tailwind CSS**. It can be deployed in under 2 minutes to both **Vercel** and **Render**.

---

## Step 1: Initialize Git and Push to GitHub

Both Vercel and Render connect directly to your GitHub repository for continuous deployment.

Run the following commands in your project root:

```bash
# 1. Initialize git repository
git init

# 2. Stage all project files
git add .

# 3. Create your initial commit
git commit -m "feat: initial release of Pelagia ReefOS with futuristic HUD and 3D bathymetry"

# 4. Set main branch
git branch -M main

# 5. Connect your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy to Vercel

The repository already includes [`vercel.json`](./vercel.json) pre-configured with Vite framework recognition, build output directory (`dist`), and Single-Page Application (SPA) routing rewrites.

### Option A: Via Vercel Web Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. *(Optional)* Add any environment variables if required (e.g. `GEMINI_API_KEY`).
6. Click **Deploy**. Your app will be live with an SSL-enabled `.vercel.app` URL.

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Log in to Vercel
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

---

## Step 3: Deploy to Render

The repository includes [`render.yaml`](./render.yaml) which defines the service blueprint for a **Static Site** with automatic routing rewrites.

### Option A: Via Render Blueprints (1-Click)
1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **"New +"** → **"Blueprint"**.
3. Connect your GitHub repository.
4. Render will read `render.yaml` automatically and configure:
   - **Service Name**: `pelagia-reefos`
   - **Environment**: `Static`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `./dist`
   - **Rewrite Rules**: `/* -> /index.html`
5. Click **Apply**. Render will trigger the build and deploy your site to `pelagia-reefos.onrender.com`.

### Option B: Via Render Web Dashboard (Manual Static Site)
1. In the Render Dashboard, click **"New +"** → **"Static Site"**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `pelagia-reefos`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Advanced** / **Redirects/Rewrites**:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
5. Click **Create Static Site**.

### Option C: As a Full-Stack Node.js Web Service on Render
If you want to run the Express backend (`server.ts`):
1. In Render Dashboard, click **"New +"** → **"Web Service"**.
2. Connect your GitHub repository.
3. Configure:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.ts`
   - **Instance Type**: Free / Starter
4. Render will start the full-stack server running both the Express API and frontend on port 3000!

---

## Summary of Configured Files
- `vercel.json`: Handles SPA routing (`/(.*) -> /index.html`), Vite framework detection, and output routing.
- `render.yaml`: Infrastructure-as-code Blueprint for zero-configuration deployment on Render.
- `vite.config.ts`: Modern ES module path resolution compatible with Linux/Node 18+ CI environments.
