import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../contexts/AdminAuthContext";
import { makeAuthenticatedRequest } from "@/lib/auth";
import type { Car, CarBrand, InsertCar } from "@shared/schema";

// Enhanced form schema with all the extensive features
const enhancedCarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().min(1, "Price must be greater than 0"),
  condition: z.enum(['new', 'used']),
  mileage: z.number().min(0).optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  description: z.string().optional(),
  
  // Engine specifications
  engineSize: z.string().optional(),
  engineType: z.string().optional(),
  horsepower: z.number().min(0).optional(),
  torque: z.number().min(0).optional(),
  
  // Technical specifications
  driveType: z.string().optional(),
  doors: z.number().min(2).max(5).optional(),
  seats: z.number().min(2).max(8).optional(),
  
  // Vehicle history
  accidentHistory: z.enum(['no_accidents', 'minor_accidents', 'major_accidents']).optional(),
  serviceHistory: z.boolean().optional(),
  ownerHistory: z.number().min(0).optional(),
  
  // Features and tags
  features: z.array(z.string()).optional(),
  safetyFeatures: z.array(z.string()).optional(),
  luxuryFeatures: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  
  // Market and business
  marketValue: z.number().min(0).optional(),
  priceNegotiable: z.boolean().optional(),
  location: z.string().optional(),
  warrantyMonths: z.number().min(0).optional(),
  financingAvailable: z.boolean().optional(),
  
  // Administrative
  vin: z.string().optional(),
  registrationNumber: z.string().optional(),
  insuranceDetails: z.string().optional(),
  stockNumber: z.string().optional(),
  
  // Status
  featured: z.boolean().optional(),
  availability: z.string().optional(),
  
  // Images
  images: z.array(z.string()).optional(),
});

type EnhancedCarFormData = z.infer<typeof enhancedCarSchema>;

interface EnhancedCarFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  car?: Car | null;
  brands: CarBrand[];
  onSuccess?: () => void;
}

// Predefined options for various fields
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG', 'CNG'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'];
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van'];
const DRIVE_TYPES = ['FWD', 'RWD', 'AWD', '4WD'];
const ENGINE_TYPES = ['Naturally Aspirated', 'Turbo', 'Supercharged', 'Hybrid', 'Electric'];

const COMMON_FEATURES = [
  'Air Conditioning', 'Bluetooth', 'GPS Navigation', 'Leather Seats', 'Sunroof', 'Cruise Control',
  'Keyless Entry', 'Push Start', 'USB Ports', 'Wireless Charging', 'Premium Sound System',
  'Heated Seats', 'Ventilated Seats', 'Memory Seats', 'Power Windows', 'Power Steering'
];

const SAFETY_FEATURES = [
  'ABS', 'Airbags', 'Stability Control', 'Traction Control', 'Lane Assist', 'Blind Spot Monitor',
  'Collision Warning', 'Emergency Braking', 'Parking Sensors', 'Backup Camera', 'Adaptive Cruise Control'
];

const LUXURY_FEATURES = [
  'Premium Leather', 'Massage Seats', 'Ambient Lighting', 'Premium Audio', 'Panoramic Roof',
  'Heads-up Display', 'Wireless Phone Charging', 'Premium Paint', 'Chrome Accents', 'Wood Trim'
];

const CAR_TAGS = [
  'Luxury', 'Sports', 'Family', 'Eco-Friendly', 'Reliable', 'Performance', 'Comfort', 
  'Technology', 'Fuel Efficient', 'Off-Road', 'City Car', 'Executive'
];

