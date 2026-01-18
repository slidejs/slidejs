---
title: Installation Guide
order: 2
category: guide
description: 'Detailed installation instructions including environment requirements, package manager options, and TypeScript support'
---

# Installation Guide

This guide will help you install SlideJS and its dependencies.

## Environment Requirements

- **Node.js**: >= 22.12.0
- **Browser**: Modern browsers with Web Components support (latest versions of Chrome, Firefox, Safari, Edge)

## Installation Steps

### Step 1: Install Core Packages

All SlideJS projects require core packages:

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context
```

### Step 2: Choose a Runner (Required)

Select one or more runners based on your needs:

#### Reveal.js Runner (Recommended for presentations)

```bash
npm install @slidejs/runner-revealjs reveal.js
```

#### Swiper Runner (Recommended for mobile)

```bash
npm install @slidejs/runner-swiper swiper
```

#### Splide Runner (Lightweight)

```bash
npm install @slidejs/runner-splide @splidejs/splide
```

### Step 3: Install Theme System (Optional)

If you need custom themes:

```bash
npm install @slidejs/theme
```

### Step 4: Verify Installation

After installation, verify that everything is working:

```typescript
import { parseSlideDSL, compile } from '@slidejs/dsl';
import type { SlideContext } from '@slidejs/context';

console.log('✅ SlideJS installed!');

// Test DSL parsing functionality
const testDSL = `
present quiz "test" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "Hello, SlideJS!"
        }
      }
    }
  }
}
`;

try {
  const ast = await parseSlideDSL(testDSL);
  const slideDSL = compile(ast);
  console.log('✅ DSL parsing and compilation working');
} catch (error) {
  console.error('❌ Error:', error);
}
```

## TypeScript Support

All packages include complete TypeScript type definitions - no need to install additional type packages.

```typescript
import type { SlideDSL, SlideContext } from '@slidejs/core';
import type { PresentationNode } from '@slidejs/dsl';
import type { SlideRunner } from '@slidejs/runner';
```

## Package Managers

### npm

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context @slidejs/runner-revealjs
```

### pnpm

```bash
pnpm add @slidejs/core @slidejs/dsl @slidejs/context @slidejs/runner-revealjs
```

### yarn

```bash
yarn add @slidejs/core @slidejs/dsl @slidejs/context @slidejs/runner-revealjs
```

## Complete Installation Examples

### Minimal Installation (Core features only)

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context @slidejs/runner-revealjs reveal.js
```

### Full Installation (All features)

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context \
  @slidejs/runner-revealjs reveal.js \
  @slidejs/runner-swiper swiper \
  @slidejs/runner-splide @splidejs/splide \
  @slidejs/theme
```

## Next Steps

- [Getting Started](./getting-started.md) - Quick start in 5 minutes
- [Slide DSL Complete Guide](./dsl-guide.md) - Deep dive into DSL syntax and features
- [Example Projects](https://github.com/slidejs/slidejs/tree/main/demos) - View complete example code
