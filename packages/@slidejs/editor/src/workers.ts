/**
 * Monaco Editor Worker 导入
 * 使用 Vite 的 ?worker 后缀来正确导入 Worker 文件
 */

// 导入所有需要的 Worker
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

/**
 * 获取 Worker 实例
 */
export function getWorker(_workerId: string, label: string): Worker {
  switch (label) {
    case 'json':
      return new JsonWorker();
    case 'css':
    case 'scss':
    case 'less':
      return new CssWorker();
    case 'html':
    case 'handlebars':
    case 'razor':
      return new HtmlWorker();
    case 'typescript':
    case 'javascript':
      return new TsWorker();
    default:
      return new EditorWorker();
  }
}
