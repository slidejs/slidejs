# RFC 0005: reveal.js 高级功能支持

## 元数据
- **RFC ID**: 0005
- **标题**: reveal.js 高级功能支持 - Fragments、Background、Notes 等
- **状态**: 草案
- **创建日期**: 2025-12-29
- **作者**: AI Assistant
- **相关 RFC**: RFC 0002 (Slide Runner)

## 摘要

本 RFC 定义了对 reveal.js 高级功能的支持，包括 Fragments（片段）、Background（背景）、Speaker Notes（演讲者备注）等功能。这些功能将显著增强幻灯片的表现力和实用性。

## 动机

### 当前限制

1. **缺乏 Fragments 支持**: 无法实现逐步显示内容的效果
2. **无背景配置**: 无法为幻灯片设置自定义背景（颜色、图片、视频等）
3. **无演讲者备注**: 无法添加演讲者视图专用的备注信息
4. **无嵌套幻灯片**: 不支持 reveal.js 的垂直嵌套（2D 布局）功能
5. **无代码高亮**: 无法自动高亮代码块

### 设计目标

1. **增强表现力**: 支持 reveal.js 的所有核心高级功能
2. **保持兼容性**: 向后兼容现有的 SlideDefinition 结构
3. **类型安全**: 完整的 TypeScript 类型定义
4. **易于使用**: 简洁的 DSL 语法和 API

## 详细设计

### 1. Fragments（片段）支持

Fragments 允许在单张幻灯片中逐步显示内容。

#### 1.1 SlideDefinition 扩展

```typescript
export interface SlideDefinition {
  // ... 现有字段
  
  /**
   * Fragments 配置（逐步显示）
   */
  fragments?: FragmentDefinition[];
}

export interface FragmentDefinition {
  /**
   * Fragment 索引（控制显示顺序）
   */
  index?: number;

  /**
   * Fragment 样式
   */
  style?: 'fade-in' | 'fade-out' | 'fade-up' | 'fade-down' | 
          'grow' | 'shrink' | 
          'highlight-red' | 'highlight-blue' | 'highlight-green';

  /**
   * 应用 fragment 的内容选择器或元素
   */
  selector?: string;
  
  /**
   * 或者直接指定内容元素
   */
  element?: HTMLElement;
}
```

#### 1.2 DSL 语法

```slide
slide {
  content text {
    "First line"  // 默认显示
    "Second line" // Fragment 1
    "Third line"  // Fragment 2
  }
  fragments {
    fragment {
      index: 1
      style: "fade-in"
      selector: "p:nth-child(2)"
    }
    fragment {
      index: 2
      style: "fade-up"
      selector: "p:nth-child(3)"
    }
  }
}
```

#### 1.3 RevealJsAdapter 实现

```typescript
private renderFragments(section: HTMLElement, fragments: FragmentDefinition[]): void {
  fragments.forEach((fragment, index) => {
    const element = fragment.element || 
                   section.querySelector(fragment.selector || '');
    
    if (element) {
      element.classList.add('fragment');
      if (fragment.style) {
        element.classList.add(`fragment-${fragment.style}`);
      }
    }
  });
}
```

### 2. Background（背景）支持

支持为幻灯片设置自定义背景。

#### 2.1 SlideDefinition 扩展

```typescript
export interface SlideDefinition {
  // ... 现有字段
  
  /**
   * 幻灯片背景配置
   */
  background?: SlideBackground;
}

export interface SlideBackground {
  /**
   * 背景类型
   */
  type: 'color' | 'image' | 'video' | 'iframe';

  /**
   * 背景值（颜色值、图片 URL、视频 URL 等）
   */
  value: string;

  /**
   * 背景大小（仅图片/视频）
   */
  size?: 'cover' | 'contain' | 'auto' | string;

  /**
   * 背景位置（仅图片/视频）
   */
  position?: string;

  /**
   * 背景重复（仅图片）
   */
  repeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';

  /**
   * 背景透明度（0-1）
   */
  opacity?: number;

  /**
   * 背景过渡效果
   */
  transition?: 'fade' | 'slide' | 'convex' | 'concave' | 'zoom' | 'none';
}
```

#### 2.2 DSL 语法

```slide
slide {
  background {
    type: "image"
    value: "https://example.com/bg.jpg"
    size: "cover"
    opacity: 0.8
  }
  content text {
    "Content with background"
  }
}
```

#### 2.3 RevealJsAdapter 实现

```typescript
private applyBackground(section: HTMLElement, background: SlideBackground): void {
  if (background.type === 'color') {
    section.setAttribute('data-background-color', background.value);
  } else if (background.type === 'image') {
    section.setAttribute('data-background-image', background.value);
    if (background.size) {
      section.setAttribute('data-background-size', background.size);
    }
    if (background.position) {
      section.setAttribute('data-background-position', background.position);
    }
    if (background.repeat) {
      section.setAttribute('data-background-repeat', background.repeat);
    }
    if (background.opacity !== undefined) {
      section.setAttribute('data-background-opacity', String(background.opacity));
    }
  } else if (background.type === 'video') {
    section.setAttribute('data-background-video', background.value);
    // ... 其他视频选项
  } else if (background.type === 'iframe') {
    section.setAttribute('data-background-iframe', background.value);
  }

  if (background.transition) {
    section.setAttribute('data-background-transition', background.transition);
  }
}
```

