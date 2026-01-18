---
title: Theme Guide
order: 5
category: guide
description: 'Complete guide to customizing SlideJS themes using the CSS Hook API'
---

# Theme Guide

SlideJS provides a unified theme system that works across all runners. This guide shows you how to customize themes using the CSS Hook API.

## Overview

The theme system uses standard CSS variables that are automatically mapped by each runner. You don't need to know runner-specific variable names - just use the standard variables.

## Quick Start

### Using Preset Themes

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// Set global theme
setTheme(Preset.SolarizedDark);
// or
setTheme(Preset.SolarizedLight);
```

### Custom Theme

```typescript
import { setTheme } from '@slidejs/theme';

setTheme({
  navigationColor: '#4a90e2',
  paginationColor: '#4a90e2',
  backgroundColor: '#1e1e1e',
  textColor: '#ffffff',
});
```

## Standard Theme Variables

The theme system provides these standard variables:

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

## Preset Themes

### Solarized Dark

```typescript
import { setTheme, Preset } from '@slidejs/theme';

setTheme(Preset.SolarizedDark);
```

### Solarized Light

```typescript
import { setTheme, Preset } from '@slidejs/theme';

setTheme(Preset.SolarizedLight);
```

## Custom Themes

### Complete Theme

```typescript
import { setTheme } from '@slidejs/theme';

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

### Partial Theme

You can set only the variables you want to change:

```typescript
setTheme({
  navigationColor: '#ff0000',
  paginationColor: '#00ff00',
  // Other variables keep their default values
});
```

## Scoped Themes

You can apply themes to specific containers:

```typescript
import { useTheme, Preset } from '@slidejs/theme';

// Create scoped theme hook
const theme = useTheme('#my-slides-container');

// Set theme for this scope
theme.set(Preset.SolarizedDark);

// Or custom theme
theme.set({
  navigationColor: '#ff0000',
  backgroundColor: '#000000',
});
```

### Multiple Containers

```typescript
const theme1 = useTheme('#slides-1');
const theme2 = useTheme('#slides-2');

theme1.set(Preset.SolarizedDark);
theme2.set(Preset.SolarizedLight);
```

## Runtime Theme Switching

You can switch themes at runtime:

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// Initial theme
setTheme(Preset.SolarizedDark);

// Switch theme on button click
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const currentTheme = document.documentElement.style.getPropertyValue('--slidejs-background-color');
  
  if (currentTheme === '#002b36') { // Solarized Dark background
    setTheme(Preset.SolarizedLight);
  } else {
    setTheme(Preset.SolarizedDark);
  }
});
```

## Theme Hook API

### Global Theme Hook

```typescript
import { globalTheme } from '@slidejs/theme';

// Set theme
globalTheme.set(Preset.SolarizedDark);

// Get current theme
const currentTheme = globalTheme.get();

// Reset to default
globalTheme.reset();
```

### Scoped Theme Hook

```typescript
import { useTheme } from '@slidejs/theme';

const theme = useTheme('#my-container');

// Set theme
theme.set({ navigationColor: '#ff0000' });

// Get current theme
const currentTheme = theme.get();

// Reset to default
theme.reset();
```

## Integration with Frameworks

### React

```typescript
import { useEffect, useState } from 'react';
import { setTheme, Preset } from '@slidejs/theme';

function ThemeSwitcher() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setTheme(theme === 'dark' ? Preset.SolarizedDark : Preset.SolarizedLight);
  }, [theme]);

  return (
    <button onClick={() => setThemeState(theme === 'dark' ? 'light' : 'dark')}>
      Switch Theme
    </button>
  );
}
```

### Vue

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
    Switch Theme
  </button>
</template>
```

## Best Practices

1. **Set theme before creating runners** - Apply theme before initializing runners for consistent styling

2. **Use preset themes when possible** - Preset themes are well-tested and consistent

3. **Use scoped themes for multiple presentations** - If you have multiple presentations on the same page, use scoped themes

4. **Provide theme switching UI** - Allow users to switch themes if appropriate

5. **Test with all runners** - Make sure your theme works well with all runners you're using

## Related Documentation

- [Theme API Reference](../api/theme.md) - Complete API reference
- [Getting Started](./getting-started.md) - Quick start guide
