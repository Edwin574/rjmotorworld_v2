import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AdminAuthContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber, formatDate } from "../../lib/utils/formatters";
import { makeAuthenticatedRequest } from "../../lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { SellInquiry } from "@shared/schema";

const AdminInquiriesPage = () => {
  const { isAuthenticated, accessToken, refreshToken } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { view } = router.query;
  const viewId = view as string;
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<SellInquiry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  // Fetch sell inquiries
  const { data: inquiries = [], isLoading } = useQuery<SellInquiry[]>({
    queryKey: ['/api/sell-inquiries'],
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
      await makeAuthenticatedRequest(
        'PUT', 
        `/api/sell-inquiries/${id}/status`, 
        { status },
        { accessToken: accessToken!, refreshToken }
      );
      
      toast({
        title: "Success",
        description: `Inquiry ${status === 'reviewed' ? 'approved' : 'rejected'} successfully.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/sell-inquiries'] });
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
    <>
      <Head>
        <title>Sell Inquiries - RJ Motorworld Admin</title>
        <meta name="description" content="Manage sell inquiries in RJ Motorworld admin panel" />
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar activePage="inquiries" />
        
        <div className="flex-1 overflow-x-hidden">
          <AdminHeader title="Sell Inquiries" />
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Sell Inquiries</h2>
              <p className="text-gray-600 mt-1">Review and manage customer sell requests</p>
            </div>
            
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading inquiries...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Seller</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Asking Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inquiries.map(inquiry => (
                        <tr key={inquiry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{inquiry.fullName}</div>
                              <div className="text-xs text-gray-medium">{inquiry.email}</div>
                              <div className="text-xs text-gray-medium">{inquiry.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{inquiry.year} {inquiry.make} {inquiry.model}</div>
                              <div className="text-xs text-gray-medium">
                                {formatNumber(inquiry.mileage)} miles • {inquiry.color}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium">{formatCurrency(inquiry.askingPrice)}</td>
                          <td className="px-6 py-4 text-gray-medium">
                            {inquiry.createdAt ? formatDate(inquiry.createdAt) : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(inquiry.status || 'pending')}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openInquiryDetails(inquiry)}
                              >
                                <i className="fas fa-eye mr-1"></i> View
                              </Button>
                              {inquiry.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateInquiryStatus(inquiry.id, 'reviewed')}
                                    disabled={isProcessing}
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                  >
                                    <i className="fas fa-check mr-1"></i> Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateInquiryStatus(inquiry.id, 'rejected')}
                                    disabled={isProcessing}
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    <i className="fas fa-times mr-1"></i> Reject
                                  </Button>
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
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
            </DialogHeader>
            
            {selectedInquiry && (
              <div className="space-y-6">
                {/* Seller Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Seller Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Full Name</label>
                      <p className="text-gray-900">{selectedInquiry.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Email</label>
                      <p className="text-gray-900">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Phone</label>
                      <p className="text-gray-900">{selectedInquiry.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Contact Method</label>
                      <p className="text-gray-900">{selectedInquiry.contactMethod}</p>
                    </div>
                  </div>
                </div>
                
                {/* Vehicle Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Vehicle Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Make</label>
                      <p className="text-gray-900">{selectedInquiry.make}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Model</label>
                      <p className="text-gray-900">{selectedInquiry.model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Year</label>
                      <p className="text-gray-900">{selectedInquiry.year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Color</label>
                      <p className="text-gray-900">{selectedInquiry.color}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Mileage</label>
                      <p className="text-gray-900">{formatNumber(selectedInquiry.mileage)} miles</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-medium">Asking Price</label>
                      <p className="text-gray-900 font-semibold">{formatCurrency(selectedInquiry.askingPrice)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                {selectedInquiry.additionalNotes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedInquiry.additionalNotes}
                    </p>
                  </div>
                )}
                
                {/* Status Actions */}
                {selectedInquiry.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'reviewed')}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <i className="fas fa-check mr-2"></i> Approve Inquiry
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'rejected')}
                      disabled={isProcessing}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <i className="fas fa-times mr-2"></i> Reject Inquiry
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminInquiriesPage;