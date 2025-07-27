import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/hooks/useAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import CarFormDialog from "@/components/admin/CarFormDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils/formatters";
import type { Car, CarBrand } from "@shared/schema";

const AdminCarsPage = () => {
  const { isAuthenticated } = useAdmin();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch cars
  const { data: cars = [], isLoading, refetch } = useQuery<Car[]>({
    queryKey: ['/api/cars'],
    enabled: isAuthenticated,
  });

  // Fetch brands
  const { data: brands = [] } = useQuery<CarBrand[]>({
    queryKey: ['/api/brands'],
    enabled: isAuthenticated,
  });

  const handleAddNewCar = () => {
    setSelectedCar(null);
    setIsModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleDeleteCar = async (car: Car) => {
    if (window.confirm(`Are you sure you want to delete ${car.title}?`)) {
      setIsDeleting(true);
      try {
        await apiRequest('DELETE', `/api/admin/cars/${car.id}`);
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

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar activePage="cars" />
        
        <div className="flex-1 overflow-x-hidden">
          <AdminHeader title="Car Listings" />
          
          <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Manage Car Listings</h2>
                <p className="text-gray-600 mt-1">Add, edit, and manage your vehicle inventory</p>
              </div>
              <Button 
                onClick={handleAddNewCar}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium"
                size="lg"
              >
                <i className="fas fa-plus mr-2"></i> Add New Car
              </Button>
            </div>
          
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cars...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                            {car.createdAt ? new Date(car.createdAt).toLocaleDateString() : 'N/A'}
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
        
        <CarFormDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          car={selectedCar}
          brands={brands}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AdminCarsPage;