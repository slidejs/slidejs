---
title: Frequently Asked Questions
order: 1
category: faq
description: 'Common questions and answers about SlideJS - installation, usage, configuration, and troubleshooting'
---

# Frequently Asked Questions

Common questions and answers about SlideJS.

## Installation

### Q: What are the system requirements?

**A:** SlideJS requires:
- **Node.js**: >= 22.12.0
- **Browser**: Modern browsers with Web Components support (latest versions of Chrome, Firefox, Safari, Edge)
- **TypeScript**: Optional but recommended (all packages include type definitions)

### Q: Which package manager should I use?

**A:** SlideJS works with npm, pnpm, and yarn. All package managers are supported:

```bash
# npm
npm install @slidejs/core @slidejs/dsl @slidejs/context

# pnpm
pnpm add @slidejs/core @slidejs/dsl @slidejs/context

# yarn
yarn add @slidejs/core @slidejs/dsl @slidejs/context
```

### Q: Do I need to install all runners?

**A:** No, you only need to install the runner(s) you plan to use. Each runner is independent:

```bash
# Install only what you need
npm install @slidejs/runner-revealjs reveal.js
# or
npm install @slidejs/runner-swiper swiper
# or
npm install @slidejs/runner-splide @splidejs/splide
```

### Q: Why do I need to install the underlying library (reveal.js, swiper, etc.)?

**A:** SlideJS runners are adapters that wrap the underlying libraries. You need to install both the runner package and the library it wraps:

- `@slidejs/runner-revealjs` requires `reveal.js`
- `@slidejs/runner-swiper` requires `swiper`
- `@slidejs/runner-splide` requires `@splidejs/splide`

## Usage

### Q: How do I import DSL source files?

**A:** Use Vite's `?raw` import or webpack's raw-loader:

```typescript
// Vite
import dslSource from './presentation.slide?raw';

// Webpack (with raw-loader)
import dslSource from '!!raw-loader!./presentation.slide';
```

### Q: Can I use SlideJS without a build tool?

**A:** Yes, you can define DSL inline as a string:

```typescript
const dslSource = `
present quiz "my-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Welcome"
        }
      }
    }
  }
}
`;
```

### Q: How do I handle DSL parsing errors?

**A:** Wrap parsing in try-catch and check error types:

```typescript
import { parseSlideDSL, ParseError, CompileError } from '@slidejs/dsl';

try {
  const ast = await parseSlideDSL(dslSource);
  const slideDSL = compile(ast);
} catch (error) {
  if (error instanceof ParseError) {
    console.error('Parse error:', error.message);
    if (error.location) {
      console.error(`At line ${error.location.line}, column ${error.location.column}`);
    }
  } else if (error instanceof CompileError) {
    console.error('Compile error:', error.message);
  }
}
```

### Q: Can I use multiple runners at the same time?

**A:** Yes! You can use multiple runners simultaneously:

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

## Configuration

### Q: How do I customize themes?

**A:** Use the `@slidejs/theme` package:

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// Use preset
setTheme(Preset.SolarizedDark);

// Or custom theme
setTheme({
  navigationColor: '#ff0000',
  paginationColor: '#00ff00',
  backgroundColor: '#ffffff',
  textColor: '#000000',
});
```

See [Theme Guide](../guide/theme-guide.md) for more details.

### Q: Can I use runner-specific CSS variables?

**A:** Yes, but it's not recommended. The theme system provides standard variables that are automatically mapped. If you need runner-specific variables, use DOM API directly:

```typescript
// Not recommended, but possible
document.documentElement.style.setProperty('--slidejs-swiper-navigation-color', '#ff0000');
```

### Q: How do I configure Vite for SlideJS?

**A:** Add SlideJS packages to `optimizeDeps.exclude`:

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@slidejs/core',
      '@slidejs/runner',
      '@slidejs/runner-revealjs',
      '@slidejs/runner-swiper',
      '@slidejs/runner-splide',
      '@slidejs/editor',
    ],
  },
});
```

## DSL

### Q: What data source types are supported?

**A:** Currently supported types:
- `quiz` - Quiz data
- `survey` - Survey data
- `form` - Form data
- `assessment` - Assessment data

You can use any string as the source type, but it must match your context's `sourceType`.

### Q: Can I use conditional logic in DSL?

**A:** Not yet. The current version doesn't support `if/else` statements. You can achieve conditional effects by preprocessing your data source. Conditional logic support is planned for future versions (see RFC 0003).

### Q: How do I access nested data in DSL?

**A:** Use dot notation:

```slide
rule content "nested-data" {
  slide {
    content text {
      quiz.metadata.title
      "Total items: " + quiz.items.length
    }
  }
}
```

### Q: Can I use loops inside loops?

**A:** Yes, nested loops are supported:

```slide
rule content "nested-loops" {
  for section in quiz.sections {
    slide {
      content text {
        section.title
      }
    }
    
    for question in section.questions {
      slide {
        content dynamic {
          name: "question-slide"
          attrs {
            question: question.text
          }
        }
      }
    }
  }
}
```

## Components

### Q: How do I create custom components?

