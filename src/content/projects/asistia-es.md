---
title: Asist.IA
description:
  Framework modular de agentes IA para automatización multi-canal con
  adaptadores y herramientas pluggables. Construí, deployeá y gestioná agentes
  conversacionales inteligentes en múltiples canales de comunicación.
longDescription:
  Una plataforma de agentes IA de nivel empresarial lista para producción que
  permite a negocios construir agentes conversacionales inteligentes con RAG,
  ejecución de herramientas, multi-tenancy y amplias opciones de
  personalización.
lang: es
category: commercial
tags: [Plataforma IA, SaaS, Full-Stack, Monorepo, Enterprise]
technologies:
  [
    NestJS,
    React,
    TanStack Start,
    TypeScript,
    PostgreSQL,
    pgvector,
    Drizzle ORM,
    Better Auth,
    BullMQ,
    Redis,
    Socket.io,
    Tailwind CSS,
    Zustand,
    TurboRepo,
  ]
images:
  - ./_images/asistia/placeholder.jpg
mainImage: ./_images/asistia/placeholder.jpg
featured: true
publishDate: 2025-12-22
order: 12
status: development
metrics:
  commits: 159
  linesOfCode: 81730
  developmentTime: '2 semanas'
  startDate: 2025-12-08
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Aislamiento de datos multi-tenant - Asegurar separación completa entre
      datos de tenants'
    solution:
      'Seguridad a nivel de fila con tenant ID en todas las queries y validación
      en middleware'
  - problem:
      'Complejidad de arquitectura de plugins - Hacer el sistema extensible sin
      modificar el core'
    solution:
      'Sistema de plugins basado en manifiestos con inyección de dependencias e
      interfaces claras'
  - problem:
      'Rendimiento de RAG a escala - Búsqueda vectorial ralentizándose con sets
      de documentos grandes'
    solution: 'pgvector con índices HNSW y estrategias de chunking inteligente'
  - problem:
      'Sincronización de conversaciones en tiempo real - Mantener múltiples
      clientes sincronizados'
    solution:
      'Rooms de Socket.io por conversación con actualizaciones optimistas'
highlights:
  - 'Soporte multi-canal: Web, Telegram y canales personalizados'
  - 'Multi-tenancy con planes de facturación (Free, Starter, Professional,
    Enterprise)'
  - 'Integración RAG con pgvector para búsqueda semántica'
  - 'Sistema de plugins extensible para canales, modelos, herramientas y parsers'
  - '50+ permisos granulares con control de acceso basado en roles'
  - 'Soporte WebSocket en tiempo real para conversaciones en vivo'
  - 'Tracking de costos de IA por conversación y tenant'
  - 'Procesamiento de documentos con soporte PDF, DOCX, TXT'
  - 'Integraciones incluidas: Google Calendar, Google Sheets'
  - 'Moderación de contenido con detección de PII'
futureImprovements:
  - 'Integraciones de canales adicionales (WhatsApp Business, Slack)'
  - 'Más proveedores de modelos IA (Gemini, Mistral)'
  - 'Dashboard de analíticas avanzado'
  - 'Personalización white-label'
  - 'Marketplace para plugins de la comunidad'
stackRationale:
  NestJS:
    'Framework Node.js de nivel empresarial con excelente DI y modularidad'
  TanStack Start: 'Framework React full-stack con routing type-safe'
  Drizzle ORM: 'ORM type-safe con excelente soporte para PostgreSQL'
  pgvector: 'Búsqueda de similitud vectorial nativa en PostgreSQL'
  BullMQ: 'Cola de jobs robusta para procesamiento de documentos y tareas async'
  Better Auth: 'Autenticación moderna con gestión de sesiones'
---

## Descripción del Proyecto

Asistia es una plataforma integral de agentes IA diseñada para negocios que
necesitan deployar asistentes conversacionales inteligentes en múltiples
canales. A diferencia de constructores de chatbots simples, Asistia provee un
ecosistema completo para construir agentes IA listos para producción con
características enterprise.

La plataforma maneja el ciclo de vida completo de gestión de agentes IA: desde
crear y configurar bots, cargar bases de conocimiento, conectar canales de
comunicación, hasta monitorear conversaciones y trackear costos.

## Arquitectura Core

### Diseño Multi-Tenant

Cada tenant opera en aislamiento completo con sus propios:

- Bots y configuraciones
- Bases de conocimiento y documentos
- Conversaciones e historial de mensajes
- Usuarios y permisos
- Planes de facturación y cuotas

### Motor de Conversación IA

El corazón de Asistia es el motor de conversación que orquesta:

- **Registro de Modelos** - Proveedores de IA pluggables (OpenAI, Claude)
- **Servicio RAG** - Búsqueda semántica en bases de conocimiento
- **Constructor de Prompts** - System prompts dinámicos con inyección de
  contexto
- **Ejecutor de Herramientas** - Integraciones con servicios externos
- **Tracking de Costos** - Cálculo de costo por token
- **Filtro de Contenido** - Moderación de entrada/salida

### Sistema de Plugins

Extendé funcionalidad sin modificar código core:

- **Canales** - Agregá nuevas plataformas de comunicación
- **Modelos** - Integrá nuevos proveedores de IA
- **Embedders** - Agregá proveedores de embeddings
- **Parsers** - Soportá nuevos formatos de documentos
- **Herramientas** - Creá integraciones personalizadas
- **Facturación** - Agregá proveedores de pago

## Características Principales

### Base de Conocimiento y RAG

Cargá documentos y construí una base de conocimiento buscable:

- Estrategias de chunking inteligente para recuperación óptima
- Embeddings vectoriales con pgvector
- Búsqueda semántica con tracking de citas
- Soporte para PDF, DOCX, TXT y más

### Integraciones de Canales

Deployeá bots en múltiples plataformas:

- **Web Chat** - Widget embebible con UI personalizable
- **Telegram** - Integración completa de Bot API
- **Extensible** - Agregá canales personalizados via plugins

### Características Enterprise

Construido para ambientes de producción:

- Sistema de permisos granular con 50+ permisos
- Control de acceso basado en roles (Super Admin, Cliente, Agente)
- Logs de auditoría para compliance
- Analíticas y reportes
- Rate limiting y gestión de cuotas

## Stack Técnico

El proyecto usa una arquitectura monorepo moderna con Turbo:

- **Backend**: NestJS con PostgreSQL y Redis
- **Frontend**: React con ecosistema TanStack
- **Tiempo real**: Socket.io para actualizaciones en vivo
- **Jobs**: BullMQ para procesamiento en background
- **Storage**: Compatible con S3 (MinIO/AWS)

## Estado Actual

Asistia está en desarrollo activo con características core implementadas. El
foco está en estabilizar el motor de conversación y expandir integraciones de
canales antes del primer release de producción.
