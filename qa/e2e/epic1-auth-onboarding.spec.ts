import { test, expect } from '@playwright/test';

// EPIC 1: Autenticación, Perfiles y Onboarding Legal

test.describe('EPIC 1 - B2B Registration and Onboarding', () => {
  const FRONTEND_URL = process.env.BASE_URL || 'http://localhost:3031';

  test('QA-E1-01: Registro B2B Exitoso', async ({ page }) => {
    // 1. Navegar al formulario de registro B2B
    await page.goto(`${FRONTEND_URL}/register/b2b`);
    
    // Validar visualización
    await expect(page.locator('h2')).toContainText('B2B Registration');

    // 2. Completar formulario (usando selectores correctos basados en RegisterB2BForm.tsx)
    await page.locator('input[type="text"]').first().fill('Tech Corp SA');
    await page.locator('input[placeholder="12345678-9"]').fill('76.123.456-7');
    await page.locator('input[type="email"]').fill('admin@techcorp.cl');
    await page.locator('input[type="password"]').fill('SecurePass123!');
    
    // MOCK: Interceptar ruta de registro para deolver éxito y esquivar validación de backend
    await page.route('**/auth/registrations/b2b', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Company successfully registered. You can now login.' })
      });
    });

    // 3. Enviar y verificar
    await page.locator('button:has-text("Register Company")').click();

    // El componente muestra un texto de success: "Company successfully registered. You can now login."
    await expect(page.locator('text=Company successfully registered')).toBeVisible();

    // Luego de 2 segundos redirige a /login (añadimos margen para Firefox)
    await expect(page).toHaveURL(/.*\/login/, { timeout: 6000 });
  });

  test('QA-E1-03: Onboarding de Proveedor (Granja 3D)', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/register/provider`);

    await expect(page.locator('h2')).toContainText('Provider Onboarding');

    // Email
    await page.locator('input[type="email"]').fill('contacto@3dprinthub.cl');
    // Password
    await page.locator('input[type="password"]').fill('SecurePass123!');
    // Capacity
    await page.locator('textarea[placeholder^="Describe your"]').fill('10 Prusa MK3S, 5 Bambu Lab X1C. Support PLA, PETG, ABS.');
    // Machines count
    await page.locator('input[type="number"]').fill('15');
    
    // MOCK: Evitamos enviar al backend real para aislar el test del UI
    await page.route('**/auth/registrations/provider', async route => {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ message: 'Success' }) });
    });

    // Envio
    await page.locator('button:has-text("Submit Application")').click();

    // Validar mensaje de éxito local y redirección a login
    await expect(page.locator('text=Success! Your application has been submitted')).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/, { timeout: 6000 });
  });

  test('QA-E1-F1: Login redirect based on role', async ({ page }) => {
    // El frontend al hacer login redirige basado en el backend
    await page.goto(`${FRONTEND_URL}/login`);

    await page.locator('input[name="email"]').fill('contacto@3dprinthub.cl');
    await page.locator('input[name="password"]').fill('SecurePass123!');
    
    // MOCK backend request
    await page.route('**/auth/session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token', user: { role: 'provider' } })
      });
    });

    await page.locator('button:has-text("Sign in")').click();

    // Provider redirecciona a /dashboard/provider
    await expect(page).toHaveURL(/.*\/dashboard\/provider/);
  });
});
