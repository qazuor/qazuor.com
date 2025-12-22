---
title: React Custom Hooks
description:
  Una colección de más de 20 hooks React de alta calidad, completamente
  testeados para casos de uso comunes. Cero dependencias, tree-shakeable y
  compatible con SSR.
longDescription:
  Repositorio centralizado de hooks React reutilizables que cubren gestión de
  estado, efectos secundarios, APIs del navegador e interacción del usuario.
  Escrito en TypeScript con documentación completa.
lang: es
category: open-source
tags: [Librería React, Hooks, TypeScript, Paquete NPM]
technologies: [React, TypeScript, Vitest]
images:
  - ./_images/reactCustomHooks/1.png
mainImage: ./_images/reactCustomHooks/1.png
githubUrl: https://github.com/qazuor/reactCustomHooks
npmUrl: https://www.npmjs.com/package/@qazuor/react-hooks
featured: false
publishDate: 2025-04-01
order: 6
status: production
metrics:
  commits: 53
  linesOfCode: 1155
  developmentTime: '2 semanas'
  startDate: 2025-03-04
  contributors: 1
  openIssues: 0
challenges:
  - problem: 'Compatibilidad SSR - Hooks accediendo a window rompían en SSR'
    solution:
      "Chequeos typeof window !== 'undefined' con valores iniciales seguros"
  - problem: 'Memory leaks en intervalos - Timers no limpiados al desmontar'
    solution: 'Limpieza rigurosa en funciones de retorno de useEffect'
  - problem:
      'Inferencia de tipos compleja - Genéricos para hooks con múltiples
      overloads'
    solution: 'Firmas de overload bien definidas más tests de tipos'
highlights:
  - '20+ hooks cubriendo casos de uso comunes'
  - 'Cero dependencias - solo React como peer dependency'
  - 'Soporte completo de TypeScript con excelente inferencia de tipos'
  - 'Tree-shakeable - solo importás lo que usás'
  - 'SSR safe - compatible con Next.js y otros'
  - 'Bundle bajo 5KB gzipped para la librería completa'
futureImprovements:
  - 'usePrevious - Trackear valor previo'
  - 'useAsync - Gestión de estado de operaciones async'
  - 'useIntersectionObserver - Detección de visibilidad en viewport'
  - 'useGeolocation - API de geolocalización del navegador'
  - 'useEventListener - Gestión simplificada de event listeners'
stackRationale:
  TypeScript: 'Excelente inferencia de tipos para consumidores del hook'
  Vitest: 'Testing rápido con gran DX'
  Zero dependencies: 'Tamaño de bundle mínimo, sin conflictos de versión'
---

## Descripción del Proyecto

Cada proyecto React en el que trabajo termina necesitando las mismas utilidades:
debouncing, sincronización con local storage, detección de clic fuera, media
queries y más. En lugar de copiar código entre proyectos o instalar múltiples
paquetes pequeños, creé un repositorio centralizado de hooks que puedo
reutilizar en todos lados.

Esta librería es mi toolkit personal que he refinado a través de múltiples
proyectos, asegurando que cada hook esté bien testeado, correctamente tipado y
siga las mejores prácticas de React.

## Características

- **Más de 20 hooks** cubriendo casos de uso comunes
- **Cero dependencias** - solo React como peer dependency
- **Soporte completo de TypeScript** con inferencia de tipos apropiada
- **Tree-shakeable** - solo importás lo que necesitás
- **Compatible con SSR** - seguro para Next.js y otros frameworks SSR
- **Completamente testeado** con cobertura de tests completa

## Instalación

```bash
npm install @qazuor/react-hooks
# o
pnpm add @qazuor/react-hooks
# o
yarn add @qazuor/react-hooks
```

## Hooks Disponibles

### Gestión de Estado

- **useBoolean** - Estado booleano con métodos `setTrue`, `setFalse`, `toggle`
- **useToggle** - Estado toggleable con persistencia opcional
- **useQueue** - Cola FIFO con operaciones `enqueue`, `dequeue`

### Efectos Secundarios

- **useTimeout** - Ejecución retrasada de callback con `start`, `stop`, `reset`
- **useInterval** - Callbacks recurrentes con funcionalidad de pausa/reanudación
- **useHandledInterval** - Intervalo mejorado con soporte de delay aleatorio
- **useDebounce** - Debouncing de valores con delay configurable

### APIs del Navegador

- **useLocalStorage** - Estado persistente sincronizado con localStorage
- **useSessionStorage** - Gestión de almacenamiento de sesión
- **useCopyToClipboard** - Utilidades de lectura/escritura del portapapeles
- **useMediaQuery** - Matching reactivo de media queries
- **useNetworkState** - Detección de conectividad de red
- **useVisibilityChange** - Monitoreo de visibilidad del documento
- **useWindowWidth** - Tracking de dimensiones de ventana

### Interacción del Usuario

- **useClickOutside** - Detectar clics fuera de un elemento
- **useIdleness** - Monitorear actividad/inactividad del usuario
- **usePageLeave** - Detectar cuando el usuario abandona la página
- **useLockBodyScroll** - Prevenir scroll del body (modales, overlays)
- **useMeasure** - Dimensiones de elementos via ResizeObserver

### Desarrollo

- **useLogger** - Logging de desarrollo con tracking de ciclo de vida

## Ejemplo de Uso

```tsx
import {
  useLocalStorage,
  useDebounce,
  useClickOutside,
} from '@qazuor/react-hooks';

function SearchDropdown() {
  const [query, setQuery] = useLocalStorage('search-query', '');
  const debouncedQuery = useDebounce(query, 300);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div ref={dropdownRef}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* Dropdown de resultados */}
    </div>
  );
}
```

## Detalles Técnicos

### Requisitos

- React 18.2+
- TypeScript 4.9+ (para usuarios de TypeScript)

### Tamaño del Bundle

Cada hook es importable independientemente, así que solo incluís en el bundle lo
que usás. La librería entera está bajo 5KB gzipped.

## Hooks Futuros

Planeando agregar:

- `usePrevious` - Trackear valor previo
- `useAsync` - Gestión de estado de operaciones async
- `useIntersectionObserver` - Detección de visibilidad en viewport
- `useGeolocation` - API de geolocalización del navegador
- `useEventListener` - Gestión simplificada de event listeners
