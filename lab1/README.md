# Lab 1: Geometry Calculator API

A simple Express.js application that provides an API for calculating the area of various geometric shapes.

## Prerequisites

- Node.js (Latest LTS recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository or navigate to the project directory.
2. Install dependencies:

```bash
npm install
```

## Usage

### Development

To run the server in development mode with `nodemon` (auto-restarts on changes):

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

### Docker

You can also run the application using Docker.

1. **Build the Docker image:**

   You can use the provided helper script:
   ```bash
   ./build_docker.sh
   ```

   Or build manually:
   ```bash
   docker build -t lab1:latest .
   ```

2. **Run the container:**

   ```bash
   docker run -p 3000:3000 lab1:latest
   ```

## API Endpoints

### Health Check

- **URL:** `/`
- **Method:** `GET`
- **Description:** Returns a greeting message to verify the server is running.
- **Example:**
  ```http
  GET /
  ```

### Geometry Operations

Base path: `/geometry`

#### 1. Rectangle Area

- **URL:** `/geometry/rectangle`
- **Method:** `GET`
- **Query Parameters:**
  - `width` (number, required)
  - `height` (number, required)
- **Response:** JSON object containing the calculated area.
- **Example:**
  ```http
  GET /geometry/rectangle?width=10&height=5
  ```
  **Response Body:**
  ```json
  { "area": 50 }
  ```

#### 2. Circle Area

- **URL:** `/geometry/circle`
- **Method:** `GET`
- **Query Parameters:**
  - `radius` (number, required)
- **Response:** JSON object containing the calculated area.
- **Example:**
  ```http
  GET /geometry/circle?radius=5
  ```
  **Response Body:**
  ```json
  { "area": 78.53981633974483 }
  ```

#### 3. Triangle Area

- **URL:** `/geometry/triangle`
- **Method:** `GET`
- **Query Parameters:**
  - `base` (number, required)
  - `height` (number, required)
- **Response:** JSON object containing the calculated area.
- **Example:**
  ```http
  GET /geometry/triangle?base=10&height=5
  ```
  **Response Body:**
  ```json
  { "area": 25 }
  ```
