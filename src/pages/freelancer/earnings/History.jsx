import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import payoutService from "@/services/freelancer/payoutService";

const PayoutHistory = () => {
  const { isFreelancer } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    year: new Date().getFullYear().toString(),
    page: 1,
    limit: 20
  });

  useEffect(() => {
    fetchPayoutHistory();
  }, [filters.status, filters.year, filters.page]);

  const fetchPayoutHistory = async () => {
    try {
      const result = await payoutService.getPayouts(filters);
      if (result.success) {
        setPayouts(result.data);
      } else {
        toast.error("Failed to load payout history");
      }
    } catch (error) {
      toast.error("Error fetching payout history");
    } finally {
      setLoading(false);
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
    return <Badge className={config.color}>{config.label}</Badge>;
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

  // Generate year options (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
  });

  // Calculate yearly summary
  const yearlySummary = payouts.payouts?.reduce((summary, payout) => {
    if (payout.status === 'paid') {
      summary.totalPaid += payout.amount;
      summary.totalPayouts += 1;
    }
    return summary;
  }, { totalPaid: 0, totalPayouts: 0 }) || { totalPaid: 0, totalPayouts: 0 };

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payout History</h1>
          <p className="text-gray-600 mt-2">Complete history of all your commission payouts</p>
        </div>

        {/* Yearly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Paid ({filters.year})</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ${yearlySummary.totalPaid?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Payouts ({filters.year})</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {yearlySummary.totalPayouts || '0'}
                  </p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg. Payout ({filters.year})</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    ${Math.round(yearlySummary.totalPaid / (yearlySummary.totalPayouts || 1))?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="text-2xl">📈</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="w-64">
                <Input
                  placeholder="Search by candidate or job..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <div className="w-32">
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-28">
                <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value, page: 1 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={fetchPayoutHistory}>
                🔄 Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payouts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            {payouts.payouts?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Candidate & Job</th>
                      <th className="text-left py-3 px-4">Payment Method</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.payouts.map((payout) => (
                      <tr key={payout._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold">
                              {payout.placementId?.candidateId?.name || 'Unknown Candidate'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {payout.placementId?.jobId?.title || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getPaymentMethodIcon(payout.paymentMethod)}</span>
                            <span className="capitalize">{payout.paymentMethod.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">
                              {payout.paidAt 
                                ? new Date(payout.paidAt).toLocaleDateString()
                                : new Date(payout.createdAt).toLocaleDateString()
                              }
                            </p>
                            <p className="text-sm text-gray-600">
                              {payout.paidAt ? 'Paid' : 'Requested'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(payout.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${payout.amount?.toLocaleString()}
                          </p>
                          {payout.transactionId && (
                            <p className="text-xs text-gray-600">
                              TXN: {payout.transactionId}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payout History</h3>
                <p className="text-gray-600 mb-6">
                  {filters.status !== 'all' || filters.year !== new Date().getFullYear().toString()
                    ? "No payouts match your current filters."
                    : "Your payout history will appear here once you start receiving payments."
                  }
                </p>
                <Button onClick={() => window.location.href = '/freelancer/payouts'}>
                  💰 Check Pending Payouts
                </Button>
              </div>
            )}

            {/* Pagination */}
            {payouts.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {filters.page} of {payouts.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={filters.page === payouts.totalPages}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="flex justify-end mt-6">
          <Button variant="outline">
            📥 Export to Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayoutHistory;