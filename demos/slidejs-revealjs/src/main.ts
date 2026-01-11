/**
 * Slide DSL + Reveal.js Demo - 编辑器 + 播放器布局
 */

import { createSlideDSLEditor } from '@slidejs/editor';
import * as monaco from 'monaco-editor';
import { createSlideRunner } from '@slidejs/runner-revealjs';
import { parseSlideDSL, compile } from '@slidejs/dsl';
import type { SlideContext } from '@slidejs/context';
import type { SlideRunner } from '@slidejs/runner';
import { setTheme, Preset } from '@slidejs/theme';
// Reveal.js 的核心 CSS 已通过 runner 包自动注入，无需手动导入
// 主题样式需要单独导入（可选）
import 'reveal.js/dist/theme/black.css';
import './style.css';

// Worker 配置已由 @slidejs/editor 包自动处理
// 无需手动配置

// 导入自定义 Web Component（必须在使用前注册）
import './components/my-quiz-question.wsx';

// 导入 DSL 文件
import dslSource from './demo.slide?raw';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'demo',
  metadata: {
    title: 'Demo Quiz',
  },
  items: [],
};

let runner: SlideRunner<SlideContext> | null = null;
let dslEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let jsonEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let updateTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * 更新播放器和 JSON
 */
async function updatePlayerAndJson(dsl: string) {
  const playerContainer = document.querySelector('#player');
  const jsonContainer = document.querySelector('#json-viewer');

  if (!playerContainer || !jsonContainer) return;

  try {
    // 解析 DSL
    const ast = await parseSlideDSL(dsl);

    // 编译为 SlideDSL
    const slideDSL = compile(ast);

    // 更新 JSON 显示
    if (jsonEditor) {
      jsonEditor.setValue(JSON.stringify(slideDSL, null, 2));
    } else {
      jsonContainer.textContent = JSON.stringify(slideDSL, null, 2);
    }

    // 销毁旧的 runner
    if (runner) {
      await runner.destroy();
      runner = null;
      playerContainer.innerHTML = '';
    }

    // 创建新的 runner
    runner = await createSlideRunner(dsl, context, {
      container: '#player',
      revealOptions: {
        controls: true,
        progress: true,
        center: true,
        transition: 'slide',
      },
    });

    // 启动演示
    runner.play();

    console.log('✅ Presentation updated!');
  } catch (error) {
    console.error('❌ Error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);

    if (playerContainer) {
      playerContainer.innerHTML = `<div style="padding: 2em; color: red; font-family: monospace; white-space: pre-wrap;">Error: ${errorMsg}</div>`;
    }

    if (jsonEditor) {
      jsonEditor.setValue(`Error: ${errorMsg}`);
    } else if (jsonContainer) {
      jsonContainer.textContent = `Error: ${errorMsg}`;
    }
  }
}

/**
 * 初始化 Monaco 编辑器
 */
function initMonacoEditors() {
  // DSL 编辑器（使用 Slide DSL 语法高亮）
  const dslContainer = document.getElementById('dsl-editor');
  if (dslContainer) {
    dslEditor = createSlideDSLEditor(dslContainer, {
      value: dslSource,
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      onChange: (value: string) => {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(() => {
          updatePlayerAndJson(value);
        }, 500);
      },
    });
  }

  // JSON 查看器（只读）
  const jsonContainer = document.getElementById('json-viewer');
  if (jsonContainer) {
    jsonEditor = monaco.editor.create(jsonContainer, {
      value: '',
      language: 'json',
      theme: 'vs-dark',
      readOnly: true,
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
    });
  }
}

/**
 * 初始化分割器
 */
function initSplitters() {
  const horizontalSplitter = document.getElementById('splitter-h');
  const verticalSplitter = document.getElementById('splitter-v');
  const playerContainer = document.querySelector('.player-container') as HTMLElement;
  const editorContainer = document.querySelector('.editor-container') as HTMLElement;
  const editorPanel = document.querySelector('.editor-panel') as HTMLElement;
  const jsonPanel = document.querySelector('.json-panel') as HTMLElement;

  if (!horizontalSplitter || !verticalSplitter || !playerContainer || !editorContainer) return;

  let isDraggingH = false;
  let isDraggingV = false;

  // 水平分割器（顶部/底部）
  horizontalSplitter.addEventListener('mousedown', () => {
    isDraggingH = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (isDraggingH) {
      const totalHeight = window.innerHeight;
      const newPlayerHeight = e.clientY;
      const newEditorHeight = totalHeight - newPlayerHeight;

      if (newPlayerHeight > 100 && newEditorHeight > 100) {
        playerContainer.style.height = `${newPlayerHeight}px`;
        editorContainer.style.height = `${newEditorHeight}px`;
        // 通知 Monaco 编辑器重新布局
        dslEditor?.layout();
        jsonEditor?.layout();
      }
    }

    if (isDraggingV && editorPanel && jsonPanel) {
      const editorContainerRect = editorContainer.getBoundingClientRect();
      const newEditorWidth = e.clientX - editorContainerRect.left;
      const totalWidth = editorContainerRect.width;
      const newJsonWidth = totalWidth - newEditorWidth;

      if (newEditorWidth > 200 && newJsonWidth > 200) {
        editorPanel.style.width = `${newEditorWidth}px`;
        jsonPanel.style.width = `${newJsonWidth}px`;
        // 通知 Monaco 编辑器重新布局
        dslEditor?.layout();
        jsonEditor?.layout();
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDraggingH || isDraggingV) {
      isDraggingH = false;
      isDraggingV = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // 通知 Monaco 编辑器重新布局
      dslEditor?.layout();
      jsonEditor?.layout();
    }
  });

  // 垂直分割器（左侧/右侧）
  verticalSplitter.addEventListener('mousedown', () => {
    isDraggingV = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });
}

/**
 * 初始化主题切换功能
 */
function initThemeSwitcher() {
  const darkBtn = document.getElementById('theme-dark');
  const lightBtn = document.getElementById('theme-light');

  // 默认使用 Solarized Dark 主题
  setTheme(Preset.SolarizedDark);
  darkBtn?.classList.add('active');

  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      setTheme(Preset.SolarizedDark);
      darkBtn.classList.add('active');
      lightBtn?.classList.remove('active');
      console.log('✅ Theme changed to Solarized Dark');
    });
  }

  if (lightBtn) {
    lightBtn.addEventListener('click', () => {
      setTheme(Preset.SolarizedLight);
      lightBtn.classList.add('active');
      darkBtn?.classList.remove('active');
      console.log('✅ Theme changed to Solarized Light');
    });
  }
}

async function main() {
  try {
    // 初始化主题切换功能
    initThemeSwitcher();

    // 初始化 Monaco 编辑器
    initMonacoEditors();

    // 初始化分割器
    initSplitters();

    // 初始化播放器和 JSON
    await updatePlayerAndJson(dslSource);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = `<div style="padding: 2em; color: red;">Error: ${error instanceof Error ? error.message : String(error)}</div>`;
    }
  }
}

main();
