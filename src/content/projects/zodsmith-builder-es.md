---
title: ZodSmith Builder
description:
  Constructor visual para crear esquemas Zod y tipos TypeScript con una interfaz
  intuitiva de arrastrar y soltar. Diseña estructuras de datos visualmente y
  genera código listo para producción al instante.
longDescription:
  Una herramienta para desarrolladores que elimina la escritura manual
  repetitiva de esquemas Zod a través de una interfaz visual. Crea, configura y
  exporta esquemas con vista previa del código en tiempo real, plantillas y
  soporte para importar TypeScript.
lang: es
category: open-source
tags:
  [
    Herramienta Dev,
    Constructor Visual,
    Generador de Código,
    Zod,
    TypeScript,
    Schema,
  ]
technologies:
  [React, TypeScript, Vite, Tailwind CSS, Zustand, shadcn/ui, dnd-kit, i18next]
images:
  - ./_images/zodsmith/1.png
  - ./_images/zodsmith/2.png
  - ./_images/zodsmith/3.png
mainImage: ./_images/zodsmith/1.png
githubUrl: https://github.com/qazuor/zodsmith-builder
demoUrl: https://qazuzor-zodsmith-builder.vercel.app
featured: true
publishDate: 2025-11-26
order: 1
status: production
metrics:
  commits: 21
  linesOfCode: 10800
  developmentTime: '5 días'
  startDate: 2025-11-25
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Sincronización de drag-and-drop con estado - Zustand no actualizaba
      correctamente durante el arrastre'
    solution:
      'Sistema de commit que solo actualiza al soltar, no durante el arrastre'
  - problem:
      'Casos edge de generación de código - Campos opcionales, arrays anidados y
      enums vacíos generaban código inválido'
    solution: 'Validación exhaustiva antes de generar más tests específicos'
  - problem: 'Performance con muchos campos - Re-renders lentos con 20+ campos'
    solution: 'Memoización agresiva y virtualización de listas'
highlights:
  - 'Drag-and-drop con animaciones suaves usando dnd-kit'
  - '8 plantillas predefinidas para casos comunes'
  - 'Importar TypeScript - pegar interfaces y convertir a Zod'
  - '3 modos de exportación: Solo Schema, Solo Type, o Módulo completo'
  - 'Persistencia local - nunca pierdas trabajo en progreso'
  - 'Soporte bilingüe (Inglés/Español)'
futureImprovements:
  - 'Soporte para objetos anidados y tipos complejos'
  - 'Composición de schemas y referencias (extends, merge)'
  - 'Exportar/importar configuraciones de schemas'
  - 'Formatos de salida adicionales (JSON Schema, Yup)'
  - 'Funciones de edición colaborativa'
stackRationale:
  dnd-kit: 'Más moderno que react-beautiful-dnd, mejor soporte de accesibilidad'
  Zustand: 'Más simple que Redux, perfecto para apps medianas'
  shadcn/ui: 'Componentes accesibles, totalmente personalizables'
  Vite: 'HMR instantáneo, builds optimizados'
---

## Descripción del Proyecto

ZodSmith Builder nació de una necesidad real: durante un proyecto a gran escala,
tuve que crear docenas de esquemas Zod manualmente. Escribir código de
validación repetitivo, gestionar tipos y mantener todo consistente se volvió
tedioso y propenso a errores.

En lugar de escribir esquemas a mano, ZodSmith proporciona un canvas visual
donde podés diseñar tus estructuras de datos con la simplicidad del arrastrar y
soltar. Cada cambio actualiza el código generado en tiempo real, mostrándote
exactamente qué esquema Zod y tipos TypeScript se producirán.

La herramienta sirve tanto como un impulsor de productividad para
desarrolladores experimentados como un recurso educativo para quienes están
aprendiendo la API de Zod.

## Características Principales

### Constructor Visual de Esquemas

- **Reordenamiento de campos con arrastrar y soltar** con animaciones suaves
- **Vista previa del código en tiempo real** que se actualiza mientras diseñás
- **Tarjetas de campos** mostrando tipos y reglas de validación de un vistazo
- **Edición inline** para cambios rápidos de nombres de campos
- **Panel lateral** para configuración detallada de cada campo
- **Diseño responsive** que funciona en cualquier tamaño de pantalla

### Soporte Completo de Tipos de Campo

Soporte para todos los tipos esenciales de Zod con sus validaciones:

- **String**: longitud mín/máx, email, URL, UUID, patrones regex
- **Number**: mín/máx, positivo/negativo, entero, multipleOf
- **Boolean**: validación simple verdadero/falso
- **Date**: validación de fecha con restricciones opcionales
- **Enum**: conjuntos de valores predefinidos
- **Array**: arrays tipados con mín/máx elementos

### Generación Inteligente de Código

Tres modos de salida para diferentes casos de uso:

- **Solo Esquema Zod**: Solo el código de validación
- **Tipo TypeScript**: Tipo inferido del esquema
- **Módulo Completo**: Archivo completo con imports, esquema y export del tipo

Opciones configurables incluyen convenciones de nomenclatura, estilos de export,
comentarios y preferencias de formato.

### Impulsores de Productividad

- **8 plantillas predefinidas**: Usuario, Producto, Dirección, Respuesta API,
  Post de Blog, Formulario de Contacto, Login, Configuración
- **Importar TypeScript**: Pegá interfaces existentes y convertilas a esquemas
  Zod
- **Auto-guardado**: Nunca perdés tu trabajo con persistencia en localStorage
- **Multi-idioma**: Soporte para inglés y español
- **Soporte de temas**: Modo claro/oscuro con detección del sistema

## Arquitectura Técnica

### Stack Frontend

Construido con patrones modernos de React y mejores prácticas:

- **React 19** con componentes funcionales y hooks
- **TypeScript 5.9** para type safety completo
- **Vite 7** para desarrollo ultrarrápido y builds optimizados
- **Tailwind CSS 4** con tokens de diseño personalizados

### Componentes UI

- **shadcn/ui** para componentes accesibles y personalizables
- **Radix UI** primitivos para interacciones complejas
- **Lucide React** para iconografía consistente
- **Motion** para animaciones y transiciones suaves

### Gestión de Estado

- **Zustand** para estado global simple y performante
- **Zod** (¡por supuesto!) para validación interna

### Librerías Clave

- **dnd-kit** para funcionalidad de arrastrar y soltar accesible
- **i18next** para internacionalización
- **Biome** para linting y formateo
- **Vitest** con Testing Library para tests

## Flujo de Trabajo de Desarrollo

El flujo típico es directo:

1. **Crear**: Empezar de cero, elegir una plantilla o importar TypeScript
2. **Diseñar**: Agregar campos y ordenarlos visualmente
3. **Configurar**: Establecer validaciones, descripciones y requerimientos
4. **Previsualizar**: Ver el código generado actualizarse en tiempo real
5. **Exportar**: Copiar el código directamente a tu proyecto
