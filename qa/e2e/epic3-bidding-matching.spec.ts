import { test, expect } from '@playwright/test';

// EPIC 3: Motor de Licitaciones y Matching

test.describe('EPIC 3 - Bidding and Matching', () => {
  const FRONTEND_URL = process.env.BASE_URL || 'http://localhost:3031';

  test('QA-E3-01: Visualización ofuscada en el Board (Granja 3D)', async ({ page }) => {
    // Login Proveedor
    await page.goto(`${FRONTEND_URL}/login`);
    await page.locator('input[type="email"]').fill('contacto@3dprinthub.cl');
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.route('**/auth/session', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'mock-token', user: { role: 'provider' } }) });
    });
    await page.locator('button:has-text("Sign in")').click();

    await page.waitForURL(/.*\/dashboard\/provider/);

    // Validar que el nombre del cliente NO aparece en la tabla
    const tableHtml = await page.locator('table').innerText();
    expect(tableHtml).not.toContain('Tech Corp SA');
    expect(tableHtml).not.toContain('Cliente Confidencial'); // Opcional, pero confirmar que no hay fuga.
  });

  test('QA-E3-02: Ingreso de Puja (Bidding)', async ({ page }) => {
    // Vamos a la página de detalle de una orden simulada
    await page.goto(`${FRONTEND_URL}/dashboard/provider/orders/WO-104`);

    // Simular que el NDA ya está aceptado y archivo descargado (forzando ui)
    await page.route('**/orders/*/files/presigned-download', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: 'http://mock.dl' }) });
    });
    await page.route('**/orders/*/nda-signatures', async route => {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ signatureId: 'sig-123' }) });
    });
    // Marcar checkbox y boton...
    await page.locator('input[type="checkbox"]').check();
    await page.locator('button:has-text("Accept NDA")').click();
    await expect(page.locator('text=File downloaded successfully')).toBeVisible();

    // Ingresar monto y plazo en el ProviderOTDetail
    await page.locator('input[placeholder="0.00"]').fill('45000');
    await page.locator('input[placeholder="7"]').fill('3');
    
    // Envio (mock de backend via playwright para que pase sin db)
    await page.route('**/bids', async route => {
      await route.fulfill({ status: 201 });
    });

    await page.locator('button:has-text("Submit Offer to Client")').click();

    // Verificar notificación de éxito
    await expect(page.locator('h2:has-text("Offer Submitted!")')).toBeVisible();
  });

  test('QA-E3-03: Adjudicación Anónima por parte del Cliente', async ({ page }) => {
    // Login Cliente B2B
    await page.goto(`${FRONTEND_URL}/login`);
    await page.locator('input[type="email"]').fill('admin@techcorp.cl');
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.route('**/auth/session', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'mock-token', user: { role: 'client' } }) });
    });
    
    // Al cargar el Dashboard, API.Orders.getOrders() necesita devolver data falsa
    await page.route('**/orders*', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 'ORD-123', status: 'open', files: [{fileName: 'pieza.stl'}], bids: [{ id: 'off-1', provider: { companyName: 'Test Provider' }, amount: 100 }] }]) });
    });
    
    await page.locator('button:has-text("Sign in")').click();

    await page.waitForURL(/.*\/dashboard\/client/);

    // Seleccionar revisar ofertas
    await page.locator('tr').nth(1).locator('button:has-text("View")').click();

    // WorkOrderModal shows up
    await expect(page.locator('text=Received Offers')).toBeVisible();
    await expect(page.locator('h4:has-text("Test Provider")')).toBeVisible();
    await expect(page.locator('p:has-text("$100")')).toBeVisible();
    
    // Adjudicar
    await page.locator('button:has-text("Accept Offer")').first().click();

    // Verificar UI de Procesando
    await expect(page.locator('p:has-text("Processing Acceptance")')).toBeVisible();
  });
});
