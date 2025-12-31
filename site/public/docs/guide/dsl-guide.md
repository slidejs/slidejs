# Slide DSL 完整指南

> 本指南将帮助您理解和使用 SlideJS 的 Slide DSL（领域特定语言），包括语法、规则引擎和 API 使用方法。

## 目录

- [简介](#简介)
- [安装](#安装)
- [基本概念](#基本概念)
- [语法参考](#语法参考)
- [规则引擎](#规则引擎)
- [内容类型](#内容类型)
- [完整示例](#完整示例)
- [API 参考](#api-参考)
- [最佳实践](#最佳实践)

## 什么是 Slide DSL？

Slide DSL 是一个声明式的领域特定语言，用于从任意数据源（Quiz、Survey、Form 等）生成幻灯片演示。它提供：

- **声明式语法**：使用简洁的 DSL 语法定义幻灯片结构
- **数据源无关**：通过 Context Adapter 支持任意数据源
- **规则引擎**：支持 start、content、end 规则和嵌套循环
- **类型安全**：完整的 TypeScript 类型定义
- **高性能**：基于编译时优化的 DSL 解析和生成

## 开始之前

### 安装

```bash
npm install @slidejs/dsl @slidejs/core @slidejs/context
```

### 导入

```typescript
import { parseSlideDSL, compile } from '@slidejs/dsl';
import { SlideEngine } from '@slidejs/core';
import type { SlideContext } from '@slidejs/context';
```

## 基本概念

### Presentation（演示）

每个 Slide DSL 文档都以 `present` 关键字开始，定义数据源类型和名称：

```slide
present quiz "my-quiz" {
  rules {
    // 规则定义
  }
}
```

支持的数据源类型：

- `quiz` - 测验数据
- `survey` - 调查数据
- `form` - 表单数据
- `assessment` - 评估数据

### Rules（规则）

规则定义了如何从数据源生成幻灯片：

- **start 规则**：在内容前执行的规则，通常用于标题页
- **content 规则**：从数据动态生成幻灯片的规则
- **end 规则**：在内容后执行的规则，通常用于结束页

### Context（上下文）

Context 是数据源转换后的统一接口，通过 Context Adapter 将任意数据源转换为 SlideContext。

## 语法参考

### Presentation 语法

```
present <type> "<name>" {
  rules {
    // 规则定义
  }
}
```

示例：

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

### Rule 语法

#### Start Rule

```
rule start "<name>" {
  slide {
    // slide 定义
  }
}
```

#### Content Rule

```
rule content "<name>" {
  // 可以是 for 循环或 slide 列表
  for item in collection {
    slide {
      // slide 定义
    }
  }
}
```

#### End Rule

```
rule end "<name>" {
  slide {
    // slide 定义
  }
}
```

### Slide 语法

```
slide {
  content <type> {
    // 内容定义
  }
  behavior {
    // 行为配置（可选）
  }
}
```

### Content 类型

#### 静态文本内容

```
content text {
  "第一行文本"
  "第二行文本"
}
```

#### 动态组件内容

```
content dynamic {
  name: "component-name"
  attrs {
    key: value
    title: "标题"
  }
}
```

### For 循环

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

嵌套循环：

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

### Behavior（行为配置）

```
behavior {
  transition zoom {
    speed: 500
  }
  background {
    color: "#ffffff"
  }
}
```

支持的过渡类型：

- `slide` - 滑动
- `zoom` - 缩放
- `fade` - 淡入淡出
- `cube` - 立方体
- `flip` - 翻转
- `none` - 无过渡

## 完整示例

### 示例 1：简单的 Quiz 演示

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

### 示例 2：带嵌套循环的复杂演示

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

## API 参考

### 解析 DSL

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

### 编译 DSL

```typescript
import { compile } from '@slidejs/dsl';

const ast = await parseSlideDSL(source);
const slideDSL = compile(ast);
```

### 生成幻灯片

```typescript
import { SlideEngine } from '@slidejs/core';
import { quizToSlideContext } from '@slidejs/dsl';

// 创建 Context
const context = quizToSlideContext(quizData);

// 创建引擎
const engine = new SlideEngine(slideDSL);

// 生成幻灯片
const slides = engine.generate(context);
```

### 使用 Runner

```typescript
import { createRunner } from '@slidejs/runner-revealjs';

const runner = createRunner({
  container: document.getElementById('slides')!,
  dsl: slideDSL,
  context: context,
});

await runner.init();
```

## 最佳实践

### 1. 规则命名

使用有意义的规则名称，便于调试和维护：

```slide
rule start "intro-slide" { ... }
rule content "question-slides" { ... }
rule end "thank-you-slide" { ... }
```

### 2. 内容组织

将相关的内容组织在一起，使用嵌套循环处理层次结构：

```slide
for section in quiz.sections {
  // 章节标题
  slide { ... }

  // 章节内容
  for question in section.questions {
    slide { ... }
  }
}
```

### 3. 过渡效果

合理使用过渡效果，避免过度使用：

```slide
behavior {
  transition slide {
    speed: "default"
  }
}
```

### 4. 组件复用

使用动态组件实现内容复用：

```slide
content dynamic {
  name: "reusable-component"
  attrs {
    data: item
  }
}
```

## 相关资源

- [GitHub 仓库](https://github.com/slidejs/slidejs)
- [npm 包](https://www.npmjs.com/package/@slidejs/dsl)
