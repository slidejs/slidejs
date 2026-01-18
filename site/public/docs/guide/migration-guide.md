---
title: Migration Guide
order: 7
category: guide
description: 'Guide to migrating from other slide libraries to SlideJS'
---

# Migration Guide

This guide helps you migrate from other slide libraries to SlideJS.

## From reveal.js

### Before (reveal.js)

```typescript
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';

Reveal.initialize({
  hash: true,
  controls: true,
  progress: true,
});

// HTML
<div class="reveal">
  <div class="slides">
    <section>Slide 1</section>
    <section>Slide 2</section>
  </div>
</div>
```

### After (SlideJS)

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-presentation',
  metadata: { title: 'My Presentation' },
  items: [],
};

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  revealOptions: {
    hash: true,
    controls: true,
    progress: true,
  },
});

runner.play();
```

### Key Changes

1. **Use DSL instead of HTML** - Define slides in Slide DSL
2. **Use factory function** - `createSlideRunner` instead of `Reveal.initialize`
3. **Context-based** - Provide context data instead of static HTML

## From Swiper

### Before (Swiper)

```typescript
import Swiper from 'swiper';
import 'swiper/css';

const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// HTML
<div class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
  </div>
  <div class="swiper-pagination"></div>
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>
```

### After (SlideJS)

```typescript
import { createSlideRunner } from '@slidejs/runner-swiper';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  swiperOptions: {
    direction: 'horizontal',
    loop: true,
    pagination: {
      clickable: true,
    },
    navigation: true,
  },
});

runner.play();
```

## From Splide

### Before (Splide)

```typescript
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const splide = new Splide('.splide', {
  type: 'loop',
  perPage: 1,
  arrows: true,
  pagination: true,
});

splide.mount();

// HTML
<div class="splide">
  <div class="splide__track">
    <ul class="splide__list">
      <li class="splide__slide">Slide 1</li>
      <li class="splide__slide">Slide 2</li>
    </ul>
  </div>
</div>
```

### After (SlideJS)

```typescript
import { createSlideRunner } from '@slidejs/runner-splide';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  splideOptions: {
    type: 'loop',
    perPage: 1,
    arrows: true,
    pagination: true,
  },
});

runner.play();
```

## General Migration Steps

### 1. Install SlideJS

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context
npm install @slidejs/runner-revealjs  # or swiper/splide
```

### 2. Convert Content to DSL

Convert your HTML/content to Slide DSL:

```slide
present quiz "my-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Slide 1"
          "Content here"
        }
      }
    }
  }
}
```

### 3. Create Context

Create a context object:

```typescript
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-presentation',
  metadata: { title: 'My Presentation' },
  items: [],
};
```

### 4. Initialize Runner

Replace your library initialization with SlideJS:

```typescript
const runner = await createSlideRunner(dslSource, context, config);
runner.play();
```

### 5. Update Event Handlers

Replace library-specific event handlers:

```typescript
// Before
swiper.on('slideChange', () => { /* ... */ });

// After
runner.on('slideChanged', ({ index, previousIndex }) => { /* ... */ });
```

## Common Patterns

### Dynamic Content

**Before:**
```html
<div class="swiper-slide">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</div>
```

**After:**
```slide
for item in items {
  slide {
    content text {
      "# {{ item.title }}"
      ""
      "{{ item.description }}"
    }
  }
}
```

### Component Integration

**Before:**
```html
<div class="swiper-slide">
  <my-component prop1="value1" prop2="value2"></my-component>
</div>
```

**After:**
```slide
slide {
  content dynamic {
    name: "my-component"
    attrs {
      prop1: "value1"
      prop2: "value2"
    }
  }
}
```

## Benefits of Migration

1. **Declarative DSL** - More maintainable than HTML
2. **Type Safety** - Full TypeScript support
3. **Multiple Runners** - Switch runners without changing DSL
4. **Context-Based** - Dynamic content from data sources
5. **Unified API** - Same API across all runners

## Related Documentation

- [Getting Started](./getting-started.md) - Quick start guide
- [DSL Guide](./dsl-guide.md) - DSL syntax reference
- [Runner Guide](./runner-guide.md) - Runner configuration
