<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=160&section=header&text=RIFTFOLIO&fontSize=48&fontColor=6ec6ff&fontAlignY=40&desc=Your%20Riftbound%20Card%20Stock%2C%20Organized&descAlignY=62&descSize=17&descColor=8fd3ff&animation=fadeIn" width="100%"/>

*Browse, sort, and manage your Riftbound card collection right from your browser.*

<br/>

![Java](https://img.shields.io/badge/Java-25-1e3a5f?style=for-the-badge\&logo=openjdk\&logoColor=6ec6ff)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-Backend-1e3a5f?style=for-the-badge\&logo=springboot\&logoColor=6ec6ff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Docker-1e3a5f?style=for-the-badge\&logo=postgresql\&logoColor=6ec6ff)

</div>

---

# 🔷 About

**Rift Folio** is a web application for managing your **Riftbound** card collection.

The backend is built with **Spring Boot** and uses **PostgreSQL** running in **Docker** for local development.

---

# 👥 Collaborators

|       | Name                           | GitHub                      |
| ----- | ------------------------------ | --------------------------- |
| 👩‍💻 | Clara Fernández Pérez          | https://github.com/megu-hub |
| 👨‍💻 | Sergio Fernández-Miranda Longo | https://github.com/clubserg |

---

# 📘 Requirements

Before running the project, make sure you have:

| Requirement       | Detail                                                                |
| ----------------- | --------------------------------------------------------------------- |
| 🐳 Docker Desktop | Latest version                                                        |
| ☕ Java 25         | Required for local development (if not running the backend in Docker) |

Verify Docker is installed:

```bash
docker --version
docker compose version
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

---

## 2. Create your environment file

Copy:

```text
.env.example
```

to

```text
.env
```

and update the values if necessary.

Example:

```env
DB_NAME=riftfolio
DB_USERNAME=riftfolio_app
DB_PASSWORD=your_password
JWT_SECRET=a_long_random_string_at_least_32_characters
```

---

## 3. Start the application

Build and start all services:

```bash
docker compose up --build
```

The first build may take a couple of minutes.

After that, you can simply run:

```bash
docker compose up
```

---

## 4. Stop the application

```bash
docker compose down
```

---

# 🗄️ Database

The PostgreSQL database runs inside Docker.

To open a PostgreSQL shell:

```bash
docker exec -it riftfolio-db psql -U riftfolio_app -d riftfolio
```

Useful commands:

```sql
\dt      -- List tables
\d table -- Describe a table
\q       -- Exit
```

---

# 💻 Frontend

The frontend lives in `webapp/` and is built with **React**, **TypeScript**, and **Vite**.

## 1. Install dependencies

```bash
cd webapp
npm install
```

## 2. Start the dev server

```bash
npm run dev
```

## 3. Open the app

```text
http://localhost:5173
```

The frontend expects the backend to be running at `http://localhost:8080`.

---

# 📂 Project Structure

```text
RiftFolio/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── init.sql
│   └── pom.xml
└── webapp/
    ├── src/
    ├── package.json
    └── vite.config.ts
```

---

# 🔧 Development

Whenever you make changes to the backend code, rebuild the application:

```bash
docker compose up --build
```

---

<div align="center">

*Made with 💙 by Clubserg & Megu*

</div>