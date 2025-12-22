---
title: Gemfolio
description:
  Jewelry catalog and e-commerce platform with product variants, stock
  management, wishlist, and AI integration. Built for modern retailers.
longDescription:
  A customizable catalog and online sales system designed for jewelry retailers.
  Includes HD product photos, variant management, collections, and dual
  catalog/sales modes.
lang: en
category: commercial
tags: [Web App, E-Commerce, Catalog, Full-Stack, AI Integration]
technologies: [Astro, React, Tailwind CSS, Drizzle ORM, PostgreSQL, TypeScript]
images:
  - ./_images/gemfolio/placeholder.jpg
mainImage: ./_images/gemfolio/placeholder.jpg
githubUrl: https://github.com/qazuor/Gemfolio
featured: true
publishDate: 2025-12-15
order: 9
status: development
metrics:
  commits: 186
  linesOfCode: 104117
  developmentTime: '2 months'
  startDate: 2025-11-05
  contributors: 2
  openIssues: 0
challenges:
  - problem: 'Heavy HD images - Jewelry photos require high resolution'
    solution: 'Automatic optimization with Cloudflare R2 CDN'
  - problem: 'Complex product variants - Same design in multiple materials'
    solution: 'Variant system with unique SKU per combination'
  - problem: 'Dual-mode (catalog/store) - Switch modes without code duplication'
    solution: 'Context provider controlling which features to display'
highlights:
  - 'HD product catalog with zoom functionality'
  - 'Variant system: sizes, materials, stone types'
  - 'PWA with offline support and installable'
  - 'SEO optimization with JSON-LD structured data'
  - 'Dual-mode: public catalog + store with pricing'
  - 'Mobile-first responsive design'
futureImprovements:
  - 'Payment gateway (MercadoPago, Stripe)'
  - 'Multi-store support'
  - 'Physical POS synchronization'
  - 'Customer accounts and order history'
  - 'Marketing tools (email campaigns, social media)'
stackRationale:
  Astro + React: 'Fast catalog pages plus interactivity where needed'
  TanStack Start: 'Modern full-stack React for admin panel'
  Cloudflare R2: 'Economical storage for many images'
  UploadThing: 'Image upload with preview and optimization'
---

## Project Description

Gemfolio started from a personal need: my partner needed a proper system to
showcase and sell jewelry online. Existing solutions were either too generic,
too expensive, or lacked the specific features needed for jewelry retail.

What began as a custom solution is evolving into a product that can serve other
small retailers facing the same challenges.

## The Challenge

Jewelry retail has unique requirements:

- **Product variants**: Same design in different sizes, materials, or stones
- **High-quality images**: Jewelry needs detailed photos from multiple angles
- **Stock tracking**: Managing inventory across variants
- **Dual-mode operation**: Sometimes you want a catalog, sometimes a store

Generic e-commerce platforms handle this poorly or require expensive add-ons.

## Key Features

### Product Management

- **Variant system**: Define products with multiple options (size, material,
  color, stone type)
- **HD photo galleries**: Multiple high-resolution images per product
- **Stock tracking**: Real-time inventory per variant
- **Collections**: Organize products into thematic groups

### Customer Experience

- **Smart search**: Find products by name, description, or attributes
- **Advanced filtering**: Narrow down by price, material, availability
- **Local wishlist**: Save favorites without requiring an account
- **Responsive gallery**: Beautiful product display on any device

### Dual-Mode Operation

Switch between two modes based on your needs:

- **Catalog mode**: Show products without prices or cart (for in-store reference
  or lookbooks)
- **Sales mode**: Full e-commerce with pricing, cart, and checkout

### AI Integration

AI-powered features to enhance the experience:

- Product description generation
- Smart recommendations
- Search improvement

## Technical Architecture

### Stack

- **Astro**: Static site generation for fast catalog pages
- **React**: Interactive components for search, filters, and cart
- **Tailwind CSS**: Modern, responsive styling
- **Drizzle ORM**: Type-safe database access
- **PostgreSQL**: Reliable data storage

### Design Principles

- **Performance first**: Fast loading even with high-resolution images
- **Mobile-friendly**: Designed to browse on any device
- **Easy to manage**: Simple admin interface for non-technical users

## Use Cases

### For Jewelry Retailers

- Show collections to in-store customers
- Enable online browsing and purchasing
- Manage inventory across variants
- Share digital lookbooks

### For Artisans

- Showcase portfolio of work
- Accept custom orders
- Track commissions and sales

## Current Status

Gemfolio is in active development with a planned launch by late December 2025 or
early January 2026. Core catalog functionality is working, with ongoing work on
sales features and AI integration.

## Business Model

Initially built for a specific need, Gemfolio will be offered as a product for
other small jewelry retailers and artisans who need a professional online
presence without the complexity of large e-commerce platforms.
