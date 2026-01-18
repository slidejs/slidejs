---
title: Components Guide
order: 6
category: guide
description: 'Complete guide to using dynamic components in SlideJS - Web Components and WSX components'
---

# Components Guide

SlideJS supports dynamic components in slides, allowing you to create interactive and reusable slide content.

## Overview

SlideJS uses **Web Components** for dynamic content. You can create Web Components using:
- **WSX Framework** - [WSX](https://wsxjs.dev/) is a framework for building Web Components (⭐ **Recommended**)
- **Standard Web Components API** - Native Web Components

**WSX is the recommended way to build Web Components for SlideJS** because it provides:
- Better TypeScript support
- Reactive state management with `@state` decorator
- JSX-like syntax
- Better developer experience
- Seamless integration with SlideJS

All components work seamlessly with all runners (Reveal.js, Swiper, Splide).

## Using Components in DSL

### Basic Usage

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

### Component Attributes

Attributes are passed as JSON strings in the DSL:

```slide
content dynamic {
  name: "my-component"
  attrs {
    title: "My Title"
    count: "5"
    items: "[\"item1\", \"item2\", \"item3\"]"
    config: "{\"key\": \"value\"}"
  }
}
```

## Creating Components

### Using WSX Framework (⭐ Recommended)

**WSX** ([wsxjs.dev](https://wsxjs.dev/)) is a framework for building Web Components. **WSX is the recommended way to build Web Components for SlideJS** because it provides better TypeScript support, reactive state management, and cleaner syntax.

```typescript
/** @jsxImportSource @wsxjs/wsx-core */
import { LightComponent, autoRegister, state } from '@wsxjs/wsx-core';

@autoRegister({ tagName: 'my-quiz-question' })
export class MyQuizQuestion extends LightComponent {
  @state private selectedOption: number | null = null;

  static get observedAttributes() {
    return ['question', 'options'];
  }

  protected onAttributeChanged(name: string, _oldValue: string, newValue: string) {
    if (name === 'question' || name === 'options') {
      this.selectedOption = null;
    }
  }

  private getQuestion(): string {
    return this.getAttribute('question') || 'No question provided';
  }

  private getOptions(): string[] {
    const optionsAttr = this.getAttribute('options') || '[]';
    try {
      return JSON.parse(optionsAttr);
    } catch (e) {
      console.error('Failed to parse options:', e);
      return [];
    }
  }

  private handleOptionClick = (index: number, option: string) => {
    this.selectedOption = index;
    this.dispatchEvent(
      new CustomEvent('option-selected', {
        detail: { index, option },
        bubbles: true,
      })
    );
  };

  render() {
    const question = this.getQuestion();
    const options = this.getOptions();

    return (
      <div className="my-quiz-question">
        <h3 className="my-quiz-question-title">{question}</h3>
        <div className="my-quiz-question-options">
          {options.map((opt: string, i: number) => (
            <button
              key={i}
              className={`my-quiz-question-option ${this.selectedOption === i ? 'selected' : ''}`}
              onClick={() => this.handleOptionClick(i, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }
}
```

## Component Registration

Components must be registered before use. Import the component file before creating the runner:

```typescript
// Import component (registers it automatically)
import './components/my-quiz-question.wsx';

// Then create runner
const runner = await createSlideRunner(dslSource, context, config);
```

## Component Styling

### Inline Styles

Components can include their own styles:

```typescript
export class MyComponent extends LightComponent {
  constructor() {
    super({
      styles: `
        .my-component {
          padding: 2rem;
          background: #fff;
        }
      `,
      styleName: 'my-component',
    });
  }
}
```

### External CSS

Import CSS files for components:

```typescript
import './my-component.css';
```

### Theme Integration

Components can use theme CSS variables:

```css
.my-component {
  background: var(--slidejs-background-color);
  color: var(--slidejs-text-color);
  border-color: var(--slidejs-navigation-color);
}
```

## Component Events

### Dispatching Events

```typescript
this.dispatchEvent(
  new CustomEvent('option-selected', {
    detail: { index, option },
    bubbles: true,
  })
);
```

### Listening to Events

```typescript
// In your application code
document.addEventListener('option-selected', (e: CustomEvent) => {
  console.log('Option selected:', e.detail);
});
```

## Best Practices

1. **Use WSX to build Web Components** - [WSX](https://wsxjs.dev/) is the recommended framework for building Web Components for SlideJS (⭐)

2. **Use descriptive component names** - Use kebab-case (e.g., `my-quiz-question`)

3. **Validate attributes** - Always validate and provide defaults for attributes

4. **Handle errors gracefully** - Parse JSON safely and handle errors

5. **Use TypeScript** - Type your components for better development experience

6. **Style consistently** - Use theme variables for consistent styling

7. **Register before use** - Always import/register components before creating runners

### Why WSX?

[WSX](https://wsxjs.dev/) is recommended for building Web Components because:
- **Better TypeScript support** - Full type checking and IntelliSense
- **Reactive state** - Built-in state management with `@state` decorator
- **Cleaner syntax** - JSX-like syntax that's easier to read and maintain
- **Better performance** - Optimized rendering and updates
- **Web Components standard** - Creates standard Web Components that work everywhere

## Example: Complete Quiz Component

```typescript
/** @jsxImportSource @wsxjs/wsx-core */
import { LightComponent, autoRegister, state } from '@wsxjs/wsx-core';

@autoRegister({ tagName: 'quiz-question' })
export class QuizQuestion extends LightComponent {
  @state private selectedOption: number | null = null;
  @state private isCorrect: boolean | null = null;

  static get observedAttributes() {
    return ['question', 'options', 'correct-answer'];
  }

  private getQuestion(): string {
    return this.getAttribute('question') || '';
  }

  private getOptions(): string[] {
    try {
      return JSON.parse(this.getAttribute('options') || '[]');
    } catch {
      return [];
    }
  }

  private getCorrectAnswer(): number {
    return parseInt(this.getAttribute('correct-answer') || '0', 10);
  }

  private handleOptionClick = (index: number) => {
    if (this.selectedOption !== null) return; // Already answered

    this.selectedOption = index;
    this.isCorrect = index === this.getCorrectAnswer();

    this.dispatchEvent(
      new CustomEvent('quiz-answered', {
        detail: {
          question: this.getQuestion(),
          selected: index,
          correct: this.isCorrect,
        },
        bubbles: true,
      })
    );
  };

  render() {
    const question = this.getQuestion();
    const options = this.getOptions();
    const correctAnswer = this.getCorrectAnswer();

    return (
      <div className="quiz-question">
        <h3>{question}</h3>
        <div className="options">
          {options.map((opt: string, i: number) => {
            let className = 'option';
            if (this.selectedOption === i) {
              className += this.isCorrect ? ' correct' : ' incorrect';
            } else if (this.selectedOption !== null && i === correctAnswer) {
              className += ' correct-answer';
            }

            return (
              <button
                key={i}
                className={className}
                onClick={() => this.handleOptionClick(i)}
                disabled={this.selectedOption !== null}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {this.selectedOption !== null && (
          <div className={`feedback ${this.isCorrect ? 'correct' : 'incorrect'}`}>
            {this.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </div>
        )}
      </div>
    );
  }
}
```

## Related Documentation

- [DSL Guide](./dsl-guide.md) - DSL syntax reference
- [Getting Started](./getting-started.md) - Quick start guide
- [Runner Guide](./runner-guide.md) - Runner configuration
