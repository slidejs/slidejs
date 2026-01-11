# OpenAPI 3.0 规范参考

本文档提供 OpenAPI 3.0 规范的快速参考和最佳实践。

## 基础结构

```yaml
openapi: 3.0.0
info:
  title: API 标题
  description: API 描述
  version: 1.0.0
  contact:
    name: API 支持
    email: support@example.com
servers:
  - url: https://api.example.com/v1
    description: 生产环境
  - url: https://staging-api.example.com/v1
    description: 测试环境
paths:
  # API 端点定义
components:
  # 可复用组件
security:
  # 安全方案
```

## 路径和操作

### GET 请求

```yaml
paths:
  /users:
    get:
      summary: 获取用户列表
      description: 返回所有用户的列表
      tags:
        - Users
      parameters:
        - name: limit
          in: query
          description: 返回的最大用户数
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: offset
          in: query
          description: 跳过的用户数
          required: false
          schema:
            type: integer
            minimum: 0
            default: 0
      responses:
        '200':
          description: 成功返回用户列表
          content:
            application/json:
              schema:
                type: object
                properties:
                  users:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  total:
                    type: integer
        '400':
          description: 无效的请求参数
        '500':
          description: 服务器错误
```

### POST 请求

```yaml
paths:
  /users:
    post:
      summary: 创建新用户
      description: 创建一个新的用户账户
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: 用户创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: 无效的请求数据
        '409':
          description: 用户已存在
```

### 路径参数

```yaml
paths:
  /users/{userId}:
    get:
      summary: 获取用户详情
      tags:
        - Users
      parameters:
        - name: userId
          in: path
          required: true
          description: 用户 ID
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: 成功返回用户详情
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: 用户不存在
```

## 组件定义

### Schema（数据模型）

```yaml
components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
      properties:
        id:
          type: string
          format: uuid
          description: 用户唯一标识符
        email:
          type: string
          format: email
          description: 用户邮箱
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: 用户名称
        age:
          type: integer
          minimum: 0
          maximum: 150
          description: 用户年龄
        createdAt:
          type: string
          format: date-time
          description: 创建时间
      example:
        id: 123e4567-e89b-12d3-a456-426614174000
        email: user@example.com
        name: John Doe
        age: 30
        createdAt: 2024-01-01T00:00:00Z

    CreateUserRequest:
      type: object
      required:
        - email
        - name
      properties:
        email:
          type: string
          format: email
        name:
          type: string
        age:
          type: integer

    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
```

### 响应模板

```yaml
components:
  responses:
    NotFound:
      description: 资源不存在
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: 未授权
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    ServerError:
      description: 服务器内部错误
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

### 参数模板

```yaml
components:
  parameters:
    PageLimit:
      name: limit
      in: query
      description: 每页返回的项目数
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
    PageOffset:
      name: offset
      in: query
      description: 跳过的项目数
      schema:
        type: integer
        minimum: 0
        default: 0
```

## 安全定义

### API Key

```yaml
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

security:
  - ApiKeyAuth: []
```

### Bearer Token (JWT)

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```

### OAuth 2.0

```yaml
components:
  securitySchemes:
    OAuth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://example.com/oauth/authorize
          tokenUrl: https://example.com/oauth/token
          scopes:
            read: 读取权限
            write: 写入权限
            admin: 管理员权限

security:
  - OAuth2:
      - read
      - write
```

## 数据类型

| 类型 | 格式 | 描述 |
|------|------|------|
| `integer` | `int32` | 32位整数 |
| `integer` | `int64` | 64位整数 |
| `number` | `float` | 浮点数 |
| `number` | `double` | 双精度浮点数 |
| `string` | - | 字符串 |
| `string` | `byte` | Base64编码 |
| `string` | `binary` | 二进制数据 |
| `string` | `date` | 日期 (RFC3339) |
| `string` | `date-time` | 日期时间 (RFC3339) |
| `string` | `password` | 密码 |
| `string` | `email` | 邮箱地址 |
| `string` | `uuid` | UUID |
| `string` | `uri` | URI |
| `boolean` | - | 布尔值 |

## 最佳实践

1. **使用标签**: 用 `tags` 对端点进行分组
2. **复用组件**: 使用 `$ref` 引用可复用的 schema 和响应
3. **详细描述**: 为每个端点和参数提供清晰的描述
4. **示例数据**: 在 schema 中包含 `example` 字段
5. **版本控制**: 在 URL 中包含 API 版本号
6. **错误响应**: 定义标准的错误响应格式
7. **安全性**: 明确定义认证和授权方案
8. **验证**: 使用 `minimum`、`maximum`、`pattern` 等进行数据验证
