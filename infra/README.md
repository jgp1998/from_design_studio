# FDS (From Design Services) - Infrastructure & DevOps ⚙️

Este directorio contiene toda la infraestructura como código (IaC), configuración de despliegue, y contenedores necesarios para ejecutar la plataforma FDS (tanto localmente como en producción).

## Objetivo
Mantener un entorno de desarrollo consistente entre todos los desarrolladores (Frontend y Backend) y facilitar el paso a producción de los componentes tecnológicos de FDS (Base de Datos, APIs, Caché).

## Contenido de este Directorio

*   `docker-compose.yml` (Próximamente): Archivo de orquestación para levantar los servicios locales básicos.
*   `db/`: Scripts de inicialización y migración manual de PostgreSQL, si aplican.
*   `scripts/`: Utilidades para automatizar tareas (ej. seeders de BD, scripts CI/CD).

## Guía de Inicio Rápido (Local)

Para levantar el entorno completo de desarrollo en tu máquina (sin instalar los motores directamente en tu SO):

1. Asegúrate de tener **Docker** y **Docker Compose** instalados.
2. Abre la terminal en esta misma carpeta (`infra/`).
3. Ejecuta el comando mágico:
   ```bash
   docker-compose up -d
   ```
4. Este comando típicamente levantará:
    - **PostgreSQL**: Motor principal de base de datos relacional para Licitaciones y Usuarios.
    - **pgAdmin o similar** (Opcional): Para gestionar visualmente la BD.
    - **Redis** (Opcional Futuro): Para cachés o colas de trabajo pesadas de procesamiento 3D.

## Variables de Entorno (Secrets)

No incluyas contraseñas reales, tokens de AWS o secret keys de firmas de NDA en tu código. Utiliza los archivos `.env` (que deben estar ignorados en `.gitignore`) para gestionar las credenciales de los servicios aquí definidos.

---
*FDS - Innovando la manufactura distribuida (MaaS) en Chile.*
