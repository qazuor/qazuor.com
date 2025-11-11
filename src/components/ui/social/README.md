# Social Links Components

Esta carpeta contiene los componentes modulares para enlaces de redes sociales.

## Arquitectura

### Componente Base: `SocialLink.astro`

Componente base que maneja la lógica común de renderizado de iconos y estilos.

### Componentes Específicos

Cada red social tiene su propio componente para mayor modularidad:

- `GitHubLink.astro` - Para enlaces de GitHub
- `LinkedInLink.astro` - Para enlaces de LinkedIn
- `FiverrLink.astro` - Para enlaces de Fiverr
- `UpworkLink.astro` - Para enlaces de Upwork

### Contenedor: `SocialLinks.astro`

Componente que agrupa múltiples enlaces sociales con configuración centralizada.

## Uso

### Componente Individual

```astro
---
import GitHubLink from './ui/social/GitHubLink.astro';
---

<GitHubLink
  href="https://github.com/username"
  ariaLabel="Mi GitHub"
  size="lg"
/>
```

### Contenedor de Enlaces

```astro
---
import SocialLinks from './ui/SocialLinks.astro';
---

<SocialLinks
  networks={['github', 'linkedin']}
  size="md"
  className="justify-center"
/>
```

## Props

### Componentes Individuales

- `href` (string, requerido): URL del perfil
- `ariaLabel` (string, opcional): Etiqueta de accesibilidad
- `size` ('sm' | 'md' | 'lg', opcional): Tamaño del icono
- `className` (string, opcional): Clases CSS adicionales

### SocialLinks

- `networks` (array, opcional): Lista de redes a mostrar
- `ariaLabels` (object, opcional): Etiquetas personalizadas
- `size` ('sm' | 'md' | 'lg', opcional): Tamaño de todos los iconos
- `className` (string, opcional): Clases CSS para el contenedor

## Ventajas de esta Arquitectura

1. **Modularidad**: Cada red social es un componente independiente
2. **Reutilización**: Los componentes pueden usarse individualmente o en grupo
3. **Mantenibilidad**: Fácil agregar nuevas redes sociales
4. **Type Safety**: TypeScript asegura el uso correcto de props
5. **Flexibilidad**: Configuración granular por componente
