# Visual Regression Testing

Este directorio contiene tests de regresión visual usando Playwright's built-in
screenshot comparison.

## 🎯 Propósito

Los tests visuales capturan screenshots de páginas y componentes críticos y los
comparan contra imágenes baseline para detectar cambios visuales no
intencionales.

## 📸 Cobertura

### Páginas Críticas

- **Homepage**: Desktop, Mobile, Tablet
- **Services**: Index y páginas individuales (4 servicios)
- **404 Page**: Página de error

### Variaciones de Tema

- Light mode
- Dark mode

### Idiomas

- English (`/en`)
- Spanish (`/es`)

### Breakpoints Responsivos

- Mobile Small: 320x568
- Mobile Medium: 375x667
- Mobile Large: 414x896
- Tablet: 768x1024
- Desktop Small: 1024x768
- Desktop Medium: 1440x900
- Desktop Large: 1920x1080

### Componentes UI

- Navigation (desktop/mobile)
- Footer
- Theme toggle
- Skip to content link
- Contact form (empty/filled)
- Command palette (open/search)

## 🚀 Uso

### Ejecutar tests visuales

```bash
# Ejecutar todos los tests visuales
npx playwright test tests/visual/

# Ejecutar solo en un browser específico
npx playwright test tests/visual/ --project=chromium

# Ver reporte HTML
npx playwright show-report
```

### Generar/Actualizar baselines

**Primera vez** (generar baselines):

```bash
npx playwright test tests/visual/ --update-snapshots
```

**Actualizar baselines después de cambios intencionales**:

```bash
# Actualizar todos los baselines
npx playwright test tests/visual/ --update-snapshots

# Actualizar solo baselines de chromium
npx playwright test tests/visual/ --project=chromium --update-snapshots

# Actualizar baseline de un test específico
npx playwright test tests/visual/pages.spec.ts:10 --update-snapshots
```

### Ver diferencias

Cuando un test visual falla, Playwright genera tres imágenes:

1. **Expected**: La imagen baseline
2. **Actual**: La imagen capturada actual
3. **Diff**: Visualización de las diferencias

Ubicación:
`test-results/[test-name]/[screenshot-name]-{actual|expected|diff}.png`

## ⚙️ Configuración

### playwright.config.ts

```typescript
expect: {
    toHaveScreenshot: {
        maxDiffPixelRatio: 0.02,      // 2% diferencia máxima
        animations: 'disabled',        // Deshabilitar animaciones
        caret: 'hide'                  // Ocultar cursor de texto
    }
}
```

### Opciones por test

```typescript
await expect(page).toHaveScreenshot('name.png', {
  fullPage: true, // Screenshot de página completa
  maxDiffPixelRatio: 0.05, // Override del threshold
  clip: { x: 0, y: 0, width: 100, height: 100 }, // Crop específico
});
```

## 📝 Mejores Prácticas

### 1. Estabilización de Contenido

```typescript
// Esperar a que la red esté idle
await page.waitForLoadState('networkidle');

// Esperar timeout adicional para animaciones
await page.waitForTimeout(500);

// Deshabilitar animaciones CSS
await page.addStyleTag({
  content: '*, *::before, *::after { animation-duration: 0s !important; }',
});
```

### 2. Manejo de Contenido Dinámico

```typescript
// Ocultar fechas/horas dinámicas
await page.evaluate(() => {
  document.querySelectorAll('[data-dynamic]').forEach((el) => {
    el.textContent = 'PLACEHOLDER';
  });
});

// Mockear datos de API
await page.route('**/api/**', (route) => {
  route.fulfill({
    body: JSON.stringify({ data: 'mocked' }),
  });
});
```

### 3. Screenshots Específicos

```typescript
// Screenshot de componente específico
const component = page.locator('.my-component');
await expect(component).toHaveScreenshot('component.png');

// Solo viewport visible (no fullPage)
await expect(page).toHaveScreenshot('above-fold.png', {
  fullPage: false,
});
```

### 4. Naming Convention

```typescript
// ✅ Buenos nombres
'homepage-desktop.png';
'service-web-apps-mobile.png';
'navigation-dark-mode.png';
'contact-form-filled.png';

// ❌ Malos nombres
'test1.png';
'screenshot.png';
'image-v2.png';
```

## 🐛 Troubleshooting

### Test falla en CI pero pasa localmente

**Problema**: Diferencias de rendering entre entornos.

**Solución**:

```bash
# Generar baselines en CI
npx playwright test --update-snapshots

# O usar Docker con la misma imagen que CI
docker run -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.40.0 \
    npx playwright test --update-snapshots
```

### Diferencias por fuentes

**Problema**: Fuentes no cargadas o diferentes.

**Solución**:

```typescript
// Esperar a que fuentes estén listas
await page.evaluate(() => document.fonts.ready);
```

### Animaciones causan diferencias

**Problema**: Animaciones CSS/JS activas.

**Solución**:

```typescript
// Ya configurado en playwright.config.ts
expect: {
  toHaveScreenshot: {
    animations: 'disabled';
  }
}
```

### Threshold muy estricto

**Problema**: Pequeñas diferencias causadas por antialiasing.

**Solución**:

```typescript
// Aumentar maxDiffPixelRatio para ese test
await expect(page).toHaveScreenshot('name.png', {
  maxDiffPixelRatio: 0.05, // 5% en lugar de 2%
});
```

## 📊 Métricas

### Tiempo de Ejecución

- ~10-15 segundos por screenshot
- Total: ~8-10 minutos para 33 tests (en paralelo)

### Tamaño de Baselines

- ~500KB - 2MB por screenshot full page
- ~50KB - 200KB por componente
- Total: ~30-50MB para todos los baselines

### Mantenimiento

- Actualizar baselines: Después de cambios intencionales de UI
- Revisar failures: Cada PR que modifica UI
- Limpiar baselines viejos: Trimestral

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
- name: Run visual regression tests
  run: npx playwright test tests/visual/

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-visual-results
    path: test-results/
```

### Pre-commit Hook

```bash
# .husky/pre-commit
npx playwright test tests/visual/ --project=chromium
```

## 📚 Referencias

- [Playwright Screenshots](https://playwright.dev/docs/screenshots)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)
