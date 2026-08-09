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
* **Diagnostics Dashboard**:
  Access the live diagnostic UI served locally at `http://localhost:5000/`.
