#!/usr/bin/env node

/**
 * AI 增强分析工具
 * 使用 AI 分析项目架构和提供洞察
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .option('-r, --root <path>', '项目根目录', '.')
  .option('-a, --analysis-dir <path>', '分析结果目录')
  .option('-o, --output <path>', '输出文件', 'ai-insights.json')
  .parse(process.argv);

const options = program.opts();

/**
 * 基于启发式规则的架构分析
 */
function analyzeArchitecture(structureData) {
  const insights = {
    patterns: [],
    recommendations: [],
    metrics: {},
  };

  // 识别架构模式
  if (structureData.modules && structureData.modules.length > 0) {
    const moduleNames = structureData.modules.map(m => m.name.toLowerCase());

    // 检测 MVC 模式
    if (
      moduleNames.some(n => n.includes('model')) &&
      moduleNames.some(n => n.includes('view')) &&
      moduleNames.some(n => n.includes('controller'))
    ) {
      insights.patterns.push({
        name: 'MVC (Model-View-Controller)',
        description: '项目采用了 MVC 架构模式，实现了关注点分离',
        benefits: ['清晰的职责划分', '便于测试和维护', '支持并行开发'],
      });
    }

    // 检测微服务模式
    if (moduleNames.some(n => n.includes('service')) && structureData.modules.length > 5) {
      insights.patterns.push({
        name: '微服务架构',
        description: '项目采用了微服务架构，将功能拆分为独立的服务',
        benefits: ['独立部署和扩展', '技术栈灵活', '故障隔离'],
      });
    }

    // 检测分层架构
    if (
      moduleNames.some(n => n.includes('domain')) ||
      moduleNames.some(n => n.includes('infrastructure')) ||
      moduleNames.some(n => n.includes('application'))
    ) {
      insights.patterns.push({
        name: '分层架构',
        description: '项目采用了分层架构，清晰地划分了不同层次的职责',
        benefits: ['职责明确', '易于维护', '支持测试'],
      });
    }
  }

  // 代码质量指标
  if (structureData.statistics) {
    const stats = structureData.statistics;

    insights.metrics = {
      codeQuality: calculateCodeQuality(stats),
      modularity: calculateModularity(structureData),
      maintainability: calculateMaintainability(stats),
    };

    // 基于指标生成建议
    if (stats.codeFiles > 0) {
      const avgLinesPerFile = stats.codeLines / stats.codeFiles;

      if (avgLinesPerFile > 300) {
        insights.recommendations.push({
          title: '文件过大',
          description: `平均每个文件有 ${avgLinesPerFile.toFixed(0)} 行代码，建议拆分大文件以提高可维护性`,
          priority: 'medium',
        });
      }
    }

    if (structureData.modules.length < 3 && stats.codeFiles > 20) {
      insights.recommendations.push({
        title: '模块化不足',
        description: '建议将代码组织成更多的模块，以提高代码的组织性和可维护性',
        priority: 'high',
      });
    }

    if (structureData.files.tests.length === 0) {
      insights.recommendations.push({
        title: '缺少测试',
        description: '项目中未发现测试文件，建议添加单元测试和集成测试',
        priority: 'high',
      });
    }
  }

  return insights;
}

/**
 * 计算代码质量分数
 */
function calculateCodeQuality(stats) {
  let score = 100;

  // 代码行数过多扣分
  if (stats.codeLines > 50000) score -= 10;
  if (stats.codeLines > 100000) score -= 10;

  // 文件数量合理性
  const avgLinesPerFile = stats.codeFiles > 0 ? stats.codeLines / stats.codeFiles : 0;
  if (avgLinesPerFile > 300) score -= 15;
  if (avgLinesPerFile > 500) score -= 15;

  return Math.max(0, Math.min(100, score));
}

/**
 * 计算模块化程度
 */
function calculateModularity(structure) {
  if (!structure.modules || structure.modules.length === 0) return 0;

  const moduleCount = structure.modules.length;
  const fileCount = structure.statistics.codeFiles;

  if (fileCount === 0) return 0;

  // 理想情况：每个模块 10-30 个文件
  const avgFilesPerModule = fileCount / moduleCount;

  let score = 100;
  if (avgFilesPerModule > 50) score -= 20;
  if (avgFilesPerModule < 5) score -= 20;

  return Math.max(0, Math.min(100, score));
}

/**
 * 计算可维护性
 */
function calculateMaintainability(stats) {
  let score = 100;

  // 配置文件数量
  if (stats.configFiles === 0) score -= 20;

  // 代码注释率估算（简化版）
  const commentRatio = (stats.totalLines - stats.codeLines) / stats.totalLines;
  if (commentRatio < 0.1) score -= 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * 主函数
 */
function main() {
  console.log('🤖 执行 AI 增强分析...');

  // 加载结构数据
  const structurePath = path.join(options.analysisDir, 'structure.json');
  if (!fs.existsSync(structurePath)) {
    console.error('❌ 未找到结构数据');
    process.exit(1);
  }

  const structureData = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));

  // 执行分析
  const insights = analyzeArchitecture(structureData);

  // 保存结果
  fs.writeFileSync(options.output, JSON.stringify(insights, null, 2));

  console.log('✅ AI 分析完成');
  console.log(`  • 识别模式: ${insights.patterns.length} 个`);
  console.log(`  • 建议数量: ${insights.recommendations.length} 个`);
}

try {
  main();
} catch (error) {
  console.error('❌ 错误:', error.message);
  process.exit(1);
}
