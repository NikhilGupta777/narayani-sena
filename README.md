# Narayani Sena Workspace

This is a full-stack web application featuring a React frontend and a Node.js/Express backend for advanced features.

## Running the Full-Stack Application

To run this project, you need to run both the frontend and the backend server concurrently.

### 1. Running the Frontend

The frontend is served via a simple static web server. In a production environment or a typical local setup, you would use a command like `npm start`. In this development environment, opening `index.html` is sufficient and handled automatically.

### 2. Running the Backend Server

The backend server handles advanced, real-time email validation checks that cannot be performed in the browser.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    This will install Express, TypeScript, and other necessary packages.
    ```bash
    npm install
    ```

3.  **Start the server:**
    This command compiles and runs the TypeScript server file using `ts-node`. The server will start on `http://localhost:3001`.
    ```bash
    npm start
    ```

Once both are running, the frontend application will be able to communicate with the backend API to perform live email validation.
