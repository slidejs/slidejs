/**
 * Monaco Editor Monarch 语法定义 - Slide DSL
 *
 * 提供 Slide DSL 的语法高亮支持
 */

import * as monaco from 'monaco-editor';

/**
 * Slide DSL 的 Monarch 语法定义
 */
export const slideDSLMonarchDefinition = {
  // 关键字
  keywords: [
    'present',
    'rule',
    'start',
    'content',
    'end',
    'for',
    'in',
    'slide',
    'dynamic',
    'text',
    'name',
    'attrs',
    'behavior',
    'transition',
  ],

  // 类型关键字
  typeKeywords: ['quiz', 'survey', 'form', 'assessment'],

  // 操作符
  operators: [':', '{', '}', '+', '.'],

  // 符号
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // 转义序列
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // 数字
  digits: /\d+(_+\d+)*/,

  // 空白字符
  tokenizer: {
    root: [
      // 标识符和关键字
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@typeKeywords': 'type',
            '@default': 'identifier',
          },
        },
      ],

      // 大写标识符（通常用于常量）
      [/[A-Z][\w\$]*/, 'type.identifier'],

      // 空白字符
      { include: '@whitespace' },

      // 数字
      [/@digits/, 'number'],

      // 字符串：双引号
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // 未闭合的字符串
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string_double' }],

      // 字符串：单引号
      [/'([^'\\]|\\.)*$/, 'string.invalid'], // 未闭合的字符串
      [/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],

      // 分隔符和括号
      [/[{}()\[\]]/, '@brackets'],
      [/[;,.]/, 'delimiter'],

      // 操作符
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'operator',
            '@default': '',
          },
        },
      ],
    ],

    // 双引号字符串
    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],

    // 单引号字符串
    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],

    // 空白字符和注释
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],

    // 多行注释
    comment: [
      [/[^/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],
  },
};

/**
 * 注册 Slide DSL 语言到 Monaco Editor
 */
export function registerSlideDSLLanguage(): void {
  monaco.languages.register({ id: 'slide-dsl' });
  monaco.languages.setMonarchTokensProvider('slide-dsl', slideDSLMonarchDefinition);
}
