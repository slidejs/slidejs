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

    <!-- 主容器：左右布局 -->
    <div class="main-container" ref="mainContainerRef">
      <!-- 左侧：Markdown 编辑器 -->
      <div class="markdown-editor-panel" ref="markdownEditorPanelRef">
        <div class="markdown-editor-header">
          <h3>Markdown Editor</h3>
        </div>
        <div id="markdown-editor" class="markdown-editor-content" ref="markdownEditorRef"></div>
      </div>

      <!-- 垂直分割器 -->
      <div
        class="splitter-vertical"
        @mousedown="startVerticalDrag"
        ref="verticalSplitterRef"
      >
        <div class="splitter-handle"></div>
      </div>

      <!-- 右侧：预览和 DSL -->
      <div class="right-panel" ref="rightPanelRef">
        <!-- 右侧顶部：幻灯片预览 -->
        <div class="slide-preview-panel" ref="slidePreviewPanelRef">
          <div class="slide-preview-header">
            <h3>Slide Preview</h3>
          </div>
          <div id="slide-preview" class="slide-preview-content" ref="slidePreviewRef"></div>
        </div>

        <!-- 水平分割器（右侧内部） -->
        <div
          class="splitter-horizontal"
          @mousedown="startHorizontalDrag"
          ref="horizontalSplitterRef"
        >
          <div class="splitter-handle"></div>
        </div>

        <!-- 右侧底部：生成的 DSL -->
        <div class="dsl-viewer-panel" ref="dslViewerPanelRef">
          <div class="dsl-viewer-header">
            <h3>Generated DSL</h3>
          </div>
          <div id="dsl-viewer" class="dsl-viewer-content" ref="dslViewerRef"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as monaco from 'monaco-editor';
import { createSlideRunner as createRevealRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';
import type { SlideRunner } from '@slidejs/runner';
import { setTheme as applyTheme, Preset } from '@slidejs/theme';
import presentationMdRaw from './presentation.md?raw';

// TODO: 当 @slidejs/markdown 包实现后，使用以下导入
// import { markdownToSlideDSL } from '@slidejs/markdown';
// import { createSlideRunner } from '@slidejs/runner-revealjs';
// import { parseSlideDSL, compile } from '@slidejs/dsl';

const currentTheme = ref<'dark' | 'light'>('dark');

const mainContainerRef = ref<HTMLElement | null>(null);
const markdownEditorPanelRef = ref<HTMLElement | null>(null);
const rightPanelRef = ref<HTMLElement | null>(null);
const markdownEditorRef = ref<HTMLElement | null>(null);
const slidePreviewRef = ref<HTMLElement | null>(null);
const dslViewerRef = ref<HTMLElement | null>(null);
const verticalSplitterRef = ref<HTMLElement | null>(null);
const horizontalSplitterRef = ref<HTMLElement | null>(null);
const slidePreviewPanelRef = ref<HTMLElement | null>(null);
const dslViewerPanelRef = ref<HTMLElement | null>(null);

let markdownEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let dslViewer: monaco.editor.IStandaloneCodeEditor | null = null;
let slideRunner: SlideRunner<SlideContext> | null = null;
let updateTimeout: ReturnType<typeof setTimeout> | null = null;

const markdownSource = ref(presentationMdRaw);

const context: SlideContext = {
  sourceType: 'markdown',
  sourceId: 'markdown-demo',
  metadata: {
    title: 'Markdown to DSL Converter Demo',
  },
  items: [],
};

/**
 * 模拟 Markdown 到 DSL 转换（临时实现）
 * TODO: 当 @slidejs/markdown 包实现后，使用真实的转换函数
 */
function mockMarkdownToDSL(markdown: string): string {
  // 简单的模拟转换，实际应该使用 @slidejs/markdown 包
  const lines = markdown.split('\n');
  const slides: string[] = [];
  let currentSlide: string[] = [];
  
  for (const line of lines) {
    if (line.trim() === '---') {
      if (currentSlide.length > 0) {
        slides.push(currentSlide.join('\n'));
        currentSlide = [];
      }
    } else {
      currentSlide.push(line);
    }
  }
  if (currentSlide.length > 0) {
    slides.push(currentSlide.join('\n'));
  }
  
  // 生成简单的 DSL（模拟）
  const slideBlocks = slides.map((slideContent, index) => {
    const html = slideContent
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/\n/g, '');
    
    return `
      slide {
        content dynamic {
          name: "markdown-slide"
          attrs {
            html: "${html.replace(/"/g, '\\"')}"
            theme: "default"
          }
        }
        behavior {
          transition slide {
            speed: 300
          }
        }
      }`;
  });
  
  return `present markdown "presentation" {
  rules {
    rule start "intro" {
${slideBlocks[0] || ''}
    }
    
    rule content "slides" {
${slideBlocks.slice(1).join('\n')}
    }
  }
}`;
}

/**
 * 更新幻灯片预览和 DSL 显示
 */
async function updatePreviewAndDSL(markdown: string) {
  try {
    // 转换 Markdown 为 DSL
    const dslSource = mockMarkdownToDSL(markdown);
    
    // 更新 DSL 查看器
    if (dslViewer) {
      dslViewer.setValue(dslSource);
    }
    
    // 更新幻灯片预览
    if (slidePreviewRef.value) {
      // 销毁旧的 runner
      if (slideRunner) {
        await slideRunner.destroy();
        slideRunner = null;
        slidePreviewRef.value.innerHTML = '';
      }
      
      // TODO: 当 @slidejs/markdown 包实现后，使用以下代码
      // import { markdownToSlideDSL } from '@slidejs/markdown';
      // import { createSlideRunner } from '@slidejs/runner-revealjs';
      //
      // // 1. 将 Markdown 转换为 DSL 源代码
      // const dslSource = await markdownToSlideDSL(markdown);
      //
      // // 2. 使用现有的 createSlideRunner 运行 DSL
      // slideRunner = await createSlideRunner(dslSource, context, {
      //   container: '#slide-preview',
      //   revealOptions: {
      //     controls: true,
      //     progress: true,
      //     center: true,
      //     transition: 'slide',
      //   },
      // });
      // slideRunner.play();
      
      // 临时显示提示信息
      slidePreviewRef.value.innerHTML = `
        <div style="padding: 2em; color: #666; font-family: monospace; text-align: center;">
          <p>Markdown to DSL conversion will be available</p>
          <p>when @slidejs/markdown package is implemented</p>
          <p style="margin-top: 1em; font-size: 0.9em; color: #999;">
            Flow: Markdown → DSL → createSlideRunner()
          </p>
          <p style="margin-top: 0.5em; font-size: 0.9em; color: #999;">
            See RFC 0013 for implementation details
          </p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error updating preview:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (slidePreviewRef.value) {
      slidePreviewRef.value.innerHTML = `
        <div style="padding: 2em; color: red; font-family: monospace; white-space: pre-wrap;">
          Error: ${errorMsg}
        </div>
      `;
    }
  }
}

/**
 * 初始化 Monaco 编辑器
 */
function initMonacoEditors() {
  // Markdown 编辑器
  if (markdownEditorRef.value) {
    markdownEditor = monaco.editor.create(markdownEditorRef.value, {
      value: markdownSource.value,
      language: 'markdown',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      onChange: (value: string | undefined) => {
        if (value !== undefined) {
          markdownSource.value = value;
          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }
          updateTimeout = setTimeout(() => {
            updatePreviewAndDSL(value);
          }, 500);
        }
      },
    });
  }
  
  // DSL 查看器（只读）
  if (dslViewerRef.value) {
    dslViewer = monaco.editor.create(dslViewerRef.value, {
      value: mockMarkdownToDSL(markdownSource.value),
      language: 'slide-dsl', // TODO: 注册 Slide DSL 语言
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      readOnly: true,
    });
  }
}

/**
 * 分割器拖拽
 */
let isDraggingV = false;
let isDraggingH = false;

function startVerticalDrag() {
  isDraggingV = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
}

function startHorizontalDrag() {
  isDraggingH = true;
  document.body.style.cursor = 'row-resize';
  document.body.style.userSelect = 'none';
}

function handleMouseMove(e: MouseEvent) {
  if (isDraggingV && markdownEditorPanelRef.value && rightPanelRef.value) {
    const totalWidth = window.innerWidth;
    const newLeftWidth = e.clientX;
    const newRightWidth = totalWidth - newLeftWidth;
    
    if (newLeftWidth > 200 && newRightWidth > 200) {
      markdownEditorPanelRef.value.style.width = `${newLeftWidth}px`;
      rightPanelRef.value.style.width = `${newRightWidth}px`;
      // 更新垂直分割器位置
      if (verticalSplitterRef.value) {
        verticalSplitterRef.value.style.left = `${newLeftWidth - 4}px`;
      }
      markdownEditor?.layout();
      dslViewer?.layout();
    }
  }
  
  if (isDraggingH && slidePreviewPanelRef.value && dslViewerPanelRef.value) {
    const totalHeight = window.innerHeight - 40; // 减去工具栏高度
    const newPreviewHeight = e.clientY - 40; // 减去工具栏高度
    const newDSLHeight = totalHeight - newPreviewHeight;
    
    if (newPreviewHeight > 100 && newDSLHeight > 100) {
      slidePreviewPanelRef.value.style.flex = `0 0 ${newPreviewHeight}px`;
      dslViewerPanelRef.value.style.flex = `0 0 ${newDSLHeight}px`;
      // 更新水平分割器位置
      if (horizontalSplitterRef.value) {
        horizontalSplitterRef.value.style.top = `${newPreviewHeight - 4}px`;
      }
      markdownEditor?.layout();
      dslViewer?.layout();
    }
  }
}

function handleMouseUp() {
  if (isDraggingV) {
    isDraggingV = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    markdownEditor?.layout();
    dslViewer?.layout();
  }
  
  if (isDraggingH) {
    isDraggingH = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    markdownEditor?.layout();
    dslViewer?.layout();
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
  
  // 初始更新预览
  await updatePreviewAndDSL(markdownSource.value);
});

onBeforeUnmount(() => {
  // 清理事件监听
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  
  // 清理编辑器
  markdownEditor?.dispose();
  dslViewer?.dispose();
  
  // 清理 runner
  slideRunner?.destroy();
  
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
});
</script>

<style>
/* 样式已在 style.css 中定义 */
</style>
