# Theme Configuration

Centralized theme configuration for design tokens used throughout the
application.

## Overview

The `theme.ts` file provides type-safe access to design system tokens including:

- **Spacing**: Consistent spacing scale (0-32)
- **Typography**: Font sizes, families, and weights
- **Border Radius**: Rounded corners scale
- **Box Shadow**: Shadow scale with glow effects
- **Transitions**: Duration and timing functions
- **Z-Index**: Layering scale
- **Breakpoints**: Responsive design breakpoints

All values are **synced with `tailwind.config.js`** to ensure consistency
between Tailwind classes and programmatic styles.

## Usage

### Basic Import

```typescript
import { spacing, typography, borderRadius } from '@/config/theme';

// Use in inline styles
<div style={{
  padding: spacing[4], // 1rem (16px)
  fontSize: typography.fontSize.base.size, // Responsive clamp
  borderRadius: borderRadius.DEFAULT // 0.5rem
}}>
  Content
</div>
```

### Spacing

```typescript
import { spacing, getSpacing } from '@/config/theme';

// Direct access
const padding = spacing[4]; // '1rem'
const margin = spacing[8]; // '2rem'

// Using utility function
const gap = getSpacing(2); // '0.5rem'

// Available keys: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32
```

### Typography

```typescript
import { typography, getFontSize } from '@/config/theme';

// Font sizes with responsive clamp
const baseSize = typography.fontSize.base.size; // 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)'
const lineHeight = typography.fontSize.base.lineHeight; // '1.5'

// Using utility function
const { size, lineHeight } = getFontSize('lg');

// Font families
const sansFont = typography.fontFamily.sans; // 'Inter, system-ui, -apple-system, sans-serif'
const monoFont = typography.fontFamily.mono; // 'JetBrains Mono, Courier New, monospace'

// Font weights
const bold = typography.fontWeight.bold; // '700'
```

### Transitions

```typescript
import { transition, buildTransition } from '@/config/theme';

// Build complete transition string
const fadeTransition = buildTransition('opacity', 'fast', 'easeInOut');
// Result: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)'

// Multiple properties
const allTransition = buildTransition(['opacity', 'transform']);
// Result: 'opacity, transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'

// Available durations: fast (150ms), base (300ms), slow (500ms), slower (700ms)
// Available timings: spring, easeInOut, easeOut, easeIn, linear
```

### Z-Index Layering

```typescript
import { zIndex } from '@/config/theme';

<div style={{ zIndex: zIndex.modal }}>Modal content</div>
<div style={{ zIndex: zIndex.tooltip }}>Tooltip (above modal)</div>

// Available layers (ascending order):
// dropdown (1000), sticky (1020), fixed (1030),
// modalBackdrop (1040), modal (1050), popover (1060), tooltip (1070)
```

### CSS Variables

```typescript
import { cssVar } from '@/config/theme';

const primaryColor = cssVar('primary'); // 'var(--primary)'
const bgColor = cssVar('background'); // 'var(--background)'

// Use in styles
<div style={{ color: cssVar('primary') }}>Colored text</div>
```

### Breakpoints

```typescript
import { breakpoints } from '@/config/theme';

// Use in media queries
const styles = `
  @media (min-width: ${breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

// Available: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
```

## Type Safety

All theme values are fully typed:

```typescript
import type {
  SpacingKey,
  FontSizeKey,
  BorderRadiusKey,
  TransitionDurationKey,
  ZIndexKey,
} from '@/config/theme';

// TypeScript will enforce valid keys
const validSpacing: SpacingKey = 4; // ✅
const invalidSpacing: SpacingKey = 7; // ❌ Type error
```

## Complete Theme Object

```typescript
import theme from '@/config/theme';

// Access all configuration
const {
  spacing,
  typography,
  borderRadius,
  boxShadow,
  transition,
  zIndex,
  breakpoints,
} = theme;
```

## Synchronization with Tailwind

**Important:** When updating design tokens:

1. Update `tailwind.config.js` first
2. Update `src/config/theme.ts` to match
3. Run tests: `npm run test src/config/theme.test.ts`

This ensures consistency between:

- Tailwind utility classes (`p-4`, `text-lg`, `rounded-md`)
- Programmatic styles (`spacing[4]`, `typography.fontSize.lg`)

## Examples

### Component with Theme

```tsx
import { spacing, typography, buildTransition } from '@/config/theme';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: spacing[6],
        fontSize: typography.fontSize.base.size,
        lineHeight: typography.fontSize.base.lineHeight,
        borderRadius: '0.5rem',
        transition: buildTransition(['opacity', 'transform'], 'base', 'spring'),
      }}
    >
      {children}
    </div>
  );
}
```

### Responsive Typography

```tsx
import { getFontSize } from '@/config/theme';

const Hero = () => {
  const { size, lineHeight } = getFontSize('4xl');

  return (
    <h1 style={{ fontSize: size, lineHeight }}>
      {/* Font size scales from 3rem (mobile) to 5rem (desktop) */}
      Welcome
    </h1>
  );
};
```

### Consistent Spacing

```tsx
import { getSpacing } from '@/config/theme';

const Container = () => (
  <div
    style={{
      paddingTop: getSpacing(8), // 2rem
      paddingBottom: getSpacing(8),
      marginBottom: getSpacing(12), // 3rem
    }}
  >
    Content
  </div>
);
```

## Testing

The theme configuration includes comprehensive tests:

```bash
npm run test src/config/theme.test.ts
```

Tests cover:

- All spacing values
- Font size responsiveness
- Transition utilities
- Type safety
- Integration scenarios

## Best Practices

1. **Prefer Tailwind classes** for standard styling
2. **Use theme config** for:
   - Dynamic/computed styles
   - JavaScript animations
   - Third-party component styling
3. **Always use spacing scale** - avoid magic numbers
4. **Use utility functions** (`getSpacing`, `buildTransition`) for cleaner code
5. **Leverage TypeScript types** for autocomplete and safety

## Related Files

- `/tailwind.config.js` - Tailwind configuration (source of truth)
- `/src/config/theme.ts` - Programmatic access to theme
- `/src/config/theme.test.ts` - Test suite
