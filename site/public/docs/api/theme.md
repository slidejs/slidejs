---
title: @slidejs/theme API Reference
order: 4
category: api
description: 'Complete API reference for @slidejs/theme package - Theme system API'
---

# @slidejs/theme API Reference

The `@slidejs/theme` package provides a unified CSS Hook API for runtime theme customization.

## Design Principles

- **High-level API only**: Uses standard variable names (e.g., `navigationColor`), not runner-specific variables
- **Automatic mapping**: Each runner automatically maps standard variables to its specific variables
- **Low-level API at your own risk**: If you need runner-specific variables, use DOM API directly

## Exports

### Functions

#### `setTheme(theme: StandardTheme | PresetThemeName, scope?: HTMLElement | string): void`

Sets the theme globally or for a specific scope.

**Parameters:**
- `theme: StandardTheme | PresetThemeName` - Theme object or preset name
- `scope?: HTMLElement | string` - Optional scope (element or selector)

**Example:**

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// Use preset theme
setTheme(Preset.SolarizedDark);
setTheme(Preset.SolarizedLight);

// Custom theme
setTheme({
  navigationColor: '#ff0000',
  paginationColor: '#00ff00',
  backgroundColor: '#ffffff',
  textColor: '#000000',
});

// Scoped theme
setTheme(Preset.SolarizedDark, '#my-slides-container');
```

#### `useTheme(scope: HTMLElement | string): SlideThemeHook`

Creates a scoped theme hook for a specific container.

**Parameters:**
- `scope: HTMLElement | string` - Container element or selector

**Returns:**
- `SlideThemeHook` - Theme hook instance

**Example:**

```typescript
import { useTheme, Preset } from '@slidejs/theme';

const theme = useTheme('#my-slides');
theme.set(Preset.SolarizedDark);
theme.set({
  navigationColor: '#ff0000',
});
```

### Classes

#### `SlideThemeHook`

Theme hook class for scoped theme management.

**Methods:**

##### `set(theme: StandardTheme | PresetThemeName): void`

Sets the theme for this scope.

**Parameters:**
- `theme: StandardTheme | PresetThemeName` - Theme object or preset name

##### `get(): StandardTheme | null`

Gets the current theme for this scope.

**Returns:**
- `StandardTheme | null` - Current theme or null

##### `reset(): void`

Resets the theme to default.

### Constants

#### `Preset`

Preset theme names.

```typescript
enum Preset {
  SolarizedDark = 'solarized-dark',
  SolarizedLight = 'solarized-light',
}
```

#### `globalTheme`

Global theme hook instance.

```typescript
const globalTheme: SlideThemeHook;
```

### Types

#### `StandardTheme`

Standard theme interface.

```typescript
interface StandardTheme {
  navigationColor?: string;
  paginationColor?: string;
  paginationActiveColor?: string;
  scrollbarBg?: string;
  scrollbarDragBg?: string;
  arrowColor?: string;
  progressBarColor?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  headingColor?: string;
  codeBackground?: string;
}
```

**Properties:**
- `navigationColor?: string` - Navigation button color
- `paginationColor?: string` - Pagination dot color
- `paginationActiveColor?: string` - Active pagination dot color
- `scrollbarBg?: string` - Scrollbar background color
- `scrollbarDragBg?: string` - Scrollbar drag handle color
- `arrowColor?: string` - Arrow button color
- `progressBarColor?: string` - Progress bar color
- `backgroundColor?: string` - Background color
- `textColor?: string` - Text color
- `linkColor?: string` - Link color
- `headingColor?: string` - Heading color
- `codeBackground?: string` - Code block background color

#### `PresetThemeName`

Preset theme name type.

```typescript
type PresetThemeName = 'solarized-dark' | 'solarized-light';
```

## Usage Examples

### Using Preset Themes

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// Set global theme
setTheme(Preset.SolarizedDark);

// Switch theme
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
  linkColor: '#4a90e2',
  headingColor: '#ffffff',
});
```

### Scoped Theme

```typescript
import { useTheme, Preset } from '@slidejs/theme';

// Create scoped theme hook
const theme = useTheme('#my-slides-container');

// Set theme for this scope
theme.set(Preset.SolarizedDark);

// Custom theme for this scope
theme.set({
  navigationColor: '#ff0000',
  backgroundColor: '#000000',
});

// Get current theme
const currentTheme = theme.get();

// Reset to default
theme.reset();
```

### Multiple Containers

```typescript
import { useTheme, Preset } from '@slidejs/theme';

const theme1 = useTheme('#slides-1');
const theme2 = useTheme('#slides-2');

theme1.set(Preset.SolarizedDark);
theme2.set(Preset.SolarizedLight);
```

## Standard CSS Variables

The theme system uses standard CSS variables that are automatically mapped by each runner:

- `--slidejs-navigation-color`
- `--slidejs-pagination-color`
- `--slidejs-pagination-active-color`
- `--slidejs-scrollbar-bg`
- `--slidejs-scrollbar-drag-bg`
- `--slidejs-arrow-color`
- `--slidejs-progress-bar-color`
- `--slidejs-background-color`
- `--slidejs-text-color`
- `--slidejs-link-color`
- `--slidejs-heading-color`
- `--slidejs-code-background`

Each runner maps these to its specific variables (e.g., `--slidejs-swiper-navigation-color`).

## Related Documentation

- [Theme Guide](../guide/theme-guide.md) - Complete theme system guide
- [Getting Started](../guide/getting-started.md) - Quick start guide
