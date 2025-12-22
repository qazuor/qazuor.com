---
title: Gradify CSS
description:
  Generador moderno de gradientes CSS con vista previa en tiempo real. Creá
  hermosos gradientes lineales, radiales y cónicos a través de una interfaz
  visual intuitiva.
longDescription:
  Un generador de gradientes contemporáneo construido con React y TypeScript.
  Diseñá gradientes CSS impresionantes con paradas de color ilimitadas, control
  visual del ángulo y exportación instantánea de código. Incluye más de 15
  presets curados y UI glassmórfica.
lang: es
category: open-source
tags: [Herramienta Dev, Generador CSS, Herramienta de Diseño, Gradientes]
technologies:
  [React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand, Zod, i18next]
images:
  - ./_images/gradify-css/1.png
  - ./_images/gradify-css/2.png
  - ./_images/gradify-css/3.png
mainImage: ./_images/gradify-css/1.png
githubUrl: https://github.com/qazuor/gradify-css
demoUrl: https://qazuor-gradify-css.vercel.app/
featured: true
publishDate: 2025-11-25
order: 2
status: production
metrics:
  commits: 24
  linesOfCode: 6087
  developmentTime: '5 días'
  startDate: 2025-11-25
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Renderizado de gradientes complejos - Gradientes cónicos con muchas
      paradas causaban artefactos visuales'
    solution: 'Limitación de paradas de color y normalización de posiciones'
  - problem:
      'Selector de color inconsistente - Diferentes navegadores renderizaban
      colores de forma distinta'
    solution: 'Normalización a hex y preview en canvas'
  - problem:
      'Selector de ángulo táctil - El selector circular era difícil de usar en
      móviles'
    solution: 'Área de toque expandida y debounce en actualizaciones'
highlights:
  - '3 tipos de gradientes: Lineal, Radial y Cónico'
  - 'Selector visual de ángulo 360° para gradientes lineales'
  - 'Paradas de color ilimitadas con posicionamiento preciso'
  - '15+ presets curados en 4 categorías'
  - 'Historial de gradientes con auto-guardado'
  - 'Tema oscuro/claro con detección de preferencias del sistema'
futureImprovements:
  - 'Generador de animaciones de gradientes'
  - 'Formatos de salida CSS-in-JS (styled-components, emotion)'
  - 'Colecciones de paletas de gradientes'
  - 'URLs compartibles de gradientes'
  - 'Extensión de navegador para acceso rápido'
stackRationale:
  Zod: 'Validación type-safe para configuraciones de gradientes'
  shadcn/ui: 'Sliders y color pickers accesibles'
  Zustand: 'Persistencia simple con middleware'
---

## Descripción del Proyecto

Cada vez que necesitaba un gradiente CSS, me encontraba googleando herramientas
online, lidiando con publicidades y peleando con interfaces desordenadas.
Gradify CSS nació del simple deseo de tener mi propia herramienta personalizada
que puedo usar instantáneamente cuando la necesito.

Más allá de resolver una necesidad personal, construir Gradify también fue un
ejercicio de aprendizaje para crear herramientas UI pulidas e interactivas con
patrones modernos de React.

## Características Principales

### Tipos de Gradiente

Soporte para todas las funciones de gradiente CSS:

- **Gradientes Lineales**: Con selector visual de ángulo 360°
- **Gradientes Radiales**: Circular y elíptico con control de posición
- **Gradientes Cónicos**: Gradientes angulares desde un punto central

### Editor de Paradas de Color

- **Paradas de color ilimitadas**: Agregá tantos colores como necesites
- **Control de posición**: Ajustá el porcentaje de cada parada con precisión
- **Edición visual**: Arrastrá y ajustá directamente en la barra de gradiente
- **Selector de color**: Selección completa de colores con entrada hexadecimal

### Exportación Instantánea de Código

- **Copiado con un clic**: Obtené el CSS instantáneamente
- **Salida limpia**: Código listo para producción
- **Vista previa en tiempo real**: Mirá los cambios mientras los hacés

### Presets Curados

Más de 15 presets de gradientes seleccionados a mano organizados por categoría:

- **Atardecer**: Tonos cálidos de naranja y rosa
- **Océano**: Azules y turquesas fríos
- **Naturaleza**: Verdes y tonos tierra
- **Neón**: Colores vibrantes de alto contraste

### Experiencia de Usuario

- **Tema oscuro/claro**: Preferencia persistente
- **Bilingüe**: Soporte para inglés y español
- **Responsive**: Funciona en cualquier dispositivo
- **Historial**: Guardado automático en localStorage
- **Accesibilidad**: Navegación completa por teclado

## Diseño Visual

La interfaz presenta un diseño de tarjetas glassmórficas con íconos SVG animados
y colores de acento dinámicos que coinciden con el gradiente actual. Esto crea
una experiencia cohesiva donde la herramienta misma muestra lo que puede
producir.

## Arquitectura Técnica

### Stack

- **React 19** con patrones modernos de hooks
- **TypeScript** para type safety
- **Vite 7** para desarrollo rápido
- **Tailwind CSS v4** para estilos
- **shadcn/ui** para componentes accesibles
- **Zustand** para gestión de estado
- **Zod** para validación
- **react-i18next** para internacionalización

### Estructura del Proyecto

```
src/
├── components/
│   ├── animate-ui/     # Íconos animados
│   ├── gradient/       # Componentes específicos de gradiente
│   └── layout/         # Estructura de la app
├── config/             # Configuración de la app
├── i18n/               # Traducciones
├── stores/             # Stores de Zustand
└── utils/              # Funciones auxiliares
```

## Cómo Funciona

1. **Seleccioná el tipo de gradiente**: Lineal, radial o cónico
2. **Ajustá los parámetros**: Ángulo para lineal, posición para radial/cónico
3. **Editá las paradas de color**: Agregá colores y ajustá posiciones
4. **Previsualización en tiempo real**: Mirá el gradiente actualizarse al
   instante
5. **Copiá el CSS**: Un clic al portapapeles
