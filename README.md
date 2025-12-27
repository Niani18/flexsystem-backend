# FlexSystem – Backend API

Backend de un sistema para la gestión de pedidos de **flexibles personalizados**.
A diferencia de un catálogo tradicional, los productos no están prefabricados, sino que se
construyen dinámicamente a partir de la selección de componentes.

El sistema está orientado a un entorno **B2B**, donde se asume que el cliente posee conocimientos
técnicos sobre el producto.

---

## Funcionalidades principales

- Configuración de productos personalizados por componentes
- Validación técnica y feedback durante la selección
- Gestión del flujo completo de pedidos
- Manejo de pagos parciales (señas y saldo pendiente)
- Seguimiento de entregas
- API REST estructurada por módulos

---

## Arquitectura

El backend está desarrollado con **NestJS**, siguiendo una arquitectura modular
y separando responsabilidades por dominio:

- `auth`: autenticación y autorización (JWT, roles)
- `client`: gestión de clientes
- `dealer`: gestión de distribuidores
- `supply`: control de insumos y stock
- `order`: flujo principal del pedido y lógica de negocio
- `delivery`: gestión de entregas
- `database`: configuración ORM y conexión a la base de datos
- `shared`: utilidades y lógica reutilizable

---

## Base de datos

- SGBD: **MySQL**
- Motor de almacenamiento: **InnoDB**
- ORM: **MikroORM** 

El modelo de datos fue diseñado desde cero, priorizando:
- Modelado del dominio
- Relaciones claras entre entidades
- Separación entre lógica de negocio y persistencia

---

## Tecnologías utilizadas

- **Node.js**
- **NestJS**
- **TypeScript**
- **MikroORM**
- **MySQL (Percona Server)**
- **JWT**
- **Docker (nociones básicas)**

---

## Configuración del entorno

Crear un archivo `.env` a partir de `.env.example` y configurar las variables necesarias:

```bash
cp .env.example .env
```

---

## Instalación 

```bash
pnpm install
```
---

## Levantar la aplicación

```bash
pnpm start:dev
```

## Documentación técnica

- Modelo de dominio: `docs/domain/domain-model.jpeg`

