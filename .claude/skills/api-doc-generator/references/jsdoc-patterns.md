# JSDoc 注释模式参考

本文档提供 JSDoc 注释的最佳实践和常用模式。

## 基础 JSDoc 格式

### 函数注释

```javascript
/**
 * 计算两个数的和
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之和
 * @example
 * add(2, 3) // 返回 5
 */
function add(a, b) {
  return a + b;
}
```

### 异步函数

```javascript
/**
 * 从 API 获取用户数据
 * @async
 * @param {string} userId - 用户 ID
 * @returns {Promise<User>} 用户对象
 * @throws {Error} 当用户不存在时抛出错误
 */
async function fetchUser(userId) {
  // 实现
}
```

### 类注释

```javascript
/**
 * 表示一个用户
 * @class
 */
class User {
  /**
   * 创建用户实例
   * @param {string} name - 用户名
   * @param {string} email - 电子邮件
   */
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  /**
   * 获取用户的显示名称
   * @returns {string} 格式化的用户名
   */
  getDisplayName() {
    return `${this.name} <${this.email}>`;
  }
}
```

## TypeScript 特定模式

### 接口注释

```typescript
/**
 * API 响应接口
 * @interface
 */
interface ApiResponse<T> {
  /** 响应数据 */
  data: T;
  /** 状态码 */
  status: number;
  /** 错误消息（可选） */
  error?: string;
}
```

### 泛型注释

```typescript
/**
 * 创建一个通用的 API 客户端
 * @template T - 响应数据类型
 * @param {string} url - API 端点
 * @returns {Promise<T>} 响应数据
 */
async function apiCall<T>(url: string): Promise<T> {
  // 实现
}
```

## 常用 JSDoc 标签

| 标签          | 用途         | 示例                              |
| ------------- | ------------ | --------------------------------- |
| `@param`      | 参数说明     | `@param {string} name - 参数名称` |
| `@returns`    | 返回值说明   | `@returns {number} 返回值说明`    |
| `@throws`     | 异常说明     | `@throws {Error} 错误描述`        |
| `@example`    | 使用示例     | `@example add(1, 2) // 3`         |
| `@deprecated` | 标记为已废弃 | `@deprecated 使用 newFunc 替代`   |
| `@see`        | 相关链接     | `@see https://example.com`        |
| `@since`      | 版本信息     | `@since 1.2.0`                    |
| `@author`     | 作者信息     | `@author John Doe`                |
| `@async`      | 异步函数     | `@async`                          |
| `@private`    | 私有成员     | `@private`                        |
| `@public`     | 公共成员     | `@public`                         |

## 复杂类型示例

### 对象参数

```javascript
/**
 * 创建新用户
 * @param {Object} options - 配置选项
 * @param {string} options.name - 用户名
 * @param {string} options.email - 邮箱
 * @param {number} [options.age] - 年龄（可选）
 * @returns {User} 用户对象
 */
function createUser(options) {
  // 实现
}
```

### 回调函数

```javascript
/**
 * 遍历数组元素
 * @param {Array} arr - 数组
 * @param {function(item: *, index: number): void} callback - 回调函数
 */
function forEach(arr, callback) {
  // 实现
}
```

### 联合类型

```javascript
/**
 * 处理输入值
 * @param {string|number} value - 字符串或数字
 * @returns {string} 处理后的字符串
 */
function process(value) {
  return String(value);
}
```

## 最佳实践

1. **保持简洁**: 注释应该补充代码，而不是重复代码
2. **使用示例**: 复杂函数应包含 `@example` 标签
3. **标记废弃**: 使用 `@deprecated` 标记过时的 API
4. **类型准确**: 确保类型注解与实际代码匹配
5. **更新及时**: 代码变更时同步更新注释
