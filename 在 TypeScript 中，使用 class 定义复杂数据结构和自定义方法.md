在 TypeScript 中，使用 `class` 定义复杂数据结构和自定义方法时，可以通过以下方式实现类型安全和面向对象编程。这里以「用户订单系统」为例，演示如何处理多层嵌套数据和业务逻辑：

---

### 场景描述
假设我们需要处理以下复杂数据：
- 每个用户有多个订单
- 每个订单包含多个商品
- 需要实现以下功能：
    - 计算订单总价
    - 验证商品库存
    - 生成订单摘要

---

### 1. 基础类型定义
```typescript
// 商品类型
type Product = {
  id: string
  name: string
  price: number
  stock: number
}

// 订单项类型
type OrderItem = {
  product: Product
  quantity: number
}

// 地址类型
type Address = {
  street: string
  city: string
  postalCode: string
}
```

---

### 2. 核心类实现
```typescript
class Order {
  // 私有属性保证数据安全
  private items: OrderItem[]
  private shippingAddress: Address
  private createdAt: Date

  constructor(items: OrderItem[], address: Address) {
    this.items = items
    this.shippingAddress = address
    this.createdAt = new Date()
  }

  // 计算订单总价
  public calculateTotal(): number {
    return this.items.reduce(
      (total, item) => total + (item.product.price * item.quantity), 0
    )
  }

  // 验证库存
  public validateStock(): boolean {
    return this.items.every(item => 
      item.product.stock >= item.quantity
    )
  }

  // 生成摘要
  public generateSummary(): string {
    return `
      Order Summary:
      - Items: ${this.items.length}
      - Total: $${this.calculateTotal().toFixed(2)}
      - Shipping to: ${this.formatAddress()}
    `
  }

  // 私有方法处理内部逻辑
  private formatAddress(): string {
    return `${this.shippingAddress.street}, 
            ${this.shippingAddress.city} 
            ${this.shippingAddress.postalCode}`
  }
}

class User {
  private orders: Order[]
  
  constructor(public id: string, public name: string) {
    this.orders = []
  }

  // 添加订单
  addOrder(order: Order): void {
    if (order.validateStock()) {
      this.orders.push(order)
      this.updateStock(order)
    } else {
      throw new Error("库存不足")
    }
  }

  // 更新库存
  private updateStock(order: Order): void {
    order.items.forEach(item => {
      item.product.stock -= item.quantity
    })
  }

  // 获取用户所有订单总消费
  getTotalSpent(): number {
    return this.orders.reduce(
      (total, order) => total + order.calculateTotal(), 0
    )
  }
}
```

---

### 3. 使用示例
```typescript
// 创建商品
const laptop: Product = {
  id: "p1",
  name: "MacBook Pro",
  price: 1999,
  stock: 10
}

const phone: Product = {
  id: "p2",
  name: "iPhone 15",
  price: 999,
  stock: 5
}

// 创建订单项
const items: OrderItem[] = [
  { product: laptop, quantity: 2 },
  { product: phone, quantity: 1 }
]

// 创建地址
const address: Address = {
  street: "123 Tech Street",
  city: "San Francisco",
  postalCode: "94105"
}

// 使用类
const user = new User("u1", "John Doe")
const order = new Order(items, address)

try {
  user.addOrder(order)
  console.log(order.generateSummary())
  console.log("用户总消费:", user.getTotalSpent())
  
  // 验证库存更新
  console.log("笔记本剩余库存:", laptop.stock) // 8
  console.log("手机剩余库存:", phone.stock)    // 4
} catch (error) {
  console.error(error.message)
}
```

---

### 4. 高级技巧

#### 使用继承扩展功能
```typescript
class DiscountedOrder extends Order {
  private discountRate: number

  constructor(
    items: OrderItem[], 
    address: Address,
    discount: number
  ) {
    super(items, address)
    this.discountRate = discount
  }

  // 重写总价计算方法
  override calculateTotal(): number {
    const originalTotal = super.calculateTotal()
    return originalTotal * (1 - this.discountRate)
  }

  // 新增方法
  getDiscountAmount(): number {
    return super.calculateTotal() * this.discountRate
  }
}
```

#### 使用接口增强类型
```typescript
interface Storable {
  serialize(): string
  deserialize(data: string): void
}

class PersistentOrder extends Order implements Storable {
  serialize(): string {
    return JSON.stringify({
      items: this.items,
      address: this.shippingAddress,
      createdAt: this.createdAt.toISOString()
    })
  }

  deserialize(data: string): void {
    const parsed = JSON.parse(data)
    this.items = parsed.items
    this.shippingAddress = parsed.address
    this.createdAt = new Date(parsed.createdAt)
  }
}
```

---

### 5. 最佳实践

1. **封装原则**：
    - 使用 `private` 保护内部状态
    - 通过公共方法暴露安全操作

2. **单一职责**：
    - `Order` 类只处理订单相关逻辑
    - `User` 类管理用户与订单的关系

3. **类型守卫**：
   ```typescript
   class ProductValidator {
     static isValid(product: unknown): product is Product {
       return (
         typeof product === 'object' &&
         product !== null &&
         'id' in product &&
         'price' in product
       )
     }
   }
   ```

4. **工厂模式**：
   ```typescript
   class OrderFactory {
     static createFromJSON(json: string): Order {
       const data = JSON.parse(json)
       return new Order(data.items, data.address)
     }
   }
   ```

---

通过这种面向对象的设计，您可以：
- 保持数据结构的一致性
- 集中处理业务规则
- 轻松扩展新功能
- 提高代码可维护性
- 利用 TypeScript 的类型系统预防错误

实际项目中应根据业务复杂度选择适当的类层次结构，避免过度设计。对于超大型项目，可以考虑结合 **装饰器** 或 **依赖注入** 等高级模式。