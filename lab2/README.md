# Lab 2: Teacher Management API

A basic Express.js application for managing teacher records with MySQL integration. This project demonstrates CRUD operations, database connection using `mysql2`, and input validation using `Zod`.

## Prerequisites

- Node.js (Latest LTS recommended)
- npm (Node Package Manager)
- Docker & Docker Compose (for running the database)

## Environment Variables

The application expects the following environment variables (defaults provided in code, but recommended to set in `.env` or Docker environment):

- `DB_HOST`: Database host (default: `localhost` or `db` in Docker)
- `DB_USER`: Database user (default: `root`)
- `DB_PASSWORD`: Database password (default: `rootpassword`)
- `DB_NAME`: Database name (default: `ncu`)

## Installation

1. Clone the repository or navigate to the project directory.
2. Install dependencies:

```bash
npm install
```

## Usage

### Development

To run the server in development mode with `nodemon`:

```bash
npm run dev
```

### Production

To build and run the compiled JavaScript code:

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will start on port 3000 by default (http://localhost:3000).

## Docker Support

This project is configured to run with Docker Compose, which sets up the application, a MySQL database, and phpMyAdmin.

1. **Start services:**
   Navigate to the parent directory (where `docker-compose.yml` is located) and run:
   ```bash
   docker-compose up --build
   ```

2. **Access Application:** `http://localhost:3000`
3. **Access phpMyAdmin:** `http://localhost:8080`

## API Endpoints

Base path: `/teacher`

### 1. Get All Teachers

- **URL:** `/teacher`
- **Method:** `GET`
- **Description:** Retrieve a list of all teachers.
- **Response:** JSON object containing an array of teachers.

### 2. Create Teacher

- **URL:** `/teacher`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "id": "T001",           // String, max 6 chars, Primary Key
    "name": "Prof. Name",   // String, max 150 chars
    "department": "Dept",   // String, max 50 chars
    "picture": "http://..." // Valid URL
  }
  ```
- **Response:** JSON object of the created teacher.

### 3. Update Teacher

- **URL:** `/teacher/:id`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "department": "Updated Dept",
    "picture": "http://updated-url..."
  }
  ```
- **Response:** JSON object of the updated teacher.

### 4. Delete Teacher

- **URL:** `/teacher/:id`
- **Method:** `DELETE`
- **Response:** 204 No Content.
