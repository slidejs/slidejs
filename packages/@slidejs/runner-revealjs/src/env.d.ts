/// <reference types="vite/client" />

/**
 * 支持 ?inline 导入 CSS 文件作为字符串
 */
declare module '*.css?inline' {
  const content: string;
  export default content;
}

/**
 * 支持 ?raw 导入 CSS 文件作为字符串（备用）
 */
declare module '*.css?raw' {
  const content: string;
  export default content;
}
