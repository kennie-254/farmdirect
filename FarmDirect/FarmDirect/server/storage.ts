import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, and, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import {
  type User,
  type InsertUser,
  type Farmer,
  type InsertFarmer,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductWithFarmer,
  type Order,
  type InsertOrder,
  type OrderWithItems,
  type OrderItem,
  type InsertOrderItem,
  type FarmerWithProducts,
  type Review,
  type InsertReview,
} from "@shared/schema";

const sql_client = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql_client, { schema });

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Farmers
  getFarmer(id: string): Promise<Farmer | undefined>;
  getFarmerByUserId(userId: string): Promise<Farmer | undefined>;
  getFarmerWithProducts(id: string): Promise<FarmerWithProducts | undefined>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  getFeaturedFarmers(): Promise<FarmerWithProducts[]>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<ProductWithFarmer[]>;
  getProduct(id: string): Promise<ProductWithFarmer | undefined>;
  getProductsByCategory(categoryId: string): Promise<ProductWithFarmer[]>;
  getProductsByFarmer(farmerId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<ProductWithFarmer[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<ProductWithFarmer[]>;

  // Orders
  getOrder(id: string): Promise<OrderWithItems | undefined>;
  getOrdersByUser(userId: string): Promise<OrderWithItems[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  updateOrderStatus(orderId: string, status: string): Promise<void>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getProductReviews(productId: string): Promise<Review[]>;
  getFarmerReviews(farmerId: string): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }

  async getFarmer(id: string): Promise<Farmer | undefined> {
    const result = await db.select().from(schema.farmers).where(eq(schema.farmers.id, id)).limit(1);
    return result[0];
  }

  async getFarmerByUserId(userId: string): Promise<Farmer | undefined> {
    const result = await db.select().from(schema.farmers).where(eq(schema.farmers.userId, userId)).limit(1);
    return result[0];
  }

  async getFarmerWithProducts(id: string): Promise<FarmerWithProducts | undefined> {
    const farmer = await db.select().from(schema.farmers).where(eq(schema.farmers.id, id)).limit(1);
    if (!farmer[0]) return undefined;

    const user = await db.select().from(schema.users).where(eq(schema.users.id, farmer[0].userId)).limit(1);
    const products = await db.select().from(schema.products).where(eq(schema.products.farmerId, id));

    return {
      ...farmer[0],
      user: user[0],
      products,
    };
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const result = await db.insert(schema.farmers).values(farmer).returning();
    return result[0];
  }

  async getFeaturedFarmers(): Promise<FarmerWithProducts[]> {
    const farmers = await db.select().from(schema.farmers).orderBy(desc(schema.farmers.rating)).limit(3);
    
    const farmersWithDetails = await Promise.all(
      farmers.map(async (farmer) => {
        const user = await db.select().from(schema.users).where(eq(schema.users.id, farmer.userId)).limit(1);
        const products = await db.select().from(schema.products).where(eq(schema.products.farmerId, farmer.id));
        
        return {
          ...farmer,
          user: user[0],
          products,
        };
      })
    );

    return farmersWithDetails;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(schema.categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(schema.categories).values(category).returning();
    return result[0];
  }

  async getProducts(): Promise<ProductWithFarmer[]> {
    const products = await db
      .select()
      .from(schema.products)
      .leftJoin(schema.farmers, eq(schema.products.farmerId, schema.farmers.id))
      .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
      .orderBy(desc(schema.products.createdAt));

    return products.map(row => ({
      ...row.products,
      farmer: row.farmers!,
      category: row.categories!,
    }));
  }

  async getProduct(id: string): Promise<ProductWithFarmer | undefined> {
    const result = await db
      .select()
      .from(schema.products)
      .leftJoin(schema.farmers, eq(schema.products.farmerId, schema.farmers.id))
      .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
      .where(eq(schema.products.id, id))
      .limit(1);

    if (!result[0]) return undefined;

    return {
      ...result[0].products,
      farmer: result[0].farmers!,
      category: result[0].categories!,
    };
  }

  async getProductsByCategory(categoryId: string): Promise<ProductWithFarmer[]> {
    const products = await db
      .select()
      .from(schema.products)
      .leftJoin(schema.farmers, eq(schema.products.farmerId, schema.farmers.id))
      .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
      .where(eq(schema.products.categoryId, categoryId));

    return products.map(row => ({
      ...row.products,
      farmer: row.farmers!,
      category: row.categories!,
    }));
  }

  async getProductsByFarmer(farmerId: string): Promise<Product[]> {
    return db.select().from(schema.products).where(eq(schema.products.farmerId, farmerId));
  }

  async getFeaturedProducts(): Promise<ProductWithFarmer[]> {
    const products = await db
      .select()
      .from(schema.products)
      .leftJoin(schema.farmers, eq(schema.products.farmerId, schema.farmers.id))
      .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
      .where(eq(schema.products.featured, true))
      .limit(4);

    return products.map(row => ({
      ...row.products,
      farmer: row.farmers!,
      category: row.categories!,
    }));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(schema.products).values(product).returning();
    return result[0];
  }

  async searchProducts(query: string): Promise<ProductWithFarmer[]> {
    const products = await db
      .select()
      .from(schema.products)
      .leftJoin(schema.farmers, eq(schema.products.farmerId, schema.farmers.id))
      .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
      .where(sql`${schema.products.name} ILIKE ${'%' + query + '%'} OR ${schema.products.description} ILIKE ${'%' + query + '%'}`);

    return products.map(row => ({
      ...row.products,
      farmer: row.farmers!,
      category: row.categories!,
    }));
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const order = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
    if (!order[0]) return undefined;

    const items = await db
      .select()
      .from(schema.orderItems)
      .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
      .where(eq(schema.orderItems.orderId, id));

    return {
      ...order[0],
      items: items.map(row => ({
        ...row.order_items,
        product: row.products!,
      })),
    };
  }

  async getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
    const orders = await db.select().from(schema.orders).where(eq(schema.orders.userId, userId)).orderBy(desc(schema.orders.createdAt));

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db
          .select()
          .from(schema.orderItems)
          .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
          .where(eq(schema.orderItems.orderId, order.id));

        return {
          ...order,
          items: items.map(row => ({
            ...row.order_items,
            product: row.products!,
          })),
        };
      })
    );

    return ordersWithItems;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(schema.orders).values(order).returning();
    return result[0];
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(schema.orderItems).values(orderItem).returning();
    return result[0];
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await db.update(schema.orders).set({ status }).where(eq(schema.orders.id, orderId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(schema.reviews).values(review).returning();
    return result[0];
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return db.select().from(schema.reviews).where(eq(schema.reviews.productId, productId)).orderBy(desc(schema.reviews.createdAt));
  }

  async getFarmerReviews(farmerId: string): Promise<Review[]> {
    return db.select().from(schema.reviews).where(eq(schema.reviews.farmerId, farmerId)).orderBy(desc(schema.reviews.createdAt));
  }
}

export const storage = new DatabaseStorage();
