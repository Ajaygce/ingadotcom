import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  products,
  categories,
  reviews,
  orders,
  orderItems,
  cartItems,
  wishlistItems,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Review,
  type InsertReview,
  type Order,
  type InsertOrder,
  type InsertOrderItem,
  type CartItem,
  type InsertCartItem,
  type WishlistItem,
  type InsertWishlistItem,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;

  // Products
  getAllProducts(filters?: {
    category?: string;
    featured?: boolean;
    bestseller?: boolean;
    limit?: number;
  }): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;

  // Reviews
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateProductRating(productId: string): Promise<void>;

  // Cart
  getUserCart(userId: string): Promise<CartItem[]>;
  getCartItem(userId: string, productId: string): Promise<CartItem | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Wishlist
  getUserWishlist(userId: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;
  isInWishlist(userId: string, productId: string): Promise<boolean>;

  // Orders
  getUserOrders(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | undefined>;

  // Admin Stats
  getAdminStats(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    lowStockProducts: number;
    pendingOrders: number;
    outOfStockProducts: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existing = await this.getUserByEmail(user.email!);
    if (existing) {
      const updated = await db
        .update(users)
        .set({ ...user, updatedAt: new Date() })
        .where(eq(users.id, existing.id))
        .returning();
      return updated[0];
    }
    const created = await db.insert(users).values(user).returning();
    return created[0];
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.displayOrder);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const created = await db.insert(categories).values(category).returning();
    return created[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const updated = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated[0];
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Products
  async getAllProducts(filters?: {
    category?: string;
    featured?: boolean;
    bestseller?: boolean;
    limit?: number;
  }): Promise<Product[]> {
    let query = db.select().from(products).leftJoin(categories, eq(products.categoryId, categories.id)).$dynamic();

    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(categories.slug, filters.category));
    }
    if (filters?.featured) {
      conditions.push(eq(products.featured, true));
    }
    if (filters?.bestseller) {
      conditions.push(eq(products.bestseller, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(products.featured), desc(products.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const results = await query;
    return results.map(row => ({ ...row.products, category: row.categories }));
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const result = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

    if (result.length === 0) return undefined;
    return { ...result[0].products, category: result[0].categories };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const created = await db.insert(products).values(product).returning();
    return created[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const updated = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Reviews
  async getProductReviews(productId: string): Promise<Review[]> {
    const result = await db
      .select()
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));

    return result.map(row => ({ ...row.reviews, user: row.users }));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const created = await db.insert(reviews).values(review).returning();
    await this.updateProductRating(review.productId);
    return created[0];
  }

  async updateProductRating(productId: string): Promise<void> {
    const reviewList = await db.select().from(reviews).where(eq(reviews.productId, productId));
    const avgRating = reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length;
    await db
      .update(products)
      .set({
        averageRating: avgRating.toFixed(2),
        reviewCount: reviewList.length,
      })
      .where(eq(products.id, productId));
  }

  // Cart
  async getUserCart(userId: string): Promise<CartItem[]> {
    const result = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    return result.map(row => ({ ...row.cart_items, product: row.products }));
  }

  async getCartItem(userId: string, productId: string): Promise<CartItem | undefined> {
    const result = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
      .limit(1);
    return result[0];
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existing = await this.getCartItem(item.userId, item.productId);
    if (existing) {
      const updated = await db
        .update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated[0];
    }
    const created = await db.insert(cartItems).values(item).returning();
    return created[0];
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const updated = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated[0];
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Wishlist
  async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    const result = await db
      .select()
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(wishlistItems.userId, userId))
      .orderBy(desc(wishlistItems.createdAt));

    return result.map(row => ({ ...row.wishlist_items, product: { ...row.products, category: row.categories } }));
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const created = await db.insert(wishlistItems).values(item).returning();
    return created[0];
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await db.delete(wishlistItems).where(
      and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId))
    );
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
      .limit(1);
    return result.length > 0;
  }

  // Orders
  async getUserOrders(userId: string): Promise<Order[]> {
    const result = await db
      .select()
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersMap = new Map();
    result.forEach(row => {
      if (!ordersMap.has(row.orders.id)) {
        ordersMap.set(row.orders.id, { ...row.orders, orderItems: [] });
      }
      if (row.order_items) {
        ordersMap.get(row.orders.id).orderItems.push(row.order_items);
      }
    });

    return Array.from(ordersMap.values());
  }

  async getAllOrders(): Promise<Order[]> {
    const result = await db
      .select()
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    const ordersMap = new Map();
    result.forEach(row => {
      if (!ordersMap.has(row.orders.id)) {
        ordersMap.set(row.orders.id, { ...row.orders, orderItems: [], user: row.users });
      }
      if (row.order_items) {
        ordersMap.get(row.orders.id).orderItems.push(row.order_items);
      }
    });

    return Array.from(ordersMap.values());
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    const result = await db
      .select()
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.id, orderId));

    if (result.length === 0) return undefined;

    const order = { ...result[0].orders, orderItems: [] as any[] };
    result.forEach(row => {
      if (row.order_items) {
        order.orderItems.push(row.order_items);
      }
    });

    return order;
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [createdOrder] = await db.insert(orders).values(order).returning();
    const createdItems = await db.insert(orderItems).values(
      items.map(item => ({ ...item, orderId: createdOrder.id }))
    ).returning();

    return { ...createdOrder, orderItems: createdItems };
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const updated = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return updated[0];
  }

  // Admin Stats
  async getAdminStats() {
    const [orderStats] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CAST(${orders.totalAmount} AS DECIMAL)), 0)`,
        totalOrders: sql<number>`COUNT(*)`,
        pendingOrders: sql<number>`SUM(CASE WHEN ${orders.status} = 'pending' THEN 1 ELSE 0 END)`,
      })
      .from(orders);

    const [productStats] = await db
      .select({
        totalProducts: sql<number>`COUNT(*)`,
        lowStockProducts: sql<number>`SUM(CASE WHEN ${products.stockQuantity} < 10 AND ${products.stockQuantity} > 0 THEN 1 ELSE 0 END)`,
        outOfStockProducts: sql<number>`SUM(CASE WHEN ${products.stockQuantity} = 0 THEN 1 ELSE 0 END)`,
      })
      .from(products);

    const [customerStats] = await db
      .select({
        totalCustomers: sql<number>`COUNT(*)`,
      })
      .from(users);

    return {
      totalRevenue: Number(orderStats.totalRevenue) || 0,
      totalOrders: Number(orderStats.totalOrders) || 0,
      totalProducts: Number(productStats.totalProducts) || 0,
      totalCustomers: Number(customerStats.totalCustomers) || 0,
      lowStockProducts: Number(productStats.lowStockProducts) || 0,
      pendingOrders: Number(orderStats.pendingOrders) || 0,
      outOfStockProducts: Number(productStats.outOfStockProducts) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
