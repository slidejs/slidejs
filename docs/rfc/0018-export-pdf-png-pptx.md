# RFC 0018: PDF/PNG/PPTX 导出功能

## 元数据

- **RFC ID**: 0018
- **标题**: PDF/PNG/PPTX 导出功能
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0002 (Slide Runner), RFC 0013 (Markdown 支持)

## 摘要

本 RFC 提议为 SlideJS 添加导出功能，支持将幻灯片导出为 PDF、PNG 图片或 PPTX 文件，方便分享和打印。

## 动机

### 背景问题

1. **分享需求**: 用户需要将幻灯片分享给他人
2. **打印需求**: 用户需要打印幻灯片
3. **归档需求**: 用户需要保存幻灯片为文件

### 设计目标

1. **PDF 导出**: 支持导出为 PDF 文件
2. **PNG 导出**: 支持导出为 PNG 图片（每张幻灯片单独导出或批量导出）
3. **PPTX 导出**: 支持导出为 PPTX 文件
4. **自定义配置**: 支持自定义页面大小、边距等

## 详细设计

### 技术实现

1. **PDF 导出**:
   - 使用 `puppeteer` 或 `playwright` 渲染幻灯片
   - 支持自定义页面大小和边距
   - 支持多页导出
   - 支持打印样式

2. **PNG 导出**:
   - 使用 `puppeteer` 或 `playwright` 截图
   - 支持每张幻灯片单独导出
   - 支持批量导出
   - 支持自定义分辨率

3. **PPTX 导出**:
   - 使用 `pptxgenjs` 生成 PPTX
   - 将幻灯片内容转换为 PPTX 格式
   - 支持图片、文本、图表等

4. **新包**: `@slidejs/export`
   - `exportToPDF()` - 导出为 PDF
   - `exportToPNG()` - 导出为 PNG
   - `exportToPPTX()` - 导出为 PPTX

### 实施步骤

1. **创建 `@slidejs/export` 包**:
   - 安装 `puppeteer` 或 `playwright` 依赖
   - 安装 `pptxgenjs` 依赖
   - 实现 PDF 导出功能
   - 实现 PNG 导出功能
   - 实现 PPTX 导出功能

2. **CLI 工具集成**:
   - 添加 `slidejs export pdf` 命令
   - 添加 `slidejs export png` 命令
   - 添加 `slidejs export pptx` 命令

3. **API 集成**:
   - 在 Runner 中添加导出方法
   - 支持编程式导出

4. **测试**:
   - 单元测试覆盖导出功能
   - 测试 PDF 导出
   - 测试 PNG 导出
   - 测试 PPTX 导出

## 技术细节

### PDF 导出

```typescript
import puppeteer from 'puppeteer';

async function exportToPDF(url: string, options: PDFOptions): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const pdf = await page.pdf({
    format: options.format || 'A4',
    margin: options.margin || { top: '20px', right: '20px', bottom: '20px', left: '20px' },
  });
  await browser.close();
  return pdf;
}
```

### PNG 导出

```typescript
async function exportToPNG(url: string, options: PNGOptions): Promise<Buffer[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const screenshots: Buffer[] = [];
  // 遍历每张幻灯片并截图
  for (let i = 0; i < slideCount; i++) {
    await page.evaluate((index) => goToSlide(index), i);
    const screenshot = await page.screenshot({ type: 'png' });
    screenshots.push(screenshot);
  }
  await browser.close();
  return screenshots;
}
```

### PPTX 导出

```typescript
import PptxGenJS from 'pptxgenjs';

async function exportToPPTX(slides: SlideDefinition[]): Promise<Buffer> {
  const pptx = new PptxGenJS();
  for (const slide of slides) {
    const slideObj = pptx.addSlide();
    // 转换幻灯片内容为 PPTX 格式
    slideObj.addText(slide.content.text || '');
    // 添加图片、图表等
  }
  return await pptx.write({ outputType: 'nodebuffer' });
}
```

## 兼容性考虑

1. **现有 Runner**: 所有 Runner 都支持
2. **Node.js**: 导出功能需要在 Node.js 环境中运行
3. **浏览器**: 某些导出功能可以在浏览器中运行（如 Canvas 导出）

## 风险评估

1. **依赖大小**: Puppeteer/Playwright 会增加依赖大小
2. **性能**: 导出操作可能较慢
3. **浏览器兼容性**: 需要现代浏览器支持

## 参考

- [Puppeteer 文档](https://pptr.dev/)
- [Playwright 文档](https://playwright.dev/)
- [pptxgenjs 文档](https://github.com/gitbrent/pptxgenjs)

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **待定**: 选择 Puppeteer 或 Playwright
- **待定**: 开始实施
