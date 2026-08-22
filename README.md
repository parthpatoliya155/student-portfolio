# Parth Patoliya Practical Works Portfolio & Task Manager API

A GitHub-ready workspace containing the Student Portfolio frontend and the Task Manager REST API backend.

## Workspace Layout

```text
project-root/
├── frontend/                  # Frontend Client Project
│   └── student-portfolio/     # React + Vite client app (GitHub Portfolio showcase)
│
├── backend/                   # Backend Server Project
│   └── task-manager-api/      # Node + Express REST API (MongoDB/Mongoose backend)
│
├── README.md                  # This workspace directory file
└── .gitignore                 # Root-level Git ignore configuration
```

---

## Projects Directory

### 1. Frontend: Student Portfolio (`frontend/student-portfolio`)
A responsive React + Vite application that showcase user info, skills, education, and fetches GitHub repositories dynamically using the GitHub REST API.

* **Tech Stack**: React 18, Vite, HTML5, CSS3.
* **Development Server**:
  ```bash
  cd frontend/student-portfolio
  npm install
  npm run dev
  ```

### 2. Backend: Task Manager API (`backend/task-manager-api`)
A RESTful API server connected to MongoDB with complete CRUD capabilities, input validation, and custom middlewares. Includes a static diagnostics testing UI served directly by the server.

* **Tech Stack**: Node.js, Express, MongoDB (Mongoose).
* **Environment variables**: Create a `.env` file based on `.env.example` in the backend project root.
* **Development Server**:
  ```bash
  cd backend/task-manager-api
  npm install
  node src/server.js
  ```
* **Testing API**:
  To run the automated endpoint tests, execute:
  ```bash
  cd backend/task-manager-api
  node test-api.js
  ```

---

## Running the Full-Stack Application (Practical 6 Integration)

Follow these steps to run both servers simultaneously and connect the frontend to the backend:

### Step 1: Start MongoDB Local Server
Ensure MongoDB is running locally on your machine at `mongodb://localhost:27017/`.
* On Windows, you can start the MongoDB Service via the **Services** app, or run:
  ```powershell
  Start-Service MongoDB
  ```
  *(Or start MongoDB Community Server locally using your terminal/MongoDB Compass)*

### Step 2: Run the Express Backend Server
1. Open a new terminal window or tab.
2. Navigate to the backend directory:
   ```bash
   cd backend/task-manager-api
   ```
3. Install dependencies (if not already done):
   ```bash
   npm install
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   You should see:
   - `Server running on port 5000`
   - `MongoDB connected successfully`

### Step 3: Run the React Frontend Client
1. Open a **second** terminal window or tab.
2. Navigate to the frontend directory:
   ```bash
   cd frontend/student-portfolio
   ```
3. Install dependencies (if not already done):
   ```bash
   npm install
   ```
4. Start the Vite React client server:
   ```bash
   npm run dev
   ```
   You should see the server starts on:
   - `http://localhost:5173/`

### Step 4: Verify the Application
1. Open your browser and navigate to `http://localhost:5173/`.
2. Click the **Tasks** link in the navigation menu at the top.
3. Try out the **Task Management Suite**:
   - **Create**: Add a task via the form on the left.
   - **Toggle Status**: Click the checkbox on a task card to mark it complete.
   - **Edit**: Click the "Edit" button, modify the task info, and click "Save Changes".
   - **Delete**: Click the "Delete" button, and verify the confirmation modal.
   - **Persistence**: Refresh the browser page; all tasks will load dynamically from MongoDB.

