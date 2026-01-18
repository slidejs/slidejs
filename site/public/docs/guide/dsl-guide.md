---
title: Slide DSL Complete Guide
order: 3
category: guide
description: 'Deep dive into Slide DSL syntax, rule engine, API usage, and best practices'
---

# Slide DSL Complete Guide

> This guide will help you understand and use SlideJS's Slide DSL (Domain-Specific Language), including syntax, rule engine, and API usage.

## Table of Contents

- [What is Slide DSL?](#what-is-slide-dsl)
- [Getting Started](#getting-started)
- [Basic Concepts](#basic-concepts)
- [Syntax Reference](#syntax-reference)
- [Complete Examples](#complete-examples)
- [API Reference](#api-reference)
- [Real-World Use Cases](#real-world-use-cases)
- [Best Practices](#best-practices)
- [Frequently Asked Questions](#frequently-asked-questions)

## What is Slide DSL?

Slide DSL is a declarative domain-specific language for generating slide presentations from any data source (Quiz, Survey, Form, etc.). It provides:

- **Declarative syntax**: Define slide structure with concise DSL syntax
- **Data source agnostic**: Support any data source through Context Adapter
- **Rule engine**: Support for start, content, end rules and nested loops
- **Type safe**: Complete TypeScript type definitions
- **High performance**: DSL parsing and generation optimized at compile time

## Getting Started

### Installation

```bash
npm install @slidejs/dsl @slidejs/core @slidejs/context
```

### Imports

```typescript
import { parseSlideDSL, compile } from '@slidejs/dsl';
import { SlideEngine } from '@slidejs/core';
import type { SlideContext } from '@slidejs/context';
```

## Basic Concepts

### Presentation

Every Slide DSL document starts with the `present` keyword, defining the data source type and name:

```slide
present quiz "my-quiz" {
  rules {
    // Rule definitions
  }
}
```

Supported data source types:

- `quiz` - Quiz data
- `survey` - Survey data
- `form` - Form data
- `assessment` - Assessment data

### Rules

Rules define how to generate slides from data sources:

- **start rule**: Executed before content, typically for title slides
- **content rule**: Dynamically generates slides from data
- **end rule**: Executed after content, typically for closing slides

### Context

Context is the unified interface after data source transformation. Any data source is converted to SlideContext through Context Adapter.

## Syntax Reference

### Presentation Syntax

```
present <type> "<name>" {
  rules {
    // Rule definitions
  }
}
```

Example:

```slide
present quiz "math-quiz" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "Welcome to Math Quiz!"
        }
      }
    }
  }
}
```

### Rule Syntax

#### Start Rule

```
rule start "<name>" {
  slide {
    // slide definition
  }
}
```

#### Content Rule

```
rule content "<name>" {
  // Can be for loop or slide list
  for item in collection {
    slide {
      // slide definition
    }
  }
}
```

#### End Rule

```
rule end "<name>" {
  slide {
    // slide definition
  }
}
```

### Slide Syntax

```
slide {
  content <type> {
    // Content definition
  }
  behavior {
    // Behavior configuration (optional)
  }
}
```

### Content Types

#### Static Text Content

```
content text {
  "First line of text"
  "Second line of text"
}
```

#### Dynamic Component Content

```
content dynamic {
  name: "component-name"
  attrs {
    key: value
    title: "Title"
  }
}
```

### For Loop

```
for item in collection {
  slide {
    content dynamic {
      name: "my-component"
      attrs {
        data: item
      }
    }
  }
}
```

Nested loops:

```
for section in quiz.sections {
  for question in section.questions {
    slide {
      content dynamic {
        name: "question-slide"
        attrs {
          section: section.title
          question: question.text
        }
      }
    }
  }
}
```

### Behavior Configuration

```
behavior {
  transition slide {
    speed: 500
    direction: "horizontal"
  }
}
```

Supported transition types:

- `slide` - Slide (default)
- `zoom` - Zoom
- `fade` - Fade
- `cube` - Cube (supported by some runners)
- `flip` - Flip (supported by some runners)
- `none` - No transition

**Note**: Different runners may support different transition types. `slide` and `fade` are universally supported, other types depend on runner capabilities.

## Complete Examples

### Example 1: Simple Quiz Presentation

```slide
present quiz "math-quiz" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "Welcome to Math Quiz!"
          "Test your math skills"
        }
        behavior {
          transition zoom {
            speed: 500
          }
        }
      }
    }

    rule content "questions" {
      for question in quiz.questions {
        slide {
          content dynamic {
            name: "wsx-quiz-question"
            attrs {
              title: question.text
              options: question.options
            }
          }
          behavior {
            transition slide {
              direction: "horizontal"
            }
          }
        }
      }
    }

    rule end "thanks" {
      slide {
        content text {
          "Thank you for participating!"
        }
        behavior {
          transition fade {}
        }
      }
    }
  }
}
```

### Example 2: Complex Presentation with Nested Loops

```slide
present quiz "comprehensive-quiz" {
  rules {
    rule start "title" {
      slide {
        content text {
          "Comprehensive Quiz"
          quiz.title
        }
      }
    }

    rule content "sections" {
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
                section: section.title
                question: question.text
                options: question.options
              }
            }
          }
        }
      }
    }

    rule end "results" {
      slide {
        content dynamic {
          name: "results-slide"
          attrs {
            showScore: true
          }
        }
      }
    }
  }
}
```

## API Reference

### Parsing DSL

```typescript
import { parseSlideDSL } from '@slidejs/dsl';

const source = `
present quiz "my-quiz" {
  rules {
    // ...
  }
}
`;

const ast = await parseSlideDSL(source);
```

### Compiling DSL

```typescript
import { compile } from '@slidejs/dsl';

const ast = await parseSlideDSL(source);
const slideDSL = compile(ast);
```

### Generating Slides

```typescript
import { SlideEngine } from '@slidejs/core';
import type { SlideContext } from '@slidejs/context';

// Create Context
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  metadata: { title: 'My Quiz' },
  items: [],
};

// Create engine
const engine = new SlideEngine(slideDSL);

// Generate slides
const slides = engine.generate(context);
```

### Using Runner

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';

// DSL source code
const dslSource = `
present quiz "my-quiz" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "Welcome!"
        }
      }
    }
  }
}
`;

// Context data
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-quiz',
  metadata: { title: 'My Quiz' },
  items: [],
};

// Create and run
const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  revealOptions: {
    controls: true,
    progress: true,
  },
});

// Start playback
runner.play();
```

## Real-World Use Cases

### Use Case 1: Generate Slides from Data Source

```slide
present quiz "math-quiz" {
  rules {
    rule content "questions" {
      for item in quiz.items {
        slide {
          content dynamic {
            name: "quiz-question"
            attrs {
              question: item.text
              options: item.data.options
            }
          }
          behavior {
            transition slide {}
          }
        }
      }
    }
  }
}
```

### Use Case 2: Nested Structure Handling

```slide
present quiz "comprehensive-quiz" {
  rules {
    rule content "sections" {
      for section in quiz.groups {
        // Section title slide
        slide {
          content text {
            section.title
          }
          behavior {
            transition fade {}
          }
        }

        // Section content
        for item in section.items {
          slide {
            content dynamic {
              name: "question-slide"
              attrs {
                section: section.title
                question: item.text
              }
            }
            behavior {
              transition slide {}
            }
          }
        }
      }
    }
  }
}
```

### Use Case 3: Mixed Static and Dynamic Content

```slide
present quiz "mixed-content" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Welcome"
          ""
          "This is a mixed content presentation"
        }
      }
    }

    rule content "dynamic" {
      for item in quiz.items {
        slide {
          content dynamic {
            name: "custom-component"
            attrs {
              data: item
            }
          }
        }
      }
    }

    rule end "conclusion" {
      slide {
        content text {
          "# Summary"
          ""
          "Thank you for watching!"
        }
      }
    }
  }
}
```

## Best Practices

### 1. Rule Naming

Use meaningful rule names for easier debugging and maintenance:

```slide
rule start "intro-slide" { ... }
rule content "question-slides" { ... }
rule end "thank-you-slide" { ... }
```

### 2. Content Organization

Organize related content together, use nested loops to handle hierarchical structures:

```slide
for section in quiz.groups {
  // Section title
  slide {
    content text {
      section.title
    }
  }

  // Section content
  for item in section.items {
    slide { ... }
  }
}
```

### 3. Transition Effects

Use transition effects appropriately, avoid overuse:

```slide
behavior {
  transition slide {
    speed: 300
  }
}
```

**Recommendations**:

- Use `fade` or `zoom` for title slides
- Use `slide` for content slides
- Use `fade` or `zoom` for closing slides

### 4. Component Reuse

Use dynamic components for content reuse:

```slide
content dynamic {
  name: "reusable-component"
  attrs {
    data: item
    config: quiz.metadata
  }
}
```

### 5. Error Handling

Handle parsing and compilation errors in code:

```typescript
import { parseSlideDSL, compile, ParseError, CompileError } from '@slidejs/dsl';

try {
  const ast = await parseSlideDSL(dslSource);
  const slideDSL = compile(ast);
} catch (error) {
  if (error instanceof ParseError) {
    console.error('Parse error:', error.message, error.location);
  } else if (error instanceof CompileError) {
    console.error('Compile error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### 6. Performance Optimization

For large amounts of data, consider:

1. **Pagination**: Only generate slides currently needed
2. **Lazy loading**: Delay loading dynamic components
3. **Caching**: Cache compiled DSL objects

```typescript
// Cache compilation results
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

## Frequently Asked Questions

### Q: How do I access context data?

A: In DSL, you can access context data through path expressions:

```slide
rule content "data-access" {
  slide {
    content text {
      quiz.metadata.title
      "Total items: " + quiz.items.length
    }
  }
}
```

### Q: What data types are supported?

A: Supported data source types:

- `quiz` - Quiz data
- `survey` - Survey data
- `form` - Form data
- `assessment` - Assessment data

### Q: How do I customize themes?

A: Use the `@slidejs/theme` package:

```typescript
import { setTheme } from '@slidejs/theme';

setTheme({
  navigationColor: '#ff0000',
  paginationColor: '#00ff00',
  backgroundColor: '#ffffff',
  textColor: '#000000',
});
```

### Q: Can I use conditional logic in DSL?

A: The current version does not support conditional logic (`if/else`), but you can achieve conditional effects through data source preprocessing. Conditional logic support is planned for future versions (see RFC 0003).

### Q: How do I debug DSL?

A: Use parsing and compilation error information:

```typescript
try {
  const ast = await parseSlideDSL(dslSource);
  console.log('AST:', ast);

  const slideDSL = compile(ast);
  console.log('Compiled DSL:', slideDSL);
} catch (error) {
  if (error instanceof ParseError) {
    console.error('Location:', error.location);
  }
}
```

## Related Resources

- [GitHub Repository](https://github.com/slidejs/slidejs)
- [npm Package](https://www.npmjs.com/package/@slidejs/dsl)
- [RFC Documentation](../../../docs/rfc/) - Technical specifications and architecture design
- [Example Projects](https://github.com/slidejs/slidejs/tree/main/demos) - Complete example code
