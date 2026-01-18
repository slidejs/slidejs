---
title: @slidejs/dsl API Reference
order: 2
category: api
description: 'Complete API reference for @slidejs/dsl package - DSL parser and compiler'
---

# @slidejs/dsl API Reference

The `@slidejs/dsl` package provides the parser and compiler for Slide DSL syntax.

## Exports

### Functions

#### `parseSlideDSL(source: string): Promise<PresentationNode>`

Parses Slide DSL source code into an AST (Abstract Syntax Tree).

**Parameters:**
- `source: string` - The Slide DSL source code

**Returns:**
- `Promise<PresentationNode>` - The parsed AST

**Throws:**
- `ParseError` - If the source code is invalid

**Example:**

```typescript
import { parseSlideDSL } from '@slidejs/dsl';

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

try {
  const ast = await parseSlideDSL(dslSource);
  console.log('Parsed successfully:', ast);
} catch (error) {
  if (error instanceof ParseError) {
    console.error('Parse error:', error.message);
  }
}
```

#### `compile<TContext>(ast: PresentationNode): SlideDSL<TContext>`

Compiles an AST into a SlideDSL object that can be used with SlideEngine.

**Type Parameters:**
- `TContext extends SlideContext` - The context type

**Parameters:**
- `ast: PresentationNode` - The parsed AST

**Returns:**
- `SlideDSL<TContext>` - The compiled Slide DSL

**Throws:**
- `CompileError` - If the AST is invalid or compilation fails

**Example:**

```typescript
import { parseSlideDSL, compile } from '@slidejs/dsl';
import type { SlideDSL, SlideContext } from '@slidejs/core';

const dslSource = `/* ... */`;

// Parse
const ast = await parseSlideDSL(dslSource);

// Compile
const slideDSL = compile<SlideContext>(ast);

// Use with SlideEngine
const engine = new SlideEngine(slideDSL);
```

#### `createParser(): Parser`

Creates a new parser instance. Useful for advanced use cases.

**Returns:**
- `Parser` - A parser instance

**Example:**

```typescript
import { createParser } from '@slidejs/dsl';

const parser = createParser();
const ast = await parser.parse(dslSource);
```

### Classes

#### `ParseError`

Error class for parsing errors.

**Properties:**
- `message: string` - Error message
- `location?: { line: number; column: number }` - Error location in source

**Example:**

```typescript
import { parseSlideDSL, ParseError } from '@slidejs/dsl';

try {
  await parseSlideDSL(invalidSource);
} catch (error) {
  if (error instanceof ParseError) {
    console.error(`Parse error at line ${error.location?.line}: ${error.message}`);
  }
}
```

#### `CompileError`

Error class for compilation errors.

**Properties:**
- `message: string` - Error message

### Types

#### `PresentationNode`

Root node of the AST.

```typescript
interface PresentationNode {
  type: 'presentation';
  sourceType: string;
  sourceId: string;
  rules: RuleNode[];
}
```

#### `RuleNode`

A rule node in the AST.

```typescript
interface RuleNode {
  type: 'rule';
  ruleType: 'start' | 'content' | 'end';
  name: string;
  slides: SlideNode[];
  forLoop?: ForLoopNode;
}
```

#### `SlideNode`

A slide node in the AST.

```typescript
interface SlideNode {
  type: 'slide';
  content: ContentNode;
  behavior?: BehaviorNode;
}
```

#### `ContentNode`

Content node (dynamic or text).

```typescript
type ContentNode = DynamicContentNode | TextContentNode;
```

#### `DynamicContentNode`

Dynamic content node.

```typescript
interface DynamicContentNode {
  type: 'dynamic';
  name: string;
  attrs: Record<string, ExpressionValue>;
}
```

#### `TextContentNode`

Text content node.

```typescript
interface TextContentNode {
  type: 'text';
  lines: string[];
}
```

#### `BehaviorNode`

Behavior node.

```typescript
interface BehaviorNode {
  type: 'behavior';
  transition?: TransitionNode;
  // ... other behavior properties
}
```

#### `TransitionNode`

Transition node.

```typescript
interface TransitionNode {
  type: 'transition';
  transitionType: 'slide' | 'zoom' | 'fade' | 'cube' | 'flip' | 'none';
  options?: Record<string, ExpressionValue>;
}
```

#### `ForLoopNode`

For loop node.

```typescript
interface ForLoopNode {
  type: 'forLoop';
  variable: string;
  collection: ExpressionValue;
  slides: SlideNode[];
}
```

#### `ExpressionValue`

Expression value type.

```typescript
type ExpressionValue =
  | string
  | number
  | boolean
  | MemberExpressionNode
  | BinaryExpressionNode
  | NumberLiteralNode
  | BooleanLiteralNode;
```

## Usage Example

Complete workflow from DSL source to slides:

```typescript
import { parseSlideDSL, compile } from '@slidejs/dsl';
import { SlideEngine } from '@slidejs/core';
import type { SlideContext } from '@slidejs/context';

const dslSource = `
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
      for item in items {
        slide {
          content text {
            "# {{ item.title }}"
            ""
            "{{ item.description }}"
          }
        }
      }
    }

    rule end "thanks" {
      slide {
        content text {
          "# Thank You!"
        }
      }
    }
  }
}
`;

// 1. Parse DSL source
const ast = await parseSlideDSL(dslSource);

// 2. Compile to SlideDSL
const slideDSL = compile(ast);

// 3. Create context
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-presentation',
  metadata: { title: 'My Presentation' },
  items: [
    { title: 'Feature 1', description: 'Description 1' },
    { title: 'Feature 2', description: 'Description 2' },
  ],
};

// 4. Generate slides
const engine = new SlideEngine(slideDSL);
const slides = engine.generate(context);

console.log(`Generated ${slides.length} slides`);
```

## Error Handling

Both `parseSlideDSL` and `compile` can throw errors. Always wrap them in try-catch:

```typescript
import { parseSlideDSL, compile, ParseError, CompileError } from '@slidejs/dsl';

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
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Related Documentation

- [DSL Guide](../guide/dsl-guide.md) - Complete DSL syntax guide
- [Core API](./core.md) - SlideEngine API reference
- [Getting Started](../guide/getting-started.md) - Quick start guide
