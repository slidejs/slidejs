---
title: Interactive Quiz Example
order: 2
category: examples
description: 'An interactive quiz example using dynamic components and data loops'
---

# Interactive Quiz Example

This example demonstrates how to create an interactive quiz with dynamic components and data loops.

## Overview

This example creates an interactive quiz with:
- Dynamic question slides
- Custom Web Component (built with [WSX](https://wsxjs.dev/) - recommended)
- Data-driven content
- Event handling

## Component

First, create a Web Component using **[WSX](https://wsxjs.dev/)** (recommended framework for building Web Components) `my-quiz-question.wsx`:

```typescript
/** @jsxImportSource @wsxjs/wsx-core */
import { LightComponent, autoRegister, state } from '@wsxjs/wsx-core';

@autoRegister({ tagName: 'my-quiz-question' })
export class MyQuizQuestion extends LightComponent {
  @state private selectedOption: number | null = null;

  static get observedAttributes() {
    return ['question', 'options', 'correct-answer'];
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

  private getCorrectAnswer(): number {
    return parseInt(this.getAttribute('correct-answer') || '0', 10);
  }

  private handleOptionClick = (index: number) => {
    if (this.selectedOption !== null) return; // Already answered

    this.selectedOption = index;
    const isCorrect = index === this.getCorrectAnswer();

    this.dispatchEvent(
      new CustomEvent('quiz-answered', {
        detail: {
          question: this.getQuestion(),
          selected: index,
          correct: isCorrect,
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
              className += this.selectedOption === correctAnswer ? ' correct' : ' incorrect';
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
          <div className={`feedback ${this.selectedOption === correctAnswer ? 'correct' : 'incorrect'}`}>
            {this.selectedOption === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </div>
        )}
      </div>
    );
  }
}
```

## DSL Source

Create `quiz.slide`:

```slide
present quiz "math-quiz" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Math Quiz"
          "## Test Your Knowledge"
          ""
          "Answer the following questions"
        }
        behavior {
          transition fade {}
        }
      }
    }

    rule content "questions" {
      for question in quiz.questions {
        slide {
          content dynamic {
            name: "my-quiz-question"
            attrs {
              question: question.text
              options: question.options
              correct-answer: question.correctAnswer
            }
          }
          behavior {
            transition slide {}
          }
        }
      }
    }

    rule end "results" {
      slide {
        content text {
          "# Quiz Complete!"
          ""
          "## Check your answers above"
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
import dslSource from './quiz.slide?raw';

// Import component (must be before runner creation)
import './components/my-quiz-question.wsx';

// Quiz data
const quizData = {
  questions: [
    {
      text: 'What is 2 + 2?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
    },
    {
      text: 'What is 5 × 3?',
      options: ['10', '15', '20', '25'],
      correctAnswer: 1,
    },
    {
      text: 'What is 10 ÷ 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
    },
  ],
};

// Create context
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'math-quiz',
  metadata: {
    title: 'Math Quiz',
  },
  items: quizData.questions.map((q, i) => ({
    id: `question-${i}`,
    data: q,
  })),
};

// Listen to quiz events
document.addEventListener('quiz-answered', (e: CustomEvent) => {
  console.log('Quiz answered:', e.detail);
  // Track score, show results, etc.
});

// Create and run quiz
async function initQuiz() {
  const runner = await createSlideRunner(dslSource, context, {
    container: '#quiz-container',
    revealOptions: {
      controls: true,
      progress: true,
      center: true,
    },
  });

  runner.play();
}

initQuiz();
```

## Styling

Add CSS for the quiz component:

```css
.quiz-question {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem;
}

.quiz-question h3 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
}

.option {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.option:hover:not(:disabled) {
  border-color: #4a90e2;
  background: #f0f7ff;
}

.option.correct {
  border-color: #4caf50;
  background: #4caf50;
  color: #fff;
}

.option.incorrect {
  border-color: #f44336;
  background: #f44336;
  color: #fff;
}

.option.correct-answer {
  border-color: #4caf50;
  background: #e8f5e9;
}

.option:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.feedback {
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.feedback.correct {
  color: #4caf50;
}

.feedback.incorrect {
  color: #f44336;
}
```

## Complete Example

See the [Vue Demo](https://github.com/slidejs/slidejs/tree/main/demos/vue) for a complete working example with quiz components.

## Next Steps

- [Basic Presentation Example](./basic-presentation.md) - Simple presentation
- [Multi-Runner Example](./multi-runner.md) - Compare different runners
- [Custom Theme Example](./custom-theme.md) - Customize appearance
