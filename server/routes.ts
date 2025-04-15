import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCarSchema, insertSellInquirySchema } from "@shared/schema";
import { uploadImage } from "./lib/imagekit";
import { sendSellInquiryEmail } from "./lib/emailjs";

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

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  const { username, password } = req.headers;
  
  if (!username || !password) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Check against environment variables
  const adminUsername = process.env.ADMIN_USERNAME || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUsername && password === adminPassword) {
    next();
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

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
  app.post("/api/admin/upload", isAuthenticated, async (req, res) => {
    try {
      if (!req.body.image) {
        return res.status(400).json({ message: "No image provided" });
      }
      
      const imageUrl = await uploadImage(req.body.image);
      res.json({ url: imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Create a new car
  app.post("/api/admin/cars", isAuthenticated, validateBody(insertCarSchema), async (req, res) => {
    try {
      const car = await storage.createCar(req.body);
      res.status(201).json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to create car" });
    }
  });

  // Update a car
  app.put("/api/admin/cars/:id", isAuthenticated, async (req, res) => {
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
  app.delete("/api/admin/cars/:id", isAuthenticated, async (req, res) => {
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
  app.get("/api/admin/inquiries", isAuthenticated, async (req, res) => {
    try {
      const inquiries = await storage.getSellInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Update inquiry status
  app.put("/api/admin/inquiries/:id/status", isAuthenticated, async (req, res) => {
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

  // Check admin credentials
  app.post("/api/admin/auth", async (req, res) => {
    const { username, password } = req.body;
    
    // Check against environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ 
        authenticated: false, 
        message: "Invalid credentials" 
      });
    }
  });

  return httpServer;
}
