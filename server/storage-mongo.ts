import { IStorage } from './storage';
import { 
  Car as CarModel, 
  SellInquiry as SellInquiryModel, 
  User as UserModel,
  CarBrand as CarBrandModel,
  CarModel as CarModelModel
} from './models';

import type { 
  Car, 
  SellInquiry, 
  User,
  InsertCar,
  InsertSellInquiry,
  InsertUser,
  CarBrand,
  CarModel,
  InsertCarBrand,
  InsertCarModel
} from '@shared/schema';

export class MongoStorage implements IStorage {
  constructor() {
    console.log('MongoDB storage initialized');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id);
      if (!user) return undefined;
      
      return {
        id: Number(user._id),
        username: user.username,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) return undefined;
      
      return {
        id: Number(user._id),
        username: user.username,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const newUser = await UserModel.create(user);
      
      return {
        id: Number(newUser._id),
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };
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
      const query: any = {};
      
      // Apply filters
      if (filters) {
        if (filters.condition) query.condition = filters.condition;
        if (filters.make) query.make = filters.make;
        if (filters.model) query.model = filters.model;
        if (filters.minYear) query.year = { $gte: filters.minYear };
        if (filters.maxYear) query.year = { ...query.year, $lte: filters.maxYear };
        if (filters.minPrice) query.price = { $gte: filters.minPrice };
        if (filters.maxPrice) query.price = { ...query.price, $lte: filters.maxPrice };
        if (filters.minMileage) query.mileage = { $gte: filters.minMileage };
        if (filters.maxMileage) query.mileage = { ...query.mileage, $lte: filters.maxMileage };
        if (filters.featured !== undefined) query.featured = filters.featured;
        
        // Search filter
        if (filters.search) {
          const searchRegex = new RegExp(filters.search, 'i');
          query.$or = [
            { title: searchRegex },
            { make: searchRegex },
            { model: searchRegex },
            { description: searchRegex }
          ];
        }
      }
      
      const cars = await CarModel.find(query).sort({ createdAt: -1 });
      
      return cars.map(car => ({
        id: Number(car._id),
        title: car.title,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        color: car.color,
        description: car.description,
        condition: car.condition,
        fuelType: car.fuelType,
        transmission: car.transmission,
        engine: car.engine,
        driveType: car.driveType,
        bodyType: car.bodyType,
        vin: car.vin,
        stockNumber: car.stockNumber,
        features: car.features,
        images: car.images,
        featured: car.featured,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt
      }));
    } catch (error) {
      console.error('Error getting cars:', error);
      return [];
    }
  }

  async getCar(id: number): Promise<Car | undefined> {
    try {
      const car = await CarModel.findById(id);
      if (!car) return undefined;
      
      return {
        id: Number(car._id),
        title: car.title,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        color: car.color,
        description: car.description,
        condition: car.condition,
        fuelType: car.fuelType,
        transmission: car.transmission,
        engine: car.engine,
        driveType: car.driveType,
        bodyType: car.bodyType,
        vin: car.vin,
        stockNumber: car.stockNumber,
        features: car.features,
        images: car.images,
        featured: car.featured,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt
      };
    } catch (error) {
      console.error('Error getting car:', error);
      return undefined;
    }
  }

  async createCar(car: InsertCar): Promise<Car> {
    try {
      const newCar = await CarModel.create(car);
      
      return {
        id: Number(newCar._id),
        title: newCar.title,
        make: newCar.make,
        model: newCar.model,
        year: newCar.year,
        price: newCar.price,
        mileage: newCar.mileage,
        color: newCar.color,
        description: newCar.description,
        condition: newCar.condition,
        fuelType: newCar.fuelType,
        transmission: newCar.transmission,
        engine: newCar.engine,
        driveType: newCar.driveType,
        bodyType: newCar.bodyType,
        vin: newCar.vin,
        stockNumber: newCar.stockNumber,
        features: newCar.features || [],
        images: newCar.images || [],
        featured: newCar.featured || false,
        createdAt: newCar.createdAt,
        updatedAt: newCar.updatedAt
      };
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  }

  async updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined> {
    try {
      const updatedCar = await CarModel.findByIdAndUpdate(id, car, { new: true });
      if (!updatedCar) return undefined;
      
      return {
        id: Number(updatedCar._id),
        title: updatedCar.title,
        make: updatedCar.make,
        model: updatedCar.model,
        year: updatedCar.year,
        price: updatedCar.price,
        mileage: updatedCar.mileage,
        color: updatedCar.color,
        description: updatedCar.description,
        condition: updatedCar.condition,
        fuelType: updatedCar.fuelType,
        transmission: updatedCar.transmission,
        engine: updatedCar.engine,
        driveType: updatedCar.driveType,
        bodyType: updatedCar.bodyType,
        vin: updatedCar.vin,
        stockNumber: updatedCar.stockNumber,
        features: updatedCar.features,
        images: updatedCar.images,
        featured: updatedCar.featured,
        createdAt: updatedCar.createdAt,
        updatedAt: updatedCar.updatedAt
      };
    } catch (error) {
      console.error('Error updating car:', error);
      return undefined;
    }
  }

  async deleteCar(id: number): Promise<boolean> {
    try {
      const result = await CarModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting car:', error);
      return false;
    }
  }

  // Sell inquiries operations
  async getSellInquiries(): Promise<SellInquiry[]> {
    try {
      const inquiries = await SellInquiryModel.find().sort({ createdAt: -1 });
      
      return inquiries.map(inquiry => ({
        id: Number(inquiry._id),
        sellerType: inquiry.sellerType,
        fullName: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone,
        contactMethod: inquiry.contactMethod,
        bestTimeToContact: inquiry.bestTimeToContact,
        make: inquiry.make,
        model: inquiry.model,
        year: inquiry.year,
        mileage: inquiry.mileage,
        color: inquiry.color,
        registrationNumber: inquiry.registrationNumber,
        accidentHistory: inquiry.accidentHistory,
        askingPrice: inquiry.askingPrice,
        location: inquiry.location,
        additionalNotes: inquiry.additionalNotes,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt
      }));
    } catch (error) {
      console.error('Error getting sell inquiries:', error);
      return [];
    }
  }

  async getSellInquiry(id: number): Promise<SellInquiry | undefined> {
    try {
      const inquiry = await SellInquiryModel.findById(id);
      if (!inquiry) return undefined;
      
      return {
        id: Number(inquiry._id),
        sellerType: inquiry.sellerType,
        fullName: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone,
        contactMethod: inquiry.contactMethod,
        bestTimeToContact: inquiry.bestTimeToContact,
        make: inquiry.make,
        model: inquiry.model,
        year: inquiry.year,
        mileage: inquiry.mileage,
        color: inquiry.color,
        registrationNumber: inquiry.registrationNumber,
        accidentHistory: inquiry.accidentHistory,
        askingPrice: inquiry.askingPrice,
        location: inquiry.location,
        additionalNotes: inquiry.additionalNotes,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt
      };
    } catch (error) {
      console.error('Error getting sell inquiry:', error);
      return undefined;
    }
  }

  async createSellInquiry(inquiry: InsertSellInquiry): Promise<SellInquiry> {
    try {
      const newInquiry = await SellInquiryModel.create({
        ...inquiry,
        status: 'pending'
      });
      
      return {
        id: Number(newInquiry._id),
        sellerType: newInquiry.sellerType,
        fullName: newInquiry.fullName,
        email: newInquiry.email,
        phone: newInquiry.phone,
        contactMethod: newInquiry.contactMethod,
        bestTimeToContact: newInquiry.bestTimeToContact,
        make: newInquiry.make,
        model: newInquiry.model,
        year: newInquiry.year,
        mileage: newInquiry.mileage,
        color: newInquiry.color,
        registrationNumber: newInquiry.registrationNumber,
        accidentHistory: newInquiry.accidentHistory,
        askingPrice: newInquiry.askingPrice,
        location: newInquiry.location,
        additionalNotes: newInquiry.additionalNotes,
        status: newInquiry.status,
        createdAt: newInquiry.createdAt,
        updatedAt: newInquiry.updatedAt
      };
    } catch (error) {
      console.error('Error creating sell inquiry:', error);
      throw error;
    }
  }

  async updateSellInquiryStatus(id: number, status: 'pending' | 'reviewed' | 'rejected'): Promise<SellInquiry | undefined> {
    try {
      const updatedInquiry = await SellInquiryModel.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
      );
      
      if (!updatedInquiry) return undefined;
      
      return {
        id: Number(updatedInquiry._id),
        sellerType: updatedInquiry.sellerType,
        fullName: updatedInquiry.fullName,
        email: updatedInquiry.email,
        phone: updatedInquiry.phone,
        contactMethod: updatedInquiry.contactMethod,
        bestTimeToContact: updatedInquiry.bestTimeToContact,
        make: updatedInquiry.make,
        model: updatedInquiry.model,
        year: updatedInquiry.year,
        mileage: updatedInquiry.mileage,
        color: updatedInquiry.color,
        registrationNumber: updatedInquiry.registrationNumber,
        accidentHistory: updatedInquiry.accidentHistory,
        askingPrice: updatedInquiry.askingPrice,
        location: updatedInquiry.location,
        additionalNotes: updatedInquiry.additionalNotes,
        status: updatedInquiry.status,
        createdAt: updatedInquiry.createdAt,
        updatedAt: updatedInquiry.updatedAt
      };
    } catch (error) {
      console.error('Error updating sell inquiry status:', error);
      return undefined;
    }
  }

  // Car brands and models operations
  async getCarBrands(): Promise<CarBrand[]> {
    try {
      const brands = await CarBrandModel.find().sort({ name: 1 });
      
      return brands.map(brand => ({
        id: Number(brand._id),
        name: brand.name,
        logoUrl: brand.logoUrl,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt
      }));
    } catch (error) {
      console.error('Error getting car brands:', error);
      return [];
    }
  }

  async getCarBrand(id: number): Promise<CarBrand | undefined> {
    try {
      const brand = await CarBrandModel.findById(id);
      if (!brand) return undefined;
      
      return {
        id: Number(brand._id),
        name: brand.name,
        logoUrl: brand.logoUrl,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt
      };
    } catch (error) {
      console.error('Error getting car brand:', error);
      return undefined;
    }
  }

  async createCarBrand(brand: InsertCarBrand): Promise<CarBrand> {
    try {
      const newBrand = await CarBrandModel.create(brand);
      
      return {
        id: Number(newBrand._id),
        name: newBrand.name,
        logoUrl: newBrand.logoUrl,
        createdAt: newBrand.createdAt,
        updatedAt: newBrand.updatedAt
      };
    } catch (error) {
      console.error('Error creating car brand:', error);
      throw error;
    }
  }

  async getCarModels(brandId?: number): Promise<CarModel[]> {
    try {
      const query = brandId ? { brandId } : {};
      const models = await CarModelModel.find(query).sort({ name: 1 });
      
      return models.map(model => ({
        id: Number(model._id),
        name: model.name,
        brandId: Number(model.brandId),
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
      }));
    } catch (error) {
      console.error('Error getting car models:', error);
      return [];
    }
  }

  async getCarModel(id: number): Promise<CarModel | undefined> {
    try {
      const model = await CarModelModel.findById(id);
      if (!model) return undefined;
      
      return {
        id: Number(model._id),
        name: model.name,
        brandId: Number(model.brandId),
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
      };
    } catch (error) {
      console.error('Error getting car model:', error);
      return undefined;
    }
  }

  async createCarModel(model: InsertCarModel): Promise<CarModel> {
    try {
      const newModel = await CarModelModel.create(model);
      
      return {
        id: Number(newModel._id),
        name: newModel.name,
        brandId: Number(newModel.brandId),
        createdAt: newModel.createdAt,
        updatedAt: newModel.updatedAt
      };
    } catch (error) {
      console.error('Error creating car model:', error);
      throw error;
    }
  }
}