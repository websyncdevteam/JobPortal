import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import freelancerService from "@/services/freelancer/freelancerService";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const EarningsOverview = () => {
  const { isFreelancer } = useAuth();
  const [earningsData, setEarningsData] = useState(null);
  const [timeframe, setTimeframe] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, [timeframe]);

  const fetchEarningsData = async () => {
    try {
      const result = await freelancerService.getEarnings(timeframe);
      if (result.success) {
        setEarningsData(result.data);
      } else {
        toast.error("Failed to load earnings data");
      }
    } catch (error) {
      toast.error("Error fetching earnings data");
    } finally {
      setLoading(false);
    }
  };

  // Sample chart data - replace with actual data from backend
  const monthlyEarnings = [
    { month: 'Jan', earnings: 2500, placements: 3 },
    { month: 'Feb', earnings: 3200, placements: 4 },
    { month: 'Mar', earnings: 2800, placements: 2 },
    { month: 'Apr', earnings: 4100, placements: 5 },
    { month: 'May', earnings: 3700, placements: 4 },
    { month: 'Jun', earnings: 4500, placements: 6 }
  ];

  const earningsBySource = [
    { name: 'IT & Software', value: 12500 },
    { name: 'Sales', value: 8500 },
    { name: 'Marketing', value: 6200 },
    { name: 'Finance', value: 4800 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings Overview</h1>
            <p className="text-gray-600 mt-2">Track your commissions and financial performance</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => window.location.href = '/freelancer/payouts'}>
              💳 Request Payout
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Earned</p>
                  <p className="text-2xl font-bold mt-1">
                    ${earningsData?.summary?.totalEarned?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Pending Payouts</p>
                  <p className="text-2xl font-bold mt-1">
                    ${earningsData?.summary?.pendingAmount?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="text-2xl">⏳</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Payouts</p>
                  <p className="text-2xl font-bold mt-1">
                    {earningsData?.totalPayouts || '0'}
                  </p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Avg. Commission</p>
                  <p className="text-2xl font-bold mt-1">
                    ${Math.round(earningsData?.summary?.totalEarned / (earningsData?.totalPayouts || 1))?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="text-2xl">📈</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Earnings Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📈</span> Earnings Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="earnings" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Earnings by Specialization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎯</span> Earnings by Specialization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={earningsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {earningsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Earnings']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payouts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>💸</span> Recent Payouts
            </CardTitle>
            <Button variant="outline" onClick={() => window.location.href = '/freelancer/earnings/history'}>
              View All History
            </Button>
          </CardHeader>
          <CardContent>
            {earningsData?.payouts?.length > 0 ? (
              <div className="space-y-4">
                {earningsData.payouts.slice(0, 5).map((payout) => (
                  <div key={payout._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        payout.status === 'paid' ? 'bg-green-500' :
                        payout.status === 'approved' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-semibold">{payout.placementId?.candidateId?.name || 'Unknown Candidate'}</p>
                        <p className="text-sm text-gray-600">
                          {payout.placementId?.jobId?.title} • {new Date(payout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${payout.amount?.toLocaleString()}</p>
                      <p className={`text-sm capitalize ${
                        payout.status === 'paid' ? 'text-green-600' :
                        payout.status === 'approved' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {payout.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payouts Yet</h3>
                <p className="text-gray-600 mb-4">Your earnings will appear here once you start getting payouts.</p>
                <Button onClick={() => window.location.href = '/freelancer/placements/submit'}>
                  👤 Submit Your First Candidate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">68%</div>
                <p className="text-sm text-gray-600">Placement Success</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Avg. Time to Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">92 days</div>
                <p className="text-sm text-gray-600">From placement to payout</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 Top Performing Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">IT & Software</div>
                <p className="text-sm text-gray-600">Highest earnings category</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;