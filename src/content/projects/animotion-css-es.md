---
title: Animotion CSS
description:
  Generador visual de animaciones CSS con línea de tiempo interactiva. Creá
  animaciones keyframe, transiciones y micro-interacciones sin escribir código
  manualmente.
longDescription:
  Una herramienta para desarrolladores que permite crear animaciones CSS
  visualmente. Incluye un editor de keyframes interactivo, 15 animaciones
  preset, 17 funciones de timing y vista previa en tiempo real. Exportá CSS
  listo para producción con un clic.
lang: es
category: open-source
tags: [Herramienta Dev, Generador CSS, Herramienta de Diseño, Animación]
technologies:
  [React, TypeScript, Vite, Tailwind CSS, Zustand, Radix UI, Motion, i18next]
images:
  - ./_images/animotion-css/1.png
  - ./_images/animotion-css/2.png
  - ./_images/animotion-css/3.png
mainImage: ./_images/animotion-css/1.png
githubUrl: https://github.com/qazuor/animotion-css
demoUrl: https://qazuor-animotion-css.vercel.app
featured: true
publishDate: 2025-11-25
order: 4
---

## Descripción del Proyecto

Escribir animaciones CSS a mano es tedioso. Encontrar el timing correcto, el
easing y los porcentajes de keyframes requiere prueba y error constante. Cada
vez que necesitaba una animación, me encontraba buscando herramientas online,
lidiando con interfaces desordenadas y copiando código que necesitaba ajustes.

Animotion CSS es mi solución personalizada: un generador visual de animaciones
donde puedo ver exactamente lo que estoy creando en tiempo real y exportar CSS
limpio y listo para producción al instante.

## Características Principales

### Editor Visual de Keyframes

- **Línea de tiempo interactiva**: Agregá y eliminá keyframes en cualquier
  posición (0-100%)
- **Toggles de propiedades**: Habilitá/deshabilitá propiedades CSS específicas
  por keyframe
- **Vista previa en tiempo real**: Mirá tu animación actualizarse mientras
  editás
- **Paneles colapsables**: Mantené tu espacio de trabajo organizado

### Configuración de Animación

Control total sobre el comportamiento de la animación:

- **Duración**: 100ms a 5000ms
- **Delay**: 0ms a 2000ms
- **Iteraciones**: 1, 2, 3, 5, 10, o infinito
- **Dirección**: normal, reverse, alternate, alternate-reverse
- **Modo de relleno**: none, forwards, backwards, both

### 17 Funciones de Timing

Desde básicas hasta avanzadas:

- **Básicas**: linear, ease, ease-in, ease-out, ease-in-out
- **Steps**: step-start, step-end, steps(n)
- **Avanzadas**: curvas cubic-bezier para easing personalizado

### Propiedades Animables

Propiedades de transformación y visuales:

- **Transform**: translateX, translateY, scale, rotate, skewX, skewY
- **Visual**: opacity, backgroundColor, color, borderRadius, boxShadow
- **Personalizado**: Soporte para cualquier propiedad CSS

### 15 Animaciones Preset

Animaciones listas para usar:

- **Fade**: fadeIn, fadeOut
- **Slide**: slideInLeft, slideInRight, slideInUp, slideInDown
- **Zoom**: zoomIn, zoomOut
- **Efectos**: pulse, spin, flip, bounce, shake, heartbeat

### Experiencia de Usuario

- **Múltiples formas de preview**: Cuadrado, círculo, texto, ícono
- **Auto-guardado**: Persistencia en LocalStorage
- **Historial de animaciones**: Aplicar animaciones previas rápidamente
- **Copiado con un clic**: Exportá CSS instantáneamente
- **Bilingüe**: Inglés y español

## Arquitectura Técnica

### Stack

- **React 19** con hooks
- **TypeScript 5.9** para type safety
- **Vite 7** para desarrollo
- **Tailwind CSS 4** para estilos
- **Radix UI** para primitivos accesibles
- **Zustand** con persistencia para estado
- **Motion** library para animaciones UI
- **Lucide React** para íconos
- **i18next** para internacionalización
- **Biome** para linting
- **Vitest** para testing

### Cómo Funciona

1. **Seleccioná o creá**: Elegí un preset o empezá desde cero
2. **Configurá timing**: Establecé duración, delay, iteraciones, dirección
3. **Editá keyframes**: Activá propiedades y ajustá valores en cada keyframe
4. **Preview**: Mirá la animación en tiempo real
5. **Exportá**: Copiá el CSS generado

## Ejemplo de Código Generado

```css
@keyframes custom-animation {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-element {
  animation: custom-animation 300ms ease-out forwards;
}
```

## Ideas Futuras

- Secuenciación de animaciones (encadenar múltiples animaciones)
- Formatos de salida CSS-in-JS
- Exportar librería de animaciones
- URLs compartibles de animaciones
- Más categorías de presets
