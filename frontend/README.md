# FDS (From Design Services) - Frontend Web Client 🚀

Este directorio alberga la aplicación web de la plataforma FDS. Está diseñada para ofrecer una experiencia SaaS B2B moderna, fluida y con alto nivel de seguridad aparente. Atiende a dos perfiles diametralmente distintos: **Clientes (Creadores de Demanda y Compradores)** y **Proveedores (Fabricantes 3D).**

## Stack Tecnológico Principal

*   **Framework:** React (implementado sobre Next.js o Vite).
*   **Tipado Fuerte:** TypeScript (Vital para la coherencia con el Backend).
*   **Estilos y Componentes:** Tailwind CSS + shadcn/ui.
*   **Manejo de Íconos:** Lucide-React.
*   **Gestión de Estado (Futuro):** React Context o Zustand (Para carrito de compras y datos asíncronos).

## Vistas Core (El MVP de la Aplicación)

El frontend orquesta las siguientes vistas principales:

1. **La Dualidad Inicial (`LandingPage`):** La puerta de entrada al marketplace con CTAs claros hacia Licitar (cotización personalizada) o Comprar (tienda directa).
2. **Flujo Cliente:**
   *   `ClientNewBidding`: Formulario de especificaciones técnicas interactivas y ruteo "Drag & Drop" del modelo 3D con aceptación legal de NDA.
   *   `ClientDashboard`: Visión de alto nivel del estatus logístico de órdenes creadas.
3. **Flujo Proveedor:**
   *   `ProviderDashboard`: "Wall Street" interno donde los fabricantes filtran y escanean lictaciones públicas.
   *   `ProviderOTDetail`: Detalle estricto donde el botón de "Ofertar Precio" queda escondido detrás de la barrera criptográfica/legal del NDA.
4. **Flujo Tienda:**
   *   `StoreCatalog` & `ProductDetail`: Experiencia E-commerce paramétrica clásica (Material, Tolerancias, Tamaños).

## Arquitectura de Carpetas Frontend (Sugerida)

```
frontend/
├── /src
│   ├── /components      # Piezas UI reutilizables (Botones, Inputs de shadcn)
│   ├── /views o /pages  # Vistas completas ensambladas (Dashboard, Checkout)
│   ├── /services        # Clientes HTTP (Axios/Fetch) para conectar con la API de .NET
│   ├── /types           # Tipos TypeScript (.d.ts) compartidos
│   ├── /store o /hooks  # Contextos React (ShoppingCart, AuthState)
│   └── /assets          # Imágenes estáticas o CSS global
```

## Instrucciones de Desarrollo

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (versión v18 o superior).
*   Gestor de paquetes recomendado: `npm`, `yarn` o `pnpm`.

### Iniciar la App Localmente

1. Navega a esta carpeta (`cd frontend`).
2. Instala por primera vez las dependencias de Node:
   ```bash
   npm install
   ```
3. Levanta el servidor de desarrollo ultrarrápido (Vite/Next):
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173` (o `:3000`) en tu navegador para interactuar con la interfaz B2B de FDS.
