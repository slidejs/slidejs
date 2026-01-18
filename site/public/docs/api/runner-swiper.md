---
title: @slidejs/runner-swiper API Reference
order: 6
category: api
description: 'Complete API reference for @slidejs/runner-swiper package - Swiper adapter'
---

# @slidejs/runner-swiper API Reference

The `@slidejs/runner-swiper` package provides the Swiper adapter for rendering slides.

## Exports

### Functions

#### `createSlideRunner<TContext>(dslSource: string, context: TContext, config: SlideRunnerConfig): Promise<SlideRunner<TContext>>`

Factory function to create a SlideRunner with Swiper adapter.

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
import { createSlideRunner } from '@slidejs/runner-swiper';
import type { SlideContext } from '@slidejs/context';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  metadata: { title: 'My Quiz' },
  items: [],
};

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides-container',
  swiperOptions: {
    direction: 'horizontal',
    loop: false,
    speed: 300,
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: true,
    pagination: {
      clickable: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
  },
});

runner.play();
```

### Classes

#### `SwiperAdapter`

Swiper adapter implementation.

**Properties:**
- `readonly name: 'swiper'` - Adapter name

**Methods:**

Same as `RevealJsAdapter` (see [Runner API](./runner.md) for base adapter interface).

### Types

#### `SlideRunnerConfig`

Configuration for the factory function.

```typescript
interface SlideRunnerConfig {
  container: string | HTMLElement;
  swiperOptions?: SwiperOptions;
}
```

**Properties:**
- `container: string | HTMLElement` - Container selector or element
- `swiperOptions?: SwiperOptions` - Optional Swiper configuration

#### `SwiperOptions`

Swiper configuration options (from Swiper.js).

**Common Options:**
- `direction: 'horizontal' | 'vertical'` - Slide direction (default: `'horizontal'`)
- `loop: boolean` - Enable loop mode (default: `false`)
- `speed: number` - Transition speed in ms (default: `300`)
- `spaceBetween: number` - Space between slides in px (default: `0`)
- `slidesPerView: number | 'auto'` - Number of slides per view (default: `1`)
- `navigation: boolean | object` - Navigation arrows (default: `false`)
- `pagination: boolean | object` - Pagination dots (default: `false`)
- `keyboard: boolean | object` - Keyboard control (default: `false`)
- `touch: boolean` - Touch gestures (default: `true`)

## Usage Examples

### Basic Usage

```typescript
import { createSlideRunner } from '@slidejs/runner-swiper';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  swiperOptions: {
    direction: 'horizontal',
    loop: false,
    speed: 300,
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: true,
    pagination: {
      clickable: true,
    },
  },
});

runner.play();
```

### Advanced Configuration

```typescript
const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  swiperOptions: {
    direction: 'horizontal',
    loop: true,
    speed: 500,
    spaceBetween: 50,
    slidesPerView: 1,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    touch: {
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true,
    },
    effect: 'slide',
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  },
});
```

### Mobile-Optimized Configuration

```typescript
const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  swiperOptions: {
    direction: 'horizontal',
    loop: false,
    speed: 300,
    spaceBetween: 0,
    slidesPerView: 1,
    touch: {
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    keyboard: {
      enabled: true,
    },
  },
});
```

## CSS Injection

The package automatically injects Swiper CSS and custom styles. You don't need to import CSS manually.

## Related Documentation

- [Runner API](./runner.md) - Base runner API
- [Swiper Guide](../guide/runner-guide.md#swiper) - Swiper specific guide
- [Getting Started](../guide/getting-started.md) - Quick start guide
