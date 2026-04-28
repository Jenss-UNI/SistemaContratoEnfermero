# SistemaContratoEnfermero - CuidadoSalud

## 👥 Integrantes del equipo

- Parcco Dominguez, Shirley Karen   →   Github: [shirley777jazz]
- Pérez Delgado, Estefani           →   Github: [EstefaniPerez47]
- Garcia Rondo, Raúl Jaren          →   Github: [GarciaR23]
- Luna Levita, Jens Jeremies          →   Github: [Jenss-UNI]
- Gavino Saravia, Cristian Meyer    →   Github: [meyer1142x]
- Zapata Yance, Eunice Anghely      →   Github: [zDevCode04]

---

## 📌 Descripción del proyecto

CuidadoSalud es una plataforma web orientada a la búsqueda y contratación de enfermeros a domicilio de manera segura y confiable. 

El sistema busca reducir la informalidad en este tipo de servicios mediante la validación de credenciales profesionales, la implementación de contratos digitales y el uso de pagos seguros, brindando mayor tranquilidad a las familias y mejores oportunidades laborales a los profesionales de salud.

---

## 🔗 Link de Figma

https://www.figma.com/design/NYJUyPMdMavQJPu1RAyOoM/WmOEObYE7W?node-id=0-1&t=v4ikLZnmzMI7Kc5w-1

---

## ⚙️ Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Java
- Spring Boot

### Base de datos
- PostgreSQL

### Control de versiones
- Git
- GitHub

---

## 🌿 Ramas utilizadas (Git Flow)

- `main` → Versión estable del proyecto  
- `develop` → Integración de funcionalidades  
- `feature/nombre-de-tu-tarea` → Desarrollo de una funcionalidad 
- `release/nombre-de-la-release` → Versión candidata a producción  
- `hotfix/nombre-de-tu-hotfix` → Corrección de errores  

---

## 🧾 Nomenclatura de commits

Se sigue una convención de commits para mantener orden y claridad en el repositorio:

- `feat`: Nueva funcionalidad  
  - Ejemplo: `feat: creación de login`

- `fix`: Corrección de errores  
  - Ejemplo: `fix: validación de contraseña`

- `style`: Cambios de diseño (CSS, UI)  
  - Ejemplo: `style: mejora en formulario de login`

- `refactor`: Mejora de código sin cambiar funcionalidad  
  - Ejemplo: `refactor: optimización de controlador`

- `docs`: Documentación  
  - Ejemplo: `docs: actualización de README`

- `test`: Pruebas  
  - Ejemplo: `test: pruebas de login`

- `chore`: Tareas menores o mantenimiento  
  - Ejemplo: `chore: actualización de dependencias`

---

## 🔄 Flujo de trabajo básico

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-tu-tarea

git add .
git commit -m "feat: creación de login"
git push origin feature/nombre-de-tu-tarea

git checkout develop
git pull origin develop
git branch -d feature/nombre-de-tu-tarea
```

---

## 🚀 Ejecución del proyecto

### 1. Clonar repositorio
```bash
git clone [URL_DEL_REPOSITORIO]

cd SistemaContratoEnfermero

### 2. Ejecutar el proyecto

# Backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev

```

---

## 📁 Estructura del proyecto

```bash
sistemaContratoEnfermero/
│
├── README.md
├── .gitignore
│
├── docs/
│   ├── mockups/
│   └── evidencias/
│
├── Frontend-Sistema/
├── Backend-Sistema/
|  
└── database/
    └── script.sql
```

---

## 📸 Evidencias

Ver carpeta:


/docs/evidencias


---

## 📌 Funcionalidades actuales

- Login de usuario
- Registro de usuario
- Registro de enfermeros
- ¿Olvidaste tu contraseña?
- Inicio


## 📋 Requisitos

- Java 17 o superior
- Node.js 16 o superior
- npm 8 o superior
- PostgreSQL
- Maven

---


