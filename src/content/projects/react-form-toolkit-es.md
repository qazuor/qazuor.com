---
title: React Form Toolkit
description:
  Una librería de formularios completa que combina React Hook Form con
  validación Zod. Construí formularios type-safe con mínimo boilerplate y
  componentes pre-construidos.
longDescription:
  Simplifica el desarrollo de formularios React con validación de esquemas
  integrada, soporte i18n para 7 idiomas y componentes flexibles para campos
  condicionales, dependencias y arrays dinámicos.
lang: es
category: open-source
tags: [Librería React, Formularios, TypeScript, Validación]
technologies: [React, TypeScript, Zod, React Hook Form, Tailwind CSS]
images:
  - ./_images/reactFormToolkit/1.png
  - ./_images/reactFormToolkit/2.png
  - ./_images/reactFormToolkit/3.png
mainImage: ./_images/reactFormToolkit/1.png
githubUrl: https://github.com/qazuor/reactFormToolkit
demoUrl: https://qazuor-react-form-toolkit.vercel.app/
featured: false
publishDate: 2025-04-10
order: 7
---

## Descripción del Proyecto

El manejo de formularios en React siempre se sintió más complejo de lo que
debería ser. Mientras librerías como React Hook Form y Formik existen, la forma
en que estructuran el código de formularios nunca encajó con cómo pienso sobre
formularios.

React Form Toolkit es mi enfoque de gestión de formularios: combinando el
rendimiento de React Hook Form con el type safety de Zod, envuelto en una API de
componentes que se siente intuitiva. El objetivo es escribir menos boilerplate
manteniendo control total sobre validación y renderizado.

## Características Principales

### Validación Type-Safe

Los esquemas Zod definen la estructura de tu formulario y reglas de validación.
TypeScript infiere tipos automáticamente, capturando errores en tiempo de
compilación.

```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

<FormProvider schema={schema} onSubmit={handleSubmit}>
  <FormField name="email" label="Email" />
  <FormField name="password" label="Contraseña" type="password" />
  <FormField name="rememberMe" label="Recordarme" type="checkbox" />
  <FormButtonsBar />
</FormProvider>;
```

### Soporte Multi-Idioma

Traducciones incorporadas para 7 idiomas:

- Inglés
- Español
- Portugués
- Francés
- Alemán
- Italiano
- Ruso

Los mensajes de error se muestran automáticamente en el idioma del usuario.

### Patrones Avanzados de Campos

- **ConditionalField**: Mostrar/ocultar campos basados en otros valores
- **DependantField**: Campos que dependen de valores de otros campos
- **FieldArray**: Listas dinámicas con funcionalidad agregar/eliminar

### Integración con Tailwind

Estilizado con Tailwind CSS de serie, pero completamente personalizable a través
de props y clases CSS.

## Componentes

### FormProvider

El componente principal que envuelve tu formulario y gestiona estado, validación
y envío.

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  defaultValues={initialData}
>
  {/* Campos del formulario */}
</FormProvider>
```

### FormField

Renderiza elementos de entrada con validación automática y display de errores.

```tsx
<FormField
  name="email"
  label="Dirección de Email"
  placeholder="tu@ejemplo.com"
  required
/>
```

### FormButtonsBar

Contenedor para botones submit/reset con estados de carga incorporados.

### ConditionalField

Renderiza hijos solo cuando se cumple una condición.

```tsx
<ConditionalField when="hasAccount" is={false}>
  <FormField name="newPassword" label="Crear Contraseña" />
</ConditionalField>
```

### DependantField

Campos que reaccionan a cambios en otros campos.

```tsx
<DependantField
  dependsOn="country"
  render={(country) => (
    <FormField name="state" options={getStatesForCountry(country)} />
  )}
/>
```

### FieldArray

Listas dinámicas de campos.

```tsx
<FieldArray
  name="items"
  render={({ fields, append, remove }) => (
    <>
      {fields.map((field, index) => (
        <FormField key={field.id} name={`items.${index}.name`} />
      ))}
      <button onClick={() => append({ name: '' })}>Agregar Item</button>
    </>
  )}
/>
```

## Detalles Técnicos

### Requisitos

- React 18.0+
- TypeScript 5.0+
- Zod 3.22+

### Compatibilidad con Frameworks

Funciona con cualquier setup de React:

- Create React App
- Next.js (App Router y Pages Router)
- Remix
- Vite

### Estado

Actualmente en **beta**. Estable para uso en producción, pero la API puede tener
cambios breaking antes de v1.0.

## ¿Por Qué Otra Librería de Formularios?

Las opciones existentes son geniales, pero cada una tiene trade-offs:

- **React Hook Form** es performante pero verbose para formularios complejos
- **Formik** tiene una API linda pero re-renderiza más de lo necesario
- **Final Form** es poderoso pero tiene curva de aprendizaje pronunciada

React Form Toolkit apunta a combinar los mejores aspectos: rendimiento de React
Hook Form, type safety de Zod y una API de componentes que se lee como el
formulario que crea.
