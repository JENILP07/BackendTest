# Support Ticket Management System (TMS)

A robust backend for handling employee support tickets, featuring role-based access control, ticket lifecycle management, and detailed audit logging.

## Features

- **Authentication**: Secure JWT-based login and password hashing with bcrypt.
- **RBAC**: Three distinct roles: MANAGER, SUPPORT, and USER.
- **Ticket Lifecycle**: Tracks status from OPEN to CLOSED with mandatory audit logging of every transition.
- **Comments**: Threaded interaction on every ticket.
- **API Documentation**: Built-in Swagger UI at `/docs`.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
```

### 3. Initialize Data
Run the seed script to create initial users and sample tickets:
```bash
npm run seed
```

### 4. Run the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Endpoints

- **Auth**: `/auth/login`
- **Tickets**: `/tickets`
- **Ticket Comments**: `/tickets/{id}/comments`
- **Comment Edit/Delete**: `/comments/{id}`
- **Users**: `/users` (Manager only)

Full interactive documentation is available at `http://localhost:3000/docs` once the server is running.
