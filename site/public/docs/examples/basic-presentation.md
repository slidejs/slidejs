---
title: Basic Presentation Example
order: 1
category: examples
description: 'A simple presentation example showing basic Slide DSL syntax and runner usage'
---

# Basic Presentation Example

This example demonstrates how to create a simple presentation with SlideJS.

## Overview

This example creates a basic presentation with:
- Title slide
- Content slides
- Closing slide
- Simple transitions

## DSL Source

Create a file `presentation.slide`:

```slide
present quiz "basic-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Welcome to SlideJS"
          "## A Powerful Slide DSL"
          ""
          "Create beautiful presentations with ease"
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
          "- Multiple rendering engines"
          "- Type safe"
          "- High performance"
        }
        behavior {
          transition slide {}
        }
      }

      slide {
        content text {
          "# Getting Started"
          ""
          "1. Install SlideJS packages"
          "2. Create a .slide file"
          "3. Use createSlideRunner()"
          "4. Enjoy!"
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
          "## Questions?"
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
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';
import dslSource from './presentation.slide?raw';

// Create context
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'basic-presentation',
  metadata: {
    title: 'Basic Presentation',
  },
  items: [],
};

// Create and run presentation
async function initPresentation() {
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
}

initPresentation();
```

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Basic Presentation</title>
</head>
<body>
  <div id="slides-container"></div>
  <script type="module" src="./main.ts"></script>
</body>
</html>
```

## Complete Example

See the [Vue Demo](https://github.com/slidejs/slidejs/tree/main/demos/vue) or [React Demo](https://github.com/slidejs/slidejs/tree/main/demos/react) for complete working examples.

## Next Steps

- [Interactive Quiz Example](./interactive-quiz.md) - Add interactive components
- [Multi-Runner Example](./multi-runner.md) - Compare different runners
- [Custom Theme Example](./custom-theme.md) - Customize appearance
