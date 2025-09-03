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

This project is configured for deployment on AWS Amplify. The `amplify.yml` file defines the build steps for both the frontend and the backend. In the Amplify Console, you can connect your repository, and it will use this configuration to build and deploy your application. You will need to configure the backend part as a "Compute" service pointing to the `/server` directory.