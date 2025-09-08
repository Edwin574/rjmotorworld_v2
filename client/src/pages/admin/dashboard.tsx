import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Car, SellInquiry, CarBrand, CarModel } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils/formatters";

const AdminDashboardPage = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [quickAddCar, setQuickAddCar] = useState({
    title: "",
    condition: "new",
    price: "",
    featured: false
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // Fetch cars (public endpoint)
  const { data: cars = [] } = useQuery<Car[]>({
    queryKey: ['/api/cars'],
    enabled: isAuthenticated,
  });

  // Fetch sell inquiries (auth required)
  const { data: inquiries = [] } = useQuery<SellInquiry[]>({
    queryKey: ['/api/admin/inquiries'],
    enabled: isAuthenticated && !!accessToken,
    queryFn: async () => {
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      return res.json();
    },
  });

  // Handle quick car add
  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickAddCar.title.trim() || !quickAddCar.price || isNaN(Number(quickAddCar.price))) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await apiRequest('POST', '/api/admin/cars', {
        title: quickAddCar.title,
        make: quickAddCar.title.split(' ')[0],
        model: quickAddCar.title.split(' ').slice(1).join(' '),
        condition: quickAddCar.condition,
        price: Number(quickAddCar.price),
        featured: quickAddCar.featured,
        year: new Date().getFullYear(),
        mileage: quickAddCar.condition === 'new' ? 0 : 1000,
        images: []
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Car added successfully!",
        });
        
        setQuickAddCar({
          title: "",
          condition: "new",
          price: "",
          featured: false
        });
      } else {
        throw new Error("Failed to add car");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add car. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Count stats
  const totalCars = Array.isArray(cars) ? cars.length : 0;
  const newCars = Array.isArray(cars) ? cars.filter(car => car.condition === 'new').length : 0;
  const usedCars = Array.isArray(cars) ? cars.filter(car => car.condition === 'used').length : 0;
  const sellRequests = Array.isArray(inquiries) ? inquiries.length : 0;

  // Recent listings (last 3)
  const recentListings = Array.isArray(cars) ? [...cars].sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  ).slice(0, 3) : [];

  // Brands and models for dashboard table
  const { data: brands = [] } = useQuery<CarBrand[]>({ queryKey: ["/api/brands"] });
  const { data: allModels = [] } = useQuery<CarModel[]>({ queryKey: ["/api/models"] });

  const updateBrand = async (id: number, name: string) => {
    await fetch(`/api/admin/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ name })
    });
  };

  const deleteBrand = async (id: number) => {
    await fetch(`/api/admin/brands/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
  };

  const updateModel = async (id: number, name: string) => {
    await fetch(`/api/admin/models/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ name })
    });
  };

  const deleteModel = async (id: number) => {
    await fetch(`/api/admin/models/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activePage="dashboard" />
      
      <div className="flex-1 overflow-x-hidden">
        <AdminHeader title="Dashboard" />
        
        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-medium mb-1">Total Cars</p>
                  <h3 className="text-3xl font-bold">{totalCars}</h3>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-primary">
                  <i className="fas fa-car text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-medium mb-1">New Cars</p>
                  <h3 className="text-3xl font-bold">{newCars}</h3>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-success">
                  <i className="fas fa-tags text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-medium mb-1">Used Cars</p>
                  <h3 className="text-3xl font-bold">{usedCars}</h3>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 text-warning">
                  <i className="fas fa-history text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-medium mb-1">Sell Requests</p>
                  <h3 className="text-3xl font-bold">{sellRequests}</h3>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <i className="fas fa-clipboard-list text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          
         

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Add Car Form */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Add New Listing</h2>
              <form onSubmit={handleQuickAddSubmit}>
                <div className="mb-4">
                  <Label className="block text-gray-medium font-medium mb-2">Car Title</Label>
                  <Input 
                    type="text" 
                    value={quickAddCar.title}
                    onChange={e => setQuickAddCar({...quickAddCar, title: e.target.value})}
                    placeholder="E.g., 2023 BMW X5"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="mb-4">
                  <Label className="block text-gray-medium font-medium mb-2">Status</Label>
                  <select 
                    value={quickAddCar.condition}
                    onChange={e => setQuickAddCar({...quickAddCar, condition: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <Label className="block text-gray-medium font-medium mb-2">Price ($)</Label>
                  <Input 
                    type="number" 
                    value={quickAddCar.price}
                    onChange={e => setQuickAddCar({...quickAddCar, price: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="mb-4">
                  <Label className="flex items-center">
                    <Checkbox 
                      checked={quickAddCar.featured}
                      onCheckedChange={(checked) => 
                        setQuickAddCar({...quickAddCar, featured: checked as boolean})
                      }
                      className="mr-2"
                    />
                    <span>Mark as featured</span>
                  </Label>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Quick Add <i className="fas fa-plus ml-1"></i>
                </Button>
              </form>
            </div>
            
            {/* Recent Listings */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Listings</h2>
                <Link href="/admin/cars">
                  <a className="text-primary hover:underline text-sm">View All</a>
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Car</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentListings.map(car => (
                      <tr key={car.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-10 w-16 rounded bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
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
                                Added: {car.createdAt ? new Date(car.createdAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            car.condition === 'new' 
                              ? 'bg-blue-100 text-primary' 
                              : 'bg-yellow-100 text-warning'
                          }`}>
                            {car.condition === 'new' ? 'New' : 'Used'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(car.price)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Link href={`/admin/cars?edit=${car.id}`}>
                              <button className="text-primary hover:text-blue-700">
                                <i className="fas fa-edit"></i>
                              </button>
                            </Link>
                            <button className="text-red-500 hover:text-red-700">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {recentListings.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-medium">
                          No car listings found. Add your first car!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
           {/* Brands & Models Table */}
           <div className="bg-white rounded-lg shadow p-6 lg:col-span-3 mb-8">
            <h2 className="text-xl font-bold mb-4">Brands & Models</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Brand</th>
                    <th className="px-4 py-2 text-left">Models</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {brands.map((b) => (
                    <tr key={b.id}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {b.logoUrl ? <img src={b.logoUrl} className="w-6 h-6 object-contain" /> : <div className="w-6 h-6 bg-gray-200" />}
                          <input
                            defaultValue={b.name}
                            className="border rounded px-2 py-1"
                            onBlur={(e) => updateBrand(b.id, e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                          {allModels.filter(m => m.brandId === b.id).map(m => (
                            <span key={m.id} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                              <input
                                defaultValue={m.name}
                                className="border rounded px-1 py-0.5"
                                onBlur={(e) => updateModel(m.id, e.target.value)}
                              />
                              <button className="text-red-500" onClick={() => deleteModel(m.id)} title="Delete model">
                                <i className="fas fa-times"></i>
                              </button>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-red-600 hover:text-red-800" onClick={() => deleteBrand(b.id)} title="Delete brand">
                          Delete Brand
                        </button>
                      </td>
                    </tr>
                  ))}
                  {brands.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-gray-500" colSpan={3}>No brands yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Sell Requests */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold">Recent Sell Requests</h2>
                <Link href="/admin/inquiries">
                  <a className="text-primary hover:underline text-sm">View All</a>
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(inquiries) ? inquiries.slice(0, 3).map((inquiry: SellInquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium">{inquiry.fullName}</div>
                          <div className="text-xs text-gray-medium">{inquiry.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{`${inquiry.year} ${inquiry.make} ${inquiry.model}`}</div>
                          <div className="text-xs text-gray-medium">{inquiry.mileage} miles</div>
                        </td>
                        <td className="px-6 py-4 font-medium">{formatCurrency(inquiry.askingPrice)}</td>
                        <td className="px-6 py-4 text-gray-medium">
                          {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            (inquiry.status || 'pending') === 'pending' 
                              ? 'bg-yellow-100 text-warning' 
                              : (inquiry.status || 'pending') === 'reviewed'
                                ? 'bg-green-100 text-success'
                                : 'bg-red-100 text-error'
                          }`}>
                            {(inquiry.status || 'pending').charAt(0).toUpperCase() + (inquiry.status || 'pending').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <Link href={`/admin/inquiries?view=${inquiry.id}`}>
                              <button className="text-primary hover:text-blue-700">
                                <i className="fas fa-eye"></i>
                              </button>
                            </Link>
                            {inquiry.status === 'pending' && (
                              <>
                                <button className="text-green-500 hover:text-green-700">
                                  <i className="fas fa-check"></i>
                                </button>
                                <button className="text-red-500 hover:text-red-700">
                                  <i className="fas fa-times"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : null}
                    
                    {Array.isArray(inquiries) && inquiries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-6 text-center text-gray-medium">
                          No sell requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