const EnhancedCarFormDialog = ({ isOpen, onClose, car, brands, onSuccess }: EnhancedCarFormDialogProps) => {
  const { accessToken, refreshToken } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<EnhancedCarFormData>({
    resolver: zodResolver(enhancedCarSchema),
    defaultValues: {
      title: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      condition: 'used',
      mileage: 0,
      features: [],
      safetyFeatures: [],
      luxuryFeatures: [],
      tags: [],
      priceNegotiable: true,
      serviceHistory: false,
      financingAvailable: false,
      featured: false,
      availability: 'available',
      images: [],
    }
  });

  // Load car data when editing
  useEffect(() => {
    if (car && isOpen) {
      form.reset({
        title: car.title || "",
        make: car.make || "",
        model: car.model || "",
        year: car.year || new Date().getFullYear(),
        price: car.price || 0,
        condition: car.condition || 'used',
        mileage: car.mileage || 0,
        color: car.color || "",
        fuelType: car.fuelType || "",
        transmission: car.transmission || "",
        bodyType: car.bodyType || "",
        description: car.description || "",
        engineSize: car.engineSize || "",
        engineType: car.engineType || "",
        horsepower: car.horsepower || undefined,
        torque: car.torque || undefined,
        driveType: car.driveType || "",
        doors: car.doors || undefined,
        seats: car.seats || undefined,
        accidentHistory: car.accidentHistory || undefined,
        serviceHistory: car.serviceHistory || false,
        ownerHistory: car.ownerHistory || undefined,
        features: car.features || [],
        safetyFeatures: car.safetyFeatures || [],
        luxuryFeatures: car.luxuryFeatures || [],
        tags: car.tags || [],
        marketValue: car.marketValue || undefined,
        priceNegotiable: car.priceNegotiable ?? true,
        location: car.location || "",
        warrantyMonths: car.warrantyMonths || undefined,
        financingAvailable: car.financingAvailable || false,
        vin: car.vin || "",
        registrationNumber: car.registrationNumber || "",
        insuranceDetails: car.insuranceDetails || "",
        stockNumber: car.stockNumber || "",
        featured: car.featured || false,
        availability: car.availability || 'available',
        images: car.images || [],
      });
    } else if (!car && isOpen) {
      form.reset({
        title: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        condition: 'used',
        mileage: 0,
        features: [],
        safetyFeatures: [],
        luxuryFeatures: [],
        tags: [],
        priceNegotiable: true,
        serviceHistory: false,
        financingAvailable: false,
        featured: false,
        availability: 'available',
        images: [],
      });
    }
  }, [car, isOpen, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadedImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const response = await makeAuthenticatedRequest(
          'POST', 
          '/api/admin/upload', 
          { image: base64 },
          { accessToken: accessToken!, refreshToken }
        );

        uploadedImages.push(response.url);
      }

      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...uploadedImages]);

      toast({
        title: "Success",
        description: `${uploadedImages.length} image(s) uploaded successfully.`
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload one or more images.",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const onSubmit = async (data: EnhancedCarFormData) => {
    setIsLoading(true);
    try {
      const url = car ? `/api/admin/cars/${car.id}` : '/api/admin/cars';
      const method = car ? 'PUT' : 'POST';

      await makeAuthenticatedRequest(
        method,
        url,
        data,
        { accessToken: accessToken!, refreshToken }
      );

      toast({
        title: "Success",
        description: car ? "Car updated successfully!" : "Car created successfully!"
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save car. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {car ? 'Edit Car Listing' : 'Add New Car Listing'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Car Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="2023 BMW M4 Competition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make *</FormLabel>
                        <FormControl>
                          <Input placeholder="BMW" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model *</FormLabel>
                        <FormControl>
                          <Input placeholder="M4 Competition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (KSh) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage (km)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Alpine White" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the vehicle..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specs" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FUEL_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmission</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TRANSMISSIONS.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select body type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BODY_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="driveType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drive Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select drive type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DRIVE_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engineSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Size</FormLabel>
                        <FormControl>
                          <Input placeholder="3.0L Twin Turbo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engineType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select engine type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ENGINE_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horsepower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horsepower (HP)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="torque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Torque (Nm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Doors</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="2" 
                            max="5"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Seats</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="2" 
                            max="8"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">General Features</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {COMMON_FEATURES.map(feature => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`feature-${feature}`}
                            checked={form.watch('features')?.includes(feature)}
                            onCheckedChange={(checked) => {
                              const currentFeatures = form.getValues('features') || [];
                              if (checked) {
                                form.setValue('features', [...currentFeatures, feature]);
                              } else {
                                form.setValue('features', currentFeatures.filter(f => f !== feature));
                              }
                            }}
                          />
                          <Label htmlFor={`feature-${feature}`} className="text-sm">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Safety Features</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {SAFETY_FEATURES.map(feature => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`safety-${feature}`}
                            checked={form.watch('safetyFeatures')?.includes(feature)}
                            onCheckedChange={(checked) => {
                              const currentFeatures = form.getValues('safetyFeatures') || [];
                              if (checked) {
                                form.setValue('safetyFeatures', [...currentFeatures, feature]);
                              } else {
                                form.setValue('safetyFeatures', currentFeatures.filter(f => f !== feature));
                              }
                            }}
                          />
                          <Label htmlFor={`safety-${feature}`} className="text-sm">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Luxury Features</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {LUXURY_FEATURES.map(feature => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`luxury-${feature}`}
                            checked={form.watch('luxuryFeatures')?.includes(feature)}
                            onCheckedChange={(checked) => {
                              const currentFeatures = form.getValues('luxuryFeatures') || [];
                              if (checked) {
                                form.setValue('luxuryFeatures', [...currentFeatures, feature]);
                              } else {
                                form.setValue('luxuryFeatures', currentFeatures.filter(f => f !== feature));
                              }
                            }}
                          />
                          <Label htmlFor={`luxury-${feature}`} className="text-sm">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Vehicle Tags</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {CAR_TAGS.map(tag => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tag-${tag}`}
                            checked={form.watch('tags')?.includes(tag)}
                            onCheckedChange={(checked) => {
                              const currentTags = form.getValues('tags') || [];
                              if (checked) {
                                form.setValue('tags', [...currentTags, tag]);
                              } else {
                                form.setValue('tags', currentTags.filter(t => t !== tag));
                              }
                            }}
                          />
                          <Label htmlFor={`tag-${tag}`} className="text-sm">
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accidentHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accident History</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select accident history" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no_accidents">No Accidents</SelectItem>
                            <SelectItem value="minor_accidents">Minor Accidents</SelectItem>
                            <SelectItem value="major_accidents">Major Accidents</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownerHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Previous Owners</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VIN (Vehicle Identification Number)</FormLabel>
                        <FormControl>
                          <Input placeholder="1HGBH41JXMN109186" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="KCA 123A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="serviceHistory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Complete Service History Available</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insuranceDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Insurance company, policy details, etc."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Business Tab */}
              <TabsContent value="business" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marketValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Value (KSh)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Nairobi, Kenya" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="warrantyMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty (Months)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stockNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Number</FormLabel>
                        <FormControl>
                          <Input placeholder="ST-2024-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="priceNegotiable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Price is Negotiable</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="financingAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Financing Available</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured Vehicle</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image-upload" className="text-base font-medium">
                      Upload Vehicle Images
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                      className="mt-2"
                    />
                    {uploadingImages && (
                      <p className="text-sm text-gray-600 mt-1">Uploading images...</p>
                    )}
                  </div>

                  {form.watch('images') && form.watch('images')!.length > 0 && (
                    <div>
                      <Label className="text-base font-medium">Current Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {form.watch('images')!.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Car image ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 p-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : car ? 'Update Car' : 'Add Car'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCarFormDialog;