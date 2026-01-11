/**
 * @slidejs/editor - Slide DSL Monaco Editor
 *
 * 提供 Slide DSL 的 Monaco Editor 集成，包括语法高亮支持
 */

export { registerSlideDSLLanguage, slideDSLMonarchDefinition } from './monarch';
export {
  configureMonacoWorkers,
  createSlideDSLEditor,
  updateEditorValue,
  setEditorTheme,
  type SlideDSLEditorOptions,
} from './editor';
