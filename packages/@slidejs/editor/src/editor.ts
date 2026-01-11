/**
 * Slide DSL Monaco Editor 组件
 */

import * as monaco from 'monaco-editor';
import { registerSlideDSLLanguage } from './monarch';
import { getWorker } from './workers';

/**
 * 配置 Monaco Editor Worker
 * 必须在创建编辑器之前调用
 * 
 * 使用 Vite 的 ?worker 导入方式，这是官方推荐的最佳实践
 * Vite 会自动处理 Worker 的打包和路径，无需手动配置
 */
export function configureMonacoWorkers(): void {
  // 如果已经配置过，直接返回
  if ((self as any).MonacoEnvironment) {
    return;
  }

  // 配置 MonacoEnvironment
  // 使用 getWorker 函数，直接返回 Worker 实例
  // Vite 的 ?worker 导入会自动处理路径和打包
  (self as any).MonacoEnvironment = {
    getWorker: function (_workerId: string, label: string) {
      return getWorker(_workerId, label);
    },
  };
}

/**
 * 编辑器配置选项
 */
export interface SlideDSLEditorOptions {
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

/**
 * 创建 Slide DSL 编辑器实例
 *
 * @param container - 容器元素
 * @param options - 编辑器选项
 * @returns Monaco Editor 实例
 */
export function createSlideDSLEditor(
  container: HTMLElement,
  options: SlideDSLEditorOptions = {}
): monaco.editor.IStandaloneCodeEditor {
  // 配置 Worker（必须在创建编辑器之前）
  configureMonacoWorkers();

  // 确保语言已注册
  if (!monaco.languages.getLanguages().find(lang => lang.id === 'slide-dsl')) {
    registerSlideDSLLanguage();
  }

  const {
    value = '',
    theme = 'vs-dark',
    fontSize = 14,
    lineNumbers = 'on',
    minimap = { enabled: true },
    wordWrap = 'on',
    readOnly = false,
    automaticLayout = true,
    onChange,
  } = options;

  // 创建编辑器实例
  const editor = monaco.editor.create(container, {
    value,
    language: 'slide-dsl',
    theme,
    fontSize,
    lineNumbers,
    minimap,
    wordWrap,
    readOnly,
    automaticLayout,
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
    formatOnPaste: false,
    formatOnType: false,
  });

  // 监听内容变化
  if (onChange) {
    editor.onDidChangeModelContent(() => {
      const content = editor.getValue();
      onChange(content);
    });
  }

  return editor;
}

/**
 * 更新编辑器内容
 *
 * @param editor - 编辑器实例
 * @param value - 新内容
 */
export function updateEditorValue(
  editor: monaco.editor.IStandaloneCodeEditor,
  value: string
): void {
  const currentValue = editor.getValue();
  if (currentValue !== value) {
    editor.setValue(value);
  }
}

/**
 * 设置编辑器主题
 *
 * @param editor - 编辑器实例
 * @param theme - 主题名称
 */
export function setEditorTheme(
  editor: monaco.editor.IStandaloneCodeEditor,
  theme: 'vs' | 'vs-dark' | 'hc-black'
): void {
  monaco.editor.setTheme(theme);
}
