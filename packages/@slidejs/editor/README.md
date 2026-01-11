# @slidejs/editor

Slide DSL Monaco Editor with syntax highlighting support.

## 特性

- ✅ **语法高亮**: 完整的 Slide DSL 语法高亮支持
- ✅ **Monaco Editor 集成**: 基于 Monaco Editor，提供强大的编辑体验
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **易于使用**: 简单的 API，快速集成

## 安装

```bash
pnpm add @slidejs/editor monaco-editor
```

## 使用示例

### 基础用法

```typescript
import { createSlideDSLEditor } from '@slidejs/editor';
import 'monaco-editor';

const container = document.getElementById('editor');
if (container) {
  const editor = createSlideDSLEditor(container, {
    value: `present quiz "my-quiz" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "Welcome!"
        }
      }
    }
  }
}`,
    theme: 'vs-dark',
    fontSize: 14,
    onChange: (value) => {
      console.log('DSL changed:', value);
    },
  });
}
```

### 配置选项

```typescript
interface SlideDSLEditorOptions {
  /** 初始内容 */
  value?: string;
  /** 主题 */
  theme?: 'vs' | 'vs-dark' | 'hc-black';
  /** 字体大小 */
  fontSize?: number;
  /** 是否显示行号 */
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  /** 是否显示小地图 */
  minimap?: { enabled: boolean };
  /** 是否自动换行 */
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  /** 是否只读 */
  readOnly?: boolean;
  /** 是否自动布局 */
  automaticLayout?: boolean;
  /** 内容变化回调 */
  onChange?: (value: string) => void;
}
```

### 手动注册语言

如果需要手动注册 Slide DSL 语言（例如在多个编辑器实例之间共享）：

```typescript
import { registerSlideDSLLanguage } from '@slidejs/editor';

// 注册语言（只需调用一次）
registerSlideDSLLanguage();

// 然后可以创建多个编辑器实例
const editor1 = createSlideDSLEditor(container1, { value: '...' });
const editor2 = createSlideDSLEditor(container2, { value: '...' });
```

## 语法高亮支持

编辑器支持以下语法元素的语法高亮：

- **关键字**: `present`, `rule`, `start`, `content`, `end`, `for`, `in`, `slide`, `dynamic`, `text`, `name`, `attrs`, `behavior`, `transition`
- **类型**: `quiz`, `survey`, `form`, `assessment`
- **字符串**: 双引号和单引号字符串
- **数字**: 整数和浮点数
- **布尔值**: `true`, `false`
- **注释**: 单行注释 (`//`) 和多行注释 (`/* */`)
- **操作符**: `:`, `{`, `}`, `+`, `.`

## API 参考

### `createSlideDSLEditor(container, options)`

创建 Slide DSL 编辑器实例。

**参数**:
- `container`: `HTMLElement` - 容器元素
- `options`: `SlideDSLEditorOptions` - 编辑器选项

**返回**: `monaco.editor.IStandaloneCodeEditor` - Monaco Editor 实例

### `registerSlideDSLLanguage()`

注册 Slide DSL 语言到 Monaco Editor。通常在创建编辑器前调用一次即可。

### `updateEditorValue(editor, value)`

更新编辑器内容。

**参数**:
- `editor`: `monaco.editor.IStandaloneCodeEditor` - 编辑器实例
- `value`: `string` - 新内容

### `setEditorTheme(editor, theme)`

设置编辑器主题。

**参数**:
- `editor`: `monaco.editor.IStandaloneCodeEditor` - 编辑器实例
- `theme`: `'vs' | 'vs-dark' | 'hc-black'` - 主题名称

## 与 Vite 集成

在 `vite.config.ts` 中配置：

```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  optimizeDeps: {
    exclude: ['monaco-editor', '@slidejs/editor'],
  },
  resolve: {
    alias: {
      '@slidejs/editor': path.resolve(__dirname, '../../packages/@slidejs/editor/src'),
    },
  },
});
```

### Worker 配置

编辑器包使用 **Vite 的 `?worker` 导入方式**，这是官方推荐的最佳实践。

**工作原理**：
- 使用 `?worker` 后缀导入 Worker 文件（如 `monaco-editor/esm/vs/editor/editor.worker?worker`）
- Vite 会自动：
  1. 在构建时将 Worker 文件打包到 `dist/assets/` 目录
  2. 生成正确的 Worker URL
  3. 处理开发和生产环境的路径差异

**开发环境**：
- Vite 开发服务器自动处理 Worker 文件
- 支持 HMR（热模块替换）

**生产环境**：
- Worker 文件自动打包到 `dist/assets/` 目录
- 使用正确的相对路径，无需额外配置
- 完全自包含，无需 CDN 或外部依赖

**优势**：
- ✅ 无需手动配置 Worker 路径
- ✅ 自动处理开发和生产环境
- ✅ Worker 文件自动打包，无需复制
- ✅ 支持所有 Monaco Editor 语言 Worker

## 许可证

MIT
