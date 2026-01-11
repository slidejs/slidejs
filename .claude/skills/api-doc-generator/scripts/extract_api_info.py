#!/usr/bin/env python3
"""
API 信息提取工具
从代码文件中提取 API 相关信息（函数、类、接口、端点等）
"""

import ast
import json
import re
from pathlib import Path
from typing import Dict, List, Any, Optional
import sys


class APIExtractor:
    """API 信息提取器基类"""

    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = self.file_path.read_text(encoding='utf-8')

    def extract(self) -> Dict[str, Any]:
        """提取 API 信息"""
        raise NotImplementedError


class PythonAPIExtractor(APIExtractor):
    """Python API 提取器"""

    def extract(self) -> Dict[str, Any]:
        """提取 Python 文件中的 API 信息"""
        try:
            tree = ast.parse(self.content)
            return {
                'file': str(self.file_path),
                'language': 'python',
                'functions': self._extract_functions(tree),
                'classes': self._extract_classes(tree),
                'imports': self._extract_imports(tree),
            }
        except SyntaxError as e:
            return {'error': f'语法错误: {str(e)}'}

    def _extract_functions(self, tree: ast.AST) -> List[Dict[str, Any]]:
        """提取函数信息"""
        functions = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                functions.append({
                    'name': node.name,
                    'line': node.lineno,
                    'docstring': ast.get_docstring(node),
                    'args': [arg.arg for arg in node.args.args],
                    'decorators': [d.id if isinstance(d, ast.Name) else str(d) for d in node.decorator_list],
                    'returns': self._get_return_annotation(node),
                })
        return functions

    def _extract_classes(self, tree: ast.AST) -> List[Dict[str, Any]]:
        """提取类信息"""
        classes = []
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                classes.append({
                    'name': node.name,
                    'line': node.lineno,
                    'docstring': ast.get_docstring(node),
                    'methods': self._extract_class_methods(node),
                    'bases': [base.id if isinstance(base, ast.Name) else str(base) for base in node.bases],
                })
        return classes

    def _extract_class_methods(self, class_node: ast.ClassDef) -> List[Dict[str, Any]]:
        """提取类方法"""
        methods = []
        for item in class_node.body:
            if isinstance(item, ast.FunctionDef):
                methods.append({
                    'name': item.name,
                    'line': item.lineno,
                    'docstring': ast.get_docstring(item),
                    'args': [arg.arg for arg in item.args.args],
                    'is_static': any(isinstance(d, ast.Name) and d.id == 'staticmethod' for d in item.decorator_list),
                    'is_classmethod': any(isinstance(d, ast.Name) and d.id == 'classmethod' for d in item.decorator_list),
                })
        return methods

    def _extract_imports(self, tree: ast.AST) -> List[str]:
        """提取导入语句"""
        imports = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imports.extend([alias.name for alias in node.names])
            elif isinstance(node, ast.ImportFrom):
                module = node.module or ''
                imports.extend([f"{module}.{alias.name}" for alias in node.names])
        return imports

    def _get_return_annotation(self, node: ast.FunctionDef) -> Optional[str]:
        """获取返回值类型注解"""
        if node.returns:
            return ast.unparse(node.returns)
        return None


