import { pgTable, text, serial, integer, boolean, timestamp, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const carConditionEnum = pgEnum('car_condition', ['new', 'used']);
export const sellerTypeEnum = pgEnum('seller_type', ['individual', 'corporate', 'showroom']);
export const accidentHistoryEnum = pgEnum('accident_history', ['no_accidents', 'minor_accidents', 'major_accidents']);
export const inquiryStatusEnum = pgEnum('inquiry_status', ['pending', 'reviewed', 'rejected']);
export const contactMethodEnum = pgEnum('contact_method', ['email', 'phone', 'whatsapp']);

// Car brands and models for filtering
export const carBrands = pgTable('car_brands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  logoUrl: text('logo_url'),
});

export const carModels = pgTable('car_models', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').references(() => carBrands.id).notNull(),
  name: text('name').notNull(),
});

// Main car listings table
export const cars = pgTable('cars', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  price: integer('price').notNull(),
  mileage: integer('mileage').default(0),
  color: text('color'),
  condition: carConditionEnum('condition').notNull(),
  fuelType: text('fuel_type'),
  transmission: text('transmission'),
  description: text('description'),
  bodyType: text('body_type'),
  engine: text('engine'),
  driveType: text('drive_type'),
  vin: text('vin'),
  stockNumber: text('stock_number'),
  featured: boolean('featured').default(false),
  images: json('images').$type<string[]>().default([]),
  features: json('features').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Sell Your Car inquiry table
export const sellInquiries = pgTable('sell_inquiries', {
  id: serial('id').primaryKey(),
  sellerType: sellerTypeEnum('seller_type').notNull(),
  registrationNumber: text('registration_number'),
  make: text('make').notNull(),
  model: text('model').notNull(),
  color: text('color'),
  year: integer('year').notNull(),
  mileage: integer('mileage').notNull(),
  accidentHistory: accidentHistoryEnum('accident_history'),
  askingPrice: integer('asking_price').notNull(),
  location: text('location'),
  additionalNotes: text('additional_notes'),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  bestTimeToContact: text('best_time_to_contact'),
  contactMethod: contactMethodEnum('contact_method').notNull(),
  status: inquiryStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean('is_admin').default(false),
});

// Schema for inserting a car
export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for inserting a sell inquiry
export const insertSellInquirySchema = createInsertSchema(sellInquiries).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Schema for inserting a user
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Schema for inserting a car brand
export const insertCarBrandSchema = createInsertSchema(carBrands).omit({
  id: true,
});

// Schema for inserting a car model
export const insertCarModelSchema = createInsertSchema(carModels).omit({
  id: true,
});

// Types
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

export type InsertSellInquiry = z.infer<typeof insertSellInquirySchema>;
export type SellInquiry = typeof sellInquiries.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCarBrand = z.infer<typeof insertCarBrandSchema>;
export type CarBrand = typeof carBrands.$inferSelect;

export type InsertCarModel = z.infer<typeof insertCarModelSchema>;
export type CarModel = typeof carModels.$inferSelect;
