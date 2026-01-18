---
title: Getting Started
order: 1
category: guide
description: 'Get started with SlideJS in 5 minutes - learn how to create your first Slide DSL file and run a slide presentation'
---

# Getting Started

This guide will help you get started with SlideJS in 5 minutes.

## Step 1: Installation

Install the required packages based on your project needs:

```bash
# Core packages (required)
npm install @slidejs/core @slidejs/dsl @slidejs/context

# Runners (choose one or more)
npm install @slidejs/runner-revealjs    # reveal.js runner
npm install @slidejs/runner-swiper     # Swiper runner
npm install @slidejs/runner-splide     # Splide runner

# Theme system (optional)
npm install @slidejs/theme
```

## Step 2: Create Your First Slide DSL File

Create a `.slide` file, for example `presentation.slide`:

```slide
present quiz "my-first-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# My First Slide"
          "## Created with SlideJS"
        }
        behavior {
          transition fade {}
        }
      }
    }

    rule content "main-content" {
      slide {
        content text {
          "# Features"
          ""
          "- Declarative DSL syntax"
          "- Support for multiple rendering engines"
          "- Type safe"
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
        }
        behavior {
          transition zoom {}
        }
      }
    }
  }
}
```

## Step 3: Use in Code

### Basic Usage

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';

// Import DSL source code (using Vite's ?raw import)
import dslSource from './presentation.slide?raw';

// Or define directly
const dslSource = `
present quiz "my-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Welcome to SlideJS"
        }
      }
    }
  }
}
`;

// Create context data
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-presentation',
  metadata: {
    title: 'My Presentation',
  },
  items: [],
};

// Create and run slides
const runner = await createSlideRunner(dslSource, context, {
  container: '#slides-container',
  revealOptions: {
    controls: true,
    progress: true,
  },
});

// Start playback
runner.play();
```

### Using Theme System

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// Use preset theme
setTheme(Preset.SolarizedDark);
// or
setTheme(Preset.SolarizedLight);

// Custom theme
setTheme({
  navigationColor: '#ff0000',
  paginationColor: '#00ff00',
  backgroundColor: '#ffffff',
  textColor: '#000000',
});
```

### Using Dynamic Components

SlideJS uses **Web Components** for dynamic content. **[WSX](https://wsxjs.dev/) is recommended** for building Web Components. Create a Web Component using WSX:

```typescript
/** @jsxImportSource @wsxjs/wsx-core */
import { LightComponent, autoRegister, state } from '@wsxjs/wsx-core';

@autoRegister({ tagName: 'my-quiz-question' })
export class MyQuizQuestion extends LightComponent {
  @state private selectedOption: number | null = null;
  
  // ... component implementation
}
```

Then use it in your DSL:

```slide
present quiz "demo" {
  rules {
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
    }
  }
}
```

See [Components Guide](./components-guide.md) for complete examples.

## Step 4: Choose a Runner

### Reveal.js Runner

**Best for:** Presentations, educational content

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  revealOptions: {
    controls: true,
    progress: true,
    hash: true,
  },
});
```

### Swiper Runner

**Best for:** Mobile apps, touch interactions

```typescript
import { createSlideRunner } from '@slidejs/runner-swiper';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  swiperOptions: {
    direction: 'horizontal',
    loop: false,
    navigation: true,
    pagination: true,
  },
});
```

### Splide Runner

**Best for:** Lightweight, simple scenarios

```typescript
import { createSlideRunner } from '@slidejs/runner-splide';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  splideOptions: {
    type: 'slide',
    perPage: 1,
    pagination: true,
    arrows: true,
  },
});
```

## Next Steps

- [Installation Guide](./installation.md) - Detailed installation instructions
- [DSL Complete Guide](./dsl-guide.md) - Deep dive into Slide DSL syntax and features
- [Theme System](./theme-guide.md) - Learn how to customize themes
- [Example Projects](https://github.com/slidejs/slidejs/tree/main/demos) - View complete examples
