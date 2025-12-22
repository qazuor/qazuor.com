---
title: Asist.IA
description:
  Modular AI Agent Framework for multi-channel automation with pluggable
  adapters and service tools. Build, deploy, and manage intelligent
  conversational agents across multiple communication channels.
longDescription:
  A production-ready, enterprise-grade AI agent platform that enables businesses
  to build intelligent conversational agents with RAG, tool execution,
  multi-tenancy, and extensive customization options.
lang: en
category: commercial
tags: [AI Platform, SaaS, Full-Stack, Monorepo, Enterprise]
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
  developmentTime: '2 weeks'
  startDate: 2025-12-08
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Multi-tenant data isolation - Ensuring complete separation between tenant
      data'
    solution:
      'Row-level security with tenant ID in all queries and middleware
      validation'
  - problem:
      'Plugin architecture complexity - Making the system extensible without
      core modifications'
    solution:
      'Manifest-based plugin system with dependency injection and clear
      interfaces'
  - problem:
      'RAG performance at scale - Vector search slowing down with large document
      sets'
    solution: 'pgvector with HNSW indexes and intelligent chunking strategies'
  - problem:
      'Real-time conversation sync - Keeping multiple clients in sync during
      conversations'
    solution: 'Socket.io rooms per conversation with optimistic updates'
highlights:
  - 'Multi-channel support: Web, Telegram, and custom channels'
  - 'Multi-tenancy with billing plans (Free, Starter, Professional, Enterprise)'
  - 'RAG integration with pgvector for semantic search'
  - 'Extensible plugin system for channels, models, tools, and parsers'
  - '50+ granular permissions with role-based access control'
  - 'Real-time WebSocket support for live conversations'
  - 'AI cost tracking per conversation and tenant'
  - 'Document processing with PDF, DOCX, TXT support'
  - 'Built-in integrations: Google Calendar, Google Sheets'
  - 'Content moderation with PII detection'
futureImprovements:
  - 'Additional channel integrations (WhatsApp Business, Slack)'
  - 'More AI model providers (Gemini, Mistral)'
  - 'Advanced analytics dashboard'
  - 'White-label customization'
  - 'Marketplace for community plugins'
stackRationale:
  NestJS: 'Enterprise-grade Node.js framework with excellent DI and modularity'
  TanStack Start: 'Full-stack React framework with type-safe routing'
  Drizzle ORM: 'Type-safe ORM with excellent PostgreSQL support'
  pgvector: 'Native vector similarity search in PostgreSQL'
  BullMQ: 'Robust job queue for document processing and async tasks'
  Better Auth: 'Modern authentication with session management'
---

## Project Description

Asistia is a comprehensive AI agent platform designed for businesses that need
to deploy intelligent conversational assistants across multiple channels. Unlike
simple chatbot builders, Asistia provides a complete ecosystem for building
production-ready AI agents with enterprise features.

The platform handles the entire lifecycle of AI agent management: from creating
and configuring bots, uploading knowledge bases, connecting communication
channels, to monitoring conversations and tracking costs.

## Core Architecture

### Multi-Tenant Design

Every tenant operates in complete isolation with their own:

- Bots and configurations
- Knowledge bases and documents
- Conversations and message history
- Users and permissions
- Billing plans and quotas

### AI Conversation Engine

The heart of Asistia is the conversation engine that orchestrates:

- **Model Registry** - Pluggable AI providers (OpenAI, Claude)
- **RAG Service** - Semantic search across knowledge bases
- **Prompt Builder** - Dynamic system prompts with context injection
- **Tool Executor** - External service integrations
- **Cost Tracking** - Per-token cost calculation
- **Content Filter** - Input/output moderation

### Plugin System

Extend functionality without modifying core code:

- **Channels** - Add new communication platforms
- **Models** - Integrate new AI providers
- **Embedders** - Add embedding providers
- **Parsers** - Support new document formats
- **Tools** - Create custom service integrations
- **Billing** - Add payment providers

## Key Features

### Knowledge Base & RAG

Upload documents and build a searchable knowledge base:

- Intelligent chunking strategies for optimal retrieval
- Vector embeddings with pgvector
- Semantic search with citation tracking
- Support for PDF, DOCX, TXT, and more

### Channel Integrations

Deploy bots across multiple platforms:

- **Web Chat** - Embeddable widget with customizable UI
- **Telegram** - Full Bot API integration
- **Extensible** - Add custom channels via plugins

### Enterprise Features

Built for production environments:

- Granular permission system with 50+ permissions
- Role-based access control (Super Admin, Client, Agent)
- Audit logs for compliance
- Analytics and reporting
- Rate limiting and quota management

## Technical Stack

The project uses a modern monorepo architecture with Turbo:

- **Backend**: NestJS with PostgreSQL and Redis
- **Frontend**: React with TanStack ecosystem
- **Real-time**: Socket.io for live updates
- **Jobs**: BullMQ for background processing
- **Storage**: S3-compatible (MinIO/AWS)

## Current Status

Asistia is in active development with core features implemented. The focus is on
stabilizing the conversation engine and expanding channel integrations before
the first production release.
