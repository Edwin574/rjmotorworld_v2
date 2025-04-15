import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/hooks/useAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImage } from "@/lib/imagekit";
import { useToast } from "@/hooks/use-toast";
import { carFormSchema } from "@/lib/utils/validators";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils/formatters";
import type { Car, CarBrand, CarModel } from "@shared/schema";
import { z } from "zod";

type FormValues = z.infer<typeof carFormSchema>;

const AdminCarsPage = () => {
  const { isAuthenticated, credentials } = useAdmin();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1]);
  const editId = queryParams.get('edit');
  
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      title: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      color: "",
      condition: "new",
      fuelType: "",
      transmission: "",
      description: "",
      bodyType: "",
      engine: "",
      driveType: "",
      vin: "",
      stockNumber: "",
      featured: false,
      images: [],
      features: []
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // Fetch cars
  const { data: cars = [], isLoading, refetch } = useQuery<Car[]>({
    queryKey: ['/api/cars'],
    enabled: isAuthenticated,
  });

  // Fetch car brands
  const { data: brands = [] } = useQuery<CarBrand[]>({
    queryKey: ['/api/brands'],
    enabled: isAuthenticated,
  });

  // Fetch car models when make is selected
  const { data: models = [] } = useQuery<CarModel[]>({
    queryKey: ['/api/models', form.watch('make')],
    enabled: isAuthenticated && !!form.watch('make'),
  });

  // Load car details if in edit mode
  useEffect(() => {
    if (editId && cars.length > 0) {
      const carToEdit = cars.find(car => car.id === Number(editId));
      if (carToEdit) {
        setSelectedCar(carToEdit);
        form.reset({
          ...carToEdit,
          features: carToEdit.features || []
        });
        setPreviewImages(carToEdit.images || []);
        setIsModalOpen(true);
      }
    }
  }, [editId, cars, form]);

  const handleAddNewCar = () => {
    setSelectedCar(null);
    form.reset({
      title: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      color: "",
      condition: "new",
      fuelType: "",
      transmission: "",
      description: "",
      bodyType: "",
      engine: "",
      driveType: "",
      vin: "",
      stockNumber: "",
      featured: false,
      images: [],
      features: []
    });
    setPreviewImages([]);
    setIsModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    form.reset({
      ...car,
      features: car.features || []
    });
    setPreviewImages(car.images || []);
    setIsModalOpen(true);
  };

  const handleDeleteCar = async (car: Car) => {
    if (window.confirm(`Are you sure you want to delete ${car.title}?`)) {
      setIsDeleting(true);
      try {
        await apiRequest('DELETE', `/api/admin/cars/${car.id}`, undefined, credentials);
        toast({
          title: "Success",
          description: "Car deleted successfully.",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete car.",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImages(true);
    const uploadedImageUrls = [...form.getValues().images];
    const newPreviewImages = [...previewImages];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create temporary preview
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewImages.push(e.target.result as string);
            setPreviewImages([...newPreviewImages]);
          }
        };
        reader.readAsDataURL(file);
        
        // Upload to server/ImageKit
        const imageUrl = await uploadImage(file, credentials);
        uploadedImageUrls.push(imageUrl);
      }
      
      form.setValue('images', uploadedImageUrls);
      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images.",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues().images;
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    form.setValue('images', updatedImages);
    
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  const addFeature = () => {
    const currentFeatures = form.getValues().features || [];
    form.setValue('features', [...currentFeatures, '']);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues().features || [];
    const updatedFeatures = [...currentFeatures];
    updatedFeatures.splice(index, 1);
    form.setValue('features', updatedFeatures);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (selectedCar) {
        // Update existing car
        await apiRequest('PUT', `/api/admin/cars/${selectedCar.id}`, data, credentials);
        toast({
          title: "Success",
          description: "Car updated successfully.",
        });
      } else {
        // Create new car
        await apiRequest('POST', '/api/admin/cars', data, credentials);
        toast({
          title: "Success",
          description: "Car added successfully.",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/cars'] });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: selectedCar ? "Failed to update car." : "Failed to add car.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activePage="cars" />
      
      <div className="flex-1 overflow-x-hidden">
        <AdminHeader title="Car Listings" />
        
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Car Listings</h2>
            <Button 
              onClick={handleAddNewCar}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <i className="fas fa-plus mr-2"></i> Add New Car
            </Button>
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Car</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Added</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cars.map(car => (
                      <tr key={car.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-16 rounded bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
                              {car.images && car.images.length > 0 && (
                                <img 
                                  src={car.images[0]} 
                                  alt={car.title} 
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{car.title}</div>
                              <div className="text-xs text-gray-medium">
                                {car.make} {car.model}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              car.condition === 'new' 
                                ? 'bg-blue-100 text-primary' 
                                : 'bg-yellow-100 text-warning'
                            }`}>
                              {car.condition === 'new' ? 'New' : 'Used'}
                            </span>
                            {car.featured && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-secondary bg-opacity-10 text-secondary rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{formatCurrency(car.price)}</td>
                        <td className="px-6 py-4">{car.year}</td>
                        <td className="px-6 py-4 text-gray-medium">
                          {new Date(car.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => handleEditCar(car)}
                              className="text-primary hover:text-blue-700"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteCar(car)}
                              className="text-red-500 hover:text-red-700"
                              disabled={isDeleting}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {cars.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-medium">
                          No car listings found. Add your first car!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Car Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Details */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 2023 BMW X5 xDrive40i" />
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
                      <FormLabel>Condition</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <option value="new">New</option>
                        <option value="used">Used</option>
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
                      <FormLabel>Make</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <option value="">Select Make</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.name}>{brand.name}</option>
                        ))}
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!form.watch('make')}
                      >
                        <option value="">Select Model</option>
                        {models.map(model => (
                          <option key={model.id} value={model.name}>{model.name}</option>
                        ))}
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
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
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <option value="">Select Transmission</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                        <option value="Semi-Automatic">Semi-Automatic</option>
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
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <option value="">Select Body Type</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Wagon">Wagon</option>
                        <option value="Van">Van</option>
                        <option value="Truck">Truck</option>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 2.0L Turbo" />
                      </FormControl>
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
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <option value="">Select Drive Type</option>
                        <option value="Front-Wheel Drive">Front-Wheel Drive</option>
                        <option value="Rear-Wheel Drive">Rear-Wheel Drive</option>
                        <option value="All-Wheel Drive">All-Wheel Drive</option>
                        <option value="4x4">4x4</option>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="featured"
                        />
                        <label
                          htmlFor="featured"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Featured Car
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Features */}
              <div>
                <Label className="mb-2 block">Features</Label>
                <div className="space-y-2">
                  {form.watch('features')?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const updatedFeatures = [...form.getValues().features || []];
                          updatedFeatures[index] = e.target.value;
                          form.setValue('features', updatedFeatures);
                        }}
                        placeholder={`Feature ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeFeature(index)}
                        size="sm"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFeature}
                    className="mt-2"
                  >
                    <i className="fas fa-plus mr-2"></i> Add Feature
                  </Button>
                </div>
              </div>
              
              {/* Images */}
              <div>
                <Label className="mb-2 block">Images</Label>
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    disabled={uploadingImages}
                  >
                    {uploadingImages ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> Uploading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload mr-2"></i> Upload Images
                      </>
                    )}
                  </Button>
                </div>
                
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="images"
                  render={() => <></>}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedCar ? 'Update Car' : 'Add Car'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCarsPage;
