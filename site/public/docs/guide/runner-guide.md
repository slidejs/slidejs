---
title: Runner Guide
order: 4
category: guide
description: 'Complete guide to choosing and using SlideJS runners - Reveal.js, Swiper, and Splide'
---

# Runner Guide

SlideJS supports multiple rendering engines through adapters called "runners". This guide helps you choose the right runner for your use case and configure it properly.

## Available Runners

### Reveal.js Runner

**Best for:** Presentations, educational content, speaker notes

**Features:**
- Full-featured presentation mode
- Speaker notes support
- Fragments (step-by-step reveals)
- Background images/videos
- Hash-based navigation
- Print/PDF export

**Installation:**

```bash
npm install @slidejs/runner-revealjs reveal.js
```

**Basic Usage:**

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';

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

### Swiper Runner

**Best for:** Mobile apps, touch interactions, carousels

**Features:**
- Excellent touch support
- Smooth animations
- Mobile-optimized
- Loop mode
- Autoplay support
- Thumbnail navigation

**Installation:**

```bash
npm install @slidejs/runner-swiper swiper
```

**Basic Usage:**

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
    keyboard: {
      enabled: true,
    },
  },
});

runner.play();
```

### Splide Runner

**Best for:** Lightweight projects, simple slideshows

**Features:**
- Lightweight (~20KB)
- Simple API
- Good performance
- Keyboard navigation
- Pagination support

**Installation:**

```bash
npm install @slidejs/runner-splide @splidejs/splide
```

**Basic Usage:**

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

## Runner Comparison

| Feature              | Reveal.js     | Swiper      | Splide            |
| -------------------- | ------------- | ----------- | ----------------- |
| **Size**             | ~200KB        | ~150KB      | ~20KB             |
| **Touch Support**    | Good          | Excellent   | Good              |
| **Mobile Optimized** | Yes           | Yes         | Yes               |
| **Speaker Notes**    | Yes           | No          | No                |
| **Fragments**        | Yes           | No          | No                |
| **Hash Navigation**  | Yes           | No          | No                |
| **Print/PDF Export** | Yes           | No          | No                |
| **Loop Mode**        | No            | Yes         | Yes               |
| **Autoplay**         | No            | Yes         | Yes               |
| **Best For**         | Presentations | Mobile apps | Simple slideshows |

## Choosing a Runner

### Choose Reveal.js if:
- You're building a presentation
- You need speaker notes
- You want hash-based navigation
- You need print/PDF export
- You want fragments (step-by-step reveals)

### Choose Swiper if:
- You're building a mobile app
- Touch interactions are important
- You need loop mode or autoplay
- You want smooth animations
- You need thumbnail navigation

### Choose Splide if:
- You want a lightweight solution
- You have simple requirements
- Bundle size is a concern
- You don't need advanced features

## Configuration

### Common Options

All runners support these common options:

- `container: string | HTMLElement` - Container selector or element
- Event handlers via `runner.on()`

### Runner-Specific Options

Each runner has its own configuration options. See the API reference for details:

- [Reveal.js API](../api/runner-revealjs.md)
- [Swiper API](../api/runner-swiper.md)
- [Splide API](../api/runner-splide.md)

## Event Handling

All runners emit the same events:

```typescript
runner.on('ready', () => {
  console.log('Runner is ready');
});

runner.on('slideChanged', ({ index, previousIndex }) => {
  console.log(`Slide changed: ${previousIndex} -> ${index}`);
});

runner.on('error', ({ message }) => {
  console.error('Error:', message);
});
```

## Lifecycle Management

### Initialization

```typescript
const runner = await createSlideRunner(dslSource, context, config);
```

### Starting the Presentation

```typescript
runner.play();
```

### Navigation

```typescript
runner.next();
runner.previous();
runner.navigateTo(5);
```

### Cleanup

```typescript
await runner.destroy();
```

## Multiple Runners

You can use multiple runners in the same application:

```typescript
import { createSlideRunner as createRevealRunner } from '@slidejs/runner-revealjs';
import { createSlideRunner as createSwiperRunner } from '@slidejs/runner-swiper';

const revealRunner = await createRevealRunner(dslSource, context, {
  container: '#reveal-slides',
  revealOptions: { /* ... */ },
});

const swiperRunner = await createSwiperRunner(dslSource, context, {
  container: '#swiper-slides',
  swiperOptions: { /* ... */ },
});
```

## Related Documentation

- [Reveal.js API Reference](../api/runner-revealjs.md)
- [Swiper API Reference](../api/runner-swiper.md)
- [Splide API Reference](../api/runner-splide.md)
- [Runner API Reference](../api/runner.md)
- [Getting Started](./getting-started.md)
