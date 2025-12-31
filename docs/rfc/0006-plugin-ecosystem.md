# RFC 0006: SlideJS 插件生态系统

## 元数据

- **RFC ID**: 0006
- **标题**: SlideJS 插件生态系统 - 插件市场与分发机制
- **状态**: 草案
- **创建日期**: 2025-12-29
- **作者**: AI Assistant
- **相关 RFC**: RFC 0002 (Slide Runner)

## 摘要

本 RFC 定义了 SlideJS 插件生态系统的设计，包括插件规范、分发机制、插件市场和插件开发工具。目标是建立一个开放、易用的插件生态系统，让社区能够轻松创建和分享插件。

## 动机

### 当前限制

1. **无插件分发机制**: 用户无法轻松发现和安装插件
2. **无插件规范**: 缺乏统一的插件开发标准
3. **无插件市场**: 没有集中展示和分发插件的地方
4. **无插件开发工具**: 缺乏插件开发的脚手架和工具
5. **无插件版本管理**: 无法管理插件的版本和依赖

### 设计目标

1. **易于开发**: 提供简单的插件开发 API 和工具
2. **易于分发**: 支持 npm 和其他分发渠道
3. **易于发现**: 提供插件市场和搜索功能
4. **类型安全**: 完整的 TypeScript 支持
5. **向后兼容**: 不影响现有插件系统

## 详细设计

### 1. 插件规范

#### 1.1 插件接口扩展

```typescript
export interface SlideRunnerPlugin {
  /**
   * 插件名称（必须唯一）
   */
  name: string;

  /**
   * 插件版本
   */
  version?: string;

  /**
   * 插件描述
   */
  description?: string;

  /**
   * 插件作者
   */
  author?: string;

  /**
   * 插件依赖的其他插件
   */
  dependencies?: string[];

  /**
   * 插件配置选项
   */
  options?: Record<string, unknown>;

  /**
   * 插件初始化（可选）
   */
  initialize?(runner: SlideRunner): Promise<void> | void;

  /**
   * 插件销毁（可选）
   */
  destroy?(): Promise<void> | void;

  // ... 现有的生命周期钩子
}
```

#### 1.2 插件包结构

```
my-slidejs-plugin/
├── package.json          # 包含插件元数据
├── src/
│   ├── index.ts          # 插件入口
│   └── types.ts          # 类型定义
├── README.md             # 插件文档
└── dist/                 # 构建输出
```

#### 1.3 package.json 规范

```json
{
  "name": "@slidejs/plugin-my-plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": ["slidejs", "slidejs-plugin"],
  "slidejs": {
    "plugin": true,
    "compatibility": {
      "runner": ">=0.1.0",
      "core": ">=0.1.0"
    }
  },
  "peerDependencies": {
    "@slidejs/runner": "workspace:*",
    "@slidejs/core": "workspace:*"
  }
}
```

### 2. 插件开发工具

#### 2.1 插件脚手架

```bash
npx create-slidejs-plugin my-plugin
```

生成标准的插件项目结构。

#### 2.2 插件开发 CLI

```bash
# 创建新插件
slidejs-plugin create my-plugin

# 构建插件
slidejs-plugin build

# 测试插件
slidejs-plugin test

# 发布插件
slidejs-plugin publish
```

### 3. 插件市场

#### 3.1 市场网站

- 插件列表和搜索
- 插件详情页面
- 评分和评论
- 下载统计
- 文档和示例

#### 3.2 插件分类

- **渲染增强**: 主题、动画、过渡效果
- **功能扩展**: 自动播放、键盘快捷键、全屏
- **集成**: 分析、录制、分享
- **开发工具**: 调试、热重载、预览

#### 3.3 插件安装

```bash
# 通过 npm 安装
npm install @slidejs/plugin-auto-play

# 通过 CLI 安装
slidejs-plugin install @slidejs/plugin-auto-play
```

### 4. 官方插件示例

#### 4.1 Auto Play 插件

```typescript
import type { SlideRunnerPlugin } from '@slidejs/runner';

export const autoPlayPlugin: SlideRunnerPlugin = {
  name: '@slidejs/plugin-auto-play',
  version: '1.0.0',
  description: '自动播放幻灯片',
  options: {
    interval: 5000, // 5秒切换
    pauseOnHover: true,
  },

  initialize(runner) {
    let intervalId: number | null = null;

    this.afterRender = () => {
      intervalId = setInterval(() => {
        const current = runner.getCurrentIndex();
        const total = runner.getTotalSlides();

        if (current < total - 1) {
          runner.navigateTo(current + 1);
        } else {
          // 循环播放
          runner.navigateTo(0);
        }
      }, this.options?.interval || 5000);
    };

    this.destroy = () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  },
};
```

#### 4.2 Analytics 插件

```typescript
export const analyticsPlugin: SlideRunnerPlugin = {
  name: '@slidejs/plugin-analytics',
  version: '1.0.0',
  description: '幻灯片分析统计',

  afterSlideChange(from, to) {
    // 发送分析事件
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'slide_change', {
        from,
        to,
        timestamp: Date.now(),
      });
    }
  },
};
```

### 5. 插件加载机制

#### 5.1 动态加载

```typescript
import { loadPlugin } from '@slidejs/runner/plugins';

// 从 npm 包加载
const plugin = await loadPlugin('@slidejs/plugin-auto-play');

// 从本地文件加载
const localPlugin = await loadPlugin('./plugins/my-plugin.js');

// 使用插件
const runner = new SlideRunner({
  container: '#app',
  adapter: new RevealJsAdapter(),
  plugins: [plugin],
});
```

#### 5.2 插件注册表

```typescript
import { PluginRegistry } from '@slidejs/runner/plugins';

// 注册插件
PluginRegistry.register('my-plugin', myPlugin);

// 获取插件
const plugin = PluginRegistry.get('my-plugin');

// 列出所有插件
const allPlugins = PluginRegistry.list();
```

## 实施计划

### Phase 1: 插件规范

- [ ] 定义插件接口扩展
- [ ] 创建插件包结构规范
- [ ] 编写插件开发文档

### Phase 2: 开发工具

- [ ] 创建插件脚手架工具
- [ ] 开发插件 CLI
- [ ] 编写开发指南

### Phase 3: 插件市场（MVP）

- [ ] 创建简单的插件列表页面
- [ ] 实现插件搜索功能
- [ ] 集成 npm 包信息

### Phase 4: 官方插件

- [ ] 开发 Auto Play 插件
- [ ] 开发 Analytics 插件
- [ ] 开发其他核心插件

### Phase 5: 完整市场

- [ ] 插件详情页面
- [ ] 评分和评论系统
- [ ] 下载统计
- [ ] 插件分类和标签

## 风险评估

### 技术风险

1. **插件兼容性**:
   - 风险等级: 中
   - 缓解: 版本管理和兼容性检查

2. **安全性**:
   - 风险等级: 中
   - 缓解: 插件沙箱、代码审查

3. **维护成本**:
   - 风险等级: 低
   - 缓解: 社区驱动，官方仅维护核心插件

## 替代方案

### 方案 A: 不建立插件市场

- **优点**: 降低维护成本
- **缺点**: 插件发现困难，生态系统发展缓慢

### 方案 B: 仅支持 npm 分发

- **优点**: 简单，利用现有基础设施
- **缺点**: 缺乏插件特定的功能和体验

**选择**: 我们选择建立完整的插件生态系统（本 RFC），因为：

1. 促进社区贡献
2. 加速功能扩展
3. 提升用户体验

## 参考资料

- [npm Package Guidelines](https://docs.npmjs.com/packages-and-modules)
- [VS Code Extension Marketplace](https://code.visualstudio.com/api/references/extension-manifest)
- RFC 0002: Slide Runner

## 变更历史

- 2025-12-29: 初始草稿
