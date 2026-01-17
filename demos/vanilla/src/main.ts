/**
 * Slide DSL + Reveal.js Demo - 编辑器 + 播放器布局
 */

import { createSlideDSLEditor } from '@slidejs/editor';
import * as monaco from 'monaco-editor';
import { createSlideRunner as createRevealRunner } from '@slidejs/runner-revealjs';
import { createSlideRunner as createSwiperRunner } from '@slidejs/runner-swiper';
import { createSlideRunner as createSplideRunner } from '@slidejs/runner-splide';
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

let revealRunner: SlideRunner<SlideContext> | null = null;
let swiperRunner: SlideRunner<SlideContext> | null = null;
let splideRunner: SlideRunner<SlideContext> | null = null;
let dslEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let updateTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * 更新播放器
 */
async function updatePlayer(dsl: string) {
  const revealContainer = document.querySelector('#player-reveal');
  const swiperContainer = document.querySelector('#player-swiper');
  const splideContainer = document.querySelector('#player-splide');

  if (!revealContainer || !swiperContainer || !splideContainer) return;

  try {
    // 销毁旧的 runners
    if (revealRunner) {
      await revealRunner.destroy();
      revealRunner = null;
      revealContainer.innerHTML = '';
    }
    if (swiperRunner) {
      await swiperRunner.destroy();
      swiperRunner = null;
      swiperContainer.innerHTML = '';
    }
    if (splideRunner) {
      await splideRunner.destroy();
      splideRunner = null;
      splideContainer.innerHTML = '';
    }

    // 创建新的 runners
    revealRunner = await createRevealRunner(dsl, context, {
      container: '#player-reveal',
      revealOptions: {
        controls: true,
        progress: true,
        center: true,
        transition: 'slide',
      },
    });
    revealRunner.play();

    swiperRunner = await createSwiperRunner(dsl, context, {
      container: '#player-swiper',
      swiperOptions: {
        direction: 'horizontal',
        loop: false,
        speed: 300,
        spaceBetween: 30,
        slidesPerView: 1,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
      },
    });
    if (swiperRunner) {
      swiperRunner.play();
    }

    splideRunner = await createSplideRunner(dsl, context, {
      container: '#player-splide',
      splideOptions: {
        type: 'slide',
        perPage: 1,
        perMove: 1,
        gap: '1rem',
        keyboard: 'global',
        arrows: true,
        pagination: true,
      },
    });
    if (splideRunner) {
      splideRunner.play();
    }

    console.log('✅ Presentation updated!');
  } catch (error) {
    console.error('❌ Error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);

    if (revealContainer) {
      revealContainer.innerHTML = `<div style="padding: 2em; color: red; font-family: monospace; white-space: pre-wrap;">Error: ${errorMsg}</div>`;
    }
    if (swiperContainer) {
      swiperContainer.innerHTML = `<div style="padding: 2em; color: red; font-family: monospace; white-space: pre-wrap;">Error: ${errorMsg}</div>`;
    }
    if (splideContainer) {
      splideContainer.innerHTML = `<div style="padding: 2em; color: red; font-family: monospace; white-space: pre-wrap;">Error: ${errorMsg}</div>`;
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
          updatePlayer(value);
        }, 500);
      },
    });
  }
}

/**
 * 初始化分割器
 */
function initSplitters() {
  const horizontalSplitter = document.getElementById('splitter-h');
  const playerContainer = document.querySelector('.player-container') as HTMLElement;
  const editorContainer = document.querySelector('.editor-container') as HTMLElement;

  if (!horizontalSplitter || !playerContainer || !editorContainer) return;

  let isDraggingH = false;

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
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDraggingH) {
      isDraggingH = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // 通知 Monaco 编辑器重新布局
      dslEditor?.layout();
    }
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

    // 初始化播放器
    await updatePlayer(dslSource);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = `<div style="padding: 2em; color: red;">Error: ${error instanceof Error ? error.message : String(error)}</div>`;
    }
  }
}

main();
