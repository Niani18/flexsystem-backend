# FlexSystem – Backend API

Backend system for managing **custom-made flexible products orders**.  
Unlike a traditional catalog, products are **not prefabricated**, but dynamically built based on selected components.

The system is designed for a **B2B environment**, assuming that clients have technical knowledge about the products they configure.

---

## Main Features

- Custom product configuration based on components  
- Technical validation and feedback during product selection  
- Full order lifecycle management  
- Partial payments handling (down payment and remaining balance)  
- Delivery tracking  
- Modular REST API  

---

## Architecture

The backend is built with **NestJS**, following a **modular architecture** and separating responsibilities by domain:

- **auth**: authentication and authorization (JWT, roles)  
- **client**: client management  
- **dealer**: distributor management  
- **supply**: inventory and supplies control  
- **order**: main order workflow and business logic  
- **delivery**: delivery management  
- **database**: ORM configuration and database connection  
- **shared**: reusable utilities and shared logic  

---

## Database

- **DBMS**: MySQL  
- **Storage Engine**: InnoDB  
- **ORM**: MikroORM  

The data model was designed from scratch, prioritizing:

- Domain-driven modeling  
- Clear relationships between entities  
- Separation between business logic and persistence  

---

## Tech Stack

- Node.js  
- NestJS  
- TypeScript  
- MikroORM  
- MySQL (Percona Server)  
- JWT  
- Docker (basic knowledge)  

---

## Environment Setup

Create a `.env` file based on `.env.example` and configure the required variables:

```bash
cp .env.example .env
```

---

## Installation
```bash
pnpm install
```

---

## Run the Application
```bash
pnpm start:dev
```

---

## Technical Documentation
Domain Model: `docs/domain/domain-model.jpeg`
