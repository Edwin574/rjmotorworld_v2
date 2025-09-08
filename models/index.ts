import mongoose from 'mongoose';

// Car Brand Schema
const carBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logoUrl: {
    type: String,
    default: null
  }
});

// Car Model Schema
const carModelSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarBrand',
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

// Car Schema
const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  mileage: {
    type: Number,
    default: 0
  },
  color: {
    type: String
  },
  condition: {
    type: String,
    enum: ['new', 'used'],
    required: true
  },
  fuelType: {
    type: String
  },
  transmission: {
    type: String
  },
  description: {
    type: String
  },
  bodyType: {
    type: String
  },
  engine: {
    type: String
  },
  driveType: {
    type: String
  },
  vin: {
    type: String
  },
  stockNumber: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    default: []
  },
  features: {
    type: [String],
    default: []
  },
  // Engine specifications
  engineSize: {
    type: String
  },
  engineType: {
    type: String
  },
  horsepower: {
    type: Number
  },
  torque: {
    type: Number
  },
  // Safety and luxury features
  safetyFeatures: {
    type: [String],
    default: []
  },
  luxuryFeatures: {
    type: [String],
    default: []
  },
  // Technical specifications
  doors: {
    type: Number
  },
  seats: {
    type: Number
  },
  // Vehicle history and condition
  accidentHistory: {
    type: String,
    enum: ['no_accidents', 'minor_accidents', 'major_accidents']
  },
  serviceHistory: {
    type: Boolean,
    default: false
  },
  ownerHistory: {
    type: Number
  },
  // Market information
  tags: {
    type: [String],
    default: []
  },
  marketValue: {
    type: Number
  },
  priceNegotiable: {
    type: Boolean,
    default: true
  },
  // Location and availability
  location: {
    type: String
  },
  availability: {
    type: String,
    default: 'available'
  },
  // Warranty and financing
  warrantyMonths: {
    type: Number
  },
  financingAvailable: {
    type: Boolean,
    default: false
  },
  // Administrative
  registrationNumber: {
    type: String
  },
  insuranceDetails: {
    type: String
  }
}, {
  timestamps: true
});

// Sell Inquiry Schema
const sellInquirySchema = new mongoose.Schema({
  sellerType: {
    type: String,
    enum: ['individual', 'corporate', 'showroom'],
    required: true
  },
  registrationNumber: {
    type: String
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  year: {
    type: Number,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  accidentHistory: {
    type: String,
    enum: ['no_accidents', 'minor_accidents', 'major_accidents']
  },
  askingPrice: {
    type: Number,
    required: true
  },
  location: {
    type: String
  },
  additionalNotes: {
    type: String
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  bestTimeToContact: {
    type: String
  },
  contactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Export models
export const CarBrand = mongoose.models.CarBrand || mongoose.model('CarBrand', carBrandSchema);
export const CarModel = mongoose.models.CarModel || mongoose.model('CarModel', carModelSchema);
export const Car = mongoose.models.Car || mongoose.model('Car', carSchema);
export const SellInquiry = mongoose.models.SellInquiry || mongoose.model('SellInquiry', sellInquirySchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);