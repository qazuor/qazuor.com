---
title: Hospeda
description:
  Plataforma de turismo moderna para descubrir alojamientos en la región del
  Litoral argentino. Herramientas potenciadas por IA para huéspedes y
  anfitriones con UX excepcional.
longDescription:
  Una plataforma web integral para alojamientos turísticos que incluye
  integración de IA, herramientas de gestión para anfitriones y un diseño
  hipermoderno enfocado en rendimiento y accesibilidad.
lang: es
category: commercial
tags: [Portal, Turismo, Full-Stack, Monorepo, Integración IA]
technologies:
  [
    Astro,
    React,
    TanStack Router,
    Hono,
    PostgreSQL,
    Drizzle ORM,
    Tailwind CSS,
    Zod,
    TurboRepo,
    Vercel,
  ]
images:
  - ./_images/hospeda/placeholder.jpg
mainImage: ./_images/hospeda/placeholder.jpg
githubUrl: https://github.com/qazuor/hospeda
demoUrl: https://hospeda-web.vercel.app
featured: true
publishDate: 2025-12-01
order: 5
status: development
metrics:
  commits: 1967
  linesOfCode: 570085
  developmentTime: '8 meses'
  startDate: 2025-05-08
  contributors: 3
  openIssues: 53
challenges:
  - problem:
      'Sincronización de tipos entre apps - Cambios en schemas rompían otras
      apps'
    solution: 'Package compartido @hospeda/types con validación en CI'
  - problem:
      'Migraciones de DB en producción - Conflictos entre Drizzle push vs
      migrate'
    solution: 'Scripts de migración con rollback automático'
  - problem:
      'Rendimiento con listados grandes - Miles de alojamientos sin paginación'
    solution: 'Paginación basada en cursor con scroll infinito'
  - problem:
      'Costos de integración IA - Llamadas a LLM acumulaban costos rápidamente'
    solution: 'Caché agresivo y rate limiting por usuario'
highlights:
  - '1,967 commits demostrando desarrollo activo'
  - 'Arquitectura monorepo con TurboRepo para builds optimizados'
  - 'Integración de IA para recomendaciones y búsqueda semántica'
  - 'Herramientas de gestión para anfitriones: calendario, analíticas,
    comunicación'
  - 'Enfoque regional con conocimiento local integrado'
  - 'Diseño WCAG compliant y mobile-first'
futureImprovements:
  - 'App móvil (React Native)'
  - 'Integración de pasarela de pagos'
  - 'Dashboard multi-propiedad para anfitriones'
  - 'Integración OTA (Booking, Airbnb)'
  - 'Sistema de reseñas con análisis NLP'
stackRationale:
  Monorepo: 'Código compartido entre apps, releases coordinados'
  TurboRepo: 'Caché de builds, paralelización inteligente'
  Hono: 'Liviano, compatible con edge, excelente DX'
  Drizzle: 'Queries type-safe, mejor que Prisma para edge'
  TanStack Router: 'Routing basado en archivos con tipos, loaders'
---

## Descripción del Proyecto

Hospeda nació de conversaciones con dueños de alojamientos en Concepción del
Uruguay y la región más amplia del Litoral argentino. Las plataformas existentes
no sirven bien a los pequeños y medianos anfitriones, están diseñadas para
escala masiva en lugar de necesidades regionales.

Este es un emprendimiento personal para crear algo diferente: una plataforma de
turismo adaptada a la región, con herramientas potenciadas por IA que
genuinamente ayudan tanto a huéspedes como anfitriones, envuelta en una interfaz
moderna, accesible y ultrarrápida.

## Qué Hace Diferente a Hospeda

### Enfoque Regional

A diferencia de las plataformas globales que tratan cada ubicación igual,
Hospeda está construida específicamente para la región del Litoral argentino. El
conocimiento local está incorporado en la plataforma, desde entender patrones
estacionales hasta destacar gemas ocultas que las plataformas más grandes pasan
por alto.

