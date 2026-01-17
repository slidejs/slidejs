# SlideJS

An open-source library for building slides using DSL.

## Language

- [English](README.md) (Current)
- [中文](README.zh.md)

## Introduction

SlideJS is a powerful slide building library that uses DSL (Domain-Specific Language) to define and render slides, supporting multiple rendering engines (reveal.js, Swiper, Splide, etc.). It allows you to easily create, manage, and present interactive slides.

## Features

- 🎯 **Declarative DSL** - Define slide structure with concise DSL syntax
- 🎨 **Multiple Rendering Engines** - Support for reveal.js, Swiper, Splide, etc.
- 📦 **Data Source Agnostic** - Support any data source (Quiz, Survey, Form, etc.) through Context Adapter
- 🔒 **Type Safe** - Complete TypeScript type definitions and validation
- 🔄 **Rule Engine** - Support for start, content, end rules and nested loops
- 🎨 **Dynamic Content** - Support for static text and dynamic components
- ⚡ **High Performance** - DSL parsing and generation optimized at compile time

## Demos

Check out our interactive demos showcasing different frameworks:

- [Vue.js Demo](demos/vue/README.md) - Multi-runner comparison with Vue.js
- [React Demo](demos/react/README.md) - Multi-runner comparison with React

## Installation

```bash
# Install core component library
npm install @slidejs/core

# Install DSL library (for validation and serialization)
npm install @slidejs/dsl

# Install runners (optional)
npm install @slidejs/runner-revealjs    # reveal.js runner
npm install @slidejs/runner-swiper      # Swiper runner
npm install @slidejs/runner-splide      # Splide runner
```

## Quick Start

### Creating Slides with Slide DSL

SlideJS uses a declarative DSL (Domain-Specific Language) to define slides. First, create a `.slide` file:

```slide
present quiz "my-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Welcome to SlideJS"
          "## A Powerful Slide DSL"
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
          "- Support for multiple rendering engines"
          "- Concise DSL syntax"
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

### Using in Code

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';

// DSL source code (can be imported from file or defined directly)
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

## Project Structure

```
slidejs/
├── packages/              # Core packages
│   ├── @slidejs/         # Core package namespace
│   │   ├── core/         # Core engine
│   │   ├── dsl/          # DSL definition, validation and serialization
│   │   ├── context/      # Context management
│   │   ├── runner/       # Base runner
│   │   ├── runner-revealjs/  # reveal.js runner
│   │   ├── runner-swiper/    # Swiper runner
│   │   └── runner-splide/    # Splide runner
├── demos/                # Demo projects
│   ├── vue/              # Vue.js demo
│   └── react/            # React demo
├── site/                 # Official website
│   └── src/              # wsx components and pages
└── docs/                 # Documentation
    └── rfc/              # Technical specifications and architecture design
```

## Core Packages

### @slidejs/core

Core engine providing fundamental slide rendering capabilities.

- `SlideEngine` - Slide engine
- `SlideContext` - Context management

### @slidejs/dsl

Slide DSL syntax parser and compiler.

- `parseSlideDSL()` - Parse DSL source code into AST
- `compile()` - Compile AST into executable SlideDSL object
- Grammar parser based on [Peggy](https://peggyjs.org/)

### @slidejs/runner-revealjs

reveal.js runner, rendering slides based on reveal.js.

- `createSlideRunner()` - Create runner instance from DSL source code

### @slidejs/runner-swiper

Swiper runner, rendering slides based on Swiper.js.

- `createSlideRunner()` - Create runner instance from DSL source code

### @slidejs/runner-splide

Splide runner, rendering slides based on Splide.

- `createSlideRunner()` - Create runner instance from DSL source code

### @slidejs/theme

Runtime theme customization system.

- `setTheme()` - Set global theme
- `useTheme()` - Create scoped theme hook
- `Preset` - Preset themes (SolarizedDark, SolarizedLight)

## Documentation

- **RFC Documents**: [docs/rfc/](./docs/rfc/) - Technical specifications and architecture design

## Development

### Requirements

- Node.js >= 22.12.0
- pnpm >= 10.0.0

### Install Dependencies

```bash
pnpm install
```

### Development Commands

```bash
# Development mode (interactive menu)
pnpm dev

# Develop specific projects
pnpm dev:site              # Develop website
pnpm dev:vue               # Vue.js demo
pnpm dev:react             # React demo

# Build all packages
pnpm build

# Run tests
pnpm test

# Code linting
pnpm lint
pnpm lint:fix        # Auto-fix
```

### Website Deployment

```bash
# Build website and demos
pnpm build:pages

# Preview build results
pnpm preview:pages

# Deploy to GitHub Pages
pnpm deploy:pages
```

## License

This project is licensed under **MIT License**, allowing free use, modification, and distribution, including commercial use.

### Enterprise License

For enterprise customers, we offer commercial license options, including:

- ✅ Commercial legal protection (no MIT disclaimer)
- ✅ Priority technical support
- ✅ SLA (Service Level Agreement)
- ✅ Custom development services
- ✅ White-label/brand customization

**Learn more**: See [Enterprise License Documentation](./docs/ENTERPRISE-LICENSE.md) or contact [enterprise@slidejs.io](mailto:enterprise@slidejs.io)

## Related Projects

- [reveal.js](https://revealjs.com/) - HTML presentation framework
- [Swiper](https://swiperjs.com/) - Modern touch slider
- [Splide](https://splidejs.com/) - Lightweight carousel component
- [wsxjs](https://www.wsxjs.dev) - Web Components framework

## Contributing

Contributions are welcome! Please check [GitHub Issues](https://github.com/slidejs/slidejs/issues) for open tasks.

## Authors

SlideJS Team
