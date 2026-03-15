# FDS (From Design Services) - Backend API ⚙️

Este directorio contiene el "cerebro" y núcleo transaccional de la plataforma FDS. Construido bajo los más altos estándares de arquitectura e integridad corporativa para soportar el ecosistema B2B.

## Stack Tecnológico Principal

*   **Framework / Lenguaje:** .NET 8 (C#)
*   **Arquitectura:** API RESTful (Mínima / Clean Architecture recomendada).
*   **Base de Datos Relacional:** PostgreSQL (Motor provisto mediante Docker en la carpeta `infra/`).
*   **ORM:** Entity Framework Core.
*   **Seguridad:** Autenticación JWT y encriptación robusta para la validación de NDA.
*   **Manejo de Archivos:** Azure Blob Storage o AWS S3 (Para almacenamiento cifrado de archivos `.stl`/`.obj`).

## Responsabilidades de esta Capa

El Backend de FDS no es una simple API CRUD; orquesta la lógica de negocio crítica:
1. **Flujo de Licitaciones (Bidding Engine):** Recibir WorkOrders, notificar proveedores calificados y registrar Ofertas (Bids).
2. **Seguridad Comercial (NDAs):** Custodia de modelos 3D y autorización de descarga exclusiva para proveedores que asintieron legalmente.
3. **Tienda E-commerce:** Proveer el catálogo de productos parametrizables (material, color, cantidad).
4. **Logs Financieros:** Gestión del Checkout y conexión con pasarelas de pago (ej. Transbank / MercadoPago).

## Estructura de Proyectos (Sugerida)
A medida que el backend evolucione, se recomienda organizar los proyectos (`.csproj`) por dominio o capas:
- `FDS.Api` (Controladores/Endpoints expuestos al Frontend).
- `FDS.Application` (Casos de uso y reglas de negocio: *CrearLicitacion*, *AceptarOferta*).
- `FDS.Infrastructure` (Implementaciones técnicas: EF Core, clientes de S3/Azure, integración de Correos).
- `FDS.Domain` (Tus entidades puras: *User*, *WorkOrder*, *Bid*, *Product*).

## Instrucciones de Desarrollo

### Requisitos Previos
*   [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
*   Cualquier IDE (Visual Studio, Rider, VS Code).
*   La Base de Datos PostgreSQL ejecutándose (ver carpeta `infra/`).

### Iniciar la API Localmente
Toda la documentación interactiva de los endpoints (y los modelos Swagger que debe consumir el Frontend) estarán disponibles en modo desarrollo en `/swagger`.

```bash
# Restaurar dependencias de NuGet
dotnet restore

# Aplicar cualquier migración pendiente a la DB
dotnet ef database update

# Ejecutar el proyecto
dotnet run --project [Ruta-a-FDS.Api]
```
