import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/hooks/useAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils/formatters";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SellInquiry } from "@shared/schema";

const AdminInquiriesPage = () => {
  const { isAuthenticated, credentials } = useAdmin();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1]);
  const viewId = queryParams.get('view');
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<SellInquiry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // Fetch sell inquiries
  const { data: inquiries = [], isLoading } = useQuery<SellInquiry[]>({
    queryKey: ['/api/admin/inquiries'],
    headers: credentials,
    enabled: isAuthenticated,
  });

  // Load inquiry details if in view mode
  useEffect(() => {
    if (viewId && inquiries.length > 0) {
      const inquiryToView = inquiries.find(inq => inq.id === Number(viewId));
      if (inquiryToView) {
        setSelectedInquiry(inquiryToView);
        setIsDetailModalOpen(true);
      }
    }
  }, [viewId, inquiries]);

  const openInquiryDetails = (inquiry: SellInquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailModalOpen(true);
  };

  const updateInquiryStatus = async (id: number, status: 'reviewed' | 'rejected') => {
    setIsProcessing(true);
    try {
      await apiRequest('PUT', `/api/admin/inquiries/${id}/status`, { status }, credentials);
      
      toast({
        title: "Success",
        description: `Inquiry ${status === 'reviewed' ? 'approved' : 'rejected'} successfully.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inquiries'] });
      setIsDetailModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inquiry status.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-warning">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-green-100 text-success">Reviewed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-error">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activePage="inquiries" />
      
      <div className="flex-1 overflow-x-hidden">
        <AdminHeader title="Sell Requests" />
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Sell Your Car Inquiries</h2>
            <p className="text-gray-medium mt-1">
              Manage and respond to customer sell requests
            </p>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inquiries.map(inquiry => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium">{inquiry.fullName}</div>
                          <div className="text-xs text-gray-medium">{inquiry.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{`${inquiry.year} ${inquiry.make} ${inquiry.model}`}</div>
                          <div className="text-xs text-gray-medium">{formatNumber(inquiry.mileage)} miles</div>
                        </td>
                        <td className="px-6 py-4 font-medium">{formatCurrency(inquiry.askingPrice)}</td>
                        <td className="px-6 py-4 text-gray-medium">
                          {formatDate(inquiry.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(inquiry.status)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => openInquiryDetails(inquiry)}
                              className="text-primary hover:text-blue-700"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            
                            {inquiry.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => updateInquiryStatus(inquiry.id, 'reviewed')}
                                  className="text-green-500 hover:text-green-700"
                                  title="Approve"
                                  disabled={isProcessing}
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button 
                                  onClick={() => updateInquiryStatus(inquiry.id, 'rejected')}
                                  className="text-red-500 hover:text-red-700"
                                  title="Reject"
                                  disabled={isProcessing}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-medium">
                          No sell inquiries found.
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
      
      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sell Request Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Seller Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-medium">Seller Type</div>
                      <div className="font-medium">
                        {selectedInquiry.sellerType.charAt(0).toUpperCase() + selectedInquiry.sellerType.slice(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-medium">Full Name</div>
                      <div className="font-medium">{selectedInquiry.fullName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-medium">Email</div>
                      <div className="font-medium">{selectedInquiry.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-medium">Phone</div>
                      <div className="font-medium">{selectedInquiry.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-medium">Preferred Contact Method</div>
                      <div className="font-medium">
                        {selectedInquiry.contactMethod.charAt(0).toUpperCase() + selectedInquiry.contactMethod.slice(1)}
                      </div>
                    </div>
                    {selectedInquiry.bestTimeToContact && (
                      <div>
                        <div className="text-sm text-gray-medium">Best Time to Contact</div>
                        <div className="font-medium">{selectedInquiry.bestTimeToContact}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-4">Vehicle Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-medium">Vehicle</div>
                      <div className="font-medium">{`${selectedInquiry.year} ${selectedInquiry.make} ${selectedInquiry.model}`}</div>
                    </div>
                    {selectedInquiry.registrationNumber && (
                      <div>
                        <div className="text-sm text-gray-medium">Registration Number</div>
                        <div className="font-medium">{selectedInquiry.registrationNumber}</div>
                      </div>
                    )}
                    {selectedInquiry.color && (
                      <div>
                        <div className="text-sm text-gray-medium">Color</div>
                        <div className="font-medium">{selectedInquiry.color}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-medium">Mileage</div>
                      <div className="font-medium">{formatNumber(selectedInquiry.mileage)} miles</div>
                    </div>
                    {selectedInquiry.accidentHistory && (
                      <div>
                        <div className="text-sm text-gray-medium">Accident History</div>
                        <div className="font-medium">
                          {selectedInquiry.accidentHistory.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-medium">Asking Price</div>
                      <div className="font-medium text-lg text-primary">{formatCurrency(selectedInquiry.askingPrice)}</div>
                    </div>
                    {selectedInquiry.location && (
                      <div>
                        <div className="text-sm text-gray-medium">Location</div>
                        <div className="font-medium">{selectedInquiry.location}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedInquiry.additionalNotes && (
                <div>
                  <h3 className="text-lg font-bold mb-2">Additional Notes</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    {selectedInquiry.additionalNotes}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-bold mb-2">Request Status</h3>
                <div className="flex items-center space-x-2">
                  <div>Current Status:</div>
                  <div>{getStatusBadge(selectedInquiry.status)}</div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              {selectedInquiry.status === 'pending' ? (
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'rejected')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Reject Request'}
                  </Button>
                  <Button 
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'reviewed')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Approve Request'}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminInquiriesPage;
