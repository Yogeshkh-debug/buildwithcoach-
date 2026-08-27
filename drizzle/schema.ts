import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const emailSubscribers = mysqlTable("email_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  consent: int("consent").default(1).notNull(),
  source: varchar("source", { length: 80 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const freePlanSignups = mysqlTable("free_plan_signups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  planName: varchar("planName", { length: 160 }).notNull(),
  status: varchar("status", { length: 40 }).default("requested").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const futureProducts = mysqlTable("future_products", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 32 }).notNull(),
  status: varchar("status", { length: 40 }).default("coming_soon").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const downloads = mysqlTable("downloads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  resourceName: varchar("resourceName", { length: 160 }).notNull(),
  status: varchar("status", { length: 40 }).default("pending_delivery").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const pdfDeliveryRequests = mysqlTable("pdf_delivery_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  status: varchar("status", { length: 40 }).default("pending_provider_setup").notNull(),
  providerMessageId: varchar("providerMessageId", { length: 255 }),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const pdfDeliveryItems = mysqlTable("pdf_delivery_items", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  planName: varchar("planName", { length: 160 }).notNull(),
  storageKey: varchar("storageKey", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const storySubmissions = mysqlTable("story_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  story: text("story").notNull(),
  photoKey: varchar("photoKey", { length: 500 }).notNull(),
  photoUrl: varchar("photoUrl", { length: 600 }).notNull(),
  photoName: varchar("photoName", { length: 260 }).notNull(),
  photoMime: varchar("photoMime", { length: 80 }).notNull(),
  consent: int("consent").default(0).notNull(),
  status: varchar("status", { length: 40 }).default("pending_review").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
