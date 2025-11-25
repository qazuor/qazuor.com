# TODOs - Performance Optimization

## Setup & Configuration

- [x] PB-001: Configurar Vite para code splitting manual
- [x] PB-002: Configurar compression middleware para desarrollo
- [x] PB-003: Configurar Vercel headers para compresión en producción
- [x] PB-004: Configurar preload hints en BaseLayout
  - ✅ Creada integración `astro-font-preloader` para auto-copiar fuentes
  - ✅ Implementado `getImage()` para imagen hero optimizada a WebP
  - ✅ 4 preload hints críticos (3 fuentes + 1 imagen)
  - ✅ Validado por qa-engineer (sin errores 404)

## Code Splitting - i18n

- [ ] PB-005: Refactorizar i18n/ui.ts para lazy loading de namespaces
- [ ] PB-006: Implementar dynamic imports por idioma
- [ ] PB-007: Crear función loadNamespace() con cache
- [ ] PB-008: Precargar idioma alternativo en background
- [ ] PB-009: Actualizar TranslatedText component para lazy loading
- [ ] PB-010: Actualizar todos los componentes que usan traducciones

## Code Splitting - Icons

- [x] PB-011: Crear SVG sprite para iconos de Timeline
  - ✅ Creada integración `TimelineIconSprite.astro` con `import.meta.glob`
  - ✅ Sprite inline en HTML (2.6KB vs 85KB chunk anterior)
  - ✅ Reducción del 99.3% en tamaño de iconos (393KB → 2.6KB)
  - ✅ 28 iconos SVG generados en sprite con symbols
- [x] PB-012: Refactorizar TimelineIcon component para usar sprite
  - ✅ Reducido de 95 líneas a 34 líneas
  - ✅ Usa `<use href="#timeline-{iconName}">` para referencias
  - ✅ Mantiene backward compatibility (misma API)
  - ✅ Mejorada accesibilidad con atributos aria
- [x] PB-013: Implementar lazy loading de iconos no visibles
  - ✅ CANCELADO - No aplicable para Astro SSG (sprite inline es más eficiente)
- [x] PB-014: Optimizar imports de iconos UI (sun, moon, command, etc.)
  - ✅ CANCELADO - lucide-react ya está optimizado (tree-shakeable por defecto)
- [x] PB-015: Crear barrel export optimizado para iconos
  - ✅ Removido manual chunking de timeline icons en astro.config.mjs
  - ✅ Timeline.js reducido a 18KB (6.3KB gzipped)

## Image Optimization

- [x] PB-016: Agregar preload para imagen LCP (photo1.png) en BaseLayout
  - ✅ Completado en PB-004 con `getImage()` optimizado
- [x] PB-017: Configurar fetchpriority="high" en imagen hero
  - ✅ Completado en PB-004 con atributo `fetchpriority="high"`
- [x] PB-018: Validar que Astro Image genere formatos optimizados (AVIF/WebP)
  - ✅ Confirmado: genera WebP optimizado (42KB vs ~100KB PNG)

## Lazy Loading - Components

- [ ] PB-019: Implementar lazy loading para Timeline component
- [ ] PB-020: Implementar lazy loading para ProjectsFeaturedStack
- [ ] PB-021: Implementar lazy loading para SkillsRadarGrid
- [ ] PB-022: Implementar lazy loading para TestimonialsSection
- [ ] PB-023: Implementar lazy loading para Contact form
- [ ] PB-024: Crear wrapper genérico LazyComponent con Intersection Observer

## Bundle Optimization

- [ ] PB-025: Configurar manualChunks para vendors (React, GSAP, etc.)
- [ ] PB-026: Separar chunk para i18n locales
- [ ] PB-027: Separar chunk para iconos SVG
- [ ] PB-028: Optimizar barrel exports problemáticos
- [ ] PB-029: Analizar bundle size con rollup-plugin-visualizer

## Critical CSS

- [ ] PB-030: Extraer CSS crítico para hero section
- [ ] PB-031: Inline CSS crítico en BaseLayout
- [ ] PB-032: Defer non-critical CSS
- [ ] PB-033: Optimizar orden de carga de fonts

## DOM Optimization

- [ ] PB-034: Reducir profundidad de componentes anidados
- [ ] PB-035: Simplificar estructura de SVGs complejos
- [ ] PB-036: Combinar elementos redundantes donde sea posible
- [ ] PB-037: Validar que DOM final tenga < 2000 elementos

## Testing & Validation

- [ ] PB-038: Configurar Lighthouse CI en GitHub Actions
- [ ] PB-039: Crear performance budget en lighthouserc.js
- [ ] PB-040: Ejecutar Lighthouse en local y validar LCP < 300ms
- [ ] PB-041: Ejecutar Lighthouse en local y validar FCP < 250ms
- [ ] PB-042: Validar cadena crítica < 400ms con Chrome DevTools
- [ ] PB-043: Validar transfer size < 800KB
- [ ] PB-044: Probar lazy loading con throttling (Fast 3G)
- [ ] PB-045: Validar que CLS se mantenga en 0.00
- [ ] PB-046: Test de accesibilidad con screen reader
- [ ] PB-047: Test de navegación por teclado en componentes lazy loaded

## Cleanup & Documentation

- [ ] PB-048: Remover console.log("pog") detectado en análisis
- [ ] PB-049: Corregir warnings de Manifest (name, short_name)
- [ ] PB-050: Documentar configuración de code splitting
- [ ] PB-051: Documentar estrategia de lazy loading
- [ ] PB-052: Crear guía de performance para nuevas features
- [ ] PB-053: Actualizar README con métricas de performance

## Deployment

- [ ] PB-054: Deploy a preview environment
- [ ] PB-055: Ejecutar Lighthouse CI en preview
- [ ] PB-056: Comparar métricas before/after
- [ ] PB-057: Deploy a producción
- [ ] PB-058: Monitorear Core Web Vitals post-deploy
- [ ] PB-059: Validar mejoras en producción real

## Post-Launch

- [ ] PB-060: Documentar learnings en CLAUDE.md
- [ ] PB-061: Crear benchmark para futuras optimizaciones
- [ ] PB-062: Identificar próximas oportunidades de mejora
