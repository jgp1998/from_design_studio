import { test, expect } from '@playwright/test';

// EPIC 2: Ingreso de Órdenes de Trabajo y NDA Seguros

test.describe('EPIC 2 - Work Orders and NDA', () => {
  const FRONTEND_URL = process.env.BASE_URL || 'http://localhost:3031';

  test.beforeEach(async ({ page }) => {
    // Setup login isolation disabled para ganar velocidad en testing local
  });

  test('QA-E2-01: Creación de Orden de Trabajo (Draft a OPEN)', async ({ page }) => {
    // Login Cliente B2B
    await page.goto(`${FRONTEND_URL}/login`);
    await page.locator('input[type="email"]').fill('admin@techcorp.cl');
    await page.locator('input[type="password"]').fill('SecurePass123!');
    
    await page.route('**/auth/session', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'mock-token', user: { role: 'client' } }) });
    });
    await page.locator('button:has-text("Sign in")').click();

    // Esperar a que el login resuelva y redirija al dashboard antes de forzar otra navegación
    await page.waitForURL(/.*\/dashboard\/client/);

    // Navegar a crear OT vía URL directa o botón
    await page.goto(`${FRONTEND_URL}/bidding/new`);

    // 1. Subida temporal de archivo CAD
    await page.locator('input[type="file"]').setInputFiles({
      name: 'pieza_motor.stl',
      mimeType: 'model/stl',
      buffer: Buffer.from('STL_CONTENT_SIMULATED')
    });
    await expect(page.locator('text=File uploaded successfully')).toBeVisible({ timeout: 15000 });
    
    // Mocks for API.Orders methods
    await page.route('**/orders/files/presigned-url', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: 'http://mock.dl', file_id: '123' }) });
    });
    await page.route('**/orders', async route => {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 'ORD-123' }) });
    });

    // 2. Seleccionar parámetros
    await page.locator('select').nth(0).selectOption('PLA'); // Material
    await page.locator('select').nth(1).selectOption('Blue'); // Color
    await page.locator('select').nth(2).selectOption('±0.1mm'); // Tolerance
    // Input number for quantity
    await page.locator('input[type="number"]').fill('1'); 
    // Details
    await page.locator('textarea').fill('Imprimir en alta resolución');

    // 3. Aceptar NDA
    await page.locator('input[type="checkbox"]').check();

    // 4. Submit
    await page.locator('button:has-text("Generate Work Order")').click();
    
    // 5. Success
    await expect(page.locator('text=Work Order Created!')).toBeVisible();
  });

  test('QA-E2-02 y 03: Bloqueo por NDA a Granja 3D y Aceptación', async ({ page }) => {
    // Login Proveedor
    await page.goto(`${FRONTEND_URL}/login`);
    await page.locator('input[type="email"]').fill('contacto@3dprinthub.cl');
    await page.locator('input[type="password"]').fill('SecurePass123!');

    await page.route('**/auth/session', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'mock-token', user: { role: 'provider' } }) });
    });
    await page.locator('button:has-text("Sign in")').click();

    // Proveedor navega al Board (segun el código es /dashboard/provider)
    await page.waitForURL(/.*\/dashboard\/provider/);

    // Buscar la orden en la tabla
    const orderRow = page.locator('tr').filter({ hasText: 'industrial_valve.stl' }).first();
    await orderRow.locator('button:has-text("View & Bid")').click();

    // Navega a detail page
    await page.waitForURL(/.*\/orders\/.*/);

    // Verificamos aviso NDA (QA-E2-02)
    await expect(page.locator('text=Confidentiality Agreement Required')).toBeVisible();
    
    // El botón para ofertar no debe estar visible hasta que acepte y descargue
    await expect(page.locator('button:has-text("Submit Offer to Client")')).toBeHidden();

    // Requisito: Aceptar NDA (QA-E2-03)
    await page.locator('input[type="checkbox"]').check();

    // Enviar click a Descargar (simulamos para no bloquear playwright)
    await page.route('**/orders/*/files/presigned-download', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: 'http://mock.dl' }) });
    });
    await page.route('**/orders/*/nda-signatures', async route => {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ signatureId: 'sig-123' }) });
    });

    await page.locator('button:has-text("Accept NDA & Download 3D File")').click();

    // Verificar que indica "File downloaded successfully"
    await expect(page.locator('text=File downloaded successfully')).toBeVisible();

    // Ahora la UI muestra el formulario para ofertar
    await expect(page.locator('button:has-text("Submit Offer to Client")')).toBeVisible();
  });
});
