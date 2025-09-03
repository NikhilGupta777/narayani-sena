# Narayani Sena Workspace

This is a full-stack web application featuring a React/Vite frontend and a Node.js/Express backend that securely handles all AI API calls.

## Running the Full-Stack Application Locally

To run this project, you need to run both the frontend and the backend server concurrently.

### 1. Configure Environment Variables

The backend server requires your Gemini API key.

1.  Navigate to the `/server` directory.
2.  Create a file named `.env`.
3.  Add your API key to this file:
    ```
    API_KEY=your_gemini_api_key_here
    ```

### 2. Running the Backend Server

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    This command runs the TypeScript server using `ts-node`. The server will start on `http://localhost:3001`.
    ```bash
    npm run dev
    ```

### 3. Running the Frontend

1.  **Navigate to the root project directory (if you are in `/server`, go back `cd ..`).**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    This will start the frontend on `http://localhost:5173`. The Vite config is already set up to proxy API requests to your backend server running on port 3001.
    ```bash
    npm run dev
    ```

## Deployment on AWS Amplify

This project is configured for a monorepo deployment on AWS Amplify using the `amplify.yml` build specification. Amplify will host the frontend as a static web app and you will deploy the backend as a separate service (e.g., Amplify Functions, App Runner, or Elastic Beanstalk).

### CRITICAL: Amplify Hosting Setup

Follow these steps carefully to deploy your frontend.

#### Step 1: Enable Monorepo Support

The build error `Missing frontend definition in buildspec` usually means Amplify is not detecting your `amplify.yml` file. You must enable monorepo support.

1.  In your AWS Amplify Console, go to your app.
2.  In the sidebar, go to **App settings > General**.
3.  Click **Edit** in the top-right corner.
4.  Under **Repository settings**, find the **Monorepo** section and check the box for **"This is a monorepo app"**.
5.  Save your changes. Amplify will now correctly find and use the `amplify.yml` file in the root of your repository.

#### Step 2: Set Environment Variables

Your backend service needs the Gemini API key. In the configuration for your deployed backend service (e.g., in Amplify Functions or your chosen service), set the following environment variable:

-   **Key:** `API_KEY`
-   **Value:** `your_gemini_api_key_here`

#### Step 3: Configure API Rewrite Rule

For the deployed frontend to communicate with the backend, you **must** configure a rewrite rule after the first successful deployment.

1.  In your Amplify app, go to **App settings > Rewrites and redirects**.
2.  Click **Add rule**.
3.  Set the following:
    -   **Source address:** `/api/<*>`
    -   **Target address:** The URL of your deployed backend service. It will look something like `https://your-backend-service-url.com/<*>`.
    -   **Type:** `200 (Rewrite)`
4.  **Add the Single Page App (SPA) redirect rule** if it doesn't exist. This rule should be **last**.
    -   **Source address:** `</^[^.]+$|\\.(?!(css|gif|ico|jpg|jpeg|js|png|svg|txt|woff|woff2)$)([^.]+$)/>`
    -   **Target address:** `/index.html`
    -   **Type:** `200 (Rewrite)`
5.  Save the rules.

This configuration will correctly proxy all frontend requests from `your-app-domain.com/api/*` to your backend server, allowing all features to work in production.