import { z } from 'zod';

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number validation regex
const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

// Registration number regex (allows common formats)
const regNumberRegex = /^[A-Z0-9\s-]{3,10}$/i;

// Basic validation schemas
export const emailSchema = z.string().regex(emailRegex, { message: "Please enter a valid email address" });

export const phoneSchema = z.string().regex(phoneRegex, { message: "Please enter a valid phone number" });

export const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });

// Login validation schema
export const loginSchema = z.object({
  username: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

// Car form validation schema
export const carFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.number().int().min(1900, { message: "Year must be 1900 or later" }),
  price: z.number().int().positive({ message: "Price must be positive" }),
  mileage: z.number().int().min(0, { message: "Mileage cannot be negative" }),
  color: z.string().optional(),
  condition: z.enum(['new', 'used'], { message: "Condition must be 'new' or 'used'" }),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  description: z.string().optional(),
  bodyType: z.string().optional(),
  engine: z.string().optional(),
  driveType: z.string().optional(),
  vin: z.string().optional(),
  stockNumber: z.string().optional(),
  featured: z.boolean().default(false),
  images: z.array(z.string()).min(1, { message: "At least one image is required" }),
  features: z.array(z.string()).optional(),
});

// Validation schemas for sell form
export const sellFormStep1Schema = z.object({
  sellerType: z.enum(['individual', 'corporate', 'showroom'], { 
    message: "Please select a seller type" 
  }),
});

export const sellFormStep2Schema = z.object({
  registrationNumber: z.string().optional(),
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  color: z.string().optional(),
  year: z.number().int().min(1900, { message: "Year must be 1900 or later" }),
  mileage: z.number().int().min(0, { message: "Mileage cannot be negative" }),
  accidentHistory: z.enum(['no_accidents', 'minor_accidents', 'major_accidents'], {
    message: "Please select accident history"
  }).optional(),
  askingPrice: z.number().int().positive({ message: "Price must be positive" }),
  location: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export const sellFormStep3Schema = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: emailSchema,
  phone: phoneSchema,
  bestTimeToContact: z.string().optional(),
  contactMethod: z.enum(['email', 'phone', 'whatsapp'], { 
    message: "Please select a contact method" 
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

// Combined schema for the entire sell form
export const sellFormSchema = sellFormStep1Schema
  .merge(sellFormStep2Schema)
  .merge(sellFormStep3Schema);
