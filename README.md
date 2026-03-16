# FDS (From Design Services)

Bienvenido al repositorio oficial de **FDS - Startup de Manufactura Distribuida (MaaS)**. 

FDS es el puente B2B y B2C que democratiza el acceso a la manufactura 3D industrial en Chile. Nuestro objetivo es conectar diseños CAD/3D con una red calificada de fabricantes a través de un ecosistema seguro, protegiendo la propiedad intelectual (IP) y ofreciendo la mejor relación entre calidad, precio y tiempo de entrega.

---

## 🏗 Arquitectura del Proyecto

Este monorepo básico aloja las 3 piezas fundamentales de la plataforma FDS. Está diseñado para mantener la simplicidad, la fuerte separación de conceptos (Separation of Concerns) y el despliegue independiente.

Haz clic en cada carpeta para explorar su documentación y configuración específica:

### 1. [`/frontend`](./frontend/) 🖥️
El cliente web moderno (React/Next.js/Vite + TypeScript). Aquí reside toda la interfaz de usuario B2B/B2C, incluyendo:
- Sistema dual de Creadores de Demanda (Clientes) y Creadores de Oferta (Proveedores).
- Dashboard interactivo, Formulario de Licitaciones Drag&Drop y el Catálogo E-commerce.
- Integración visual con **shadcn/ui** y Tailwind CSS.

### 2. [`/backend`](./backend/) 🧠
El motor transaccional y orquestador central (API RESTful en .NET 8 / C#). Responsable de:
- El "Bidding Engine" (Lógica de asignación de Licitaciones y validación de Ofertas).
- Seguridad corporativa, protección de archivos CAD y flujos de aceptación de NDAs (Non-Disclosure Agreements).
- Gestión de base de datos relacional y orquestación de la Tienda de Componentes.

### 3. [`/infra`](./infra/) ☁️
La infraestructura como código (IaC) para entornos locales y de nube. Contiene:
- Orquestación Local con `docker-compose` (Motor PostgreSQL, Caché, Servicios Auxiliares).
- Scripts de automatización y guías logísticas de DevOps para FDS a escala de la Nube (ej. Azure/AWS).

---

## ⚡ Guía Rápida para Levantar FDS (Entorno de Desarrollo)

Para contribuir o testear el MVP completo de forma local, el flujo de trabajo sugerido para ambos fundadores es:

1. **Clonar este repositorio** en tu laptop.
2. Navegar a la carpeta `infra/` y ejecutar `docker-compose up -d` para **encender la Base de Datos PostgreSQL** y dependencias infraestructurales.
3. Abrir la carpeta `backend/` en tu IDE (.NET), aplicar migraciones (si las hay) e **iniciar la API**.
4. Abrir la carpeta `frontend/` en tu terminal, instalar paquetes con `npm install` e **iniciar la Aplicación React** con `npm run dev`.

---

## 🔒 Privacidad y Confidencialidad
Al ser un proyecto para el Programa CORFO/Start-Up Chile en fase MVP, este código fuente es de **propiedad exclusiva de FDS**. No divulgar claves de base de datos ni *secrets* (`.env`) en commits públicos.
