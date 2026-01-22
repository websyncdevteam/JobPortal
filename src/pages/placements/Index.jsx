import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import placementService from "@/services/freelancer/placementService";

const PlacementsList = () => {
  const { isFreelancer } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchPlacements();
  }, [filters.status, filters.page]);

  const fetchPlacements = async () => {
    try {
      const result = await placementService.getPlacements(filters);
      if (result.success) {
        setPlacements(result.data);
      } else {
        toast.error("Failed to load placements");
      }
    } catch (error) {
      toast.error("Error fetching placements");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
      under_review: { color: "bg-yellow-100 text-yellow-800", label: "Under Review" },
      interview_scheduled: { color: "bg-purple-100 text-purple-800", label: "Interview Scheduled" },
      interview_completed: { color: "bg-indigo-100 text-indigo-800", label: "Interview Done" },
      offer_made: { color: "bg-green-100 text-green-800", label: "Offer Made" },
      offer_accepted: { color: "bg-green-100 text-green-800", label: "Offer Accepted" },
      joined: { color: "bg-green-100 text-green-800", label: "Joined" },
      in_progress: { color: "bg-orange-100 text-orange-800", label: "In Progress" },
      completed_90_days: { color: "bg-teal-100 text-teal-800", label: "90 Days Completed" },
      payout_eligible: { color: "bg-emerald-100 text-emerald-800", label: "Payout Eligible" },
      paid: { color: "bg-gray-100 text-gray-800", label: "Paid" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      candidate_dropped: { color: "bg-red-100 text-red-800", label: "Candidate Dropped" }
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Placements</h1>
            <p className="text-gray-600 mt-2">Track all your candidate submissions and placements</p>
          </div>
          <Button onClick={() => window.location.href = '/freelancer/placements/submit'}>
            👤 Submit New Candidate
          </Button>
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
              <div className="w-48">
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="offer_made">Offer Made</SelectItem>
                    <SelectItem value="joined">Joined</SelectItem>
                    <SelectItem value="completed_90_days">90 Days Completed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={fetchPlacements}>
                🔄 Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Placements List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : placements.placements?.length > 0 ? (
          <div className="space-y-4">
            {placements.placements.map((placement) => (
              <Card key={placement._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Candidate & Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                          {placement.candidateId?.name?.charAt(0) || 'C'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {placement.candidateId?.name || 'Unknown Candidate'}
                            </h3>
                            {getStatusBadge(placement.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Job:</span> {placement.jobId?.title || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Company:</span> {placement.companyId?.name || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span> {new Date(placement.submissionDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Expected Salary:</span> ${placement.candidateSalary?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Commission & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${placement.commissionAmount?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Commission ({placement.commissionPercentage}%)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/freelancer/placements/${placement._id}`}
                        >
                          View Details
                        </Button>
                        {placement.status === 'payout_eligible' && (
                          <Button 
                            size="sm"
                            onClick={() => window.location.href = `/freelancer/payouts/request?placementId=${placement._id}`}
                          >
                            💰 Request Payout
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  {placement.interviewDate || placement.offerDate || placement.joinDate ? (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {placement.interviewDate && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Interview: {new Date(placement.interviewDate).toLocaleDateString()}
                          </div>
                        )}
                        {placement.offerDate && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Offer: {new Date(placement.offerDate).toLocaleDateString()}
                          </div>
                        )}
                        {placement.joinDate && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Joined: {new Date(placement.joinDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {placements.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {filters.page} of {placements.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={filters.page === placements.totalPages}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Placements Yet</h3>
              <p className="text-gray-600 mb-6">Start by submitting your first candidate to see placements here.</p>
              <Button onClick={() => window.location.href = '/freelancer/placements/submit'}>
                👤 Submit Your First Candidate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlacementsList;