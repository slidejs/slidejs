import { useState, useEffect, useRef } from 'react';
import { createSlideDSLEditor } from '@slidejs/editor';
import * as monaco from 'monaco-editor';
import { createSlideRunner as createRevealRunner } from '@slidejs/runner-revealjs';
import { createSlideRunner as createSwiperRunner } from '@slidejs/runner-swiper';
import { createSlideRunner as createSplideRunner } from '@slidejs/runner-splide';
import type { SlideContext } from '@slidejs/context';
import type { SlideRunner } from '@slidejs/runner';
import { setTheme, Preset } from '@slidejs/theme';
import dslSourceRaw from './demo.slide?raw';

// 导入自定义 Web Component（必须在使用前注册）
import './components/my-quiz-question.wsx';

const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'comparison-demo',
  metadata: {
    title: 'Runner Comparison Demo',
  },
  items: [],
};

export default function App() {
  const [dslSource, setDslSource] = useState(dslSourceRaw);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  const runnersContainerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorPanelRef = useRef<HTMLDivElement>(null);
  const horizontalSplitterRef = useRef<HTMLDivElement>(null);
  const dslEditorRef = useRef<HTMLDivElement>(null);

  const revealRunnerRef = useRef<SlideRunner<SlideContext> | null>(null);
  const swiperRunnerRef = useRef<SlideRunner<SlideContext> | null>(null);
  const splideRunnerRef = useRef<SlideRunner<SlideContext> | null>(null);
  const dslEditorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingHRef = useRef(false);

  /**
   * 更新所有 Runner
   */
  const updateRunners = async (dsl: string) => {
    const revealContainer = document.querySelector('#player-reveal');
    const swiperContainer = document.querySelector('#player-swiper');
    const splideContainer = document.querySelector('#player-splide');

    if (!revealContainer || !swiperContainer || !splideContainer) return;

    try {
      // 销毁旧的 runners
      if (revealRunnerRef.current) {
        await revealRunnerRef.current.destroy();
        revealRunnerRef.current = null;
        revealContainer.innerHTML = '';
      }
      if (swiperRunnerRef.current) {
        await swiperRunnerRef.current.destroy();
        swiperRunnerRef.current = null;
        swiperContainer.innerHTML = '';
      }
      if (splideRunnerRef.current) {
        await splideRunnerRef.current.destroy();
        splideRunnerRef.current = null;
        splideContainer.innerHTML = '';
      }

      // 创建新的 runners
      revealRunnerRef.current = await createRevealRunner(dsl, context, {
        container: '#player-reveal',
        revealOptions: {
          controls: true,
          progress: true,
          center: true,
          transition: 'slide',
        },
      });
      revealRunnerRef.current.play();

      swiperRunnerRef.current = await createSwiperRunner(dsl, context, {
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
      swiperRunnerRef.current.play();

      splideRunnerRef.current = await createSplideRunner(dsl, context, {
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
      splideRunnerRef.current.play();

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
  };

  /**
   * 初始化 Monaco 编辑器
   */
  const initMonacoEditors = () => {
    if (dslEditorRef.current) {
      dslEditorInstanceRef.current = createSlideDSLEditor(dslEditorRef.current, {
        value: dslSource,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        onChange: (value: string) => {
          if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
          }
          updateTimeoutRef.current = setTimeout(() => {
            setDslSource(value);
            updateRunners(value);
          }, 500);
        },
      });
    }
  };

  /**
   * 初始化分割器
   */
  const startHorizontalDrag = () => {
    isDraggingHRef.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingHRef.current && runnersContainerRef.current && editorContainerRef.current) {
      const totalHeight = window.innerHeight - 40; // 减去工具栏高度
      const newPlayerHeight = e.clientY - 40; // 减去工具栏高度
      const newEditorHeight = totalHeight - newPlayerHeight;

      if (newPlayerHeight > 100 && newEditorHeight > 100) {
        runnersContainerRef.current.style.height = `${newPlayerHeight}px`;
        editorContainerRef.current.style.height = `${newEditorHeight}px`;
        // 通知 Monaco 编辑器重新布局
        dslEditorInstanceRef.current?.layout();
      }
    }
  };

  const handleMouseUp = () => {
    if (isDraggingHRef.current) {
      isDraggingHRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // 通知 Monaco 编辑器重新布局
      dslEditorInstanceRef.current?.layout();
    }
  };

  const applyTheme = (theme: 'dark' | 'light') => {
    setCurrentTheme(theme);
    if (theme === 'dark') {
      setTheme(Preset.SolarizedDark);
    } else {
      setTheme(Preset.SolarizedLight);
    }
  };

  useEffect(() => {
    // 默认使用 Solarized Dark 主题
    applyTheme('dark');

    // 初始化 Monaco 编辑器
    initMonacoEditors();

    // 初始化分割器事件监听
    const horizontalSplitter = horizontalSplitterRef.current;
    if (horizontalSplitter) {
      horizontalSplitter.addEventListener('mousedown', startHorizontalDrag);
    }
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 初始化所有 runners
    updateRunners(dslSource);

    // 清理函数
    return () => {
      if (horizontalSplitter) {
        horizontalSplitter.removeEventListener('mousedown', startHorizontalDrag);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // 清理编辑器
      dslEditorInstanceRef.current?.dispose();

      // 清理 runners
      revealRunnerRef.current?.destroy();
      swiperRunnerRef.current?.destroy();
      splideRunnerRef.current?.destroy();

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      {/* 主题切换工具栏 */}
      <div className="theme-toolbar">
        <div className="theme-toolbar-content">
          <span className="theme-label">Theme:</span>
          <button
            className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
            onClick={() => applyTheme('dark')}
            title="Solarized Dark"
          >
            🌙 Dark
          </button>
          <button
            className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
            onClick={() => applyTheme('light')}
            title="Solarized Light"
          >
            ☀️ Light
          </button>
        </div>
      </div>

      {/* 顶部 3 列 Runner 展示区域 */}
      <div className="runners-container" ref={runnersContainerRef}>
        <div className="runner-column">
          <div className="runner-header">
            <h3>Reveal.js</h3>
          </div>
          <div id="player-reveal" className="runner-container"></div>
        </div>
        <div className="runner-column">
          <div className="runner-header">
            <h3>Swiper</h3>
          </div>
          <div id="player-swiper" className="runner-container"></div>
        </div>
        <div className="runner-column">
          <div className="runner-header">
            <h3>Splide</h3>
          </div>
          <div id="player-splide" className="runner-container"></div>
        </div>
      </div>

      {/* 水平分割器 */}
      <div className="splitter-horizontal" id="splitter-h" ref={horizontalSplitterRef}>
        <div className="splitter-handle"></div>
      </div>

      {/* 底部编辑器区域 */}
      <div className="editor-container" ref={editorContainerRef}>
        {/* DSL 编辑器 */}
        <div className="editor-panel" ref={editorPanelRef}>
          <div className="panel-header">
            <h3>DSL Editor</h3>
          </div>
          <div id="dsl-editor" className="editor-content" ref={dslEditorRef}></div>
        </div>
      </div>
    </div>
  );
}
