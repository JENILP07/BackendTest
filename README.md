# 🔧 NestJS REST API

A production-ready **RESTful API** built with NestJS, featuring JWT authentication, TypeORM, PostgreSQL integration, and clean architecture patterns.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login & token-based session management
- 🗄️ **TypeORM + PostgreSQL** — Database integration with type-safe ORM
- ✅ **DTO Validation** — Request validation with `class-validator`
- 🏗️ **Clean Architecture** — Modular structure with controllers, services, and repositories
- 🔒 **Guards & Decorators** — Role-based access control
- 🌍 **Environment Config** — `.env`-driven configuration with `@nestjs/config`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | TypeORM |
| Auth | JWT + Passport |
| Validation | class-validator / class-transformer |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL database (or [Neon](https://neon.tech) serverless)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JENILP07/BackendTest.git
cd BackendTest

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_super_secret_key
JWT_EXPIRATION=7d
PORT=3000
```

### Running the App

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## 📁 Project Structure

```
src/
├── auth/           # JWT authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── users/          # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── user.entity.ts
├── common/         # Guards, decorators, filters
└── main.ts
```

---

## 📬 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/users/me` | Get current user profile | ✅ |
| `PATCH` | `/users/:id` | Update user | ✅ |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/JENILP07">Jenil Patel</a>
</div>
