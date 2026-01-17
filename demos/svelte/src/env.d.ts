/// <reference types="vite/client" />

declare module '*.slide' {
  const content: string;
  export default content;
}

// Monaco Editor types
declare module 'monaco-editor' {
  export * from 'monaco-editor/esm/vs/editor/editor.api';
}

declare namespace monaco.languages {
  interface IMonarchLanguage {
    // Define properties if needed, or leave empty if just for namespace declaration
  }
}
