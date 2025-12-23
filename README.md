# 📱 Social Media Fullstack – Technical Assessment

## 👩‍💻 Autora
**Juliana María Florez Morales**  
Full Stack Developer  

---

## 🧠 Descripción general

Este proyecto implementa una **aplicación tipo red social**, construida con una arquitectura **Fullstack**, que permite:

- Autenticación de usuarios
- Creación de publicaciones (texto e imagen)
- Visualización de publicaciones
- Sistema de likes con comportamiento *toggle*
- Perfil de usuario
- Manejo de sesión

El sistema está compuesto por:
- **Backend:** NestJS
- **Frontend:** React + Vite
- **Base de datos:** PostgreSQL
- **Infraestructura:** Docker


---

# 🔧 Frontend – React.js

## 🛠 Tecnologías utilizadas
- React
- Vite
- JavaScript
- Fetch API
- Docker

---

## 📂 Estructura del frontend

```css
src/
 ├── pages/
 │   ├── Dashboard
 │   └── Profile
 │   ├── PostCard
 │   ├── CreatePostCard
 │   └── PostList
 ├── components/
 │   ├── ProtectedRoute
 ├── services/
 │   ├── auth
 │   ├── post
 │   ├── post-likes
 │   └── user
```

---

## Decisiones técnicas (Frontend)
- Separación de lógica en services
- Manejo de estado con useState y useEffect
- Control de sesión con localStorage
- Componentes reutilizables
- Estilos inline para mayor claridad en la prueba técnica
---

## ❤️ Integración de Likes

- El click en el corazón ejecuta una llamada al backend
- El backend decide si agrega o elimina el like
- El frontend solo refleja el resultado
---

## 🐳 Frontend – Docker

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite dev server debe escuchar en 0.0.0.0 dentro del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### docker-compose

```docker-compose
version: "3.8"

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev -- --host 0.0.0.0 --port 5173
```

## Levantar Frontend

```bash
docker compose up -d --build
```

## Frontend disponible en:
```arduino
http://localhost:5173
```

Si no se desea lenvantar con el docker sino manualmente, se debe aplicar los siguientes comandos

```bash
npm i
npm run dev
```

Esto para que instale todas las dependencias que hace que la app funciona y finalmente el otro comando para correr manualmente el frontend