---
title: @slidejs/runner API Reference
order: 3
category: api
description: 'Complete API reference for @slidejs/runner package - SlideRunner core class'
---

# @slidejs/runner API Reference

The `@slidejs/runner` package provides the core SlideRunner class for managing slide presentations.

## Exports

### Classes

#### `SlideRunner<TContext>`

The main class for running slide presentations with adapters.

**Constructor**

```typescript
constructor(config: SlideRunnerConfig)
```

Creates a new SlideRunner instance.

**Parameters:**
- `config: SlideRunnerConfig` - Runner configuration

**Throws:**
- `SlideRunnerError` - If adapter is missing or container is invalid

**Methods**

##### `run(dsl: SlideDSL<TContext>, context: TContext): Promise<void>`

Runs a slide presentation from DSL and context.

**Parameters:**
- `dsl: SlideDSL<TContext>` - The Slide DSL definition
- `context: TContext` - The slide context

**Returns:**
- `Promise<void>`

**Throws:**
- `SlideRunnerError` - If running fails

**Example:**

```typescript
import { SlideRunner } from '@slidejs/runner';
import { RevealJsAdapter } from '@slidejs/runner-revealjs';
import type { SlideDSL, SlideContext } from '@slidejs/core';

const runner = new SlideRunner({
  container: document.getElementById('slides')!,
  adapter: new RevealJsAdapter(),
  adapterOptions: {
    revealConfig: {
      controls: true,
      progress: true,
    },
  },
});

await runner.run(slideDSL, context);
```

##### `renderSlides(slides: SlideDefinition[]): Promise<void>`

Directly renders an array of slide definitions.

**Parameters:**
- `slides: SlideDefinition[]` - Array of slide definitions

**Returns:**
- `Promise<void>`

**Throws:**
- `SlideRunnerError` - If rendering fails

##### `play(): void`

Starts the presentation (navigates to the first slide).

**Example:**

```typescript
await runner.run(slideDSL, context);
runner.play(); // Start presentation
```

##### `pause(): void`

Pauses the presentation.

##### `navigateTo(index: number): void`

Navigates to a specific slide by index.

**Parameters:**
- `index: number` - Slide index (0-based)

**Throws:**
- `SlideRunnerError` - If index is out of range

##### `next(): void`

Navigates to the next slide.

##### `previous(): void`

Navigates to the previous slide.

##### `getCurrentIndex(): number`

Gets the current slide index.

**Returns:**
- `number` - Current slide index

##### `getTotalSlides(): number`

Gets the total number of slides.

**Returns:**
- `number` - Total slide count

##### `destroy(): Promise<void>`

Destroys the runner and cleans up resources.

**Returns:**
- `Promise<void>`

##### `on(event: AdapterEvent, handler: EventHandler): void`

Registers an event handler.

**Parameters:**
- `event: AdapterEvent` - Event type
- `handler: EventHandler` - Event handler function

**Example:**

```typescript
runner.on('slideChanged', ({ index, previousIndex }) => {
  console.log(`Slide changed from ${previousIndex} to ${index}`);
});
```

##### `off(event: AdapterEvent, handler: EventHandler): void`

Removes an event handler.

**Parameters:**
- `event: AdapterEvent` - Event type
- `handler: EventHandler` - Event handler function

#### `SlideRunnerError`

Error class for SlideRunner-related errors.

**Properties:**
- `code: string` - Error code
- `message: string` - Error message

**Error Codes:**
- `MISSING_ADAPTER` - Adapter is required
- `INVALID_CONTAINER` - Container is invalid
- `RUN_FAILED` - Failed to run slides
- `RENDER_FAILED` - Failed to render slides
- `INVALID_INDEX` - Invalid slide index

### Types

#### `SlideRunnerConfig`

Configuration for SlideRunner.

```typescript
interface SlideRunnerConfig {
  container: string | HTMLElement;
  adapter: SlideAdapter;
  adapterOptions?: AdapterOptions;
  plugins?: SlideRunnerPlugin[];
}
```

**Properties:**
- `container: string | HTMLElement` - Container selector or element
- `adapter: SlideAdapter` - Slide adapter instance
- `adapterOptions?: AdapterOptions` - Optional adapter options
- `plugins?: SlideRunnerPlugin[]` - Optional plugins

#### `SlideAdapter`

Adapter interface that runners must implement.

```typescript
interface SlideAdapter {
  readonly name: string;
  initialize(container: HTMLElement, options?: AdapterOptions): Promise<void>;
  render(slides: SlideDefinition[]): Promise<void>;
  navigateTo(index: number): void;
  getCurrentIndex(): number;
  getTotalSlides(): number;
  destroy(): Promise<void>;
  on(event: AdapterEvent, handler: EventHandler): void;
  off(event: AdapterEvent, handler: EventHandler): void;
}
```

#### `AdapterEvent`

Event types emitted by adapters.

```typescript
type AdapterEvent =
  | 'ready'
  | 'slideChanged'
  | 'slideRendered'
  | 'error';
```

#### `EventHandler`

Event handler function type.

```typescript
type EventHandler = (data: any) => void;
```

#### `AdapterOptions`

Adapter-specific options.

```typescript
type AdapterOptions = Record<string, unknown>;
```

#### `SlideRunnerPlugin`

Plugin interface.

```typescript
interface SlideRunnerPlugin {
  name: string;
  beforeRender?: (slides: SlideDefinition[]) => Promise<void> | void;
  afterRender?: (slides: SlideDefinition[]) => Promise<void> | void;
  beforeSlideChange?: (from: number, to: number) => void;
  afterSlideChange?: (from: number, to: number) => void;
}
```

## Usage Example

Complete example with event handling:

```typescript
import { SlideRunner } from '@slidejs/runner';
import { RevealJsAdapter } from '@slidejs/runner-revealjs';
import type { SlideDSL, SlideContext } from '@slidejs/core';

// Create runner
const runner = new SlideRunner({
  container: '#slides-container',
  adapter: new RevealJsAdapter(),
  adapterOptions: {
    revealConfig: {
      controls: true,
      progress: true,
      hash: true,
    },
  },
});

// Register event handlers
runner.on('ready', () => {
  console.log('Runner is ready');
});

runner.on('slideChanged', ({ index, previousIndex }) => {
  console.log(`Slide changed: ${previousIndex} -> ${index}`);
});

runner.on('error', ({ message }) => {
  console.error('Runner error:', message);
});

// Run presentation
try {
  await runner.run(slideDSL, context);
  runner.play();
} catch (error) {
  console.error('Failed to run:', error);
}

// Cleanup
await runner.destroy();
```

## Plugin Example

```typescript
import type { SlideRunnerPlugin, SlideDefinition } from '@slidejs/runner';

const analyticsPlugin: SlideRunnerPlugin = {
  name: 'analytics',
  afterSlideChange: (from, to) => {
    // Track slide changes
    console.log(`Analytics: slide ${from} -> ${to}`);
  },
};

const runner = new SlideRunner({
  container: '#slides',
  adapter: new RevealJsAdapter(),
  plugins: [analyticsPlugin],
});
```

## Related Documentation

- [Reveal.js Runner API](./runner-revealjs.md) - Reveal.js adapter API
- [Swiper Runner API](./runner-swiper.md) - Swiper adapter API
- [Splide Runner API](./runner-splide.md) - Splide adapter API
- [Core API](./core.md) - SlideEngine API reference
