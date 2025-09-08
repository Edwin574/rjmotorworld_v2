// @ts-nocheck
import mongoose, { Schema, Document } from 'mongoose';
import { getNextSequence } from './counter';
import type {
  Car as CarType,
  SellInquiry as SellInquiryType,
  User as UserType,
  CarBrand as CarBrandType,
  CarModel as CarModelType
} from '@shared/schema';

// Car model
export interface CarDocument extends Document, Omit<CarType, 'id'> { id: number }

const carSchema = new Schema<CarDocument>({
  id: { type: Number, unique: true, index: true },
  title: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  color: { type: String },
  description: { type: String },
  condition: { type: String, enum: ['new', 'used'], required: true },
  fuelType: { type: String },
  transmission: { type: String },
  engine: { type: String },
  driveType: { type: String },
  bodyType: { type: String },
  vin: { type: String },
  stockNumber: { type: String },
  features: [{ type: String }],
  images: [{ type: String }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

carSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('car');
  }
  next();
});

// Sell Inquiry model
export interface SellInquiryDocument extends Document, Omit<SellInquiryType, 'id'> { id: number }

const sellInquirySchema = new Schema<SellInquiryDocument>({
  id: { type: Number, unique: true, index: true },
  sellerType: { type: String, enum: ['individual', 'corporate', 'showroom'], required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  contactMethod: { type: String, enum: ['email', 'phone', 'whatsapp'], required: true },
  bestTimeToContact: { type: String },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  color: { type: String },
  registrationNumber: { type: String },
  accidentHistory: { type: String, enum: ['no_accidents', 'minor_accidents', 'major_accidents'] },
  askingPrice: { type: Number, required: true },
  location: { type: String },
  additionalNotes: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'rejected'], default: 'pending' }
}, { timestamps: true });

sellInquirySchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('sell_inquiry');
  }
  next();
});

// User model
export interface UserDocument extends Document, Omit<UserType, 'id'> { id: number }

const userSchema = new Schema<UserDocument>({
  id: { type: Number, unique: true, index: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('user');
  }
  next();
});

// Car Brand model
export interface CarBrandDocument extends Document, Omit<CarBrandType, 'id'> { id: number }

const carBrandSchema = new Schema<CarBrandDocument>({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true, unique: true },
  logoUrl: { type: String }
}, { timestamps: true });

carBrandSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('car_brand');
  }
  next();
});

// Car Model model
export interface CarModelDocument extends Document, Omit<CarModelType, 'id'> { id: number }

const carModelSchema = new Schema<CarModelDocument>({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  brandId: { type: Number, required: true }
}, { timestamps: true });

carModelSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequence('car_model');
  }
  next();
});

// Create and export models
export const Car = mongoose.model<CarDocument>('Car', carSchema);
export const SellInquiry = mongoose.model<SellInquiryDocument>('SellInquiry', sellInquirySchema);
export const User = mongoose.model<UserDocument>('User', userSchema);
export const CarBrand = mongoose.model<CarBrandDocument>('CarBrand', carBrandSchema);
export const CarModel = mongoose.model<CarModelDocument>('CarModel', carModelSchema);