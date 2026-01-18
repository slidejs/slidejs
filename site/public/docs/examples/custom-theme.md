---
title: Custom Theme Example
order: 4
category: examples
description: 'Customize SlideJS appearance using the theme system'
---

# Custom Theme Example

This example demonstrates how to create and apply custom themes using SlideJS theme system.

## Overview

This example shows:
- Using preset themes
- Creating custom themes
- Scoped themes for multiple containers
- Runtime theme switching

## Preset Themes

### Using Preset Themes

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// Set global theme
setTheme(Preset.SolarizedDark);
// or
setTheme(Preset.SolarizedLight);
```

## Custom Theme

### Basic Custom Theme

```typescript
import { setTheme } from '@slidejs/theme';

// Custom dark theme
setTheme({
  navigationColor: '#4a90e2',
  paginationColor: '#4a90e2',
  paginationActiveColor: '#2a70c2',
  scrollbarBg: '#2a2a2a',
  scrollbarDragBg: '#4a4a4a',
  arrowColor: '#4a90e2',
  progressBarColor: '#4a90e2',
  backgroundColor: '#1e1e1e',
  textColor: '#ffffff',
  linkColor: '#4a90e2',
  headingColor: '#ffffff',
  codeBackground: '#2a2a2a',
});
```

### Complete Example with Theme Switching

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import { setTheme, Preset } from '@slidejs/theme';
import type { SlideContext } from '@slidejs/context';
import dslSource from './presentation.slide?raw';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'themed-presentation',
  metadata: { title: 'Themed Presentation' },
  items: [],
};

// Theme definitions
const themes = {
  dark: {
    navigationColor: '#4a90e2',
    paginationColor: '#4a90e2',
    backgroundColor: '#1e1e1e',
    textColor: '#ffffff',
    linkColor: '#4a90e2',
    headingColor: '#ffffff',
  },
  light: {
    navigationColor: '#0066cc',
    paginationColor: '#0066cc',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    linkColor: '#0066cc',
    headingColor: '#000000',
  },
  colorful: {
    navigationColor: '#ff6b6b',
    paginationColor: '#4ecdc4',
    backgroundColor: '#f7f7f7',
    textColor: '#2c3e50',
    linkColor: '#ff6b6b',
    headingColor: '#2c3e50',
  },
};

let currentTheme: keyof typeof themes = 'dark';
let runner: any;

// Initialize presentation
async function initPresentation() {
  // Set initial theme
  setTheme(themes[currentTheme]);

  // Create runner
  runner = await createSlideRunner(dslSource, context, {
    container: '#slides',
    revealOptions: {
      controls: true,
      progress: true,
    },
  });

  runner.play();
}

// Theme switcher
function switchTheme(themeName: keyof typeof themes) {
  currentTheme = themeName;
  setTheme(themes[themeName]);
  console.log(`Theme switched to: ${themeName}`);
}

// Initialize
initPresentation();

// Expose theme switcher (for UI buttons)
(window as any).switchTheme = switchTheme;
```

## HTML with Theme Switcher

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Theme Example</title>
  <style>
    .theme-toolbar {
      padding: 1rem;
      background: #252526;
      border-bottom: 1px solid #3c3c3c;
      display: flex;
      gap: 0.5rem;
    }
    .theme-btn {
      padding: 0.5rem 1rem;
      background: #3c3c3c;
      border: 1px solid #4a4a4a;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
    }
    .theme-btn:hover {
      background: #4a4a4a;
    }
    .theme-btn.active {
      background: #4a90e2;
      border-color: #4a90e2;
    }
    #slides {
      height: calc(100vh - 60px);
    }
  </style>
</head>
<body>
  <div class="theme-toolbar">
    <span>Theme:</span>
    <button class="theme-btn active" onclick="switchTheme('dark')">Dark</button>
    <button class="theme-btn" onclick="switchTheme('light')">Light</button>
    <button class="theme-btn" onclick="switchTheme('colorful')">Colorful</button>
  </div>
  <div id="slides"></div>
  <script type="module" src="./main.ts"></script>
</body>
</html>
```

## Scoped Themes

### Multiple Containers with Different Themes

```typescript
import { useTheme, Preset } from '@slidejs/theme';

// Create scoped theme hooks
const theme1 = useTheme('#slides-1');
const theme2 = useTheme('#slides-2');
const theme3 = useTheme('#slides-3');

// Apply different themes
theme1.set(Preset.SolarizedDark);
theme2.set(Preset.SolarizedLight);
theme3.set({
  navigationColor: '#ff0000',
  backgroundColor: '#000000',
  textColor: '#ffffff',
});
```

## React Integration

```typescript
import { useEffect, useState } from 'react';
import { setTheme, Preset } from '@slidejs/theme';

function ThemeSwitcher() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setTheme(theme === 'dark' ? Preset.SolarizedDark : Preset.SolarizedLight);
  }, [theme]);

  return (
    <div>
      <button onClick={() => setThemeState(theme === 'dark' ? 'light' : 'dark')}>
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
      </button>
    </div>
  );
}
```

## Vue Integration

```vue
<script setup>
import { ref, watch } from 'vue';
import { setTheme, Preset } from '@slidejs/theme';

const theme = ref<'dark' | 'light'>('dark');

watch(theme, (newTheme) => {
  setTheme(newTheme === 'dark' ? Preset.SolarizedDark : Preset.SolarizedLight);
});
</script>

<template>
  <button @click="theme = theme === 'dark' ? 'light' : 'dark'">
    Switch to {{ theme === 'dark' ? 'Light' : 'Dark' }} Theme
  </button>
</template>
```

## Complete Example

See the [Vue Demo](https://github.com/slidejs/slidejs/tree/main/demos/vue) or [React Demo](https://github.com/slidejs/slidejs/tree/main/demos/react) for complete working examples with theme switching.

## Next Steps

- [Basic Presentation Example](./basic-presentation.md) - Simple presentation
- [Interactive Quiz Example](./interactive-quiz.md) - Add interactive components
- [Multi-Runner Example](./multi-runner.md) - Compare different runners
- [Theme Guide](../guide/theme-guide.md) - Complete theme system guide
