---
title: Multi-Runner Comparison Example
order: 3
category: examples
description: 'Compare different runners side by side using the same DSL source'
---

# Multi-Runner Comparison Example

This example demonstrates how to use multiple runners simultaneously to compare their rendering.

## Overview

This example creates a side-by-side comparison of:
- Reveal.js runner
- Swiper runner
- Splide runner

All using the same DSL source.

## DSL Source

Create `demo.slide`:

```slide
present quiz "comparison-demo" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Slide DSL Runner Comparison"
          "## Compare Reveal.js, Swiper, and Splide"
          ""
          "This demo shows how the same Slide DSL can be rendered with different runners."
        }
        behavior {
          transition fade {}
        }
      }
    }

    rule content "quiz-slides" {
      slide {
        content dynamic {
          name: "my-quiz-question"
          attrs {
            question: "What is 2 + 2?"
            options: "[\"2\", \"3\", \"4\", \"5\"]"
          }
        }
        behavior {
          transition slide {}
        }
      }

      slide {
        content dynamic {
          name: "my-quiz-question"
          attrs {
            question: "Which is a JavaScript framework?"
            options: "[\"React\", \"Python\", \"Java\", \"C++\"]"
          }
        }
        behavior {
          transition slide {}
        }
      }

      slide {
        content text {
          "# Features"
          ""
          "- Support for Web Components"
          "- Support for WSX components"
          "- Smooth transitions"
          "- Keyboard and mouse navigation"
        }
        behavior {
          transition slide {}
        }
      }
    }

    rule end "thanks" {
      slide {
        content text {
          "# Thank You!"
          ""
          "## Compare different rendering engines side by side"
        }
        behavior {
          transition fade {}
        }
      }
    }
  }
}
```

## TypeScript Code

```typescript
import { createSlideRunner as createRevealRunner } from '@slidejs/runner-revealjs';
import { createSlideRunner as createSwiperRunner } from '@slidejs/runner-swiper';
import { createSlideRunner as createSplideRunner } from '@slidejs/runner-splide';
import type { SlideContext } from '@slidejs/context';
import dslSource from './demo.slide?raw';

// Import component
import './components/my-quiz-question.wsx';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'comparison-demo',
  metadata: {
    title: 'Runner Comparison Demo',
  },
  items: [],
};

async function initRunners() {
  // Create Reveal.js runner
  const revealRunner = await createRevealRunner(dslSource, context, {
    container: '#player-reveal',
    revealOptions: {
      controls: true,
      progress: true,
      center: true,
      transition: 'slide',
    },
  });
  revealRunner.play();

  // Create Swiper runner
  const swiperRunner = await createSwiperRunner(dslSource, context, {
    container: '#player-swiper',
    swiperOptions: {
      direction: 'horizontal',
      loop: false,
      speed: 300,
      spaceBetween: 30,
      slidesPerView: 1,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
    },
  });
  swiperRunner.play();

  // Create Splide runner
  const splideRunner = await createSplideRunner(dslSource, context, {
    container: '#player-splide',
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
  splideRunner.play();
}

initRunners();
```

## HTML Layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Multi-Runner Comparison</title>
  <style>
    .runners-container {
      display: flex;
      width: 100%;
      height: 100vh;
    }
    .runner-column {
      flex: 1;
      border-right: 1px solid #e0e0e0;
    }
    .runner-column:last-child {
      border-right: none;
    }
    .runner-header {
      padding: 0.75em 1em;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
      text-align: center;
    }
    #player-reveal,
    #player-swiper,
    #player-splide {
      width: 100%;
      height: calc(100% - 50px);
    }
  </style>
</head>
<body>
  <div class="runners-container">
    <div class="runner-column">
      <div class="runner-header">
        <h3>Reveal.js</h3>
      </div>
      <div id="player-reveal"></div>
    </div>
    <div class="runner-column">
      <div class="runner-header">
        <h3>Swiper</h3>
      </div>
      <div id="player-swiper"></div>
    </div>
    <div class="runner-column">
      <div class="runner-header">
        <h3>Splide</h3>
      </div>
      <div id="player-splide"></div>
    </div>
  </div>
  <script type="module" src="./main.ts"></script>
</body>
</html>
```

## Complete Example

See the [Vue Demo](https://github.com/slidejs/slidejs/tree/main/demos/vue), [React Demo](https://github.com/slidejs/slidejs/tree/main/demos/react), or [Svelte Demo](https://github.com/slidejs/slidejs/tree/main/demos/svelte) for complete working examples with Monaco editor and theme switching.

## Next Steps

- [Basic Presentation Example](./basic-presentation.md) - Simple presentation
- [Interactive Quiz Example](./interactive-quiz.md) - Add interactive components
- [Custom Theme Example](./custom-theme.md) - Customize appearance