**A:** SlideJS uses **Web Components** for dynamic content. **[WSX](https://wsxjs.dev/) is the recommended framework** for building Web Components. Create a Web Component using WSX:

```typescript
/** @jsxImportSource @wsxjs/wsx-core */
import { LightComponent, autoRegister, state } from '@wsxjs/wsx-core';

@autoRegister({ tagName: 'my-component' })
export class MyComponent extends LightComponent {
  @state private count = 0;
  
  render() {
    return <div>My Component: {this.count}</div>;
  }
}
```

Then import before using:

```typescript
import './components/my-component.wsx';
```

**Why WSX?** [WSX](https://wsxjs.dev/) is a framework for building Web Components that provides better TypeScript support, reactive state management, and cleaner syntax. See [Components Guide](../guide/components-guide.md) for details.

### Q: How do I pass data to components?

**A:** Use the `attrs` block in DSL:

```slide
content dynamic {
  name: "my-component"
  attrs {
    title: "My Title"
    count: "5"
    items: "[\"item1\", \"item2\"]"
  }
}
```

### Q: Can I use React/Vue components directly?

**A:** Not directly. SlideJS uses **Web Components** for dynamic content. **[WSX](https://wsxjs.dev/) is the recommended framework** for building Web Components as it provides:
- Better TypeScript support
- Reactive state management
- JSX-like syntax
- Better developer experience

You can also create Web Components using the standard Web Components API, or wrap React/Vue components in Web Components if needed, but WSX is the recommended approach.

## Performance

### Q: How do I optimize performance for large presentations?

**A:** Consider these strategies:

1. **Cache compiled DSL**:
```typescript
const cache = new Map<string, SlideDSL>();

function getCompiledDSL(source: string): SlideDSL {
  const hash = hashString(source);
  if (cache.has(hash)) {
    return cache.get(hash)!;
  }
  const ast = await parseSlideDSL(source);
  const slideDSL = compile(ast);
  cache.set(hash, slideDSL);
  return slideDSL;
}
```

2. **Lazy load components**: Load components only when needed
3. **Pagination**: Generate slides in batches

### Q: Which runner is the fastest?

**A:** Performance depends on your use case:
- **Splide**: Lightest (~20KB), fastest for simple slideshows
- **Swiper**: Good balance (~150KB), excellent for mobile
- **Reveal.js**: Most features (~200KB), best for presentations

## Troubleshooting

### Q: Runner doesn't initialize

**A:** Check:
1. Container element exists: `document.getElementById('slides')` returns an element
2. DSL is valid: Parse and compile without errors
3. Context matches DSL source type
4. CSS is loaded: Runner CSS should be automatically injected

### Q: Slides are not rendering

**A:** Common causes:
1. **DSL errors**: Check console for parse/compile errors
2. **Context mismatch**: Ensure `context.sourceType` matches DSL `sourceType`
3. **Missing rules**: Ensure at least one `start` and one `end` rule
4. **Container issues**: Ensure container is visible and has dimensions

### Q: Theme not applying

**A:** Check:
1. Theme is set before creating runner
2. Using standard theme variables (not runner-specific)
3. CSS is not overridden by other styles
4. Container scope is correct (if using scoped themes)

### Q: Components not rendering

**A:** Ensure:
1. Component is registered before creating runner
2. Component file is imported
3. Component name matches DSL `name` attribute
4. Attributes are valid JSON strings

### Q: TypeScript errors

**A:** Common issues:
1. **Missing types**: All packages include types, no `@types/*` needed
2. **Import errors**: Use correct import paths from package exports
3. **Type mismatches**: Ensure context type matches DSL generic type

### Q: Build errors with Vite

**A:** Common solutions:
1. Add to `optimizeDeps.exclude`:
```typescript
optimizeDeps: {
  exclude: ['@slidejs/core', '@slidejs/runner', /* ... */],
}
```

2. Use `?raw` for DSL imports:
```typescript
import dslSource from './presentation.slide?raw';
```

3. Check Vite version: Requires Vite >= 5.0

## Migration

### Q: How do I migrate from reveal.js?

**A:** See [Migration Guide](../guide/migration-guide.md) for detailed steps. Basic process:
1. Convert HTML slides to DSL
2. Replace `Reveal.initialize()` with `createSlideRunner()`
3. Update event handlers to use runner API

### Q: Can I use existing reveal.js/Swiper/Splide configurations?

**A:** Yes! Runner options accept the same configuration objects:

```typescript
// Reveal.js options work as-is
revealOptions: {
  controls: true,
  progress: true,
  hash: true,
}

// Swiper options work as-is
swiperOptions: {
  direction: 'horizontal',
  loop: true,
  navigation: true,
}
```

## Related Documentation

- [Getting Started](../guide/getting-started.md) - Quick start guide
- [DSL Guide](../guide/dsl-guide.md) - Complete DSL reference
- [Runner Guide](../guide/runner-guide.md) - Runner selection and configuration
- [Theme Guide](../guide/theme-guide.md) - Theme customization
- [Components Guide](../guide/components-guide.md) - Component development
- [Migration Guide](../guide/migration-guide.md) - Migration from other libraries
