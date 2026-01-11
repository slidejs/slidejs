/**
 * Slide DSL + Splide Demo - 类型声明
 */

declare module '*.slide?raw' {
  const content: string;
  export default content;
}

// Monaco Editor 类型声明
declare module 'monaco-editor' {
  export * from 'monaco-editor/esm/vs/editor/editor.api';
}

declare namespace monaco {
  export namespace editor {
    export interface IStandaloneCodeEditor {
      setValue(value: string): void;
      getValue(): string;
      layout(): void;
      dispose(): void;
      onDidChangeModelContent(callback: () => void): monaco.IDisposable;
    }

    export interface IDisposable {
      dispose(): void;
    }

    export interface IEditorOptions {
      value?: string;
      language?: string;
      theme?: string;
      readOnly?: boolean;
      automaticLayout?: boolean;
      minimap?: { enabled: boolean };
      fontSize?: number;
      lineNumbers?: 'on' | 'off';
      wordWrap?: 'on' | 'off';
    }

    export function create(
      container: HTMLElement,
      options?: IEditorOptions
    ): IStandaloneCodeEditor;
  }
}
