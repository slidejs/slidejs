---
title: @slidejs/core API Reference
order: 1
category: api
description: 'Complete API reference for @slidejs/core package - SlideEngine and core types'
---

# @slidejs/core API Reference

The `@slidejs/core` package provides the core engine for generating slides from Slide DSL definitions.

## Exports

### Classes

#### `SlideEngine<TContext>`

The main engine class that generates slides from a Slide DSL definition and context.

**Constructor**

```typescript
constructor(dsl: SlideDSL<TContext>)
```

Creates a new SlideEngine instance with the given Slide DSL.

**Parameters:**
- `dsl: SlideDSL<TContext>` - The Slide DSL definition

**Throws:**
- `SlideEngineError` - If the DSL is invalid (missing start/end rules)

**Methods**

##### `generate(context: TContext): SlideDefinition[]`

Generates slides from the DSL and context.

**Parameters:**
- `context: TContext` - The slide context data

**Returns:**
- `SlideDefinition[]` - Array of generated slide definitions

**Throws:**
- `SlideEngineError` - If context source type doesn't match DSL source type, or if rule generation fails

**Example:**

```typescript
import { SlideEngine } from '@slidejs/core';
import type { SlideDSL, SlideContext } from '@slidejs/core';

const dsl: SlideDSL = {
  version: '1.0',
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  rules: [/* ... */],
};

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  metadata: { title: 'My Quiz' },
  items: [],
};

const engine = new SlideEngine(dsl);
const slides = engine.generate(context);
```

#### `SlideEngineError`

Error class for SlideEngine-related errors.

**Properties:**
- `code: string` - Error code
- `message: string` - Error message
- `cause?: Error` - Original error (if any)

**Error Codes:**
- `MISSING_START_RULE` - No start rule found in DSL
- `MISSING_END_RULE` - No end rule found in DSL
- `SOURCE_TYPE_MISMATCH` - Context source type doesn't match DSL source type
- `RULE_GENERATION_ERROR` - Error during rule execution

### Types

#### `SlideDSL<TContext>`

The root Slide DSL definition.

```typescript
interface SlideDSL<TContext extends SlideContext = SlideContext> {
  version: string;
  sourceType: string;
  sourceId: string;
  rules: SlideRule<TContext>[];
  config?: SlideConfig;
}
```

**Properties:**
- `version: string` - DSL version
- `sourceType: string` - Data source type (must match Context.sourceType)
- `sourceId: string` - Data source ID
- `rules: SlideRule<TContext>[]` - Array of rules
- `config?: SlideConfig` - Optional global configuration

#### `SlideRule<TContext>`

A rule definition in the Slide DSL.

```typescript
interface SlideRule<TContext extends SlideContext = SlideContext> {
  type: 'start' | 'content' | 'end';
  name: string;
  generate: (context: TContext) => SlideDefinition[];
}
```

**Properties:**
- `type: 'start' | 'content' | 'end'` - Rule type
- `name: string` - Rule name (for debugging)
- `generate: (context: TContext) => SlideDefinition[]` - Slide generation function

#### `SlideDefinition`

A single slide definition.

```typescript
interface SlideDefinition {
  id?: string;
  content: SlideContent;
  behavior?: SlideBehavior;
  metadata?: Record<string, unknown>;
}
```

**Properties:**
- `id?: string` - Optional slide ID (auto-generated if not provided)
- `content: SlideContent` - Slide content configuration
- `behavior?: SlideBehavior` - Optional behavior configuration
- `metadata?: Record<string, unknown>` - Optional metadata

#### `SlideContent`

Slide content type (dynamic or static).

```typescript
type SlideContent = DynamicContent | StaticContent;
```

#### `DynamicContent`

Dynamic content using a component.

```typescript
interface DynamicContent {
  type: 'dynamic';
  component: string;
  props: Record<string, unknown>;
}
```

**Properties:**
- `type: 'dynamic'` - Content type
- `component: string` - Component name (e.g., 'my-quiz-question')
- `props: Record<string, unknown>` - Component properties

#### `StaticContent`

Static text content.

```typescript
interface StaticContent {
  type: 'text';
  lines: string[];
  format?: {
    markdown?: boolean;
    html?: boolean;
  };
}
```

**Properties:**
- `type: 'text'` - Content type
- `lines: string[]` - Array of text lines
- `format?: { markdown?: boolean; html?: boolean }` - Optional format options

#### `SlideBehavior`

Slide behavior configuration.

```typescript
interface SlideBehavior {
  transition?: SlideTransition;
  background?: SlideBackground;
  layout?: SlideLayout;
  fragments?: boolean;
  autoplay?: number;
}
```

#### `SlideTransition`

Transition animation configuration.

```typescript
interface SlideTransition {
  type: 'slide' | 'zoom' | 'fade' | 'cube' | 'flip' | 'none';
  speed?: 'slow' | 'default' | 'fast' | number;
  direction?: 'horizontal' | 'vertical';
  options?: Record<string, unknown>;
}
```

**Transition Types:**
- `slide` - Slide transition (default)
- `zoom` - Zoom transition
- `fade` - Fade transition
- `cube` - 3D cube transition
- `flip` - Flip transition
- `none` - No transition

#### `SlideBackground`

Background configuration.

```typescript
interface SlideBackground {
  color?: string;
  image?: string;
  video?: string;
  opacity?: number;
}
```

#### `SlideLayout`

Layout configuration.

```typescript
interface SlideLayout {
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  width?: string | number;
}
```

#### `SlideConfig`

Global configuration.

```typescript
interface SlideConfig {
  defaultTransition?: SlideTransition;
  defaultBackground?: SlideBackground;
  theme?: string;
  [key: string]: unknown;
}
```

## Usage Example

```typescript
import { SlideEngine } from '@slidejs/core';
import type { SlideDSL, SlideContext } from '@slidejs/core';

// Define Slide DSL
const dsl: SlideDSL = {
  version: '1.0',
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  rules: [
    {
      type: 'start',
      name: 'intro',
      generate: () => [
        {
          content: {
            type: 'text',
            lines: ['# Welcome', '## My Presentation'],
          },
        },
      ],
    },
    {
      type: 'end',
      name: 'thanks',
      generate: () => [
        {
          content: {
            type: 'text',
            lines: ['# Thank You!'],
          },
        },
      ],
    },
  ],
};

// Create context
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  metadata: { title: 'My Quiz' },
  items: [],
};

// Generate slides
const engine = new SlideEngine(dsl);
const slides = engine.generate(context);

console.log(`Generated ${slides.length} slides`);
```

## Related Documentation

- [DSL Guide](../guide/dsl-guide.md) - Complete DSL syntax guide
- [Runner API](./runner.md) - SlideRunner API reference
- [Getting Started](../guide/getting-started.md) - Quick start guide
