<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createSlideDSLEditor } from '@slidejs/editor';
  import * as monaco from 'monaco-editor';
  import { createSlideRunner as createRevealRunner } from '@slidejs/runner-revealjs';
  import { createSlideRunner as createSwiperRunner } from '@slidejs/runner-swiper';
  import { createSlideRunner as createSplideRunner } from '@slidejs/runner-splide';
  import type { SlideContext } from '@slidejs/context';
  import type { SlideRunner } from '@slidejs/runner';
  import { setTheme, Preset } from '@slidejs/theme';
  import dslSourceRaw from './demo.slide?raw';
  import './style.css';

  // 导入自定义 Web Component（必须在使用前注册）
  import './components/my-quiz-question.wsx';

  let dslSource = dslSourceRaw;
  let currentTheme: 'dark' | 'light' = 'dark';

  let runnersContainer: HTMLElement;
  let editorContainer: HTMLElement;
  let horizontalSplitter: HTMLElement;
  let dslEditorElement: HTMLElement;

  let revealRunner: SlideRunner<SlideContext> | null = null;
  let swiperRunner: SlideRunner<SlideContext> | null = null;
  let splideRunner: SlideRunner<SlideContext> | null = null;
  let dslEditor: monaco.editor.IStandaloneCodeEditor | null = null;
  let updateTimeout: ReturnType<typeof setTimeout> | null = null;
  let isDraggingH = false;

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
    if (dslEditorElement) {
      dslEditor = createSlideDSLEditor(dslEditorElement, {
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
            dslSource = value;
            updateRunners(value);
          }, 500);
        },
      });
    }
  }

  /**
   * 初始化分割器
   */
  function startHorizontalDrag() {
    isDraggingH = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }

  function handleMouseMove(e: MouseEvent) {
    if (isDraggingH && runnersContainer && editorContainer) {
      const totalHeight = window.innerHeight - 40; // 减去工具栏高度
      const newPlayerHeight = e.clientY - 40; // 减去工具栏高度
      const newEditorHeight = totalHeight - newPlayerHeight;

      if (newPlayerHeight > 100 && newEditorHeight > 100) {
        runnersContainer.style.height = `${newPlayerHeight}px`;
        editorContainer.style.height = `${newEditorHeight}px`;
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

  function applyTheme(theme: 'dark' | 'light') {
    currentTheme = theme;
    if (theme === 'dark') {
      setTheme(Preset.SolarizedDark);
    } else {
      setTheme(Preset.SolarizedLight);
    }
  }

  onMount(async () => {
    // 默认使用 Solarized Dark 主题
    applyTheme('dark');

    // 初始化 Monaco 编辑器
    initMonacoEditors();

    // 初始化分割器事件监听
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 初始化所有 runners
    await updateRunners(dslSource);
  });

  onDestroy(() => {
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

<div class="app">
  <!-- 主题切换工具栏 -->
  <div class="theme-toolbar">
    <div class="theme-toolbar-content">
      <span class="theme-label">Theme:</span>
      <button
        class="theme-btn"
        class:active={currentTheme === 'dark'}
        onclick={() => applyTheme('dark')}
        title="Solarized Dark"
      >
        🌙 Dark
      </button>
      <button
        class="theme-btn"
        class:active={currentTheme === 'light'}
        onclick={() => applyTheme('light')}
        title="Solarized Light"
      >
        ☀️ Light
      </button>
    </div>
  </div>

  <!-- 顶部 3 列 Runner 展示区域 -->
  <div class="runners-container" bind:this={runnersContainer}>
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
    onmousedown={startHorizontalDrag}
    bind:this={horizontalSplitter}
  >
    <div class="splitter-handle"></div>
  </div>

  <!-- 底部编辑器区域 -->
  <div class="editor-container" bind:this={editorContainer}>
    <!-- DSL 编辑器 -->
    <div class="editor-panel">
      <div class="panel-header">
        <h3>DSL Editor</h3>
      </div>
      <div id="dsl-editor" class="editor-content" bind:this={dslEditorElement}></div>
    </div>
  </div>
</div>
