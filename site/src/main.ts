/**
 * SlideJS Site - Main Entry Point
 *
 * 初始化 wsx 应用，挂载根组件到 DOM
 */

import { createLogger } from '@wsxjs/wsx-core';
import 'uno.css'; // UnoCSS 工具类
import './main.css'; // 全局样式
// 导入基础组件包（包含 CSS）
import '@wsxjs/wsx-base-components';
// 导入路由
import '@wsxjs/wsx-router';
// 初始化 i18n（必须在组件导入之前）
import './i18n';

// 导入 App 组件（触发自动注册）
import './App.wsx';

const logger = createLogger('SlideJS-Site');

/**
 * 初始化主题系统
 * 默认使用暗色模式，支持从 localStorage 恢复用户偏好
 */
function initTheme() {
  // 从 localStorage 读取用户偏好，默认为 'dark'
  const savedTheme = localStorage.getItem('slidejs-theme') || 'dark';
  const theme = savedTheme === 'light' ? 'light' : 'dark';
  
  // 设置 data-theme 属性到 document.documentElement
  document.documentElement.setAttribute('data-theme', theme);
  
  logger.info(`Theme initialized: ${theme}`);
}

/**
 * 初始化应用
 */
function initApp() {
  // 先初始化主题（必须在 DOM 渲染之前）
  initTheme();
  
  const appContainer = document.getElementById('app');

  if (!appContainer) {
    logger.error('App container not found');
    return;
  }

  // 挂载 WSX App 组件到 DOM
  // 使用自定义元素标签名（由 @autoRegister 定义）
  appContainer.innerHTML = '<slidejs-app></slidejs-app>';

  logger.info('SlideJS Site initialized');
}

// DOM 就绪后启动应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
