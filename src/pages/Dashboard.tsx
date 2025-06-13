import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Coins, 
  BarChart2, 
  Smartphone, 
  Users, 
  Download
} from 'lucide-react'; // Import Lucide icons
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const allTransactions = [
    { id: 'TXN001', amount: '$500.00', balance: '$500.00', time: '2024-01-15 10:30', type: 'Credit Card' },
    { id: 'TXN001', amount: '$500.00', balance: '$1,000.00', time: '2024-01-15 10:30', type: 'Crypto' },
    { id: 'TXN001', amount: '$500.00', balance: '$1,500.00', time: '2024-01-15 10:30', type: 'Credit Card' },
    { id: 'TXN001', amount: '$500.00', balance: '$2,000.00', time: '2024-01-15 10:30', type: 'Crypto' },
    { id: 'TXN001', amount: '$500.00', balance: '$2,500.00', time: '2024-01-15 10:30', type: 'Credit Card' },
    { id: 'TXN001', amount: '$500.00', balance: '$3,000.00', time: '2024-01-15 10:30', type: 'Credit Card' },
    { id: 'TXN001', amount: '$500.00', balance: '$3,500.00', time: '2024-01-15 10:30', type: 'Credit Card' },
    { id: 'TXN001', amount: '$500.00', balance: '$4,000.00', time: '2024-01-15 10:30', type: 'Credit Card' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Changed to 8 to match screenshot
  const [usageTimePeriod, setUsageTimePeriod] = useState("last7days");
  const [chartTimePeriod, setChartTimePeriod] = useState("last7days"); // New state for chart time period

  const getUsageData = () => {
    if (usageTimePeriod === "last7days") {
      return { value: "$89.50" };
    }
    return { value: "$0.00" }; // Default or error case
  };

  const usageData = getUsageData();

  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const transactions = allTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownloadCSV = () => {
    const headers = ["Transaction ID", "Amount", "Balance", "Date & Time", "Type"];
    const rows = allTransactions.map(t => [
      t.id, 
      t.amount.replace('-','').replace('$',''), 
      t.balance.replace('-','').replace('$',''), 
      t.time, 
      t.type
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "top-up_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dummy data for Usage Graphs
  const getMonthlyUsageData = (period: string) => {
    if (period === "last7days") {
      return [
        { name: 'Day 1', usage: 50 },
        { name: 'Day 2', usage: 70 },
        { name: 'Day 3', usage: 60 },
        { name: 'Day 4', usage: 90 },
        { name: 'Day 5', usage: 80 },
        { name: 'Day 6', usage: 100 },
        { name: 'Day 7', usage: 120 },
      ];
    } else if (period === "last30days") {
      return [
        { name: 'Week 1', usage: 200 },
        { name: 'Week 2', usage: 250 },
        { name: 'Week 3', usage: 180 },
        { name: 'Week 4', usage: 300 },
      ];
    }
    return [];
  };
  const monthlyUsageData = getMonthlyUsageData(chartTimePeriod); // Use chartTimePeriod

  // Dummy data for eSIM Distribution
  const esimDistributionData = [
    { name: 'Activated eSIMs', value: 200, color: '#0088FE' },
    { name: 'Sent to Users', value: 150, color: '#00C49F' },
  ];

  const chartConfig = {
    usage: {
      label: "Usage",
      color: "hsl(var(--chart-1))",
    },
  } as const

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Monitor your account and team activity</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Account Balance"
            value="$4,000.00"
            icon={<Coins className="h-5 w-5 text-gray-500" />}
          />
          <div className="relative">
            <MetricCard
              title="Usage"
              value={usageData.value}
              icon={<BarChart2 className="h-5 w-5 text-gray-500" />}
              className="pr-24"
            >
              <div className="absolute top-4 right-4">
                <Select defaultValue="last7days" onValueChange={setUsageTimePeriod}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Last 7 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7days">Last 7 days</SelectItem>
                    <SelectItem value="last30days">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </MetricCard>
          </div>
          <MetricCard
            title="eSIM Codes Used"
            value="267 / 500"
            icon={<Smartphone className="h-5 w-5 text-gray-500" />}
          />
          <MetricCard
            title="Active Team Members"
            value="50"
            icon={<Users className="h-5 w-5 text-gray-500" />}
          />
        </div>

        {/* Usage and eSIM Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Usage Graphs</CardTitle>
              <div className="absolute top-4 right-4">
                <Select defaultValue="last7days" onValueChange={setChartTimePeriod}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Last 7 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7days">Last 7 days</SelectItem>
                    <SelectItem value="last30days">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <LineChart
                  accessibilityLayer
                  data={monthlyUsageData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    // @ts-ignore
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Line
                    dataKey="usage"
                    type="monotone"
                    stroke="var(--color-usage)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>eSIM Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={esimDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {esimDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Top-Up Transactions History</CardTitle>
            <Button variant="outline" onClick={handleDownloadCSV}>
              <Download className="h-4 w-4 mr-2" /> Download .csv
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Transaction ID</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Balance</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Date & Time</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-2 text-sm">{transaction.id}</td>
                      <td className="py-3 px-2 text-sm font-medium">{transaction.amount}</td>
                      <td className="py-3 px-2 text-sm">{transaction.balance}</td>
                      <td className="py-3 px-2 text-sm text-gray-500">{transaction.time}</td>
                      <td className="py-3 px-2 text-sm text-gray-500">{transaction.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => handlePageChange(i + 1)}
                  className={currentPage === i + 1 ? "bg-gray-900 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium" : "px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
