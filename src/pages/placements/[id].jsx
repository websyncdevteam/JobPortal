import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import placementService from "@/services/freelancer/placementService";

const PlacementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFreelancer } = useAuth();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacementDetails();
  }, [id]);

  const fetchPlacementDetails = async () => {
    try {
      const result = await placementService.getPlacement(id);
      if (result.success) {
        setPlacement(result.data);
      } else {
        toast.error("Failed to load placement details");
        navigate('/freelancer/placements');
      }
    } catch (error) {
      toast.error("Error fetching placement details");
      navigate('/freelancer/placements');
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

  const getTimelineEvents = () => {
    const events = [];
    
    if (placement.submissionDate) {
      events.push({
        date: placement.submissionDate,
        title: "Candidate Submitted",
        description: "Candidate was submitted for review",
        status: "completed"
      });
    }

    if (placement.interviewDate) {
      events.push({
        date: placement.interviewDate,
        title: "Interview Scheduled",
        description: "Interview was scheduled with the company",
        status: placement.status === 'interview_completed' ? 'completed' : 'upcoming'
      });
    }

    if (placement.offerDate) {
      events.push({
        date: placement.offerDate,
        title: "Offer Made",
        description: "Company made an offer to the candidate",
        status: "completed"
      });
    }

    if (placement.joinDate) {
      events.push({
        date: placement.joinDate,
        title: "Candidate Joined",
        description: "Candidate officially joined the company",
        status: "completed"
      });
    }

    if (placement.completionDate) {
      events.push({
        date: placement.completionDate,
        title: "90 Days Completed",
        description: "Candidate completed 90 days with company",
        status: "completed"
      });
    }

    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
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

  if (!placement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Placement not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timelineEvents = getTimelineEvents();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Button variant="outline" onClick={() => navigate('/freelancer/placements')} className="mb-4">
              ← Back to Placements
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Placement Details</h1>
            <p className="text-gray-600 mt-2">Tracking candidate: {placement.candidateId?.name}</p>
          </div>
          <div className="text-right">
            {getStatusBadge(placement.status)}
            <p className="text-sm text-gray-600 mt-2">
              Submitted: {new Date(placement.submissionDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👤 Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                    <p className="text-lg font-semibold">{placement.candidateId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg">{placement.candidateId?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-lg">{placement.candidateId?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expected Salary</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${placement.candidateSalary?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
                {placement.candidateId?.resume && (
                  <div className="mt-4">
                    <Button variant="outline" asChild>
                      <a href={placement.candidateId.resume} target="_blank" rel="noopener noreferrer">
                        📄 View Candidate Resume
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💼 Job Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Job Title</p>
                    <p className="text-lg font-semibold">{placement.jobId?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Company</p>
                    <p className="text-lg">{placement.companyId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-lg">{placement.jobId?.category || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Industry</p>
                    <p className="text-lg">{placement.companyId?.industry || 'N/A'}</p>
                  </div>
                </div>
                {placement.jobId?.description && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Job Description</p>
                    <p className="text-gray-700">{placement.jobId.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            {timelineEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🕒 Placement Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          event.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Commission Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💰 Commission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commission Rate:</span>
                  <span className="font-semibold">{placement.commissionPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commission Amount:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${placement.commissionAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payout Status:</span>
                  <Badge className={
                    placement.status === 'paid' ? 'bg-green-100 text-green-800' :
                    placement.status === 'payout_eligible' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {placement.status === 'paid' ? 'Paid' : 
                     placement.status === 'payout_eligible' ? 'Eligible' : 'Pending'}
                  </Badge>
                </div>
                {placement.payoutDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Paid On:</span>
                    <span className="font-semibold">
                      {new Date(placement.payoutDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {placement.status === 'payout_eligible' && (
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/freelancer/payouts/request?placementId=${placement._id}`)}
                  >
                    💳 Request Payout
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Your Referral */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 Your Referral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-purple-800 mb-2">Referral Code Used:</p>
                  <code className="text-lg font-bold text-purple-700 font-mono block text-center">
                    {placement.referralCode}
                  </code>
                  <p className="text-xs text-purple-600 text-center mt-2">
                    This identifies you as the source
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚡ Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${placement.candidateId?.email}`}>
                    📧 Email Candidate
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`/freelancer/placements/submit?similar=${placement.jobId?._id}`}>
                    👤 Submit Similar Candidate
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/freelancer/placements')}>
                  📋 Back to All Placements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDetails;