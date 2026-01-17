# SlideJS Runner Comparison Demo (React)

This is a React demo project that showcases 3 different SlideJS Runners side by side, with a DSL editor.

## Language

- [English](README.md)
- [中文](README.zh.md)

## Related Demos

- [Vue.js Demo](../vue/README.md)
- [React Demo](README.md) (Current)

## Features

- **3-Column Runner Display**: Showcases Reveal.js, Swiper, and Splide runners simultaneously
- **Monaco Editor**: Real-time Slide DSL editing with syntax highlighting
- **Adjustable Splitter**: Drag to resize player and editor areas
- **Theme Switching**: Support for Solarized Dark / Light themes
- **Real-time Sync**: All 3 runners update automatically when editing DSL
- **Web Components Support**: Support for custom Web Components and WSX components

## Layout Structure

```
┌─────────────────────────────────────────┐
│  Theme Toolbar                          │
├──────────┬──────────┬───────────────────┤
│          │          │                   │
│ Reveal.js│  Swiper  │      Splide       │
│          │          │                   │
│          │          │                   │
├──────────┴──────────┴───────────────────┤
│  ←→ Horizontal Splitter (draggable)      │
├─────────────────────────────────────────┤
│                                          │
│         DSL Editor (Monaco)              │
│                                          │
└─────────────────────────────────────────┘
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (port 3005)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
react/
├── src/
│   ├── components/
│   │   ├── my-quiz-question.wsx   # Web Component example
│   │   └── my-quiz-question.css
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry file
│   ├── demo.slide                 # Slide DSL source file
│   └── style.css                  # Global styles
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type support
- **Vite** - Build tool
- **Monaco Editor** - Code editor (VS Code editor core)
- **@slidejs/editor** - Slide DSL editor support
- **@slidejs/runner-revealjs** - Reveal.js Runner
- **@slidejs/runner-swiper** - Swiper Runner
- **@slidejs/runner-splide** - Splide Runner
- **@slidejs/theme** - Theme system

## Usage

1. **Start Development Server**: Run `pnpm dev`, browser will automatically open `http://localhost:3005`

2. **Edit DSL**:
   - Edit Slide DSL in the DSL Editor at the bottom
   - All runners will automatically update after 500ms delay

3. **Adjust Layout**:
   - Drag the horizontal splitter to adjust the height of player and editor areas

4. **Switch Theme**:
   - Click theme buttons in the top toolbar to switch themes
   - Theme affects all runners' styles

5. **Compare Runners**:
   - All 3 runners use the same DSL source file
   - View rendering effects of different runners side by side
   - Support keyboard navigation (each runner is independent)

## Notes

- Monaco Editor is a large library, initial load may take some time
- Each runner manages its own lifecycle independently
- When DSL syntax errors occur, all runners will display error messages
- There is a 500ms debounce delay when editing DSL to avoid frequent updates
- Uses React Hooks (useState, useEffect, useRef) for state and lifecycle management

## References

This demo references the implementation of `demos/vue`, including:

- Monaco editor integration
- Adjustable splitter implementation
- Layout structure and style design
