import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import payoutService from "@/services/freelancer/payoutService";
import placementService from "@/services/freelancer/placementService";

const Payouts = () => {
  const { isFreelancer } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [eligiblePlacements, setEligiblePlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestForm, setRequestForm] = useState({
    placementId: "",
    paymentMethod: "bank_transfer",
    paymentDetails: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      upiId: "",
      paypalEmail: ""
    }
  });

  useEffect(() => {
    fetchPayouts();
    fetchEligiblePlacements();
  }, []);

  const fetchPayouts = async () => {
    try {
      const result = await payoutService.getPayouts();
      if (result.success) {
        setPayouts(result.data);
      } else {
        toast.error("Failed to load payouts");
      }
    } catch (error) {
      toast.error("Error fetching payouts");
    } finally {
      setLoading(false);
    }
  };

  const fetchEligiblePlacements = async () => {
    try {
      const result = await placementService.getPlacements({ status: 'payout_eligible' });
      if (result.success) {
        setEligiblePlacements(result.data.placements || []);
      }
    } catch (error) {
      console.error("Error fetching eligible placements:", error);
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setRequestLoading(true);

    try {
      const result = await payoutService.requestPayout(requestForm);
      
      if (result.success) {
        toast.success("Payout request submitted successfully!");
        setRequestDialogOpen(false);
        setRequestForm({
          placementId: "",
          paymentMethod: "bank_transfer",
          paymentDetails: {
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            upiId: "",
            paypalEmail: ""
          }
        });
        fetchPayouts();
        fetchEligiblePlacements();
      } else {
        toast.error(result.message || "Failed to submit payout request");
      }
    } catch (error) {
      toast.error("Error submitting payout request");
    } finally {
      setRequestLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending Review" },
      approved: { color: "bg-blue-100 text-blue-800", label: "Approved" },
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" }
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      bank_transfer: "🏦",
      upi: "📱", 
      paypal: "🔵",
      other: "💳"
    };
    return icons[method] || "💳";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isFreelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Access denied. Freelancer role required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
            <p className="text-gray-600 mt-2">Request and track your commission payouts</p>
          </div>
          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={eligiblePlacements.length === 0}>
                💰 Request New Payout
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleRequestPayout} className="space-y-6">
                {/* Placement Selection */}
                <div className="space-y-3">
                  <Label htmlFor="placementId" className="text-sm font-medium">
                    Select Placement *
                  </Label>
                  <Select 
                    value={requestForm.placementId} 
                    onValueChange={(value) => setRequestForm(prev => ({ ...prev, placementId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a placement to payout" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligiblePlacements.map((placement) => (
                        <SelectItem key={placement._id} value={placement._id}>
                          {placement.candidateId?.name} - {placement.jobId?.title} (${placement.commissionAmount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Only placements with completed 90-day periods are eligible
                  </p>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label htmlFor="paymentMethod" className="text-sm font-medium">
                    Payment Method *
                  </Label>
                  <Select 
                    value={requestForm.paymentMethod} 
                    onValueChange={(value) => setRequestForm(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
                      <SelectItem value="upi">📱 UPI</SelectItem>
                      <SelectItem value="paypal">🔵 PayPal</SelectItem>
                      <SelectItem value="other">💳 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Payment Details *</Label>
                  
                  {requestForm.paymentMethod === 'bank_transfer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="accountNumber" className="text-sm font-medium">
                          Account Number
                        </Label>
                        <Input
                          id="accountNumber"
                          value={requestForm.paymentDetails.accountNumber}
                          onChange={(e) => setRequestForm(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, accountNumber: e.target.value }
                          }))}
                          placeholder="Enter account number"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="ifscCode" className="text-sm font-medium">
                          IFSC Code
                        </Label>
                        <Input
                          id="ifscCode"
                          value={requestForm.paymentDetails.ifscCode}
                          onChange={(e) => setRequestForm(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, ifscCode: e.target.value }
                          }))}
                          placeholder="Enter IFSC code"
                          required
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <Label htmlFor="bankName" className="text-sm font-medium">
                          Bank Name
                        </Label>
                        <Input
                          id="bankName"
                          value={requestForm.paymentDetails.bankName}
                          onChange={(e) => setRequestForm(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, bankName: e.target.value }
                          }))}
                          placeholder="Enter bank name"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {requestForm.paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <Label htmlFor="upiId" className="text-sm font-medium">
                        UPI ID
                      </Label>
                      <Input
                        id="upiId"
                        value={requestForm.paymentDetails.upiId}
                        onChange={(e) => setRequestForm(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, upiId: e.target.value }
                        }))}
                        placeholder="yourname@upi"
                        required
                      />
                    </div>
                  )}

                  {requestForm.paymentMethod === 'paypal' && (
                    <div className="space-y-3">
                      <Label htmlFor="paypalEmail" className="text-sm font-medium">
                        PayPal Email
                      </Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={requestForm.paymentDetails.paypalEmail}
                        onChange={(e) => setRequestForm(prev => ({
                          ...prev,
                          paymentDetails: { ...prev.paymentDetails, paypalEmail: e.target.value }
                        }))}
                        placeholder="paypal@example.com"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={requestLoading || !requestForm.placementId}
                  className="w-full"
                >
                  {requestLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Request...
                    </>
                  ) : (
                    "💰 Submit Payout Request"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payouts Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Payouts</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    ${payouts.summary?.find(s => s._id === 'pending')?.totalAmount || '0'}
                  </p>
                </div>
                <div className="text-2xl">⏳</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Approved Payouts</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    ${payouts.summary?.find(s => s._id === 'approved')?.totalAmount || '0'}
                  </p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ${payouts.summary?.find(s => s._id === 'paid')?.totalAmount || '0'}
                  </p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payouts List */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            {payouts.payouts?.length > 0 ? (
              <div className="space-y-4">
                {payouts.payouts.map((payout) => (
                  <div key={payout._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-2xl">
                        {getPaymentMethodIcon(payout.paymentMethod)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold">
                            {payout.placementId?.candidateId?.name || 'Unknown Candidate'}
                          </p>
                          {getStatusBadge(payout.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Job:</span> {payout.placementId?.jobId?.title || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Requested:</span> {new Date(payout.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Method:</span> {payout.paymentMethod.replace('_', ' ')}
                          </div>
                        </div>
                        {payout.paidAt && (
                          <div className="text-sm text-green-600 mt-1">
                            Paid on {new Date(payout.paidAt).toLocaleDateString()}
                            {payout.transactionId && ` • Transaction: ${payout.transactionId}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${payout.amount?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{payout.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payouts Yet</h3>
                <p className="text-gray-600 mb-6">
                  {eligiblePlacements.length > 0 
                    ? "You have eligible placements ready for payout."
                    : "Complete placements and wait for 90-day period to request payouts."
                  }
                </p>
                {eligiblePlacements.length > 0 && (
                  <Button onClick={() => setRequestDialogOpen(true)}>
                    💰 Request Your First Payout
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {payouts.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button variant="outline" disabled={payouts.currentPage === 1}>
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {payouts.currentPage} of {payouts.totalPages}
                </span>
                <Button variant="outline" disabled={payouts.currentPage === payouts.totalPages}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 Payout Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Eligibility Requirements</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Candidate must complete 90 days with the company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Placement status must be "completed_90_days"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✅</span>
                    <span>No active disputes or issues</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Processing Timeline</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">⏱️</span>
                    <span>Approval: 2-3 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">⏱️</span>
                    <span>Payment processing: 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">⏱️</span>
                    <span>Total time: 5-8 business days</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payouts;