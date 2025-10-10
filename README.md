# Next Blog Starter

A **EMS - For Hospital** built with **TypeScript, Express.js, Prisma**.  
This project is designed for the **Next Level Web Development Bootcamp** to help
learners practice Prisma hands-on by building a blog platform.

---

## Features

- TypeScript + Express.js setup
- Modular project structure
- Environment configuration with `dotenv`
- Ready to extend with blog modules (Posts, Users, etc.)

---

## Installation

Install dependencies:

```bash
# using npm
npm install

# using yarn
yarn install

# using pnpm
pnpm install
```

Setup environment variables:

```bash
cp .env.example .env
```

Run the development server:

```bash
# using npm
npm run dev

# using yarn
yarn dev

# using pnpm
pnpm dev
```

---

## Folder Structure

```
EMS Hospital/
│── node_modules/          # Dependencies
│── src/
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│   ├── config/            # Environment & configuration files
│   └── modules/           # Application modules (posts, users, etc.)
│── package.json           # Project metadata & scripts
│── pnpm-lock.yaml         # Lockfile (pnpm)
│── tsconfig.json          # TypeScript configuration
│── README.md              # Documentation
```

---

## Scripts

```bash
# Run in development mode
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

---

## Learning Objective

This starter pack is part of the **Next Level Web Development Bootcamp**
curriculum. By using this project, students will learn how to:

- Connect a Node.js app with Prisma ORM
- Build modular APIs
- Manage environment variables
- Structure scalable backend projects
