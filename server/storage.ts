import { 
  users, type User, type InsertUser,
  cars, type Car, type InsertCar,
  sellInquiries, type SellInquiry, type InsertSellInquiry,
  carBrands, type CarBrand, type InsertCarBrand,
  carModels, type CarModel, type InsertCarModel
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Car operations
  getCars(filters?: Partial<{ 
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
  }>): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  
  // Sell inquiries operations
  getSellInquiries(): Promise<SellInquiry[]>;
  getSellInquiry(id: number): Promise<SellInquiry | undefined>;
  createSellInquiry(inquiry: InsertSellInquiry): Promise<SellInquiry>;
  updateSellInquiryStatus(id: number, status: 'pending' | 'reviewed' | 'rejected'): Promise<SellInquiry | undefined>;
  
  // Car brands and models operations
  getCarBrands(): Promise<CarBrand[]>;
  getCarBrand(id: number): Promise<CarBrand | undefined>;
  createCarBrand(brand: InsertCarBrand): Promise<CarBrand>;
  
  getCarModels(brandId?: number): Promise<CarModel[]>;
  getCarModel(id: number): Promise<CarModel | undefined>;
  createCarModel(model: InsertCarModel): Promise<CarModel>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cars: Map<number, Car>;
  private sellInquiries: Map<number, SellInquiry>;
  private carBrands: Map<number, CarBrand>;
  private carModels: Map<number, CarModel>;
  userCurrentId: number;
  carCurrentId: number;
  inquiryCurrentId: number;
  brandCurrentId: number;
  modelCurrentId: number;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.sellInquiries = new Map();
    this.carBrands = new Map();
    this.carModels = new Map();
    this.userCurrentId = 1;
    this.carCurrentId = 1;
    this.inquiryCurrentId = 1;
    this.brandCurrentId = 1;
    this.modelCurrentId = 1;

    // Initialize with admin user
    this.createUser({
      username: process.env.ADMIN_USERNAME || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      isAdmin: true
    });

    // Initialize with some car brands
    const brands = [
      { name: "BMW", logoUrl: "https://www.carlogos.org/car-logos/bmw-logo.png" },
      { name: "Mercedes-Benz", logoUrl: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
      { name: "Toyota", logoUrl: "https://www.carlogos.org/car-logos/toyota-logo.png" },
      { name: "Audi", logoUrl: "https://www.carlogos.org/car-logos/audi-logo.png" },
      { name: "Honda", logoUrl: "https://www.carlogos.org/car-logos/honda-logo.png" },
      { name: "Ford", logoUrl: "https://www.carlogos.org/car-logos/ford-logo.png" },
      { name: "Volkswagen", logoUrl: "https://www.carlogos.org/car-logos/volkswagen-logo.png" }
    ];
    
    brands.forEach(brand => this.createCarBrand(brand));

    // Add some models for each brand
    const models = [
      { brandId: 1, name: "3 Series" },
      { brandId: 1, name: "5 Series" },
      { brandId: 1, name: "X5" },
      { brandId: 1, name: "M4" },
      { brandId: 2, name: "C-Class" },
      { brandId: 2, name: "E-Class" },
      { brandId: 2, name: "S-Class" },
      { brandId: 2, name: "EQS" },
      { brandId: 3, name: "Camry" },
      { brandId: 3, name: "Corolla" },
      { brandId: 3, name: "RAV4" },
      { brandId: 4, name: "A4" },
      { brandId: 4, name: "Q5" },
      { brandId: 4, name: "RS7" }
    ];
    
    models.forEach(model => this.createCarModel(model));

    // Add some sample cars
    const sampleCars = [
      {
        title: "BMW M4 Competition",
        make: "BMW",
        model: "M4",
        year: 2023,
        price: 82500,
        mileage: 12,
        color: "Isle of Man Green",
        condition: "new" as const,
        fuelType: "Petrol",
        transmission: "Automatic",
        description: "Experience the thrill of driving with the all-new 2023 BMW M4 Competition. This stunning Isle of Man Green example comes with only 12 miles on the odometer and is equipped with all the latest technology and performance features.",
        bodyType: "Coupe",
        engine: "3.0L Twin-Turbo",
        driveType: "Rear-Wheel Drive",
        vin: "WB****1234567890",
        stockNumber: "BMW-M4-2023-001",
        featured: true,
        images: [
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1617654112808-106c1d614972?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1543465077-db45d34b88a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "M Sport Differential",
          "Adaptive M Suspension",
          "19\"/20\" M Double-spoke wheels",
          "Harman Kardon Surround Sound",
          "M Carbon Exterior Package",
          "BMW Live Cockpit Professional",
          "Merino Leather Interior",
          "Heated front seats",
          "Wireless charging",
          "Apple CarPlay & Android Auto",
          "Parking Assistant Plus",
          "M Drive Professional"
        ]
      },
      {
        title: "Audi RS7 Sportback",
        make: "Audi",
        model: "RS7",
        year: 2023,
        price: 123800,
        mileage: 5,
        color: "Nardo Gray",
        condition: "new" as const,
        fuelType: "Petrol",
        transmission: "Automatic",
        description: "Introducing the 2023 Audi RS7 Sportback, a performance masterpiece with 591 horsepower and quattro all-wheel drive.",
        bodyType: "Sportback",
        engine: "4.0L Twin-Turbo V8",
        driveType: "All-Wheel Drive",
        vin: "WAU****1234567890",
        stockNumber: "AUDI-RS7-2023-001",
        featured: false,
        images: [
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1606611013875-4b5d4b5a3e85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1612825173281-9a193378527e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "Quattro All-Wheel Drive",
          "RS Sport Suspension",
          "Bang & Olufsen Sound System",
          "Carbon Fiber Trim",
          "Valcona Leather Interior",
          "Heated and Ventilated Seats"
        ]
      },
      {
        title: "Mercedes-Benz EQS",
        make: "Mercedes-Benz",
        model: "EQS",
        year: 2023,
        price: 105450,
        mileage: 8,
        color: "Obsidian Black",
        condition: "new" as const,
        fuelType: "Electric",
        transmission: "Automatic",
        description: "The all-electric 2023 Mercedes-Benz EQS redefines luxury with cutting-edge technology and impressive range.",
        bodyType: "Sedan",
        engine: "Electric Dual Motor",
        driveType: "All-Wheel Drive",
        vin: "WDB****1234567890",
        stockNumber: "MB-EQS-2023-001",
        featured: false,
        images: [
          "https://images.unsplash.com/photo-1560031607-99279bc29ced?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618569419473-89b2634c0f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "MBUX Hyperscreen",
          "Level 3 Autonomous Driving",
          "Burmester 3D Sound System",
          "Energizing Comfort Package",
          "Driving Assistance Package"
        ]
      },
      {
        title: "BMW 5 Series 530e",
        make: "BMW",
        model: "5 Series",
        year: 2020,
        price: 38950,
        mileage: 25432,
        color: "Alpine White",
        condition: "used" as const,
        fuelType: "Hybrid",
        transmission: "Automatic",
        description: "Well-maintained 2020 BMW 530e hybrid with low mileage and excellent fuel efficiency.",
        bodyType: "Sedan",
        engine: "2.0L Turbo + Electric Motor",
        driveType: "Rear-Wheel Drive",
        vin: "WBA****1234567890",
        stockNumber: "BMW-530E-2020-001",
        featured: true,
        images: [
          "https://images.unsplash.com/photo-1635048424329-a9bfb146d7aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1617654112808-106c1d614972?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "iDrive 7.0",
          "Apple CarPlay & Android Auto",
          "Navigation System",
          "Heated Seats",
          "Parking Sensors"
        ]
      },
      {
        title: "Audi Q5 S-Line",
        make: "Audi",
        model: "Q5",
        year: 2019,
        price: 31200,
        mileage: 38725,
        color: "Glacier White",
        condition: "used" as const,
        fuelType: "Diesel",
        transmission: "Automatic",
        description: "Premium 2019 Audi Q5 S-Line with Quattro all-wheel drive and comprehensive service history.",
        bodyType: "SUV",
        engine: "2.0L TDI",
        driveType: "All-Wheel Drive",
        vin: "WAU****9876543210",
        stockNumber: "AUDI-Q5-2019-001",
        featured: false,
        images: [
          "https://images.unsplash.com/photo-1619141522531-32525370eccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1606611013875-4b5d4b5a3e85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1621937303719-44b6c8c8eb52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618569419473-89b2634c0f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "Audi Virtual Cockpit",
          "MMI Navigation Plus",
          "S-Line Sport Package",
          "Leather Interior",
          "Panoramic Sunroof"
        ]
      },
      {
        title: "Mercedes-Benz E-Class",
        make: "Mercedes-Benz",
        model: "E-Class",
        year: 2020,
        price: 42750,
        mileage: 29548,
        color: "Selenite Grey",
        condition: "used" as const,
        fuelType: "Petrol",
        transmission: "Automatic",
        description: "Elegant 2020 Mercedes-Benz E-Class with premium features and exceptional comfort.",
        bodyType: "Sedan",
        engine: "2.0L Turbo",
        driveType: "Rear-Wheel Drive",
        vin: "WDB****9876543210",
        stockNumber: "MB-E-2020-001",
        featured: true,
        images: [
          "https://images.unsplash.com/photo-1606152456819-b5077544842f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1560031607-99279bc29ced?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "MBUX Infotainment",
          "Burmester Sound System",
          "Premium Package",
          "Wireless Charging",
          "Active Park Assist"
        ]
      },
      {
        title: "Toyota Camry Hybrid",
        make: "Toyota",
        model: "Camry",
        year: 2022,
        price: 28750,
        mileage: 15432,
        color: "Silver Metallic",
        condition: "used" as const,
        fuelType: "Hybrid",
        transmission: "Automatic",
        description: "Reliable 2022 Toyota Camry Hybrid with excellent fuel economy and proven reliability.",
        bodyType: "Sedan",
        engine: "2.5L Hybrid",
        driveType: "Front-Wheel Drive",
        vin: "4T1****1234567890",
        stockNumber: "TOY-CAM-2022-001",
        featured: false,
        images: [
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1612825173281-9a193378527e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1604169863924-aeeab4e69f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1621937303719-44b6c8c8eb52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "Toyota Safety Sense 2.0",
          "Apple CarPlay & Android Auto",
          "Dual-Zone Climate Control",
          "Wireless Phone Charging",
          "LED Headlights",
          "Heated Front Seats"
        ]
      },
      {
        title: "BMW X5 xDrive40i",
        make: "BMW",
        model: "X5",
        year: 2021,
        price: 67850,
        mileage: 22150,
        color: "Carbon Black",
        condition: "used" as const,
        fuelType: "Petrol",
        transmission: "Automatic",
        description: "Luxurious 2021 BMW X5 with advanced technology and superior comfort for family adventures.",
        bodyType: "SUV",
        engine: "3.0L TwinPower Turbo",
        driveType: "All-Wheel Drive",
        vin: "5UX****1234567890",
        stockNumber: "BMW-X5-2021-001",
        featured: true,
        images: [
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1621937303719-44b6c8c8eb52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1617654112808-106c1d614972?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "BMW iDrive 7.0",
          "Panoramic Moonroof",
          "Harman Kardon Sound",
          "Ventilated Seats",
          "Driving Assistant Pro",
          "Third Row Seating"
        ]
      },
      {
        title: "Audi A4 Quattro",
        make: "Audi",
        model: "A4",
        year: 2023,
        price: 45900,
        mileage: 8750,
        color: "Glacier White",
        condition: "new" as const,
        fuelType: "Petrol",
        transmission: "Automatic",
        description: "Brand new 2023 Audi A4 with quattro all-wheel drive and cutting-edge technology.",
        bodyType: "Sedan",
        engine: "2.0L TFSI",
        driveType: "All-Wheel Drive",
        vin: "WAU****2023567890",
        stockNumber: "AUDI-A4-2023-001",
        featured: false,
        images: [
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1606611013875-4b5d4b5a3e85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1612825173281-9a193378527e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        features: [
          "Audi Virtual Cockpit Plus",
          "MMI Touch Navigation",
          "Bang & Olufsen Premium Audio",
          "Quattro All-Wheel Drive",
          "LED Matrix Headlights",
          "Audi Pre Sense"
        ]
      }
    ];

    sampleCars.forEach(car => this.createCar(car));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    let result = Array.from(this.cars.values());

    if (filters) {
      if (filters.condition) {
        result = result.filter(car => car.condition === filters.condition);
      }
      
      if (filters.make) {
        result = result.filter(car => car.make === filters.make);
      }
      
      if (filters.model) {
        result = result.filter(car => car.model === filters.model);
      }
      
      if (filters.minYear) {
        result = result.filter(car => car.year >= filters.minYear);
      }
      
      if (filters.maxYear) {
        result = result.filter(car => car.year <= filters.maxYear);
      }
      
      if (filters.minPrice) {
        result = result.filter(car => car.price >= filters.minPrice);
      }
      
      if (filters.maxPrice) {
        result = result.filter(car => car.price <= filters.maxPrice);
      }
      
      if (filters.minMileage) {
        result = result.filter(car => car.mileage >= filters.minMileage);
      }
      
      if (filters.maxMileage) {
        result = result.filter(car => car.mileage <= filters.maxMileage);
      }
      
      if (filters.featured !== undefined) {
        result = result.filter(car => car.featured === filters.featured);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(car => 
          car.title.toLowerCase().includes(searchLower) ||
          car.make.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower) ||
          (car.description && car.description.toLowerCase().includes(searchLower))
        );
      }
    }

    return result;
  }

  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = this.carCurrentId++;
    const now = new Date();
    const car: Car = { 
      ...insertCar, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: number, carUpdate: Partial<InsertCar>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;

    const updatedCar: Car = { 
      ...car, 
      ...carUpdate,
      updatedAt: new Date()
    };
    
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: number): Promise<boolean> {
    return this.cars.delete(id);
  }

  // Sell inquiries operations
  async getSellInquiries(): Promise<SellInquiry[]> {
    return Array.from(this.sellInquiries.values());
  }

  async getSellInquiry(id: number): Promise<SellInquiry | undefined> {
    return this.sellInquiries.get(id);
  }

  async createSellInquiry(inquiry: InsertSellInquiry): Promise<SellInquiry> {
    const id = this.inquiryCurrentId++;
    const sellInquiry: SellInquiry = { 
      ...inquiry, 
      id, 
      status: 'pending',
      createdAt: new Date()
    };
    this.sellInquiries.set(id, sellInquiry);
    return sellInquiry;
  }

  async updateSellInquiryStatus(id: number, status: 'pending' | 'reviewed' | 'rejected'): Promise<SellInquiry | undefined> {
    const inquiry = this.sellInquiries.get(id);
    if (!inquiry) return undefined;

    const updatedInquiry: SellInquiry = { ...inquiry, status };
    this.sellInquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }

  // Car brands operations
  async getCarBrands(): Promise<CarBrand[]> {
    return Array.from(this.carBrands.values());
  }

  async getCarBrand(id: number): Promise<CarBrand | undefined> {
    return this.carBrands.get(id);
  }

  async createCarBrand(brand: InsertCarBrand): Promise<CarBrand> {
    const id = this.brandCurrentId++;
    const carBrand: CarBrand = { ...brand, id };
    this.carBrands.set(id, carBrand);
    return carBrand;
  }

  // Car models operations
  async getCarModels(brandId?: number): Promise<CarModel[]> {
    const models = Array.from(this.carModels.values());
    if (brandId !== undefined) {
      return models.filter(model => model.brandId === brandId);
    }
    return models;
  }

  async getCarModel(id: number): Promise<CarModel | undefined> {
    return this.carModels.get(id);
  }

  async createCarModel(model: InsertCarModel): Promise<CarModel> {
    const id = this.modelCurrentId++;
    const carModel: CarModel = { ...model, id };
    this.carModels.set(id, carModel);
    return carModel;
  }
}

export const storage = new MemStorage();
