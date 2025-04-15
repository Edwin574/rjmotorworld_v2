import mongoose, { Schema, Document } from 'mongoose';
import type {
  Car as CarType,
  SellInquiry as SellInquiryType,
  User as UserType,
  CarBrand as CarBrandType,
  CarModel as CarModelType
} from '@shared/schema';

// Car model
export interface CarDocument extends Document, Omit<CarType, 'id'> {}

const carSchema = new Schema<CarDocument>({
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

// Sell Inquiry model
export interface SellInquiryDocument extends Document, Omit<SellInquiryType, 'id'> {}

const sellInquirySchema = new Schema<SellInquiryDocument>({
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

// User model
export interface UserDocument extends Document, Omit<UserType, 'id'> {}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

// Car Brand model
export interface CarBrandDocument extends Document, Omit<CarBrandType, 'id'> {}

const carBrandSchema = new Schema<CarBrandDocument>({
  name: { type: String, required: true, unique: true },
  logoUrl: { type: String }
}, { timestamps: true });

// Car Model model
export interface CarModelDocument extends Document, Omit<CarModelType, 'id'> {}

const carModelSchema = new Schema<CarModelDocument>({
  name: { type: String, required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarBrand', required: true }
}, { timestamps: true });

// Create and export models
export const Car = mongoose.model<CarDocument>('Car', carSchema);
export const SellInquiry = mongoose.model<SellInquiryDocument>('SellInquiry', sellInquirySchema);
export const User = mongoose.model<UserDocument>('User', userSchema);
export const CarBrand = mongoose.model<CarBrandDocument>('CarBrand', carBrandSchema);
export const CarModel = mongoose.model<CarModelDocument>('CarModel', carModelSchema);