class TypeScriptAPIExtractor(APIExtractor):
    """TypeScript/JavaScript API 提取器"""

    def extract(self) -> Dict[str, Any]:
        """提取 TypeScript/JavaScript 文件中的 API 信息"""
        return {
            'file': str(self.file_path),
            'language': 'typescript',
            'functions': self._extract_functions(),
            'classes': self._extract_classes(),
            'interfaces': self._extract_interfaces(),
            'types': self._extract_types(),
            'exports': self._extract_exports(),
        }

    def _extract_functions(self) -> List[Dict[str, Any]]:
        """提取函数（简单正则匹配）"""
        # 匹配函数声明：function name(...) 或 const name = (...) => 或 export function name(...)
        pattern = r'(?:export\s+)?(?:async\s+)?(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>)'
        functions = []

        for match in re.finditer(pattern, self.content):
            name = match.group(1) or match.group(2)
            if name:
                # 提取 JSDoc 注释
                jsdoc = self._extract_jsdoc_before(match.start())
                functions.append({
                    'name': name,
                    'line': self.content[:match.start()].count('\n') + 1,
                    'jsdoc': jsdoc,
                    'is_exported': 'export' in match.group(0),
                    'is_async': 'async' in match.group(0),
                })

        return functions

    def _extract_classes(self) -> List[Dict[str, Any]]:
        """提取类"""
        pattern = r'(?:export\s+)?(?:abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?'
        classes = []

        for match in re.finditer(pattern, self.content):
            classes.append({
                'name': match.group(1),
                'line': self.content[:match.start()].count('\n') + 1,
                'extends': match.group(2),
                'implements': [i.strip() for i in (match.group(3) or '').split(',')] if match.group(3) else [],
                'is_exported': 'export' in match.group(0),
                'jsdoc': self._extract_jsdoc_before(match.start()),
            })

        return classes

    def _extract_interfaces(self) -> List[Dict[str, Any]]:
        """提取接口"""
        pattern = r'(?:export\s+)?interface\s+(\w+)(?:\s+extends\s+([\w,\s]+))?'
        interfaces = []

        for match in re.finditer(pattern, self.content):
            interfaces.append({
                'name': match.group(1),
                'line': self.content[:match.start()].count('\n') + 1,
                'extends': [e.strip() for e in (match.group(2) or '').split(',')] if match.group(2) else [],
                'is_exported': 'export' in match.group(0),
                'jsdoc': self._extract_jsdoc_before(match.start()),
            })

        return interfaces

    def _extract_types(self) -> List[Dict[str, Any]]:
        """提取类型别名"""
        pattern = r'(?:export\s+)?type\s+(\w+)\s*='
        types = []

        for match in re.finditer(pattern, self.content):
            types.append({
                'name': match.group(1),
                'line': self.content[:match.start()].count('\n') + 1,
                'is_exported': 'export' in match.group(0),
                'jsdoc': self._extract_jsdoc_before(match.start()),
            })

        return types

    def _extract_exports(self) -> List[str]:
        """提取导出"""
        pattern = r'export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)\s+(\w+)'
        return [match.group(1) for match in re.finditer(pattern, self.content)]

    def _extract_jsdoc_before(self, position: int) -> Optional[str]:
        """提取指定位置前的 JSDoc 注释"""
        # 从位置向前查找最近的 /** ... */ 注释
        before = self.content[:position]
        match = re.search(r'/\*\*[\s\S]*?\*/', before[::-1])
        if match:
            jsdoc = match.group(0)[::-1]
            return jsdoc.strip()
        return None


def extract_api_info(file_path: str) -> Dict[str, Any]:
    """
    提取文件的 API 信息

    Args:
        file_path: 文件路径

    Returns:
        包含 API 信息的字典
    """
    path = Path(file_path)

    if not path.exists():
        return {'error': f'文件不存在: {file_path}'}

    # 根据文件扩展名选择提取器
    suffix = path.suffix.lower()

    if suffix == '.py':
        extractor = PythonAPIExtractor(file_path)
    elif suffix in ['.ts', '.tsx', '.js', '.jsx']:
        extractor = TypeScriptAPIExtractor(file_path)
    else:
        return {'error': f'不支持的文件类型: {suffix}'}

    return extractor.extract()


def main():
    """命令行入口"""
    if len(sys.argv) < 2:
        print("用法: python extract_api_info.py <file_path>")
        print("示例: python extract_api_info.py src/api/users.py")
        sys.exit(1)

    file_path = sys.argv[1]
    result = extract_api_info(file_path)

    # 输出 JSON 格式结果
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
