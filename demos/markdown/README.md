# Markdown to DSL Converter Demo

This demo application showcases the Markdown to Slide DSL conversion feature.

## Layout

```
┌─────────────────────────────────────────────────────────┐
│  Theme Toolbar                                          │
├──────────────┬──────────────────────────────────────────┤
│              │  ┌────────────────────────────────────┐  │
│  Markdown     │  │  Slide Preview (Reveal.js)        │  │
│  Editor       │  └────────────────────────────────────┘  │
│  (Monaco)     │  ┌────────────────────────────────────┐  │
│              │  │  Generated DSL (Monaco)            │  │
│              │  └────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────┘
```

- **Left Panel**: Markdown editor (Monaco Editor with Markdown syntax highlighting)
- **Right Top Panel**: Slide preview (Reveal.js Runner)
- **Right Bottom Panel**: Generated DSL (Monaco Editor, read-only)

## Features

- Real-time conversion: Automatically converts Markdown to DSL as you type
- Resizable panels: Drag the vertical and horizontal splitters to adjust panel sizes
- Theme switching: Toggle between dark and light themes
- Live preview: See your slides rendered in real-time

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
demos/markdown/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── style.css
│   ├── presentation.md          # Example Markdown file
│   └── env.d.ts
└── README.md
```

## Implementation Status

⚠️ **Note**: This demo currently uses a mock conversion function. The actual Markdown to DSL conversion will be implemented in the `@slidejs/markdown` package (see RFC 0013).

Once the `@slidejs/markdown` package is implemented, this demo will:
- Use `markdownToSlideDSL()` to convert Markdown to DSL
- Use `createMarkdownRunner()` to create slide runners
- Support all Markdown features (Frontmatter, code highlighting, LaTeX, Mermaid, etc.)

## Related Demos

- [Vue Demo](../vue/README.md) - Full-featured Vue.js demo with all runners
- [React Demo](../react/README.md) - React.js demo
- [Vanilla Demo](../vanilla/README.md) - Vanilla TypeScript demo

## Language

[中文](./README.zh.md)
