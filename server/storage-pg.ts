import { IStorage } from './storage';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { eq, and, gte, lte, or, ilike, desc } from 'drizzle-orm';
import { 
  users, type User, type InsertUser,
  cars, type Car, type InsertCar,
  sellInquiries, type SellInquiry, type InsertSellInquiry,
  carBrands, type CarBrand, type InsertCarBrand,
  carModels, type CarModel, type InsertCarModel
} from '@shared/schema';

export class PostgreSQLStorage implements IStorage {
  private db;
  private pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(this.pool);
    console.log('PostgreSQL storage initialized');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await this.db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await this.db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await this.db.insert(users).values(user).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Car operations
  async getCars(filters?: Partial<{
    condition: 'new' | 'used',
    make: string,
    model: string,
    minYear: number,
    maxYear: number,
    minPrice: number,
    maxPrice: number,
    minMileage: number,
    maxMileage: number,
    featured: boolean,
    search: string,
  }>): Promise<Car[]> {
    try {
      let query = this.db.select().from(cars);
      const conditions = [];

      if (filters) {
        if (filters.condition) {
          conditions.push(eq(cars.condition, filters.condition));
        }
        if (filters.make) {
          conditions.push(eq(cars.make, filters.make));
        }
        if (filters.model) {
          conditions.push(eq(cars.model, filters.model));
        }
        if (filters.minYear) {
          conditions.push(gte(cars.year, filters.minYear));
        }
        if (filters.maxYear) {
          conditions.push(lte(cars.year, filters.maxYear));
        }
        if (filters.minPrice) {
          conditions.push(gte(cars.price, filters.minPrice));
        }
        if (filters.maxPrice) {
          conditions.push(lte(cars.price, filters.maxPrice));
        }
        if (filters.minMileage && cars.mileage) {
          conditions.push(gte(cars.mileage, filters.minMileage));
        }
        if (filters.maxMileage && cars.mileage) {
          conditions.push(lte(cars.mileage, filters.maxMileage));
        }
        if (filters.featured !== undefined) {
          conditions.push(eq(cars.featured, filters.featured));
        }
        if (filters.search) {
          conditions.push(
            or(
              ilike(cars.title, `%${filters.search}%`),
              ilike(cars.make, `%${filters.search}%`),
              ilike(cars.model, `%${filters.search}%`),
              ilike(cars.description, `%${filters.search}%`)
            )
          );
        }
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const result = await query.orderBy(desc(cars.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting cars:', error);
      return [];
    }
  }

  async getCar(id: number): Promise<Car | undefined> {
    try {
      const result = await this.db.select().from(cars).where(eq(cars.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting car:', error);
      return undefined;
    }
  }

  async createCar(car: InsertCar): Promise<Car> {
    try {
      const result = await this.db.insert(cars).values(car as any).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  }

  async updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined> {
    try {
      const result = await this.db.update(cars).set({
        ...car,
        updatedAt: new Date()
      } as any).where(eq(cars.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating car:', error);
      return undefined;
    }
  }

  async deleteCar(id: number): Promise<boolean> {
    try {
      const result = await this.db.delete(cars).where(eq(cars.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting car:', error);
      return false;
    }
  }

  // Sell inquiries operations
  async getSellInquiries(): Promise<SellInquiry[]> {
    try {
      const result = await this.db.select().from(sellInquiries).orderBy(desc(sellInquiries.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting sell inquiries:', error);
      return [];
    }
  }

  async getSellInquiry(id: number): Promise<SellInquiry | undefined> {
    try {
      const result = await this.db.select().from(sellInquiries).where(eq(sellInquiries.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting sell inquiry:', error);
      return undefined;
    }
  }

  async createSellInquiry(inquiry: InsertSellInquiry): Promise<SellInquiry> {
    try {
      const result = await this.db.insert(sellInquiries).values({
        ...inquiry,
        status: 'pending'
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating sell inquiry:', error);
      throw error;
    }
  }

  async updateSellInquiryStatus(id: number, status: 'pending' | 'reviewed' | 'rejected'): Promise<SellInquiry | undefined> {
    try {
      const result = await this.db.update(sellInquiries).set({ status }).where(eq(sellInquiries.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating sell inquiry status:', error);
      return undefined;
    }
  }

  // Car brands and models operations
  async getCarBrands(): Promise<CarBrand[]> {
    try {
      const result = await this.db.select().from(carBrands).orderBy(carBrands.name);
      return result;
    } catch (error) {
      console.error('Error getting car brands:', error);
      return [];
    }
  }

  async getCarBrand(id: number): Promise<CarBrand | undefined> {
    try {
      const result = await this.db.select().from(carBrands).where(eq(carBrands.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting car brand:', error);
      return undefined;
    }
  }

  async createCarBrand(brand: InsertCarBrand): Promise<CarBrand> {
    try {
      const result = await this.db.insert(carBrands).values(brand).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating car brand:', error);
      throw error;
    }
  }

  async getCarModels(brandId?: number): Promise<CarModel[]> {
    try {
      let query = this.db.select().from(carModels);
      
      if (brandId !== undefined) {
        query = query.where(eq(carModels.brandId, brandId));
      }
      
      const result = await query.orderBy(carModels.name);
      return result;
    } catch (error) {
      console.error('Error getting car models:', error);
      return [];
    }
  }

  async getCarModel(id: number): Promise<CarModel | undefined> {
    try {
      const result = await this.db.select().from(carModels).where(eq(carModels.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting car model:', error);
      return undefined;
    }
  }

  async createCarModel(model: InsertCarModel): Promise<CarModel> {
    try {
      const result = await this.db.insert(carModels).values(model).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating car model:', error);
      throw error;
    }
  }
}