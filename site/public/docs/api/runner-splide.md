---
title: @slidejs/runner-splide API Reference
order: 7
category: api
description: 'Complete API reference for @slidejs/runner-splide package - Splide adapter'
---

# @slidejs/runner-splide API Reference

The `@slidejs/runner-splide` package provides the Splide adapter for rendering slides.

## Exports

### Functions

#### `createSlideRunner<TContext>(dslSource: string, context: TContext, config: SlideRunnerConfig): Promise<SlideRunner<TContext>>`

Factory function to create a SlideRunner with Splide adapter.

**Type Parameters:**
- `TContext extends SlideContext` - The context type

**Parameters:**
- `dslSource: string` - Slide DSL source code
- `context: TContext` - Slide context
- `config: SlideRunnerConfig` - Runner configuration

**Returns:**
- `Promise<SlideRunner<TContext>>` - Configured SlideRunner instance

**Example:**

```typescript
import { createSlideRunner } from '@slidejs/runner-splide';
import type { SlideContext } from '@slidejs/context';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  metadata: { title: 'My Quiz' },
  items: [],
};

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides-container',
  splideOptions: {
    type: 'slide',
    perPage: 1,
    perMove: 1,
    gap: '1rem',
    keyboard: 'global',
    arrows: true,
    pagination: true,
  },
});

runner.play();
```

### Classes

#### `SplideAdapter`

Splide adapter implementation.

**Properties:**
- `readonly name: 'splide'` - Adapter name

**Methods:**

Same as `RevealJsAdapter` (see [Runner API](./runner.md) for base adapter interface).

### Types

#### `SlideRunnerConfig`

Configuration for the factory function.

```typescript
interface SlideRunnerConfig {
  container: string | HTMLElement;
  splideOptions?: SplideOptions;
}
```

**Properties:**
- `container: string | HTMLElement` - Container selector or element
- `splideOptions?: SplideOptions` - Optional Splide configuration

#### `SplideOptions`

Splide configuration options (from Splide.js).

**Common Options:**
- `type: 'slide' | 'loop' | 'fade'` - Slide type (default: `'slide'`)
- `perPage: number` - Number of slides per page (default: `1`)
- `perMove: number` - Number of slides to move (default: `1`)
- `gap: string` - Gap between slides (default: `'0'`)
- `keyboard: boolean | 'global' | 'focused'` - Keyboard control (default: `false`)
- `arrows: boolean` - Show arrow buttons (default: `true`)
- `pagination: boolean` - Show pagination dots (default: `true`)
- `speed: number` - Transition speed in ms (default: `400`)
- `rewind: boolean` - Rewind to first/last slide (default: `false`)
- `autoplay: boolean | string` - Autoplay (default: `false`)

## Usage Examples

### Basic Usage

```typescript
import { createSlideRunner } from '@slidejs/runner-splide';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  splideOptions: {
    type: 'slide',
    perPage: 1,
    perMove: 1,
    gap: '1rem',
    keyboard: 'global',
    arrows: true,
    pagination: true,
  },
});

runner.play();
```

### Advanced Configuration

```typescript
const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  splideOptions: {
    type: 'loop',
    perPage: 1,
    perMove: 1,
    gap: '2rem',
    speed: 600,
    rewind: true,
    keyboard: 'global',
    arrows: true,
    pagination: {
      type: 'bullets',
    },
    autoplay: 'pause',
    interval: 3000,
    pauseOnHover: true,
    resetProgress: false,
  },
});
```

### Fade Effect

```typescript
const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  splideOptions: {
    type: 'fade',
    perPage: 1,
    rewind: true,
    arrows: true,
    pagination: true,
    keyboard: 'global',
  },
});
```

## CSS Injection

The package automatically injects Splide CSS and custom styles. You don't need to import CSS manually.

## Related Documentation

- [Runner API](./runner.md) - Base runner API
- [Splide Guide](../guide/runner-guide.md#splide) - Splide specific guide
- [Getting Started](../guide/getting-started.md) - Quick start guide
