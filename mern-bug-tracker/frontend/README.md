# MERN Bug Tracker

A full-stack bug tracking application built with the MERN stack (MongoDB, Express, React, Node.js) that demonstrates best practices for testing and debugging.

## Features

- User authentication and authorization
- Create, read, update, and delete bug reports
- Filter and sort bugs by various criteria
- Update bug status (open, in-progress, resolved)
- Assign bugs to team members
- Comprehensive testing suite

## Project Structure

```
mern-bug-tracker/
├── backend/                 # Express server
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── tests/               # Backend tests
│   │   ├── integration/     # API route tests
│   │   └── unit/            # Helper function tests
│   ├── utils/               # Helper functions
│   └── server.js            # Server entry point
└── frontend/                # React client
    ├── public/              # Static files
    └── src/                 # React source
        ├── components/      # Reusable components
        ├── screens/         # Page components
        ├── tests/           # Frontend tests
        ├── App.js           # Main component
        └── index.js         # Entry point
```

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/mern-bug-tracker.git
   cd mern-bug-tracker
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Running the Application

### Development Mode

1. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Production Mode

1. Build the frontend
   ```bash
   cd frontend
   npm run build
   ```

2. Start the server
   ```bash
   cd ../backend
   npm start
   ```

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Test Coverage

```bash
cd backend
npm run test:coverage

cd ../frontend
npm run test:coverage
```

## Debugging Techniques

### Backend Debugging

1. Using Node.js Inspector
   ```bash
   cd backend
   node --inspect server.js
   ```
   Then open Chrome and navigate to `chrome://inspect`

2. Using Console Logs
   - Strategic console.log placement for tracing execution flow
   - console.table for displaying arrays/objects
   - console.trace for stack traces

3. Error Middleware
   - Custom error handling middleware captures and formats errors
   - Different behavior in development vs production environments

### Frontend Debugging

1. React DevTools
   - Install the React DevTools browser extension
   - Inspect component hierarchy, props, and state

2. Chrome DevTools
   - Network tab for API requests
   - Console for logging
   - Sources tab for setting breakpoints

3. Error Boundaries
   - React Error Boundaries catch and handle rendering errors
   - Prevents entire application from crashing

## Testing Strategy

### Unit Tests

- Backend: Testing individual helper functions and utilities
- Frontend: Testing component rendering and behavior in isolation

### Integration Tests

- Backend: Testing API routes with supertest
- Frontend: Testing component interactions and API calls

### Mocking

- Using Jest mock functions for external dependencies
- MongoDB memory server for database testing
- Axios mocking for API calls

## Intentional Bugs for Learning

Several intentional bugs have been introduced for practice:

1. Missing validation in the backend
2. Incorrect state updates in React components
3. Race condition in asynchronous operations
4. Memory leak in a component unmount
5. Improper error handling in API calls

Use the debugging techniques outlined above to identify and fix these issues.
