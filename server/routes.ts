import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCarSchema, insertSellInquirySchema } from "@shared/schema";
import { insertCarBrandSchema, insertCarModelSchema } from "@shared/schema";
import { CarBrand as CarBrandModel, CarModel as CarModelModel } from "./models";
import { uploadImage } from "./lib/imagekit";
import { sendSellInquiryEmail } from "./lib/emailjs";
import jwt from "jsonwebtoken";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'rj-motorworld-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'rj-motorworld-refresh-secret-key';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Helper function to validate request body
const validateBody = <T>(schema: z.ZodType<T>) => {
  return (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.format() 
        });
      }
      next(error);
    }
  };
};

// JWT Authentication middleware
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Generate tokens
const generateTokens = (user: any) => {
  const payload = { id: user.id, username: user.username, role: user.role };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check against environment variables
      const adminUsername = process.env.ADMIN_USERNAME || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      if (username === adminUsername && password === adminPassword) {
        const user = { id: 1, username, role: 'admin' };
        const { accessToken, refreshToken } = generateTokens(user);
        
        res.json({
          success: true,
          user: { id: 1, username, role: 'admin' },
          accessToken,
          refreshToken
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post("/api/admin/refresh", async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
      }

      jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err: any, user: any) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }
        
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        res.json({ accessToken, refreshToken: newRefreshToken });
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/admin/logout", authenticateToken, async (req, res) => {
    // In a real app, you'd blacklist the token
    res.json({ message: "Logged out successfully" });
  });

  // Public routes
  // Get car brands
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getCarBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch car brands" });
    }
  });

  // Get car models by brand
  app.get("/api/models", async (req, res) => {
    try {
      const brandId = req.query.brandId ? Number(req.query.brandId) : undefined;
      const models = await storage.getCarModels(brandId);
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch car models" });
    }
  });

  // Get all cars with optional filters
  app.get("/api/cars", async (req, res) => {
    try {
      const filters: any = {};
      
      if (req.query.condition) filters.condition = req.query.condition;
      if (req.query.make) filters.make = req.query.make;
      if (req.query.model) filters.model = req.query.model;
      if (req.query.minYear) filters.minYear = Number(req.query.minYear);
      if (req.query.maxYear) filters.maxYear = Number(req.query.maxYear);
      if (req.query.minPrice) filters.minPrice = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.maxPrice = Number(req.query.maxPrice);
      if (req.query.minMileage) filters.minMileage = Number(req.query.minMileage);
      if (req.query.maxMileage) filters.maxMileage = Number(req.query.maxMileage);
      if (req.query.featured) filters.featured = req.query.featured === 'true';
      if (req.query.search) filters.search = req.query.search;
      
      const cars = await storage.getCars(filters);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });

  // Get featured cars
  app.get("/api/cars/featured", async (req, res) => {
    try {
      const condition = req.query.condition as 'new' | 'used' | undefined;
      const filters: any = { featured: true };
      
      if (condition) {
        filters.condition = condition;
      }
      
      const cars = await storage.getCars(filters);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured cars" });
    }
  });

  // Get a specific car by ID
  app.get("/api/cars/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      
      const car = await storage.getCar(id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch car details" });
    }
  });

  // Submit sell inquiry
  app.post("/api/sell", validateBody(insertSellInquirySchema), async (req, res) => {
    try {
      const inquiry = await storage.createSellInquiry(req.body);
      
      // Send email notification
      await sendSellInquiryEmail(inquiry);
      
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit inquiry" });
    }
  });

  // Admin routes (protected)
  // Upload image to ImageKit
  app.post("/api/admin/upload", authenticateToken, async (req, res) => {
    try {
      if (!req.body.image) {
        return res.status(400).json({ message: "No image provided" });
      }
      
      const imageUrl = await uploadImage(req.body.image);
      res.json({ url: imageUrl });
    } catch (error) {
      const e: any = error || {};
      const status = typeof e.status === 'number' ? e.status : 500;
      const message = e.message || 'Failed to upload image';
      const help = e.help;
      res.status(status).json({ message, help });
    }
  });

  // Create a new car
  app.post("/api/admin/cars", authenticateToken, validateBody(insertCarSchema), async (req, res) => {
    try {
      const car = await storage.createCar(req.body);
      res.status(201).json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to create car" });
    }
  });

  // Admin: Brands
  app.get("/api/admin/brands", authenticateToken, async (_req, res) => {
    try {
      const brands = await storage.getCarBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.post("/api/admin/brands", authenticateToken, validateBody(insertCarBrandSchema), async (req, res) => {
    try {
      const brand = await storage.createCarBrand(req.body);
      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  // Admin: Models
  app.get("/api/admin/models", authenticateToken, async (req, res) => {
    try {
      const brandId = req.query.brandId ? Number(req.query.brandId) : undefined;
      const models = await storage.getCarModels(brandId);
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  app.post("/api/admin/models", authenticateToken, validateBody(insertCarModelSchema), async (req, res) => {
    try {
      const model = await storage.createCarModel(req.body);
      res.status(201).json(model);
    } catch (error) {
      res.status(500).json({ message: "Failed to create model" });
    }
  });

  // Admin: Update/Delete brand
  app.put("/api/admin/brands/:id", authenticateToken, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid brand ID" });
      const update: any = {};
      if (typeof req.body.name === 'string') update.name = req.body.name;
      if (typeof req.body.logoUrl === 'string' || req.body.logoUrl === null) update.logoUrl = req.body.logoUrl;
      const updated = await CarBrandModel.findOneAndUpdate({ id }, update, { new: true });
      if (!updated) return res.status(404).json({ message: "Brand not found" });
      res.json({ id: updated.id, name: updated.name, logoUrl: updated.logoUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to update brand" });
    }
  });

  app.delete("/api/admin/brands/:id", authenticateToken, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid brand ID" });
      const deleted = await CarBrandModel.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ message: "Brand not found" });
      res.json({ message: "Brand deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // Admin: Update/Delete model
  app.put("/api/admin/models/:id", authenticateToken, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid model ID" });
      const update: any = {};
      if (typeof req.body.name === 'string') update.name = req.body.name;
      if (typeof req.body.brandId === 'number') update.brandId = req.body.brandId;
      const updated = await CarModelModel.findOneAndUpdate({ id }, update, { new: true });
      if (!updated) return res.status(404).json({ message: "Model not found" });
      res.json({ id: updated.id, name: updated.name, brandId: Number(updated.brandId) });
    } catch (error) {
      res.status(500).json({ message: "Failed to update model" });
    }
  });

  app.delete("/api/admin/models/:id", authenticateToken, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid model ID" });
      const deleted = await CarModelModel.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ message: "Model not found" });
      res.json({ message: "Model deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete model" });
    }
  });

  // Update a car
  app.put("/api/admin/cars/:id", authenticateToken, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      
      const car = await storage.updateCar(id, req.body);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to update car" });
    }
  });

  // Delete a car
  app.delete("/api/admin/cars/:id", authenticateToken, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      
      const success = await storage.deleteCar(id);
      if (!success) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json({ message: "Car deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete car" });
    }
  });

  // Get all sell inquiries
  app.get("/api/admin/inquiries", authenticateToken, async (req, res) => {
    try {
      const inquiries = await storage.getSellInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Update inquiry status
  app.put("/api/admin/inquiries/:id/status", authenticateToken, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inquiry ID" });
      }
      
      const { status } = req.body;
      if (!status || !['pending', 'reviewed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const inquiry = await storage.updateSellInquiryStatus(id, status);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry status" });
    }
  });

  // Get all cars for admin (adding missing route)
  app.get("/api/admin/cars", authenticateToken, async (req, res) => {
    try {
      const cars = await storage.getCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });

  return httpServer;
}
