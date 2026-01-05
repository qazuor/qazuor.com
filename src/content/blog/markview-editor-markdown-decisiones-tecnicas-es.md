---
title:
  'Construyendo MarkView: un editor markdown moderno con sync cloud y soporte
  offline'
slug: 'markview-editor-markdown-decisiones-tecnicas'
lang: es
excerpt:
  'El paso a paso de construir un editor markdown desde cero: por qué lo hice,
  qué problemas encontré, decisiones arquitectónicas, y cómo encaré los
  diferentes problemas con los que me encontré'
publishDate: 2026-01-05
tags: [markdown, editor, react, typescript, pwa, codemirror, arquitectura]
readTime: 18 min read
draft: false
category: development
image: ./_images/markview-blog.jpg
---

_Probé muchos editores markdown durante los últimos años. Ninguno tenía en un
solo lugar todas las características que me hubieran gustado tener._

Typora es excelente pero es desktop-only y de pago. Obsidian es potente pero
orientado a notas, no a documentación técnica. HackMD tiene colaboración pero la
UX no me convence. Y los que más me interesaban, los editores online gratuitos
son... básicos, muy básicos.

Después de un tiempo de usar varias alternativas y que ninguna me terminó de
convencer, decidí construirme una. Así nació
**[MarkView](https://qazuor-markview.vercel.app)**: un editor markdown moderno,
con preview en tiempo real, sincronización con GitHub y Google Drive, y soporte
offline como PWA.

---

## El problema que quería resolver

Mi workflow con markdown incluye:

1. **Documentación de proyectos** que vive en repos de GitHub
2. **Notas técnicas** que quiero acceder desde cualquier dispositivo
3. **Borradores de posts** que eventualmente publico en mi blog
4. **README y changelogs** que edito frecuentemente

Probé para docs de GitHub, el editor web de GitHub (no me gusta). Para notas
probé Notion (tampoco me convenció). Para posts usaba VS Code local (sin sync
automático, solo en la pc, etc).

Quería una sola herramienta que:

- Funcione en el navegador, sin instalación
- Tenga un editor potente con atajos de teclado
- Muestre preview en tiempo real
- Sincronice directamente con GitHub y Google Drive
- Funcione offline cuando no tenga conexión

---

## Las decisiones arquitectónicas

### Por qué CodeMirror 6

El editor es la parte principal de la aplicación. Evalué tres opciones:

| Opción           | Pros                        | Contras                                |
| ---------------- | --------------------------- | -------------------------------------- |
| Monaco (VS Code) | Feature-complete, familiar  | 2MB+ de bundle, overkill para markdown |
| ProseMirror      | Excelente para rich text    | WYSIWYG, no quiero ocultar la sintaxis |
| CodeMirror 6     | Modular, ligero, extensible | Curva de aprendizaje                   |

Elegí CodeMirror 6 por tres razones:

1. **Modularidad** — Solo importo las extensiones que necesito
2. **Performance** — Virtual scrolling nativo para documentos largos
3. **Extensibilidad** — Puedo crear extensiones custom sin tocar el core

La arquitectura de CodeMirror 6 es diferente a la versión anterior. Todo es
inmutable y funcional. Al principio fue confuso, pero una vez que entendí el
modelo de `State → Transaction → New State`, el código se volvió muy predecible.

```typescript
// Ejemplo de extensión custom para insertar frontmatter
const insertFrontmatter = StateCommand({
  run(view) {
    const frontmatter = '---\ntitle: \ndate: \n---\n\n';
    view.dispatch({
      changes: { from: 0, insert: frontmatter },
      selection: { anchor: 10 }, // Posicionar cursor en title
    });
    return true;
  },
});
```

### Por qué Zustand y no Redux o Context

La gestión de estado fue otra decisión importante. MarkView tiene múltiples
dominios de estado:

- **Documentos** — Contenido, metadata, historial de versiones
- **UI** — Modales abiertos, panel activo, sidebar collapsed
- **Settings** — Tema, font size, auto-save interval
- **GitHub** — Repos, branches, archivos remotos
- **Google Drive** — Carpetas, archivos, estado de sync
- **Sync** — Cola de operaciones, estado de conexión

Con Redux, esto serían 6 slices con mucho boilerplate. Con Context, serían 6
providers anidados con re-renders innecesarios.

Zustand me permite tener **6 stores independientes** que se suscriben
granularmente:

```typescript
// documentStore.ts
export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  activeDocumentId: null,

  setContent: (id, content) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, content, modified: true } : doc
      ),
    }));
    // Trigger auto-save
    get().scheduleAutoSave(id);
  },
}));

// En un componente, solo me suscribo a lo que necesito
const content = useDocumentStore(
  (state) => state.documents.find((d) => d.id === activeId)?.content
);
```

Esto evita re-renders innecesarios. Si cambio el contenido de un documento, solo
se re-renderizan los componentes que usan ese contenido específico.

### Por qué Hono para el backend

El backend es mínimo: maneja OAuth, hace de proxy a requests a GitHub/Google
APIs, y almacena preferencias de usuario.

Elegí Hono sobre Express o Fastify porque:

1. **Ultra ligero** — ~14KB vs ~200KB de Express
2. **Edge-ready** — Funciona en Vercel Edge, Cloudflare Workers, Deno
3. **Type-safe** — Integración nativa con Zod para validación
4. **DX excelente** — Similar a Express pero más moderno

```typescript
// server/api/routes/github.ts
const github = new Hono()
  .use('/*', authMiddleware)
  .get('/repos', async (c) => {
    const user = c.get('user');
    const repos = await octokit.repos.listForAuthenticatedUser();
    return c.json(repos.data);
  })
  .post(
    '/files/:owner/:repo/*',
    zValidator('json', saveFileSchema),
    async (c) => {
      const { content, message } = c.req.valid('json');
      const path = c.req.param('*');
      // ... save to GitHub
    }
  );
```

---

## Problemas reales y cómo los resolví

### El scroll sync entre editor y preview

**El problema:** Quería que al scrollear el editor, el preview se moviera a la
sección correspondiente (y viceversa). Pero el markdown no tiene una relación
1:1 con el HTML renderizado.

Un heading `## Título` ocupa una línea en markdown pero puede ser un `<h2>` con
padding y margin variables en el preview. Una lista de 10 items en markdown son
10 líneas, pero en HTML son elementos `<li>` con alturas diferentes según el
contenido.

**La solución:** Creé un plugin de rehype que anota cada elemento HTML con su
línea de origen:

```typescript
// services/markdown/rehypeLineNumbers.ts
function rehypeLineNumbers() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.position?.start?.line) {
        node.properties = {
          ...node.properties,
          'data-source-line': node.position.start.line,
        };
      }
    });
  };
}
```

Con esto, cada elemento del preview tiene un atributo `data-source-line`. Cuando
scrolleo el editor, busco el elemento del preview más cercano a la línea visible
y lo scrolleo al viewport.

```typescript
// hooks/useScrollSync.ts
const syncPreviewToEditor = useCallback((editorLine: number) => {
  const elements = previewRef.current?.querySelectorAll('[data-source-line]');
  let closest = null;
  let minDistance = Infinity;

  elements?.forEach((el) => {
    const sourceLine = parseInt(el.getAttribute('data-source-line') || '0');
    const distance = Math.abs(sourceLine - editorLine);
    if (distance < minDistance) {
      minDistance = distance;
      closest = el;
    }
  });

  closest?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, []);
```

### Conflictos de edición con servicios cloud

**El problema:** El usuario puede editar un documento localmente mientras
alguien (o él mismo desde otro dispositivo) lo modifica en GitHub o Google
Drive. Sin manejo de conflictos, el que guarda último gana y se pierden cambios.

**La solución:** Implementé un sistema de detección de conflictos basado en
ETags y timestamps:

1. Al abrir un archivo, guardo su `etag` o `modifiedTime`
2. Antes de guardar, verifico si cambió en el servidor
3. Si cambió, muestro un modal de resolución con tres opciones:
   - **Usar versión local** — Sobrescribir el servidor
   - **Usar versión remota** — Descartar cambios locales
   - **Merge manual** — Mostrar diff y dejar que el usuario decida

```typescript
// services/sync/conflictDetection.ts
async function checkForConflicts(doc: Document): Promise<ConflictResult> {
  if (doc.source === 'github') {
    const remote = await fetchGitHubFile(doc.path);
    if (remote.sha !== doc.remoteSha) {
      return {
        hasConflict: true,
        localContent: doc.content,
        remoteContent: remote.content,
        localTimestamp: doc.lastModified,
        remoteTimestamp: remote.committedAt,
      };
    }
  }
  return { hasConflict: false };
}
```

El modal de conflictos usa un diff viewer side-by-side que resalta las
diferencias. Fue más trabajo del que esperaba, pero evita pérdida de datos.

### Performance del preview con Mermaid y KaTeX

**El problema:** El preview se actualiza en cada keystroke (debounced a 300ms).
Pero si el documento tiene diagramas Mermaid o ecuaciones KaTeX, cada
actualización era lenta porque re-renderizaba todo.

Mermaid especialmente es pesado. Un diagrama de flujo mediano toma ~100ms en
renderizar. Con 5 diagramas en un documento, el preview laggea notoriamente.

**La solución:** Cache de bloques renderizados con invalidación selectiva:

```typescript
// services/markdown/blockCache.ts
const blockCache = new Map<string, { hash: string; html: string }>();

function getCachedBlock(
  type: 'mermaid' | 'katex',
  content: string
): string | null {
  const hash = hashContent(content);
  const key = `${type}:${hash}`;

  if (blockCache.has(key)) {
    return blockCache.get(key)!.html;
  }
  return null;
}

function cacheBlock(type: string, content: string, html: string): void {
  const hash = hashContent(content);
  const key = `${type}:${hash}`;
  blockCache.set(key, { hash, html });
}
```

Ahora, cuando el usuario edita texto normal, los diagramas Mermaid usan la
versión cacheada. Solo se re-renderizan cuando el contenido del bloque
específico cambia.

### Historial de versiones por documento

**El problema:** Quería un historial de versiones tipo "undo on steroids", donde
puedas ver versiones anteriores de un documento y hacer diff entre ellas. Pero
cada pestaña tiene su propio historial independiente.

**La solución:** Cada documento tiene su array de versiones con timestamps y
contenido. El challenge fue el almacenamiento, ya que localStorage tiene límite
de ~5MB.

Implementé:

1. **Límite de versiones** — Máximo 50 versiones por documento
2. **Compresión delta** — Solo guardo el diff, no el contenido completo
3. **Pruning automático** — Las versiones viejas se eliminan al superar el
   límite

```typescript
// stores/documentStore.ts - versioning logic
addVersion: (docId, content) => {
  const doc = get().documents.find((d) => d.id === docId);
  if (!doc) return;

  const previousContent = doc.versions[doc.versions.length - 1]?.content || '';
  const delta = createDelta(previousContent, content);

  const newVersion: Version = {
    id: generateId(),
    timestamp: Date.now(),
    delta,
    contentHash: hashContent(content),
  };

  const versions = [...doc.versions, newVersion].slice(-50); // Keep last 50

  set((state) => ({
    documents: state.documents.map((d) =>
      d.id === docId ? { ...d, versions } : d
    ),
  }));
};
```

El visor de diferencias usa un algoritmo de diff line-by-line con highlighting
de cambios. No es tan sofisticado como git diff, pero funciona bien para
documentos markdown.

---

## El sistema de temas de preview

Agregué temas para que la preview se vea como en:

- GitHub Light/Dark
- GitLab
- Notion
- Obsidian
- Stack Overflow
- Dev.to

Cada tema es un archivo CSS que intenta replicar los estilos de cada plataforma.
No son copias exactas (eso sería complejo y frágil), pero capturan la esencia
visual.

```css
/* styles/preview-themes/github-dark.css */
.preview-theme-github-dark {
  --preview-bg: #0d1117;
  --preview-text: #c9d1d9;
  --preview-heading: #c9d1d9;
  --preview-link: #58a6ff;
  --preview-code-bg: #161b22;
  --preview-blockquote-border: #3b434b;
  /* ... más variables */
}

.preview-theme-github-dark h1 {
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--preview-blockquote-border);
}

.preview-theme-github-dark code {
  background: var(--preview-code-bg);
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 85%;
}
```

El usuario puede cambiar el tema del preview independientemente del tema de la
aplicación. Es útil para ver cómo quedará un README antes de pushearlo.

---

## La PWA y el soporte offline

MarkView funciona completamente offline.

### Service Worker strategy

Uso Workbox con una estrategia mixta:

- **App shell** — Cache-first con actualización en background
- **Assets estáticos** — Cache-first, versionados por hash
- **API calls** — Network-first con fallback a cache

```typescript
// sw.ts (simplificado)
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 3,
  })
);

registerRoute(
  ({ request }) =>
    request.destination === 'script' || request.destination === 'style',
  new CacheFirst({
    cacheName: 'assets',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
);
```

### Sync diferido

Cuando el usuario está offline, las operaciones de guardado cloud se encolan:

```typescript
// services/sync/queue.ts
const syncQueue: SyncOperation[] = [];

function queueOperation(op: SyncOperation) {
  syncQueue.push(op);
  persistQueue(); // Guardar en IndexedDB
}

// Cuando vuelve la conexión
window.addEventListener('online', () => {
  processQueue();
});

async function processQueue() {
  while (syncQueue.length > 0) {
    const op = syncQueue[0];
    try {
      await executeOperation(op);
      syncQueue.shift();
      persistQueue();
    } catch (error) {
      // Reintentar después o mostrar error al usuario
      break;
    }
  }
}
```

---

## Onboarding y UX

Por más que lo hice pensando en uso particular mío, la idea era ofertarlo a la
comunidad, y en ese caso un editor con unas cuantas features necesita guiar al
usuario. Así que implementé:

### Tour interactivo

Al primer uso, un tour guía por las features principales:

1. El editor y sus atajos
2. El panel de preview
3. El explorador de archivos
4. La integración cloud
5. Las opciones de exportación

Cada paso resalta el elemento relevante y espera interacción antes de continuar.

### Hints contextuales

Pequeños tooltips que aparecen cuando el usuario hace algo por primera vez:

- "Tip: Usá Ctrl+B para negrita"
- "Tip: Podés arrastrar archivos .md aquí"
- "Tip: Hacé click derecho para más opciones"

Los hints se marcan como vistos y no vuelven a aparecer.

---

## Lecciones aprendidas

### Lo que funcionó bien

1. **CodeMirror 6** — Vale la pena la curva de aprendizaje. La performance y
   extensibilidad son excelentes.

2. **Zustand con stores separados** — Mantiene el código organizado y evita
   re-renders innecesarios.

3. **PWA desde el día uno** — Agregarlo después hubiera sido mucho más trabajo.

4. **Cache agresivo en preview** — La diferencia de performance es notable.

### Lo que haría diferente

1. **Usar IndexedDB desde el inicio** — localStorage tiene limitaciones de
   tamaño que me obligaron a comprimir historial.

2. **Tests E2E más tempranos** — Los tests unitarios no capturan bugs de
   integración. Playwright debería haber entrado antes.

---

## Cierre

MarkView empezó como "quiero un editor mejor" y terminó siendo un proyecto de 3,
casi 4 semanas con muchas líneas de código. ¿Es perfecto? No. ¿Resuelve mi
problema original? **Absolutamente**.

Lo uso todos los días para documentación, notas, y borradores. La sincronización
con GitHub me ahorra saltar entre herramientas. El soporte offline me permite
escribir en cualquier lado.

Si tenés un workflow similar o simplemente querés un editor markdown moderno que
funcione en el navegador, [probalo](https://qazuor-markview.vercel.app). Es open
source y gratuito.

_Las mejores herramientas son las que construís para vos mismo, porque entendés
exactamente qué problema resuelven._

---

## Referencias

- [MarkView en GitHub](https://github.com/qazuor/markview) — Código fuente
- [MarkView Demo](https://qazuor-markview.vercel.app) — Probalo online
- [MarkView - Página del proyecto](/es/projects/markview) — Más detalles
- [CodeMirror 6](https://codemirror.net/) — Documentación del editor
- [Unified/Remark](https://unifiedjs.com/) — Pipeline de markdown
