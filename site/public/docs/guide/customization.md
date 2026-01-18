---
title: Customization Guide
order: 6
category: guide
description: 'Complete guide to customizing SlideJS - themes, components, runners, and advanced customization options'
---

# Customization Guide

SlideJS provides extensive customization options to tailor your slide presentations to your needs. This guide covers all aspects of customization.

## Overview

SlideJS customization includes:

- **Theme Customization** - Colors, fonts, and visual styles
- **Component Customization** - Custom Web Components for dynamic content
- **Runner Customization** - Configure runner-specific options
- **DSL Customization** - Advanced DSL patterns and extensions

## Theme Customization

### Quick Start

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// Use preset themes
setTheme(Preset.SolarizedDark);
setTheme(Preset.SolarizedLight);

// Or create custom theme
setTheme({
  navigationColor: '#4a90e2',
  paginationColor: '#4a90e2',
  backgroundColor: '#1e1e1e',
  textColor: '#ffffff',
});
```

### Available Theme Variables

- `navigationColor` - Navigation button color
- `paginationColor` - Pagination dot color
- `paginationActiveColor` - Active pagination dot color
- `scrollbarBg` - Scrollbar background color
- `scrollbarDragBg` - Scrollbar drag handle color
- `arrowColor` - Arrow button color
- `progressBarColor` - Progress bar color
- `backgroundColor` - Background color
- `textColor` - Text color
- `linkColor` - Link color
- `headingColor` - Heading color
- `codeBackground` - Code block background color

For detailed theme customization, see [Theme Guide](./theme-guide.md).

## Component Customization

### Creating Custom Components

SlideJS uses **Web Components** for dynamic content. **[WSX](https://wsxjs.dev/) is the recommended framework** for building Web Components:

```typescript
/** @jsxImportSource @wsxjs/wsx-core */
import { LightComponent, autoRegister, state } from '@wsxjs/wsx-core';

@autoRegister({ tagName: 'my-custom-component' })
export class MyCustomComponent extends LightComponent {
  @state private count = 0;
  
  render() {
    return <div>Count: {this.count}</div>;
  }
}
```

### Using Custom Components in DSL

```slide
present quiz "demo" {
  rules {
    rule content "custom-slide" {
      slide {
        content dynamic {
          name: "my-custom-component"
          attrs {
            title: "My Title"
            count: "5"
          }
        }
      }
    }
  }
}
```

For detailed component development, see [Components Guide](./components-guide.md).

## Runner Customization

### Reveal.js Runner Options

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  revealOptions: {
    controls: true,
    progress: true,
    center: true,
    transition: 'slide',
    hash: true,
    // ... all reveal.js options
  },
});
```

### Swiper Runner Options

```typescript
import { createSlideRunner } from '@slidejs/runner-swiper';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  swiperOptions: {
    direction: 'horizontal',
    loop: false,
    navigation: true,
    pagination: { clickable: true },
    // ... all Swiper options
  },
});
```

### Splide Runner Options

```typescript
import { createSlideRunner } from '@slidejs/runner-splide';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  splideOptions: {
    type: 'slide',
    perPage: 1,
    keyboard: 'global',
    arrows: true,
    // ... all Splide options
  },
});
```

For detailed runner configuration, see [Runner Guide](./runner-guide.md).

## DSL Customization

### Advanced DSL Patterns

#### Custom Rule Names

```slide
present quiz "my-quiz" {
  rules {
    rule start "welcome" {
      slide {
        content text {
          "# Welcome"
        }
      }
    }
    
    rule content "question" {
      slide {
        content text {
          "# Question"
        }
      }
    }
    
    rule end "thank-you" {
      slide {
        content text {
          "# Thank You!"
        }
      }
    }
  }
}
```

#### Nested Loops

```slide
present quiz "nested-demo" {
  rules {
    rule content "nested-content" {
      loop items {
        slide {
          content text {
            "# Item: {item.title}"
          }
          loop item.subItems {
            slide {
              content text {
                "## Sub-item: {subItem.name}"
              }
            }
          }
        }
      }
    }
  }
}
```

For complete DSL reference, see [DSL Guide](./dsl-guide.md).

## CSS Customization

### Global Styles

You can add custom CSS to override default styles:

```css
/* Custom slide styles */
.reveal .slides section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Custom component styles */
my-custom-component {
  --custom-color: #4a90e2;
}
```

### Theme Variables

Use CSS variables for consistent theming:

```css
:root {
  --slidejs-background-color: #1e1e1e;
  --slidejs-text-color: #ffffff;
  --slidejs-navigation-color: #4a90e2;
}
```

## Best Practices

1. **Use Theme System** - Always use the theme system for colors and styles
2. **Component Reusability** - Create reusable Web Components
3. **Type Safety** - Use TypeScript for all customizations
4. **Performance** - Optimize components and avoid heavy computations
5. **Accessibility** - Ensure customizations maintain accessibility

## Related Documentation

- [Theme Guide](./theme-guide.md) - Detailed theme customization
- [Components Guide](./components-guide.md) - Component development
- [Runner Guide](./runner-guide.md) - Runner configuration
- [DSL Guide](./dsl-guide.md) - DSL syntax and patterns
