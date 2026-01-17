<template>
  <div class="app">
    <!-- 主题切换工具栏 -->
    <div class="theme-toolbar">
      <div class="theme-toolbar-content">
        <span class="theme-label">Theme:</span>
        <button
          :class="['theme-btn', { active: currentTheme === 'dark' }]"
          @click="setTheme('dark')"
          title="Solarized Dark"
        >
          🌙 Dark
        </button>
        <button
          :class="['theme-btn', { active: currentTheme === 'light' }]"
          @click="setTheme('light')"
          title="Solarized Light"
        >
          ☀️ Light
        </button>
      </div>
    </div>

    <!-- 顶部 3 列 Runner 展示区域 -->
    <div class="runners-container" ref="runnersContainerRef">
      <div class="runner-column">
        <div class="runner-header">
          <h3>Reveal.js</h3>
        </div>
        <div id="player-reveal" class="runner-container"></div>
      </div>
      <div class="runner-column">
        <div class="runner-header">
          <h3>Swiper</h3>
        </div>
        <div id="player-swiper" class="runner-container"></div>
      </div>
      <div class="runner-column">
        <div class="runner-header">
          <h3>Splide</h3>
        </div>
        <div id="player-splide" class="runner-container"></div>
      </div>
    </div>

    <!-- 水平分割器 -->
    <div
      class="splitter-horizontal"
      id="splitter-h"
      @mousedown="startHorizontalDrag"
      ref="horizontalSplitterRef"
    >
      <div class="splitter-handle"></div>
    </div>

    <!-- 底部编辑器区域 -->
    <div class="editor-container" ref="editorContainerRef">
      <!-- DSL 编辑器 -->
      <div class="editor-panel" ref="editorPanelRef">
        <div class="panel-header">
          <h3>DSL Editor</h3>
        </div>
        <div id="dsl-editor" class="editor-content" ref="dslEditorRef"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { createSlideDSLEditor } from '@slidejs/editor';
import * as monaco from 'monaco-editor';
import { createSlideRunner as createRevealRunner } from '@slidejs/runner-revealjs';
import { createSlideRunner as createSwiperRunner } from '@slidejs/runner-swiper';
import { createSlideRunner as createSplideRunner } from '@slidejs/runner-splide';
import type { SlideContext } from '@slidejs/context';
import type { SlideRunner } from '@slidejs/runner';
import { setTheme as applyTheme, Preset } from '@slidejs/theme';
import dslSourceRaw from './demo.slide?raw';

// 导入自定义 Web Component（必须在使用前注册）
import './components/my-quiz-question.wsx';

const dslSource = ref(dslSourceRaw);
const currentTheme = ref<'dark' | 'light'>('dark');

const runnersContainerRef = ref<HTMLElement | null>(null);
const editorContainerRef = ref<HTMLElement | null>(null);
const editorPanelRef = ref<HTMLElement | null>(null);
const horizontalSplitterRef = ref<HTMLElement | null>(null);
const dslEditorRef = ref<HTMLElement | null>(null);

let revealRunner: SlideRunner<SlideContext> | null = null;
let swiperRunner: SlideRunner<SlideContext> | null = null;
let splideRunner: SlideRunner<SlideContext> | null = null;
let dslEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let updateTimeout: ReturnType<typeof setTimeout> | null = null;

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'comparison-demo',
  metadata: {
    title: 'Runner Comparison Demo',
  },
  items: [],
};

/**
 * 更新所有 Runner
 */
async function updateRunners(dsl: string) {
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
    swiperRunner.play();

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
    splideRunner.play();

    console.log('✅ All runners updated!');
  } catch (error) {
    console.error('❌ Error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);

    // 显示错误信息
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
  if (dslEditorRef.value) {
    dslEditor = createSlideDSLEditor(dslEditorRef.value, {
      value: dslSource.value,
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
          updateRunners(value);
        }, 500);
      },
    });
  }

}

/**
 * 初始化分割器
 */
let isDraggingH = false;

