---
title: React Form Toolkit
description:
  A comprehensive form library that combines React Hook Form with Zod
  validation. Build type-safe forms with minimal boilerplate and pre-built
  components.
longDescription:
  Simplify React form development with integrated schema validation, i18n
  support for 7 languages, and flexible components for conditional fields,
  dependencies, and dynamic arrays.
lang: en
category: open-source
tags: [React Library, Forms, TypeScript, Validation]
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
status: beta
metrics:
  commits: 293
  linesOfCode: 10196
  developmentTime: '1 month'
  startDate: 2025-03-19
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Type inference with Zod schemas - Inferring types from nested fields was
      complex'
    solution: 'Utility types that recursively extract types from schema'
  - problem: 'Conditional fields re-mount - Conditional fields lost state'
    solution: 'Preserve in React Hook Form even when not rendered'
  - problem:
      'Array fields validation - Validating arrays with internal dependencies'
    solution: 'Schema validation at the complete array level'
highlights:
  - 'Type-safe end-to-end - Schema defines validation AND types'
  - '7 languages built-in for error messages'
  - 'Advanced field patterns: conditional, dependent, arrays'
  - 'Low boilerplate compared to pure React Hook Form'
  - 'Framework agnostic: CRA, Next.js, Remix, Vite'
futureImprovements:
  - 'Wizard/multi-step forms'
  - 'File upload fields'
  - 'Rich text editor integration'
  - 'Visual form builder'
  - 'More pre-designed themes'
stackRationale:
  React Hook Form:
    'Performance (controlled vs uncontrolled), minimal re-renders'
  Zod: 'Runtime validation plus TypeScript inference'
  Tailwind: 'Quick styling but fully customizable'
---

## Project Description

Form handling in React has always felt more complex than it should be. While
libraries like React Hook Form and Formik exist, the way they structure form
code never quite aligned with how I think about forms.

React Form Toolkit is my take on form management: combining the performance of
React Hook Form with the type safety of Zod, wrapped in a component API that
feels intuitive. The goal is to write less boilerplate while maintaining full
control over validation and rendering.

## Key Features

### Type-Safe Validation

Zod schemas define your form structure and validation rules. TypeScript
automatically infers types, catching errors at compile time.

```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

<FormProvider schema={schema} onSubmit={handleSubmit}>
  <FormField name="email" label="Email" />
  <FormField name="password" label="Password" type="password" />
  <FormField name="rememberMe" label="Remember me" type="checkbox" />
  <FormButtonsBar />
</FormProvider>;
```

### Multi-Language Support

Built-in translations for 7 languages:

- English
- Spanish
- Portuguese
- French
- German
- Italian
- Russian

Error messages automatically display in the user's language.

### Advanced Field Patterns

- **ConditionalField**: Show/hide fields based on other values
- **DependantField**: Fields that depend on other field values
- **FieldArray**: Dynamic lists with add/remove functionality

### Tailwind Integration

Styled with Tailwind CSS out of the box, but fully customizable through props
and CSS classes.

## Components

### FormProvider

The main component that wraps your form and manages state, validation, and
submission.

```tsx
<FormProvider
  schema={schema}
  onSubmit={handleSubmit}
  defaultValues={initialData}
>
  {/* Form fields */}
</FormProvider>
```

### FormField

Renders input elements with automatic validation and error display.

```tsx
<FormField
  name="email"
  label="Email Address"
  placeholder="you@example.com"
  required
/>
```

### FormButtonsBar

Container for submit/reset buttons with built-in loading states.

### ConditionalField

Renders children only when a condition is met.

```tsx
<ConditionalField when="hasAccount" is={false}>
  <FormField name="newPassword" label="Create Password" />
</ConditionalField>
```

### DependantField

Fields that react to changes in other fields.

```tsx
<DependantField
  dependsOn="country"
  render={(country) => (
    <FormField name="state" options={getStatesForCountry(country)} />
  )}
/>
```

### FieldArray

Dynamic lists of fields.

```tsx
<FieldArray
  name="items"
  render={({ fields, append, remove }) => (
    <>
      {fields.map((field, index) => (
        <FormField key={field.id} name={`items.${index}.name`} />
      ))}
      <button onClick={() => append({ name: '' })}>Add Item</button>
    </>
  )}
/>
```

## Technical Details

### Requirements

- React 18.0+
- TypeScript 5.0+
- Zod 3.22+

### Framework Compatibility

Works with any React setup:

- Create React App
- Next.js (App Router and Pages Router)
- Remix
- Vite

### Status

Currently in **beta**. Stable for production use, but the API may have breaking
changes before v1.0.

## Why Another Form Library?

Existing options are great, but each has trade-offs:

- **React Hook Form** is performant but verbose for complex forms
- **Formik** has a nice API but re-renders more than necessary
- **Final Form** is powerful but has a steep learning curve

React Form Toolkit aims to combine the best aspects: React Hook Form's
performance, Zod's type safety, and a component API that reads like the form it
creates.
