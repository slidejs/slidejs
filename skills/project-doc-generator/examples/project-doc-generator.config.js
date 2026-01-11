/**
 * 项目架构文档生成器配置示例
 *
 * 将此文件复制到项目根目录并根据需要修改
 */

module.exports = {
  // 项目根目录
  root: '.',

  // 输出目录
  output: 'docs/architecture',

  // 输出格式: markdown | html | pdf | confluence
  format: 'markdown',

  // 分析深度: basic | detailed | comprehensive
  depth: 'detailed',

  // 是否包含代码示例
  includeExamples: true,

  // 是否生成架构图
  generateDiagrams: true,

  // 是否分析依赖关系
  analyzeDependencies: true,

  // 是否使用 AI 增强
  aiEnhanced: true,

  // 排除的目录和文件（glob 模式）
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.git/**',
    '**/coverage/**',
    '**/__tests__/**',
    '**/*.test.js',
    '**/*.spec.ts',
  ],

  // 模块识别规则
  modules: {
    // 模块目录模式
    patterns: ['src/*', 'lib/*', 'packages/*', 'apps/*'],

    // 最小文件数（少于此数不算模块）
    minFiles: 2,

    // 是否递归查找子模块
    recursive: true,
  },

  // 架构图配置
  diagrams: {
    // 生成的图表类型
    types: ['modules', 'techStack', 'directory', 'dependencies'],

    // Mermaid 主题: default | forest | dark | neutral
    theme: 'default',

    // 图表方向: TB | LR | BT | RL
    direction: 'TB',

    // 是否生成 SVG 图片
    generateImages: false,

    // 最大节点数（避免图表过于复杂）
    maxNodes: 50,
  },

  // 文档内容配置
  content: {
    // 包含的章节
    sections: [
      'overview', // 项目概览
      'techStack', // 技术栈
      'architecture', // 架构设计
      'modules', // 模块说明
      'dependencies', // 依赖关系
      'deployment', // 部署说明
      'testing', // 测试说明
    ],

    // 是否包含目录
    toc: true,

    // 是否包含页眉页脚
    headerFooter: true,

    // 是否显示生成时间
    showTimestamp: true,

    // 是否显示项目统计
    showStatistics: true,
  },

  // AI 分析配置
  ai: {
    // 是否启用 AI 分析
    enabled: true,

    // 分析维度
    dimensions: [
      'patterns', // 架构模式识别
      'quality', // 代码质量评估
      'maintainability', // 可维护性分析
      'scalability', // 可扩展性分析
      'security', // 安全性检查
    ],

    // 是否生成改进建议
    recommendations: true,

    // 建议的最小优先级: low | medium | high
    minPriority: 'medium',
  },

  // 技术栈识别配置
  techStack: {
    // 是否自动识别
    autoDetect: true,

    // 手动指定技术栈（会与自动识别结果合并）
    custom: {
      languages: [],
      frameworks: [],
      tools: [],
      databases: [],
    },
  },

  // 依赖分析配置
  dependencies: {
    // 是否分析 npm 依赖
    npm: true,

    // 是否分析模块依赖
    modules: true,

    // 是否生成依赖图
    graph: true,

    // 最大依赖深度
    maxDepth: 3,

    // 是否检查循环依赖
    checkCycles: true,

    // 是否显示依赖大小
    showSize: false,
  },

  // 代码统计配置
  statistics: {
    // 统计的指标
    metrics: [
      'fileCount', // 文件数量
      'lineCount', // 代码行数
      'moduleCount', // 模块数量
      'functionCount', // 函数数量
      'classCount', // 类数量
      'complexity', // 复杂度
    ],

    // 是否按语言分类
    byLanguage: true,

    // 是否按模块分类
    byModule: true,
  },

  // 输出格式配置
  formats: {
    markdown: {
      // 标题级别偏移
      headingOffset: 0,

      // 是否使用 GFM (GitHub Flavored Markdown)
      gfm: true,

      // 代码块语言
      codeBlockLanguage: 'javascript',
    },

    html: {
      // HTML 主题
      theme: 'default',

      // 是否包含 CSS
      includeCss: true,

      // 是否包含 JavaScript
      includeJs: false,

      // 是否生成单页面
      singlePage: true,
    },

    pdf: {
      // 页面大小: A4 | Letter
      pageSize: 'A4',

      // 页面方向: portrait | landscape
      orientation: 'portrait',

      // 是否包含页码
      pageNumbers: true,

      // 是否包含目录
      toc: true,
    },
  },

  // 模板配置
  templates: {
    // 自定义模板目录
    dir: null,

    // 模板引擎: handlebars | ejs | pug
    engine: 'handlebars',

    // 自定义变量
    vars: {
      author: 'Your Name',
      copyright: '© 2024 Your Company',
      license: 'MIT',
    },
  },

  // 钩子函数
  hooks: {
    // 生成前执行
    beforeGenerate: async context => {
      console.log('开始生成文档...');
      // 可以在这里执行预处理
    },

    // 生成后执行
    afterGenerate: async context => {
      console.log('文档生成完成！');
      // 可以在这里执行后处理，如发送通知
    },

    // 分析前执行
    beforeAnalyze: async context => {
      // 可以在这里执行预分析处理
    },

    // 分析后执行
    afterAnalyze: async context => {
      // 可以在这里处理分析结果
    },
  },

  // 日志配置
  logging: {
    // 日志级别: silent | error | warn | info | debug
    level: 'info',

    // 是否显示进度条
    progress: true,

    // 是否输出详细信息
    verbose: false,

    // 日志文件路径（null 表示不写入文件）
    file: null,
  },

  // 性能配置
  performance: {
    // 并发处理文件数
    concurrency: 4,

    // 文件大小限制（MB）
    maxFileSize: 10,

    // 超时时间（秒）
    timeout: 300,
  },

  // 缓存配置
  cache: {
    // 是否启用缓存
    enabled: true,

    // 缓存目录
    dir: '.cache/project-doc-generator',

    // 缓存有效期（小时）
    ttl: 24,
  },
};
