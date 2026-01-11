/**
 * @slidejs/runner-splide - 类型声明
 *
 * 支持 CSS ?inline 和 ?raw 导入
 */

declare module '*.css?inline' {
  const content: string;
  export default content;
}

declare module '*.css?raw' {
  const content: string;
  export default content;
}

// 支持 @splidejs/splide/css 的 ?inline 导入
declare module '@splidejs/splide/css?inline' {
  const content: string;
  export default content;
}
