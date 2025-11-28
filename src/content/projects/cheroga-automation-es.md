---
title: Automatización de Reservas Cheroga
description:
  Sistema completo de automatización No-Code para gestionar reservas de
  alquiler. Maneja reservaciones, gestión de clientes, pagos y comunicación con
  huéspedes vía WhatsApp.
longDescription:
  Sistema de gestión de reservas de punta a punta construido con Make.com que
  automatiza todo el flujo de alquiler desde la consulta hasta el post-checkout,
  integrando con servicios de Google, WhatsApp y Airtable.
lang: es
category: client
tags: [Automatización, No-Code, Make.com, Proyecto Cliente]
technologies:
  [
    Make.com,
    Gmail,
    Google Calendar,
    Google Contacts,
    Google Sheets,
    Airtable,
    WhatsApp,
  ]
images:
  - ./_images/cheroga-automation/1.png
  - ./_images/cheroga-automation/2.png
mainImage: ./_images/cheroga-automation/1.png
featured: true
publishDate: 2021-08-01
order: 11
---

## Descripción del Proyecto

Gestionar reservas de alquiler para una propiedad vacacional involucra
innumerables tareas repetitivas: responder consultas, enviar confirmaciones,
trackear pagos, coordinar con huéspedes y hacer seguimiento después de su
estadía. Para el dueño de Cheroga Casa Quinta, esto significaba horas de trabajo
manual por cada reserva.

Este sistema de automatización transforma todo ese proceso. Desde el momento en
que un huésped envía una solicitud de reserva hasta el mensaje de agradecimiento
después del checkout, todo corre automáticamente.

## El Desafío

Antes de la automatización, el dueño de la propiedad tenía que:

- Responder manualmente a cada consulta
- Llevar registro de información de huéspedes en múltiples lugares
- Crear eventos de calendario a mano
- Generar y enviar recibos manualmente
- Coordinar via WhatsApp con constante ida y vuelta
- Recordar enviar recordatorios antes del check-in
- Hacer seguimiento después del checkout

Esto consumía tiempo, era propenso a errores y no escalaba bien a medida que las
reservas aumentaban.

## La Solución

Una automatización integral con Make.com que maneja el ciclo de vida completo de
reservas:

### 1. Procesamiento de Solicitud de Reserva

Cuando un huésped envía el formulario de reserva en el sitio web:

- **Búsqueda de cliente**: Busca en la base de datos por número de teléfono
- **Creación de cliente**: Si es huésped nuevo, crea un registro en la base de
  datos
- **Sincronización con Google Contacts**: Verifica si el huésped existe en
  Google Contacts
  - Si existe: Actualiza su información
  - Si es nuevo: Crea un contacto automáticamente
  - Esto significa que el dueño siempre tiene los contactos de huéspedes
    guardados en su teléfono Android

### 2. Calendario y Documentación

- **Evento de calendario**: Crea un evento en Google Calendar con todos los
  detalles de la reserva
- **Recibo PDF**: Genera un recibo profesional con información de la reserva
- **Entrega por WhatsApp**: Envía el recibo directamente al huésped via WhatsApp

### 3. Tracking Financiero

- **Actualización de Google Sheets**: Registra información de pago
  - Monto pagado como seña
  - Saldo pendiente
  - Fechas de vencimiento de pago
  - Estado de la reserva

### 4. Hub de Comunicación con Huéspedes

- **Creación de grupo WhatsApp**: Crea automáticamente un grupo incluyendo:
  - Dueño de la propiedad
  - Huésped principal
  - Huéspedes/acompañantes adicionales
- **Paquete de información**: Envía información útil sobre el alquiler,
  instrucciones de check-in y reglas de la propiedad

### 5. Recordatorios Automatizados

- **Mensaje pre-llegada**: 1 día antes del check-in
  - Envía un recordatorio al grupo de WhatsApp
  - Incluye información útil para la llegada
  - Instrucciones de check-in y datos de contacto

### 6. Seguimiento Post-Estadía

- **Mensaje de agradecimiento**: 1 día después del checkout
  - Envía un mensaje de despedida al grupo
  - Agradece a los huéspedes por su estadía
  - Elimina automáticamente el grupo (limpieza)

## Arquitectura Técnica

### Plataforma

Construido enteramente en **Make.com** (anteriormente Integromat), una poderosa
plataforma de automatización no-code.

### Integraciones

| Servicio            | Propósito                                          |
| ------------------- | -------------------------------------------------- |
| **Gmail**           | Notificaciones y confirmaciones por email          |
| **Google Calendar** | Eventos de reserva y disponibilidad                |
| **Google Contacts** | Gestión de contactos de huéspedes                  |
| **Google Sheets**   | Tracking financiero y reportes                     |
| **Airtable**        | Base de datos de huéspedes y registros de reservas |
| **WhatsApp**        | Comunicación con huéspedes y grupos                |

### Diseño del Workflow

La automatización consiste en múltiples escenarios interconectados:

1. **Intake de reserva**: Disparado por envío de formulario
2. **Gestión de clientes**: Maneja base de datos y contactos
3. **Documentación**: Genera recibos y actualiza registros
4. **Comunicación**: Gestiona grupos y mensajes de WhatsApp
5. **Tareas programadas**: Mensajes pre-llegada y post-checkout

## Resultados

La automatización entregó mejoras significativas:

- **Tiempo ahorrado**: Horas de trabajo manual eliminadas por reserva
- **Consistencia**: Cada huésped recibe la misma experiencia profesional
- **Sin comunicaciones perdidas**: Los recordatorios automatizados nunca olvidan
- **Mejor organización**: Toda la información en un solo lugar
- **Escalabilidad**: Puede manejar más reservas sin más trabajo
- **Imagen profesional**: Comunicaciones pulidas y oportunas

## ¿Por Qué No-Code?

Este proyecto demuestra el poder de la automatización no-code:

- **Desarrollo rápido**: Construido y deployado rápidamente
- **Mantenimiento fácil**: El dueño puede entender y modificar partes simples
- **Costo-efectivo**: Sin infraestructura de servidor que mantener
- **Confiable**: Make.com maneja escalado y uptime
- **Flexible**: Fácil agregar nuevas integraciones o modificar workflows

## Lecciones Aprendidas

Construir este sistema enseñó lecciones valiosas sobre:

- Diseñar automatizaciones resilientes que manejan casos edge
- Estructurar datos para múltiples integraciones
- Crear una experiencia de huésped fluida a través de automatización
- Balancear automatización con toque personal

## Relación con el Cliente

Este sistema de automatización complementa el sitio web de Cheroga Casa Quinta,
creando una solución digital completa para la presencia online y operaciones de
la propiedad.
