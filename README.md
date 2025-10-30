# EMS Hospital Backend

A **Hospital EMS (Electronic Management System)** backend built with
**TypeScript, Express.js, and Prisma**.  
This project is designed to manage patients, doctors, appointments, payments,
and health records efficiently.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express-5.1.0-lightgrey?logo=express)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.17.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens)](https://jwt.io/)
[![Zod](https://img.shields.io/badge/Zod-Validation-orange)](https://zod.dev/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Upload-3448C5?logo=cloudinary)](https://cloudinary.com/)
[![pnpm](https://img.shields.io/badge/pnpm-Fast%20Package%20Manager-yellow?logo=pnpm)](https://pnpm.io/)
[![ESLint](https://img.shields.io/badge/Code%20Style-ESLint-4B32C3?logo=eslint)](https://eslint.org/)

---

## Features

- Fully typed backend using **TypeScript**
- Modular structure for **patients, doctors, appointments, and payments**
- **Prisma ORM** for database modeling & management
- Authentication with **JWT**
- File uploads with **Cloudinary** support
- Data validation using **Zod**
- RESTful API structure
- Environment management via `.env`
- Global error handler for handle error

---

## Tech Stack

- **Node.js** - Server runtime
- **Express.js** - API framework
- **TypeScript** - Strong typing
- **Prisma** - ORM for database queries
- **PostgreSQL/MySQL** - Database (configurable)
- **Cloudinary** - File & image storage
- **Zod** - Request validation
- **JWT** - Authentication

---

## Getting Started

### Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Folder Structure

```bash
hospital_ems_backend/
│── node_modules/            # Dependencies
│── prisma/                  # Prisma schema & migrations
│── src/
│   ├── server.ts            # Server entry point
│   ├── app.ts               # Express app configuration
│   ├── config/              # Environment & config files
│   ├── modules/             # Feature-based modules (patients, doctors, etc.)
│   └── middleware/          # Validation, auth, error handlers
│── package.json             # Project metadata & scripts
│── tsconfig.json            # TypeScript configuration
│── .env.example             # Example environment variables
│── README.md                # Project documentation

```
