---
name: api-doc-generator
description: 'Comprehensive API documentation generator for code projects. Automatically scans source code to extract API information (functions, classes, interfaces, endpoints) and generates professional documentation in multiple formats (Markdown, HTML, OpenAPI). Use when Claude needs to: (1) Generate API documentation for a project, (2) Extract API information from source files, (3) Create OpenAPI/Swagger specifications, (4) Document TypeScript/JavaScript/Python APIs, (5) Scan code and produce structured API references, or (6) Any task involving automatic API documentation generation.'
---

# API Documentation Generator

Generate professional API documentation automatically by scanning your codebase and extracting API information.

## Overview

This skill enables automatic API documentation generation from source code. It supports:

- **Multiple languages**: JavaScript/TypeScript, Python, Java
- **Multiple output formats**: Markdown, HTML, OpenAPI 3.0
- **Automatic extraction**: Functions, classes, interfaces, type definitions, API endpoints
- **Documentation parsing**: JSDoc, Python docstrings, type annotations
- **Professional formatting**: Clean, structured, searchable documentation

## Quick Start

### Generate Markdown Documentation for a Single File

```bash
# Extract API info
python3 scripts/extract_api_info.py src/api/users.ts > api_info.json

# Generate Markdown
python3 scripts/generate_markdown.py api_info.json docs/api.md
```

### Generate Documentation for an Entire Project

1. **Scan the codebase** to identify API files
2. **Extract API information** from each file using `extract_api_info.py`
3. **Generate documentation** in the desired format
4. **Combine** into a single documentation file or separate per module

## Workflows

### Workflow 1: Single File Documentation

Use when the user wants to document a specific file:

1. Run `extract_api_info.py <file_path>` to extract API information
2. Run `generate_markdown.py <api_info.json> <output.md>` to generate documentation
3. Present the generated documentation to the user

### Workflow 2: Project-Wide Documentation

Use when the user wants to document an entire project or module:

1. **Identify API files**: Use `glob` to find all relevant source files (e.g., `src/**/*.ts`, `lib/**/*.py`)
2. **Extract information**: Run `extract_api_info.py` on each file
3. **Generate documentation**: Combine results into a comprehensive documentation file
4. **Organize by module**: Structure documentation with clear sections for each module/file

### Workflow 3: OpenAPI Specification Generation

Use when the user needs an OpenAPI/Swagger spec:

1. Identify API endpoint files (Express routes, FastAPI endpoints, etc.)
2. Extract route definitions, request/response schemas
3. Use the OpenAPI template in `assets/templates/openapi-base.yaml`
4. Generate a complete OpenAPI 3.0 specification
5. Validate against OpenAPI schema

### Workflow 4: Documentation Update

Use when the user wants to update existing documentation:

1. Read existing documentation
2. Extract API information from updated source files
3. Compare with existing documentation
4. Update only changed sections
5. Preserve manual edits and examples

## Supported Languages and Patterns

### JavaScript/TypeScript

**Extractable elements:**

- Functions (regular, arrow, async)
- Classes and methods
- Interfaces
- Type aliases
- JSDoc comments
- Export statements

**Example:**

```typescript
/**
 * Fetch user data from API
 * @param userId - User ID
 * @returns User object
 */
export async function fetchUser(userId: string): Promise<User> {
  // Implementation
}
```

### Python

**Extractable elements:**

- Functions and methods
- Classes
- Docstrings (Google, NumPy, Sphinx styles)
- Type hints
- Decorators (e.g., `@app.route`, `@dataclass`)

**Example:**

```python
def calculate_total(items: List[Item]) -> float:
    """
    Calculate total price of items.

    Args:
        items: List of items to sum

    Returns:
        Total price as float
    """
    return sum(item.price for item in items)
```

## Output Formats

### Markdown

- Clean, readable documentation
- GitHub-flavored markdown
- Includes code examples
- Easy to version control
- Use `generate_markdown.py` script

### HTML

- Styled, searchable documentation
- Navigation sidebar
- Syntax highlighting
- Responsive design
- Convert from Markdown or generate directly

### OpenAPI 3.0

- Industry-standard API specification
- Interactive API documentation (Swagger UI)
- Client code generation support
- API testing integration
- Use `openapi-base.yaml` template

## Best Practices

### For Users

1. **Keep code documented**: Use JSDoc/docstrings for better extraction
2. **Type annotations**: Include types for clearer documentation
3. **Organize exports**: Group related APIs in modules
4. **Examples in comments**: Add usage examples in JSDoc/docstrings
5. **Version your docs**: Commit generated docs to version control

### For Claude

1. **Scan before extracting**: Use `glob` to find all API files first
2. **Handle errors gracefully**: Check for syntax errors in source files
3. **Preserve structure**: Maintain the project's module organization in docs
4. **Include examples**: Extract and include `@example` tags from comments
5. **Cross-reference**: Link related APIs in the documentation
6. **Update incrementally**: When updating, only regenerate changed files

## Scripts Reference

### extract_api_info.py

Extract API information from a source file.

**Usage:**

```bash
python3 scripts/extract_api_info.py <file_path>
```

**Output:** JSON containing functions, classes, interfaces, types, etc.

**Supported extensions:** `.py`, `.ts`, `.tsx`, `.js`, `.jsx`

### generate_markdown.py

Generate Markdown documentation from extracted API information.

**Usage:**

```bash
python3 scripts/generate_markdown.py <api_info.json> [output.md]
```

**Input:** JSON file from `extract_api_info.py`
**Output:** Markdown documentation (stdout or file)

## Templates

### Markdown Template

Located at `assets/templates/markdown-api.md`. Contains:

- Header with metadata
- Overview section
- Quick start guide
- API reference sections
- Examples and FAQ

**Variables:**

- `{{API_NAME}}` - Project/API name
- `{{TIMESTAMP}}` - Generation timestamp
- `{{VERSION}}` - API version
- `{{API_SECTIONS}}` - Generated API documentation
- `{{EXAMPLES}}` - Usage examples

### OpenAPI Template

Located at `assets/templates/openapi-base.yaml`. Contains:

- OpenAPI 3.0 structure
- Standard error responses
- Security schemes
- Reusable components

**Variables:**

- `{{API_TITLE}}` - API title
- `{{API_VERSION}}` - Version number
- `{{SERVER_URL}}` - API base URL
- `{{CONTACT_EMAIL}}` - Support email

## Advanced Features

### Custom Documentation Sections

Add custom sections to generated documentation:

```markdown
## Custom Section

{{CUSTOM_CONTENT}}
```

### Multi-language Projects

For projects with multiple languages:

1. Extract API info from each language separately
2. Generate documentation per language or combine
3. Use clear section headers to distinguish languages

### API Versioning

Document multiple API versions:

1. Extract from version-specific directories
2. Generate separate docs per version
3. Include version badges and deprecation notices

### Integration with CI/CD

Automate documentation generation:

1. Add to build pipeline
2. Generate docs on every commit/release
3. Publish to documentation site automatically
4. Validate documentation coverage

## Reference Documentation

For detailed information on documentation standards:

- **JSDoc patterns**: See [references/jsdoc-patterns.md](references/jsdoc-patterns.md)
- **OpenAPI spec**: See [references/openapi-spec.md](references/openapi-spec.md)

Load these references when you need detailed guidance on:

- JSDoc comment syntax and best practices
- OpenAPI 3.0 specification format
- Complex type definitions
- Security scheme configuration