function startHorizontalDrag() {
  isDraggingH = true;
  document.body.style.cursor = 'row-resize';
  document.body.style.userSelect = 'none';
}

function handleMouseMove(e: MouseEvent) {
  if (isDraggingH && runnersContainerRef.value && editorContainerRef.value) {
    const totalHeight = window.innerHeight - 40; // 减去工具栏高度
    const newPlayerHeight = e.clientY - 40; // 减去工具栏高度
    const newEditorHeight = totalHeight - newPlayerHeight;

    if (newPlayerHeight > 100 && newEditorHeight > 100) {
      runnersContainerRef.value.style.height = `${newPlayerHeight}px`;
      editorContainerRef.value.style.height = `${newEditorHeight}px`;
      // 通知 Monaco 编辑器重新布局
      dslEditor?.layout();
    }
  }
}

function handleMouseUp() {
  if (isDraggingH) {
    isDraggingH = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // 通知 Monaco 编辑器重新布局
    dslEditor?.layout();
  }
}

function setTheme(theme: 'dark' | 'light') {
  currentTheme.value = theme;
  if (theme === 'dark') {
    applyTheme(Preset.SolarizedDark);
  } else {
    applyTheme(Preset.SolarizedLight);
  }
}

onMounted(async () => {
  // 默认使用 Solarized Dark 主题
  setTheme('dark');

  // 初始化 Monaco 编辑器
  initMonacoEditors();

  // 初始化分割器事件监听
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // 初始化所有 runners
  await updateRunners(dslSource.value);
});

onBeforeUnmount(() => {
  // 清理事件监听
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);

  // 清理编辑器
  dslEditor?.dispose();

  // 清理 runners
  revealRunner?.destroy();
  swiperRunner?.destroy();
  splideRunner?.destroy();

  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #1e1e1e;
  overflow: hidden;
}

.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 主题切换工具栏 */
.theme-toolbar {
  width: 100%;
  height: 40px;
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
  display: flex;
  align-items: center;
  padding: 0 1em;
  flex-shrink: 0;
  z-index: 100;
}

.theme-toolbar-content {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.theme-label {
  font-size: 0.85em;
  color: #cccccc;
  margin-right: 0.5em;
}

.theme-btn {
  padding: 0.4em 0.8em;
  background: #3c3c3c;
  border: 1px solid #4a4a4a;
  border-radius: 4px;
  color: #cccccc;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-btn:hover {
  background: #4a4a4a;
  border-color: #4a90e2;
  color: #ffffff;
}

.theme-btn.active {
  background: #4a90e2;
  border-color: #4a90e2;
  color: #ffffff;
}

/* 顶部 3 列 Runner 容器 */
.runners-container {
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background: #1e1e1e;
  position: relative;
}

.runners-container > * {
  flex: 1;
  min-width: 0;
}

.runner-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  overflow: hidden;
}

.runner-column:last-child {
  border-right: none;
}

.runner-header {
  padding: 0.75em 1em;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.runner-header h3 {
  margin: 0;
  font-size: 0.9em;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.runner-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* 分割器样式 */
.splitter-horizontal {
  position: absolute;
  top: calc(75% - 4px);
  left: 0;
  right: 0;
  height: 8px;
  cursor: row-resize;
  z-index: 10;
  background: transparent;
}


.splitter-handle {
  width: 100%;
  height: 100%;
  background: #3c3c3c;
  transition: background 0.2s;
}

.splitter-handle:hover {
  background: #4a90e2;
}

.splitter-horizontal .splitter-handle {
  height: 2px;
  margin: 3px 0;
}


/* 底部编辑器区域 */
.editor-container {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: row;
  background: #1e1e1e;
  position: relative;
}

/* 编辑器面板 */
.editor-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  overflow: hidden;
}

.panel-header {
  padding: 0.5em 1em;
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 0.9em;
  font-weight: 600;
  color: #cccccc;
}

.editor-content {
  flex: 1;
  overflow: hidden;
}
</style>
