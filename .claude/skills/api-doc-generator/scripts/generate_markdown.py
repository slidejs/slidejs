#!/usr/bin/env python3
"""
Markdown 文档生成器
根据提取的 API 信息生成 Markdown 格式的文档
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime


class MarkdownGenerator:
    """Markdown 文档生成器"""

    def __init__(self, api_info: Dict[str, Any]):
        self.api_info = api_info
        self.language = api_info.get('language', 'unknown')

    def generate(self) -> str:
        """生成完整的 Markdown 文档"""
        sections = [
            self._generate_header(),
            self._generate_overview(),
            self._generate_functions_section(),
            self._generate_classes_section(),
            self._generate_interfaces_section(),
            self._generate_types_section(),
        ]

        # 过滤空章节
        return '\n\n'.join(filter(None, sections))

    def _generate_header(self) -> str:
        """生成文档头部"""
        file_name = Path(self.api_info.get('file', 'API')).name
        return f"""# API 文档: {file_name}

> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
>
> 语言: {self.language.upper()}

---
"""

    def _generate_overview(self) -> str:
        """生成概览"""
        functions_count = len(self.api_info.get('functions', []))
        classes_count = len(self.api_info.get('classes', []))
        interfaces_count = len(self.api_info.get('interfaces', []))
        types_count = len(self.api_info.get('types', []))

        overview = "## 📋 概览\n\n"
        overview += "| 类型 | 数量 |\n"
        overview += "|------|------|\n"

        if functions_count > 0:
            overview += f"| 函数 | {functions_count} |\n"
        if classes_count > 0:
            overview += f"| 类 | {classes_count} |\n"
        if interfaces_count > 0:
            overview += f"| 接口 | {interfaces_count} |\n"
        if types_count > 0:
            overview += f"| 类型 | {types_count} |\n"

        return overview

    def _generate_functions_section(self) -> Optional[str]:
        """生成函数文档"""
        functions = self.api_info.get('functions', [])
        if not functions:
            return None

        section = "## 🔧 函数\n\n"

        for func in functions:
            section += self._generate_function_doc(func)
            section += "\n---\n\n"

        return section.rstrip('\n---\n\n')

    def _generate_function_doc(self, func: Dict[str, Any]) -> str:
        """生成单个函数文档"""
        doc = f"### {func['name']}\n\n"

        # 添加标签
        badges = []
        if func.get('is_exported'):
            badges.append('`exported`')
        if func.get('is_async'):
            badges.append('`async`')
        if badges:
            doc += ' '.join(badges) + '\n\n'

        # 添加位置信息
        doc += f"**位置**: 第 {func.get('line', '?')} 行\n\n"

        # 添加 docstring 或 JSDoc
        docstring = func.get('docstring') or func.get('jsdoc')
        if docstring:
            doc += f"**说明**:\n```\n{docstring}\n```\n\n"

        # Python 函数参数
        if self.language == 'python' and func.get('args'):
            doc += "**参数**:\n"
            for arg in func['args']:
                doc += f"- `{arg}`\n"
            doc += "\n"

        # Python 返回值
        if self.language == 'python' and func.get('returns'):
            doc += f"**返回**: `{func['returns']}`\n\n"

        # 装饰器
        if func.get('decorators'):
            doc += "**装饰器**: " + ', '.join(f"`@{d}`" for d in func['decorators']) + "\n\n"

        return doc

    def _generate_classes_section(self) -> Optional[str]:
        """生成类文档"""
        classes = self.api_info.get('classes', [])
        if not classes:
            return None

        section = "## 📦 类\n\n"

        for cls in classes:
            section += self._generate_class_doc(cls)
            section += "\n---\n\n"

        return section.rstrip('\n---\n\n')

    def _generate_class_doc(self, cls: Dict[str, Any]) -> str:
        """生成单个类文档"""
        doc = f"### {cls['name']}\n\n"

        # 添加标签
        if cls.get('is_exported'):
            doc += '`exported` '
        doc += "\n\n"

        # 添加位置信息
        doc += f"**位置**: 第 {cls.get('line', '?')} 行\n\n"

        # 继承信息
        if cls.get('extends'):
            extends = cls['extends']
            if isinstance(extends, list):
                doc += f"**继承**: {', '.join(f'`{e}`' for e in extends)}\n\n"
            else:
                doc += f"**继承**: `{extends}`\n\n"

        # 实现的接口
        if cls.get('implements'):
            doc += f"**实现**: {', '.join(f'`{i}`' for i in cls['implements'])}\n\n"

        # 基类
        if cls.get('bases'):
            doc += f"**基类**: {', '.join(f'`{b}`' for b in cls['bases'])}\n\n"

        # Docstring 或 JSDoc
        docstring = cls.get('docstring') or cls.get('jsdoc')
        if docstring:
            doc += f"**说明**:\n```\n{docstring}\n```\n\n"

        # 方法列表
        methods = cls.get('methods', [])
        if methods:
            doc += "**方法**:\n\n"
            for method in methods:
                badges = []
                if method.get('is_static'):
                    badges.append('`static`')
                if method.get('is_classmethod'):
                    badges.append('`classmethod`')

                badge_str = ' '.join(badges) + ' ' if badges else ''
                doc += f"- {badge_str}`{method['name']}()` - 第 {method.get('line', '?')} 行\n"

                if method.get('docstring'):
                    doc += f"  > {method['docstring']}\n"

            doc += "\n"

        return doc

    def _generate_interfaces_section(self) -> Optional[str]:
        """生成接口文档"""
        interfaces = self.api_info.get('interfaces', [])
        if not interfaces:
            return None

        section = "## 🔌 接口\n\n"

        for interface in interfaces:
            section += self._generate_interface_doc(interface)
            section += "\n---\n\n"

        return section.rstrip('\n---\n\n')

    def _generate_interface_doc(self, interface: Dict[str, Any]) -> str:
        """生成单个接口文档"""
        doc = f"### {interface['name']}\n\n"

        if interface.get('is_exported'):
            doc += '`exported`\n\n'

        doc += f"**位置**: 第 {interface.get('line', '?')} 行\n\n"

        # 继承的接口
        if interface.get('extends'):
            doc += f"**继承**: {', '.join(f'`{e}`' for e in interface['extends'])}\n\n"

        # JSDoc
        if interface.get('jsdoc'):
            doc += f"**说明**:\n```\n{interface['jsdoc']}\n```\n\n"

        return doc

    def _generate_types_section(self) -> Optional[str]:
        """生成类型别名文档"""
        types = self.api_info.get('types', [])
        if not types:
            return None

        section = "## 📝 类型别名\n\n"

        for type_alias in types:
            section += self._generate_type_doc(type_alias)
            section += "\n---\n\n"

        return section.rstrip('\n---\n\n')

    def _generate_type_doc(self, type_alias: Dict[str, Any]) -> str:
        """生成单个类型别名文档"""
        doc = f"### {type_alias['name']}\n\n"

        if type_alias.get('is_exported'):
            doc += '`exported`\n\n'

        doc += f"**位置**: 第 {type_alias.get('line', '?')} 行\n\n"

        if type_alias.get('jsdoc'):
            doc += f"**说明**:\n```\n{type_alias['jsdoc']}\n```\n\n"

        return doc


def generate_markdown(api_info: Dict[str, Any]) -> str:
    """
    生成 Markdown 文档

    Args:
        api_info: API 信息字典

    Returns:
        Markdown 格式的文档字符串
    """
    generator = MarkdownGenerator(api_info)
    return generator.generate()


def main():
    """命令行入口"""
    if len(sys.argv) < 2:
        print("用法: python generate_markdown.py <api_info_json_file> [output_file]")
        print("示例: python generate_markdown.py api_info.json api_doc.md")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    # 读取 API 信息
    with open(input_file, 'r', encoding='utf-8') as f:
        api_info = json.load(f)

    # 生成文档
    markdown = generate_markdown(api_info)

    # 输出到文件或标准输出
    if output_file:
        Path(output_file).write_text(markdown, encoding='utf-8')
        print(f"✅ 文档已生成: {output_file}")
    else:
        print(markdown)


if __name__ == '__main__':
    main()
