/// <reference types="vite/client" />

declare module '*.slide?raw' {
  const content: string;
  export default content;
}

// Monaco Editor 类型声明
declare module 'monaco-editor' {
  /**
   * 可释放对象接口
   */
  export interface IDisposable {
    /**
     * 释放资源
     */
    dispose(): void;
  }

  /**
   * Monaco Editor 命名空间
   */
  export namespace editor {
    /**
     * Monaco Editor 独立代码编辑器接口
     */
    export interface IStandaloneCodeEditor {
      /**
       * 获取编辑器内容
       */
      getValue(): string;

      /**
       * 设置编辑器内容
       */
      setValue(value: string): void;

      /**
       * 监听内容变化
       * @param listener - 变化回调函数
       * @returns 可释放的订阅对象
       */
      onDidChangeModelContent(listener: () => void): IDisposable;

      /**
       * 重新布局编辑器（当容器尺寸变化时调用）
       */
      layout(): void;

      /**
       * 销毁编辑器实例
       */
      dispose(): void;
    }

    /**
     * 编辑器配置选项
     */
    export interface IEditorOptions {
      /** 初始内容 */
      value?: string;
      /** 语言模式 */
      language?: string;
      /** 主题 */
      theme?: string;
      /** 自动布局 */
      automaticLayout?: boolean;
      /** 小地图配置 */
      minimap?: { enabled: boolean };
      /** 字体大小 */
      fontSize?: number;
      /** 行号显示 */
      lineNumbers?: 'on' | 'off';
      /** 自动换行 */
      wordWrap?: 'on' | 'off';
      /** 只读模式 */
      readOnly?: boolean;
    }

    /**
     * 创建独立代码编辑器实例
     * @param container - 容器元素
     * @param options - 编辑器选项
     * @returns 编辑器实例
     */
    export function create(container: HTMLElement, options?: IEditorOptions): IStandaloneCodeEditor;
  }
}
