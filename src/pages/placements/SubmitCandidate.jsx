import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import placementService from "@/services/freelancer/placementService";
import freelancerService from "@/services/freelancer/freelancerService";

const SubmitCandidate = () => {
  const { user, isFreelancer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    jobId: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    candidateResume: "",
    expectedSalary: "",
    notes: ""
  });

  useEffect(() => {
    fetchJobs();
    fetchFreelancerProfile();
  }, []);

  const fetchJobs = async () => {
    try {
      // This would come from a jobs service - you'll need to create this
      const response = await fetch('/api/v1/jobs/active');
      const result = await response.json();
      if (result.success) {
        setJobs(result.data);
      }
    } catch (error) {
      toast.error("Error fetching jobs");
    }
  };

  const fetchFreelancerProfile = async () => {
    try {
      const result = await freelancerService.getProfile();
      if (result.success) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error("Error fetching freelancer profile:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await placementService.submitCandidate(formData);
      
      if (result.success) {
        toast.success("Candidate submitted successfully!");
        // Reset form
        setFormData({
          jobId: "",
          candidateName: "",
          candidateEmail: "",
          candidatePhone: "",
          candidateResume: "",
          expectedSalary: "",
          notes: ""
        });
      } else {
        toast.error(result.message || "Failed to submit candidate");
      }
    } catch (error) {
      toast.error("Error submitting candidate");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    // Implement file upload logic here
    // This would upload to your server and return file URL
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/v1/upload/resume', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, candidateResume: result.fileUrl }));
        toast.success("Resume uploaded successfully");
      }
    } catch (error) {
      toast.error("Error uploading resume");
    }
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit New Candidate</h1>
          <p className="text-gray-600 mt-2">Fill in candidate details to submit for a job</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Job Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="jobId" className="text-sm font-medium">
                      Select Job *
                    </Label>
                    <Select value={formData.jobId} onValueChange={(value) => setFormData(prev => ({ ...prev, jobId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a job to submit candidate for" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem key={job._id} value={job._id}>
                            {job.title} - {job.company?.name} (${job.salaryRange?.min} - ${job.salaryRange?.max})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      Choose the job you're submitting this candidate for
                    </p>
                  </div>

                  {/* Candidate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="candidateName" className="text-sm font-medium">
                        Candidate Name *
                      </Label>
                      <Input
                        id="candidateName"
                        value={formData.candidateName}
                        onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
                        placeholder="Full name"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="candidateEmail" className="text-sm font-medium">
                        Candidate Email *
                      </Label>
                      <Input
                        id="candidateEmail"
                        type="email"
                        value={formData.candidateEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, candidateEmail: e.target.value }))}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="candidatePhone" className="text-sm font-medium">
                        Candidate Phone
                      </Label>
                      <Input
                        id="candidatePhone"
                        type="tel"
                        value={formData.candidatePhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, candidatePhone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="expectedSalary" className="text-sm font-medium">
                        Expected Salary (USD) *
                      </Label>
                      <Input
                        id="expectedSalary"
                        type="number"
                        value={formData.expectedSalary}
                        onChange={(e) => setFormData(prev => ({ ...prev, expectedSalary: e.target.value }))}
                        placeholder="e.g., 75000"
                        required
                      />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-3">
                    <Label htmlFor="resume" className="text-sm font-medium">
                      Candidate Resume
                    </Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                    />
                    <p className="text-sm text-gray-500">
                      Upload resume (PDF, DOC, DOCX). Max 5MB.
                    </p>
                    {formData.candidateResume && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span>✅ Resume uploaded successfully</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(formData.candidateResume, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional information about the candidate, their skills, experience, or why they're a good fit for this role..."
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || !formData.jobId || !formData.candidateName || !formData.candidateEmail || !formData.expectedSalary}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Candidate...
                      </>
                    ) : (
                      "🎯 Submit Candidate for Review"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Referral Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <code className="text-2xl font-bold text-purple-700 font-mono">
                    {profile?.referralCode || 'Loading...'}
                  </code>
                  <p className="text-sm text-purple-600 mt-2">
                    Share this code with candidates when submitting them
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submission Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <span>Ensure candidate has given consent for submission</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <span>Verify candidate's interest in the position</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <span>Provide accurate salary expectations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <span>Include relevant notes about candidate fit</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600">❌</span>
                  <span>Do not submit candidates without their knowledge</span>
                </div>
              </CardContent>
            </Card>

            {/* Commission Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commission Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Standard Commission:</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Payout Timeline:</span>
                  <span className="font-semibold">90 days after joining</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate Bonus:</span>
                  <span className="font-semibold">+2% after 5 placements</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitCandidate;