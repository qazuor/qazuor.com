---
title: 'Checklist práctico para usar IA sin llenar el repo de basura'
slug: 'ia-codigo-calidad'
lang: es
excerpt:
  'Rutinas concretas de trabajo asistido por IA: debugging, tests, refactors y
  diseño. Todo sin regalarle el volante al modelo.'
publishDate: 2025-11-21
tags: [ia, productividad, desarrollo, typescript, debugging]
readTime: 14 min read
draft: false
category: Productividad
image: ./_images/portfolio-design.jpg
series:
  id: ia-and-development
  name: 'IA para Development'
  part: 2
---

Uso **Claude Code** y **ChatGPT** prácticamente todos los días. Me ayudan mucho,
pero con reglas estrictas para que no terminen metiendo código falopa en el
repo.

En la [Parte 1](/es/blog/claude-code-chatgpt-productividad) hablé de la
filosofía general y de qué tareas delego o no. Acá me meto en el **día a día**:

- El patrón mental que sigo siempre
- Cómo los uso para _debugging_
- Cómo los uso para _tests_
- Cómo los uso para ideas de arquitectura
- Cómo les doy contexto sin regalarles el repo
- Un _checklist_ rápido de rutina diaria

_La idea no es que la IA programe por vos, sino que te saque de encima lo que te
distrae de pensar._

---

## Patrón base: primero pensás vos, después la IA complementa

Mi patrón mental es simple:

1. Entendés y reformulás el problema
2. Escribís tu solución o al menos tu _approach_
3. Recién ahí traés a la IA para refinar, cuestionar o automatizar

```mermaid
flowchart LR
  P["Problema"] --> H1["Humano piensa"]
  H1 --> Draft["Borrador de código"]
  Draft --> IA["IA sugiere mejoras"]
  IA --> H2["Humano revisa y decide"]
  H2 --> Repo["Código final"]
```

### Paso 1: formulás el problema en tu cabeza

Antes de abrir Claude o ChatGPT, trato de que mi cabeza haga el laburo básico:

- ¿Qué estoy tratando de resolver exactamente?
- ¿Dónde está el borde difícil? (algoritmia, API, _performance_, DX)
- ¿Qué condiciona la solución? (_stack_ actual, restricciones de negocio)

Si no lo podés explicar en 3 o 4 frases, todavía no está para la IA. Es un
filtro para que no te use de goma de borrar mental.

### Paso 2: escribís tu versión primero

Aunque sea pseudo código, siempre escribo algo mío antes de pedir ayuda. Ejemplo
real de mi proyecto [Hospeda](/es/projects/hospeda):

```ts
// Hook para filtrar destinos - lo escribo funcional primero
export function useFilteredDestinations(
  destinations: Destination[],
  filters: DestinationFilters
) {
  return useMemo(() => {
    let result = destinations;

    if (filters.region) {
      result = result.filter((d) => d.region === filters.region);
    }

    if (filters.minRating != null) {
      result = result.filter((d) => d.rating >= filters.minRating);
    }

    if (filters.hasAccommodations) {
      result = result.filter((d) => d.accommodationCount > 0);
    }

    return result;
  }, [
    destinations,
    filters.region,
    filters.minRating,
    filters.hasAccommodations,
  ]);
}
```

¿Es mejorable? Seguro. ¿Funciona? Sí. Primero lo dejo funcional, después pido
ayuda para pulirlo.

### Paso 3: IA como revisor y generador de alternativas

Recién acá le digo algo tipo:

```text
Este hook de React funciona, pero lo quiero:
- Más legible
- Más fácil de extender si agrego filtros nuevos
- Manteniendo el mismo comportamiento

Proponeme 2 alternativas de refactor, explicando pros y contras.
```

Si propone algo mejor, lo comparo. Si mete cosas raras, lo descarto. La clave:
no pregunto _"¿cómo hago esto?"_. Pregunto _"¿cómo mejorás esto que ya
funciona?"_.

---

## Debugging: IA como segundo par de ojos

```mermaid
flowchart TD
  Bug[Bug raro] --> Repro[Reproducís el error]
  Repro --> Q1{¿Stack trace claro?}

  Q1 -- "Sí" --> Inspect[Inspeccionás código]
  Q1 -- "No" --> IAContext[Le das contexto a la IA]

  Inspect --> Q2{¿Encontraste la causa?}
  IAContext --> Hyp[IA propone hipótesis]
  Hyp --> Q2

  Q2 -- "Sí" --> Fix[Aplicás el fix]
  Q2 -- "No" --> DeepDive[Debug más profundo]
  DeepDive --> IARefine[Volvés a la IA con hallazgos]
  IARefine --> Hyp

  Fix --> Tests[Corrés tests]
  Tests --> Done[Merge]
```

Uso la IA cuando:

- El error no es obvio
- El _stack trace_ es críptico
- Ya probaste 2-3 cosas y seguís igual

### Ejemplo de prompt para debugging

```text
Contexto:
- Front: React 19 + TanStack Query
- API: Hono
- DB: Drizzle + PostgreSQL

Error en consola:
TypeError: Cannot read properties of undefined (reading 'items')

Componente que explota:

function DestinationsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["destinations"],
    queryFn: () => destinationService.list({ page: 1, pageSize: 20 }),
  });

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {data.items.map((d) => <li key={d.id}>{d.name}</li>)}
    </ul>
  );
}

Qué sospechas harías y qué cosas revisarías paso a paso.
No inventes código nuevo, focalizate en posibles causas.
```

La IA no "magia" el _bug_, pero te ordena las hipótesis, te recuerda casos borde
que se te escaparon, y te hace de _checklist_ cuando ya venís cansado.

### Cuando el stack trace no alcanza

También la uso para entender errores de Drizzle o PostgreSQL:

```text
Tengo este error de Drizzle:

Error: Column "destinations.slug" must appear in the GROUP BY clause
or be used in an aggregate function

Con este query:

const rows = await db
  .select({
    slug: destinations.slug,
    count: sql<number>`count(*)`.as("count"),
  })
  .from(destinations)
  .groupBy(destinations.region);

Explicame:
1) Qué está diciendo exactamente el error
2) Por qué pasa con este query
3) Dos formas correctas de reescribirlo
```

Lo que le pido: que explique. Lo que hago yo: elijo la solución y la adapto.

---

## Tests: intención humana, esqueleto IA

```mermaid
flowchart TD
  Regla[Regla de negocio] --> Coment[Escribís intención como comentario]
  Coment --> Prompt[Prompt a la IA con el pattern]
  Prompt --> Skeleton[IA genera esqueleto]
  Skeleton --> Review[Ajustás mocks y asserts]
  Review --> RunTests[Corrés tests]
  RunTests --> Q{¿Pasan?}
  Q -- "Sí" --> Commit[Commit]
  Q -- "No" --> Fix[Arreglás]
  Fix --> RunTests
```

Para tests unitarios o de integración:

1. Escribo a mano la **intención** del test
2. Lo dejo como comentario en el archivo
3. Le pido a la IA que lo transforme en un test con mi _stack_

Ejemplo de comentario:

```ts
// Quiero testear:
// - Que DestinationService.list() devuelve paginado correctamente
// - Que respeta los filtros de búsqueda
// - Que si el actor no tiene permisos, devuelve FORBIDDEN
```

Prompt típico:

```text
Con este comentario como guía y usando el pattern de tests de mi proyecto
(Vitest + factories), generame los tests completos.

Pattern que uso:

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createActor } from '../../factories/actorFactory';
import { createModelMock } from '../../utils/modelMockFactory';

describe('DestinationService.list', () => {
  let service: DestinationService;
  let model: ReturnType<typeof createModelMock>;

  beforeEach(() => {
    model = createModelMock();
    service = new DestinationService({ logger: mockLogger }, model);
    vi.restoreAllMocks();
  });

  it('should return paginated list', async () => {
    // ...
  });
});
```

La IA arma el esqueleto. Vos ajustás _mocks_, _assertions_ y casos borde que
conocés del negocio.

### Ejemplo con función simple

Función para generar _slugs_:

```ts
export function generateSlug(name: string, existingSlugs: string[]): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = base;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}
```

Prompt:

```text
Generame tests con Vitest para esta función, cubriendo:
- Caso base con nombre simple
- Nombre con acentos y caracteres especiales
- Nombre que ya existe (debe agregar sufijo numérico)
- Múltiples colisiones (debe incrementar el contador)

No uses valores mágicos raros, mantenelo simple.
```

La IA hace el borrador, vos te quedás con el criterio.

---

## Arquitectura: IA como colega rompebolas

Cuando estoy decidiendo algo de arquitectura, uso la IA como ese colega que
siempre opina, a veces dice pavadas, pero te obliga a justificar lo que hacés.

Ejemplo real:

```text
Contexto de proyecto:
- Monorepo con apps/web (Astro), apps/admin (TanStack Start), apps/api (Hono)
- packages: @repo/db (Drizzle), @repo/service-core, @repo/schemas (Zod)

Quiero decidir dónde vive la lógica para "featured destinations" que:
- Lee accommodations de cada destination
- Calcula un score basado en reviews y bookings
- Devuelve una lista ordenada

Proponeme dos opciones:
1) Método custom en DestinationService
2) Query directo en el route handler

En cada caso: ventajas, desventajas, impacto en testing y reuso.
```

No le delego la decisión. La uso para ver ángulos que quizá me estoy perdiendo.

---

## Contexto sin regalar el repo

### Contexto mínimo pero suficiente

No hace falta pegar 2000 líneas de código. Prefiero:

- 1 archivo clave
- Una descripción corta de la arquitectura
- Los tipos relevantes

Mi regla:

- Si la respuesta depende de un detalle específico → pego el código relevante
- Si es pregunta de diseño → describo, no pego

### Ejemplo con handler real

```ts
export const destinationListRoute = createListRoute({
  method: 'get',
  path: '/',
  handler: async (ctx, _params, _body, query) => {
    const actor = getActorFromContext(ctx);
    const result = await destinationService.list(actor, query || {});

    if (result.error) throw result.error;

    return {
      items: result.data?.items || [],
      pagination: getPaginationResponse(result.data?.total || 0, query),
    };
  },
});
```

Prompt:

```text
Mi arquitectura de services:
- Todos extienden BaseCrudService
- Cada service tiene permission hooks y normalizers
- Pattern de llamada: service.list(actor, filters)

Con este handler, qué refactors te parecen razonables para:
- Manejar el error de forma más prolija
- Evitar el optional chaining repetido

No inventes servicios nuevos, trabajá con lo que hay.
```

---

## Límites que pongo sí o sí

### Nada de credenciales ni datos sensibles

En el apuro te podés mandar una macana. Reglas que me puse:

- Nunca pego tokens de API
- Nunca pego _secrets_ de producción
- Nunca pego _connection strings_ reales
- Nunca pego datos reales de usuarios

En vez de la _connection string_ real, mando:
`postgres://USER:PASS@HOST:PORT/DB_NAME` y aclaro que es _placeholder_.

### Nada de decisiones finales de negocio

Cosas que no delego:

- Criterios de _pricing_
- Reglas de permisos por rol
- Cosas legales o de _compliance_

La IA me puede ayudar a expresarlo en código, pero la regla la defino yo.

---

## Casos donde me ahorró tiempo de verdad

### Refactor grande sin morir entre diffs

Tenía que mover todos los _imports_ de `@repo/db/schema/*` a `@repo/db` sin
romper nada en el _monorepo_.

Flujo:

1. Le pedí a Claude Code que detecte _imports_ viejos, los reemplace, y me
   muestre _diffs_ por archivo
2. Yo revisé cada _diff_ con calma

Trabajo que a mano eran 3-4 horas se fue a ~1 hora con control humano.

### Tests que jamás iba a escribir "por fiaca"

Tenía _services_ con métodos custom (`getSummary`, `getStats`, `getFeatured`)
que "sabía" que tenía que testear, pero nunca llegaba.

Usé IA para generar el esqueleto de tests siguiendo mi _pattern_. Yo ajusté
lógica, nombres y agregué casos borde.

Resultado: pasaron de "algún día" a "hoy".

### Debug de bug cruzado

Los filtros de búsqueda no se aplicaban igual en el _service_ y en el _route
handler_.

Usé la IA para:

1. Hacer un mapa del flujo de filtros: query params → handler → `service.list()`
   → `model.findAll()`
2. Armar un _checklist_ de debugging

Me ordenó la cabeza más que el código. Solo eso ya te ahorra tiempo.

---

## Checklist de rutina diaria

1. **Lo entiendo yo primero** — Si no lo podés explicar en 3 frases, no está
   para IA
2. **Escribís algo tuyo** — Borrador de código, idea, comentario de test
3. **IA complementa, no crea desde cero** — Refactors, tests, docs,
   explicaciones
4. **Siempre revisás diffs** — Nada entra al repo sin pasar por tus ojos
5. **Corrés tests** — Si tocás código testeado, los tests tienen que pasar
6. **Cuidás qué pegás** — Nada de _secrets_, nada de datos reales
7. **No dejás que decida por vos** — Arquitectura, negocio y seguridad son tu
   responsabilidad

---

## Cierre

Claude y ChatGPT pueden ser parte de tu rutina diaria sin convertir tu repo en
un _frankenstein_.

La clave está en tres cosas:

- **Patrón mental claro:** primero pensás vos, después la IA ayuda
- **Flujos concretos:** _debugging_, tests, refactors y diseño asistido (no
  tercerizado)
- **Límites sanos:** sin _secrets_, sin decisiones de negocio delegadas, sin
  _commits_ ciegos

Si los tratás como herramientas y no como oráculos, son como tener un junior
hiper rápido al lado... pero el senior que firma los _commits_ seguís siendo
vos.

---

## Referencias

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Asistente
  integrado para trabajar sobre el repo
- [ChatGPT](https://chat.openai.com) — Para texto largo, ejemplos y _debugging_
  guiado
- [Parte 1: IA como copiloto, no como piloto suicida](/es/blog/claude-code-chatgpt-productividad)
  — La filosofía general
- [Configurando Claude Code para monorepos grandes](/es/blog/configurando-claude-code-para-trabajar-con-monorepos-grandes)
  — Setup para proyectos complejos
