# Plan de Pruebas QA Automatizado - FDS (From Design Studio)

## 1. Estrategia de Pruebas y Stack Tecnológico
Basado en las directrices de `qa-tester`, la arquitectura del proyecto (NestJS en BE, Turbo/React en FE) y la integración de Playwright:

- **E2E Testing (Browser Automation):** Framework: Playwright (`playwright-skill`). Se ejecutarán flujos automatizados que cubren el "Happy Path" y casos intermedios en el cliente y proveedor.
- **Integration Testing (API/DB):** Jest y Supertest en el Backend (NestJS).
- **Unit Testing:** Jest para validaciones complejas del negocio (cálculo de RUT, matching rules logísticas, lógica ofuscación de nombres).

### Fases del Workflow de QA Integrado
1. **Unit Testing:** Componentes aislados (FE) y servicios/utilities (BE).
2. **Integration Testing:** Endpoints (REST), Webhooks (MinIO, Webpay/MercadoPago), Storage services.
3. **E2E Testing:** Playwright ejecutado sobre los flujos visuales completos.

---

## 2. Casos de Prueba Automatizados por Épica (User Flows)

### EPIC 1: Autenticación, Perfiles y Onboarding Legal

#### Casos de Prueba E2E (Playwright)
- **QA-E1-01 (Registro B2B Exitoso):** 
  - *Acción:* Llenar formulario de Empresa con RUT válido y correo corporativo.
  - *Expectativa:* Redirección exitosa, rol asignado `ROLE_CLIENT`.
- **QA-E1-02 (Validaciones B2B):** 
  - *Acción:* Intentar registrar RUT bloqueado, formato erróneo, o correo gratuito (gmail.com).
  - *Expectativa:* Bloqueo en el formulario por validación inline y error del servidor.
- **QA-E1-03 (Onboarding Proveedor):** 
  - *Acción:* Registro como Granja 3D y simular drag & drop de documento PDF.
  - *Expectativa:* Estado queda en `PENDING_APPROVAL`. Redirigido a panel restringido.
- **QA-E1-04 (Aprobación Admin):** 
  - *Acción:* Login como Admin, navegar al dashboard de proveedores, aprobar documento.
  - *Expectativa:* Estado de proveedor transiciona a `ACTIVE`.

#### Pruebas de Backend
- **Test:** Enviar un payload POST `/auth/register` verificando emisión de Token JWT válido y hashing correcto de password con bcrypt.

---

### EPIC 2: Ingreso de Órdenes de Trabajo y NDA Seguros

#### Casos de Prueba E2E (Playwright)
- **QA-E2-01 (Creación de Draft OT):** 
  - *Acción:* Cliente inicia OT, simula subida de archivo CAD y rellena el formulario de material/relleno.
  - *Expectativa:* Se crea una OT (Orden de Trabajo) en estado Draft y avanza tras "Publicar" a estado `OPEN`.
- **QA-E2-02 (Bloqueo por NDA a Granja 3D):** 
  - *Acción:* Proveedor (Granja) navega al listado y da clic en una OT `OPEN`.
  - *Expectativa:* UI levanta el Modal tipo Clic-Wrap NDA. El botón de descargar modelo está deshabilitado.
- **QA-E2-03 (Aceptación de NDA):** 
  - *Acción:* En el Modal, el proveedor presiona "Aceptar y ver detalles". 
  - *Expectativa:* Modal desaparece, interfaz se desbloquea, habilitando panel de oferta y boton de descarga (con rastro de timestamp).

#### Pruebas de Backend
- **Test:** Testing del controlador de Webhooks de Storage (MinIO) verificando inyección local de atributos de volumen.

---

### EPIC 3: Motor de Licitaciones y Matching

#### Casos de Prueba E2E (Playwright)
- **QA-E3-01 (Ofuscación Cliente):** 
  - *Acción:* Login Proveedor y visitar lista de `OPEN` OTs.
  - *Expectativa:* Confirmar mediante aserciones DOM (`locator`) que el nombre del cliente NO aparece en pantalla.
- **QA-E3-02 (Postulación Bidding):** 
  - *Acción:* Proveedor ingresa \$X CLP y días de fabricación en la OT y envía.
  - *Expectativa:* El estado de la puja queda en `PENDING`.
- **QA-E3-03 (Adjudicación de Oferta):** 
  - *Acción:* Login Cliente corporativo, entrar a la OT, y ver grilla de oferentes (deben aparecer ofuscados como "Proveedor #A2"). Hacer clic en "Aceptar Oferta".
  - *Expectativa:* OT pasa a estado `ACCEPTED` y el oferente perdedor ve su puja como rechazada.

#### Pruebas de Backend
- **Test:** Verificar integridad de transacciones si múltiples POST requests de Bidding actúan sobre la misma orden simultáneamente.

---

### EPIC 4: Checkout, Transacciones y Trazabilidad

#### Casos de Prueba E2E (Playwright)
- **QA-E4-01 (Checkout Flow):** 
  - *Acción:* En estado `ACCEPTED`, cliente hace clic en "Pagar".
  - *Expectativa:* Interceptación de red en Playwright a la URL de gateway (`page.route()`) para simular respuesta 200 de pago exitoso. 
- **QA-E4-02 (Recepción de Desofuscación):** 
  - *Acción:* Login Proveedor adjudicado, visualizar la misma OT (ahora en estado `PAID_AND_IN_PRODUCTION`).
  - *Expectativa:* Aparecen desofuscados los datos exactos del cliente (nombre empresa, dirección logística de envío).
- **QA-E4-03 (Máquina de Estados Logística):** 
  - *Acción:* Proveedor da clic en avanzar estados (`PRINTING` -> `QUALITY_CHECK` -> `DISPATCHED`).
  - *Expectativa:* Envío de URL de tracking. El cliente en su sesión paralela debe ver los cambios de estado aplicados instántaneamente en el Timeline.

#### Pruebas de Backend
- **Test:** Validar el Webhook callback desde MercadoPago/Webpay mediante Jest E2E, corroborando que transiciona la orden a `PAID_AND_IN_PRODUCTION` y rechaza otras llamadas sin hash de firma válido.

---

## 3. Implementación de Automatización y CI/CD (Quality Gates)

### Ejecución de E2E Automático
Se definirán scripts interactivos que hacen uso del entorno levantado en NextJS (e.g., puerto `3000`) y NestJS (e.g., puerto `3001`).

```javascript
// Ejemplo conceptual Playwright (Basado en el skill playwright-test-*)
test('Flujo E2E - Client publica OT y Proveedor acepta NDA', async ({ page }) => {
  // 1. Setup Data vía API Helpers / Auth
  await page.goto('http://localhost:3000/auth/login');
  // ... Login y subida
  // 2. Aserciones
  await expect(page.locator('.status-badge')).toHaveText('OPEN');
});
```

### Quality Gates recomendados para el CI:
- **Cobertura Backend:** `< 80%` en archivos funcionales fallará el Pipeline.
- **Flujos Críticos Requeridos (Smoke Test):** `QA-E1-01`, `QA-E2-03`, `QA-E3-03` y `QA-E4-01` forman el **Core Smoke Suite** que debe correr en cada Pull Request.
- **Desempeño Visual:** Playwright capturará *screenshots* comparativos de visualizaciones de dashboards, previendo rupturas de CSS en el entorno unificado (`turbo build`).