### Integración de IA

La IA no es solo una palabra de moda acá. Está integrada en todo para proveer
valor real:

- **Para Huéspedes**: Recomendaciones inteligentes basadas en preferencias,
  búsqueda en lenguaje natural, asistencia en planificación de viajes
- **Para Anfitriones**: Sugerencias de precios, pronóstico de demanda,
  comunicación automatizada con huéspedes, borradores de respuesta a reseñas

### Herramientas de Gestión para Anfitriones

Más allá de solo listar alojamientos, Hospeda provee herramientas satélite para
ayudar a los anfitriones a manejar su negocio:

- Gestión de calendario y disponibilidad
- Sincronización multi-plataforma
- Analíticas de rendimiento
- Hub de comunicación con huéspedes

### Excelencia en Diseño

- **Extremadamente moderno**: UI contemporánea que se siente fresca y
  profesional
- **Accesible**: Cumple WCAG, usable por todos
- **Super performante**: Optimizado para carga rápida incluso en conexiones
  lentas
- **Amigable al usuario**: Navegación intuitiva que no requiere aprendizaje

## Características Principales

### Para Huéspedes

- **Descubrimiento de Alojamientos**: Navegá y filtrá propiedades con detalles
  ricos
- **Exploración de Destinos**: Aprendé sobre lugares para visitar en la región
- **Reseñas y Calificaciones**: Feedback auténtico de estadías verificadas
- **Eventos**: Descubrí eventos locales durante tu visita
- **Asistente IA**: Ayuda en lenguaje natural para planificar tu viaje

### Para Anfitriones

- **Gestión de Propiedades**: Control completo sobre listados
- **Gestión de Reservas**: Manejá reservaciones eficientemente
- **Dashboard de Analíticas**: Entendé tu rendimiento
- **Herramientas IA**: Asistencia automatizada para tareas comunes
- **Centro de Comunicación**: Gestioná interacciones con huéspedes

### Características de Admin

- Gestión de contenido para destinos y eventos
- Gestión de roles y permisos de usuarios
- Analíticas a nivel plataforma
- Herramientas de moderación

## Arquitectura Técnica

### Estructura Monorepo

Construido con TurboRepo para desarrollo eficiente a través de múltiples
paquetes:

```
hospeda/
├── apps/
│   ├── web/          # Sitio Astro para huéspedes
│   ├── admin/        # Dashboard admin (React)
│   └── api/          # Servidor API Hono
└── packages/
    ├── db/           # Drizzle ORM + PostgreSQL
    ├── schemas/      # Esquemas Zod compartidos
    ├── types/        # Tipos TypeScript
    ├── logger/       # Utilidades de logging
    └── utils/        # Utilidades compartidas
```

### Stack Tecnológico

- **Frontend**: Astro para páginas estáticas, React para features interactivas
- **Routing**: TanStack Router para navegación type-safe
- **API**: Hono para endpoints rápidos y livianos
- **Base de Datos**: PostgreSQL con Drizzle ORM
- **Validación**: Zod para type safety en runtime
- **Estilos**: Tailwind CSS para diseño moderno y responsive
- **Build**: TurboRepo para gestión del monorepo
- **Deployment**: Vercel para rendimiento edge

## Estado Actual

Hospeda está en desarrollo activo con más de 1,900 commits. La funcionalidad
core de la plataforma está en su lugar, con trabajo continuo en features de IA y
herramientas para anfitriones.

## Modelo de Negocio

La plataforma será monetizada a través de un modelo que se alinea con el éxito
de los anfitriones, diferente de las altas comisiones de las plataformas
principales. Los detalles se anunciarán más cerca del lanzamiento.

## Visión

Crear la plataforma de referencia para turismo en la región del Litoral
argentino, una que realmente sirva a la comunidad en lugar de extraer de ella.
