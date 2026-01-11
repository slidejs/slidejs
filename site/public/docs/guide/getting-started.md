---
title: 快速开始
order: 1
category: guide
description: "5 分钟快速上手 SlideJS，学习如何创建第一个 Slide DSL 文件和运行幻灯片演示"
---

# 快速开始

本指南将帮助您在 5 分钟内开始使用 SlideJS。

## 步骤 1: 安装

根据您的项目需求，选择安装相应的包：

```bash
# 核心包（必需）
npm install @slidejs/core @slidejs/dsl @slidejs/context

# 运行器（选择一个或多个）
npm install @slidejs/runner-revealjs    # reveal.js 运行器
npm install @slidejs/runner-swiper       # Swiper 运行器
npm install @slidejs/runner-splide      # Splide 运行器

# 主题系统（可选）
npm install @slidejs/theme
```

## 步骤 2: 创建第一个 Slide DSL 文件

创建一个 `.slide` 文件，例如 `presentation.slide`：

```slide
present quiz "my-first-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# 我的第一个幻灯片"
          "## 使用 SlideJS 创建"
        }
        behavior {
          transition fade {}
        }
      }
    }

    rule content "main-content" {
      slide {
        content text {
          "# 特性"
          ""
          "- 声明式 DSL 语法"
          "- 支持多种渲染引擎"
          "- 类型安全"
        }
        behavior {
          transition slide {}
        }
      }
    }

    rule end "thanks" {
      slide {
        content text {
          "# 谢谢！"
        }
        behavior {
          transition zoom {}
        }
      }
    }
  }
}
```

## 步骤 3: 在代码中使用

### 基础用法

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';

// 导入 DSL 源代码（使用 Vite 的 ?raw 导入）
import dslSource from './presentation.slide?raw';

// 或者直接定义
const dslSource = `
present quiz "my-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# 欢迎使用 SlideJS"
        }
      }
    }
  }
}
`;

// 创建上下文数据
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-presentation',
  metadata: {
    title: '我的演示',
  },
  items: [],
};

// 创建并运行幻灯片
const runner = await createSlideRunner(dslSource, context, {
  container: '#slides-container',
  revealOptions: {
    controls: true,
    progress: true,
  },
});

// 开始播放
runner.play();
```

### 使用主题系统

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// 使用预设主题
setTheme(Preset.SolarizedDark);
// 或
setTheme(Preset.SolarizedLight);

// 自定义主题
setTheme({
  navigationColor: '#ff0000',
  paginationColor: '#00ff00',
  backgroundColor: '#ffffff',
  textColor: '#000000',
});
```

### 使用动态组件

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

## 步骤 4: 选择运行器

### Reveal.js 运行器

适合：演示文稿、教学课件

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  revealOptions: {
    controls: true,
    progress: true,
    hash: true,
  },
});
```

### Swiper 运行器

适合：移动端、触摸交互

```typescript
import { createSlideRunner } from '@slidejs/runner-swiper';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  swiperOptions: {
    direction: 'horizontal',
    loop: false,
    navigation: true,
    pagination: true,
  },
});
```

### Splide 运行器

适合：轻量级、简单场景

```typescript
import { createSlideRunner } from '@slidejs/runner-splide';

const runner = await createSlideRunner(dslSource, context, {
  container: '#slides',
  splideOptions: {
    type: 'slide',
    perPage: 1,
    pagination: true,
    arrows: true,
  },
});
```

## 下一步

- [安装指南](./installation.md) - 详细的安装说明
- [DSL 完整指南](./dsl-guide.md) - 深入了解 Slide DSL 语法和功能
- [主题系统](../guide/theme.md) - 了解如何自定义主题
- [示例项目](https://github.com/slidejs/slidejs/tree/main/demos) - 查看完整示例
