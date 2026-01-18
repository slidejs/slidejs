---
title: @slidejs/runner-revealjs API Reference
order: 5
category: api
description: 'Complete API reference for @slidejs/runner-revealjs package - Reveal.js adapter'
---

# @slidejs/runner-revealjs API Reference

The `@slidejs/runner-revealjs` package provides the Reveal.js adapter for rendering slides.

## Exports

### Functions

#### `createSlideRunner<TContext>(dslSource: string, context: TContext, config: SlideRunnerConfig): Promise<SlideRunner<TContext>>`

Factory function to create a SlideRunner with Reveal.js adapter.

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
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  metadata: { title: 'My Quiz' },
  items: [],
};

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides-container',
  revealOptions: {
    controls: true,
    progress: true,
    center: true,
    hash: false,
    transition: 'slide',
  },
});

runner.play();
```

### Classes

#### `RevealJsAdapter`

Reveal.js adapter implementation.

**Properties:**
- `readonly name: 'revealjs'` - Adapter name

**Methods:**

##### `initialize(container: HTMLElement, options?: RevealJsAdapterOptions): Promise<void>`

Initializes the Reveal.js adapter.

**Parameters:**
- `container: HTMLElement` - Container element
- `options?: RevealJsAdapterOptions` - Optional adapter options

**Throws:**
- `Error` - If initialization fails

##### `render(slides: SlideDefinition[]): Promise<void>`

Renders slides.

**Parameters:**
- `slides: SlideDefinition[]` - Array of slide definitions

##### `navigateTo(index: number): void`

Navigates to a specific slide.

**Parameters:**
- `index: number` - Slide index (0-based)

##### `getCurrentIndex(): number`

Gets the current slide index.

**Returns:**
- `number` - Current slide index

##### `getTotalSlides(): number`

Gets the total number of slides.

**Returns:**
- `number` - Total slide count

##### `destroy(): Promise<void>`

Destroys the adapter and cleans up resources.

##### `on(event: AdapterEvent, handler: EventHandler): void`

Registers an event handler.

##### `off(event: AdapterEvent, handler: EventHandler): void`

Removes an event handler.

### Types

#### `SlideRunnerConfig`

Configuration for the factory function.

```typescript
interface SlideRunnerConfig {
  container: string | HTMLElement;
  revealOptions?: RevealOptions;
}
```

**Properties:**
- `container: string | HTMLElement` - Container selector or element
- `revealOptions?: RevealOptions` - Optional Reveal.js configuration

#### `RevealOptions`

Reveal.js configuration options.

```typescript
interface RevealOptions {
  controls?: boolean;
  progress?: boolean;
  center?: boolean;
  hash?: boolean;
  transition?: 'slide' | 'zoom' | 'fade' | 'cube' | 'flip' | 'none';
  // ... other Reveal.js options
}
```

**Common Options:**
- `controls: boolean` - Show navigation controls (default: `true`)
- `progress: boolean` - Show progress bar (default: `true`)
- `center: boolean` - Center slides vertically (default: `true`)
- `hash: boolean` - Enable hash-based navigation (default: `false`)
- `transition: string` - Transition type (default: `'slide'`)

#### `RevealJsAdapterOptions`

Adapter options.

```typescript
interface RevealJsAdapterOptions {
  revealConfig?: RevealOptions;
}
```

## Usage Examples

### Basic Usage

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'demo',
  metadata: { title: 'Demo' },
  items: [],
};

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  revealOptions: {
    controls: true,
    progress: true,
    center: true,
    hash: false,
    transition: 'slide',
  },
});

runner.play();
```

### Advanced Configuration

```typescript
const runner = await createSlideRunner(dslSource, context, {
  container: document.getElementById('slides')!,
  revealOptions: {
    controls: true,
    progress: true,
    center: true,
    hash: true,
    transition: 'fade',
    backgroundTransition: 'fade',
    keyboard: true,
    touch: true,
    loop: false,
    rtl: false,
    shuffle: false,
    fragments: true,
    embedded: false,
    help: true,
    showNotes: false,
    autoPlayMedia: null,
    preloadIframes: null,
    autoAnimate: true,
    autoAnimateMatcher: null,
    autoAnimateEasing: 'ease',
    autoAnimateDuration: 1.0,
    autoAnimateUnmatched: true,
    autoSlide: 0,
    autoSlideStoppable: true,
    autoSlideMethod: null,
    defaultTiming: null,
    mouseWheel: false,
    previewLinks: false,
    postMessage: true,
    postMessageEvents: false,
    focusBodyOnPageVisibilityChange: true,
    transition: 'slide',
    transitionSpeed: 'default',
    backgroundTransition: 'fade',
    view: null,
    viewDistance: 3,
    mobileViewDistance: 2,
    display: 'block',
    hideInactiveCursor: true,
    hideCursorTime: 5000,
  },
});
```

### Event Handling

```typescript
runner.on('ready', () => {
  console.log('Reveal.js is ready');
});

runner.on('slideChanged', ({ index, previousIndex }) => {
  console.log(`Slide changed: ${previousIndex} -> ${index}`);
});

runner.on('error', ({ message }) => {
  console.error('Error:', message);
});
```

### Cleanup

```typescript
// Destroy runner when done
await runner.destroy();
```

## CSS Injection

The package automatically injects Reveal.js CSS and custom styles. You don't need to import CSS manually, except for Reveal.js themes:

```typescript
// Optional: Import Reveal.js theme
import 'reveal.js/dist/theme/black.css';
// Other themes: white.css, league.css, sky.css, night.css, beige.css
```

## Related Documentation

- [Runner API](./runner.md) - Base runner API
- [Reveal.js Guide](../guide/runner-guide.md#revealjs) - Reveal.js specific guide
- [Getting Started](../guide/getting-started.md) - Quick start guide