### 3. Speaker Notes（演讲者备注）支持

支持添加演讲者视图专用的备注。

#### 3.1 SlideDefinition 扩展

```typescript
export interface SlideDefinition {
  // ... 现有字段
  
  /**
   * 演讲者备注
   */
  notes?: string | string[];
}
```

#### 3.2 DSL 语法

```slide
slide {
  content text {
    "Slide content"
  }
  notes {
    "Speaker note 1"
    "Speaker note 2"
  }
}
```

#### 3.3 RevealJsAdapter 实现

```typescript
private renderNotes(section: HTMLElement, notes: string | string[]): void {
  const notesElement = document.createElement('aside');
  notesElement.className = 'notes';
  
  const notesArray = Array.isArray(notes) ? notes : [notes];
  notesArray.forEach(note => {
    const p = document.createElement('p');
    p.textContent = note;
    notesElement.appendChild(p);
  });
  
  section.appendChild(notesElement);
}
```

### 4. 嵌套幻灯片（2D 布局）支持

支持 reveal.js 的垂直嵌套功能。

#### 4.1 SlideDefinition 扩展

```typescript
export interface SlideDefinition {
  // ... 现有字段
  
  /**
   * 垂直嵌套的子幻灯片（2D 布局）
   */
  children?: SlideDefinition[];
}
```

#### 4.2 DSL 语法

```slide
slide {
  content text {
    "Main slide"
  }
  children {
    slide {
      content text {
        "Vertical slide 1"
      }
    }
    slide {
      content text {
        "Vertical slide 2"
      }
    }
  }
}
```

#### 4.3 RevealJsAdapter 实现

```typescript
private async renderSlideWithChildren(slide: SlideDefinition): Promise<HTMLElement> {
  const section = await this.renderSlide(slide);
  
  if (slide.children && slide.children.length > 0) {
    const verticalContainer = document.createElement('div');
    verticalContainer.className = 'slides';
    
    for (const child of slide.children) {
      const childSection = await this.renderSlide(child);
      verticalContainer.appendChild(childSection);
    }
    
    section.appendChild(verticalContainer);
  }
  
  return section;
}
```

### 5. 代码高亮支持

自动检测并高亮代码块。

#### 5.1 自动检测

```typescript
private async loadCodeHighlight(): Promise<void> {
  // 动态加载 highlight.js
  const hljs = await import('highlight.js');
  
  // 在渲染后自动高亮所有代码块
  this.reveal?.on('slidechanged', () => {
    const codeBlocks = this.container?.querySelectorAll('pre code');
    codeBlocks?.forEach((block) => {
      hljs.default.highlightElement(block as HTMLElement);
    });
  });
}
```

#### 5.2 DSL 语法

```slide
slide {
  content text {
    "```javascript"
    "const x = 1;"
    "```"
  }
}
```

## 实施计划

### Phase 1: Fragments 支持
- [ ] 扩展 SlideDefinition 类型
- [ ] 更新 DSL 语法解析器
- [ ] 实现 RevealJsAdapter 的 fragments 渲染
- [ ] 编写测试和文档

### Phase 2: Background 支持
- [ ] 扩展 SlideDefinition 类型
- [ ] 更新 DSL 语法解析器
- [ ] 实现 RevealJsAdapter 的 background 渲染
- [ ] 支持所有背景类型（color, image, video, iframe）
- [ ] 编写测试和文档

### Phase 3: Speaker Notes 支持
- [ ] 扩展 SlideDefinition 类型
- [ ] 更新 DSL 语法解析器
- [ ] 实现 RevealJsAdapter 的 notes 渲染
- [ ] 编写测试和文档

### Phase 4: 嵌套幻灯片支持
- [ ] 扩展 SlideDefinition 类型
- [ ] 更新 DSL 语法解析器
- [ ] 实现 RevealJsAdapter 的嵌套渲染
- [ ] 编写测试和文档

### Phase 5: 代码高亮支持
- [ ] 集成 highlight.js 或 Prism.js
- [ ] 实现自动检测和高亮
- [ ] 编写测试和文档

## 风险评估

### 技术风险

1. **reveal.js 版本兼容性**: 
   - 风险等级: 低
   - 缓解: 锁定 reveal.js 版本，提供升级指南

2. **性能影响**:
   - 风险等级: 低
   - 缓解: 懒加载代码高亮库，仅在需要时加载

3. **DSL 语法复杂性**:
   - 风险等级: 中
   - 缓解: 所有新功能都是可选的，保持向后兼容

## 替代方案

### 方案 A: 不实现这些功能
- **优点**: 保持简单
- **缺点**: 功能受限，无法充分利用 reveal.js 的能力

### 方案 B: 仅支持部分功能
- **优点**: 降低复杂度
- **缺点**: 功能不完整

**选择**: 我们选择实现所有核心高级功能（本 RFC），因为：
1. 这些是 reveal.js 的核心功能
2. 向后兼容，不影响现有代码
3. 显著增强表现力

## 参考资料

- [reveal.js Fragments](https://revealjs.com/fragments/)
- [reveal.js Backgrounds](https://revealjs.com/backgrounds/)
- [reveal.js Speaker Notes](https://revealjs.com/speaker-view/)
- [reveal.js Nested Slides](https://revealjs.com/vertical-slides/)
- RFC 0002: Slide Runner

## 变更历史

- 2025-12-29: 初始草稿

