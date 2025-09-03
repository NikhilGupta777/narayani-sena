# Narayani Sena Workspace

This is a full-stack web application featuring a React frontend and a Node.js/Express backend for advanced features.

## Running the Full-Stack Application

To run this project, you need to run both the frontend and the backend server concurrently.

### 1. Running the Frontend

The frontend is built using Vite.

1. **Navigate to the root directory:**
   (You should be in the root of the project)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   This will start the frontend on `http://localhost:5173` (or the next available port).
   ```bash
   npm run dev
   ```

### 2. Running the Backend Server

The backend server handles advanced, real-time email validation checks.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    This will install Express, TypeScript, and other necessary packages.
    ```bash
    npm install
    ```

3.  **Start the development server:**
    This command runs the TypeScript server file directly using `ts-node`. The server will start on `http://localhost:3001`.
    ```bash
    npm run dev
    ```

Once both are running, the frontend application will be able to communicate with the backend API to perform live email validation.

## Deployment on AWS Amplify

This project is configured for a monorepo deployment on AWS Amplify using the `amplify.yml` build specification.

### Build Configuration (`amplify.yml`)

The `amplify.yml` file at the root of the project tells Amplify how to build both the frontend and backend:

-   **Frontend:** It installs dependencies and runs `npm run build` in the root directory, which builds the Vite React app into the `/dist` folder.
-   **Backend:** It navigates into the `/server` directory, installs its dependencies, and runs `npm run build` to compile the TypeScript server into the `/server/dist` folder.

Amplify will host the frontend as a static web app and the backend as a Node.js compute service.

### CRITICAL: Deployment Steps

Follow these steps carefully to deploy your application.

#### Step 1: Enable Monorepo Support

The build error `Missing frontend definition in buildspec` usually means Amplify is not detecting your `amplify.yml` file. You must enable monorepo support.

1.  In your AWS Amplify Console, go to your app.
2.  In the sidebar, go to **App settings > General**.
3.  Click **Edit** in the top-right corner.
4.  Under **Repository settings**, find the **Monorepo** section and check the box for **"This is a monorepo app"**.
5.  Save your changes. Amplify will now correctly find and use the `amplify.yml` file in the root of your repository.

#### Step 2: Configure API Rewrite Rule

For the deployed frontend to communicate with the backend, you **must** configure a rewrite rule after the first successful deployment.

1.  In your Amplify app, go to **App settings > Rewrites and redirects**.
2.  Click **Add rule**.
3.  Set the following:
    -   **Source address:** `/api/<*>`
    -   **Target address:** The URL of your deployed backend service. You can find this URL in the **Backend environments** tab of your Amplify app. It will look something like `https://main.d12345.amplifybackend.com/<*>`.
    -   **Type:** `200 (Rewrite)`
4.  Save the rule.

This rule will proxy all requests from `your-app-domain.com/api/*` to your backend server, allowing the email validation feature to work in production.