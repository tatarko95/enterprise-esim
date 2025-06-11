import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const allTransactions = [
    { id: 'TXN001', amount: '$500.00', balance: '$2,450.00', time: '2024-01-15 10:30', type: 'Credit Card' },
    { id: 'TXN002', amount: '-$89.50', balance: '$1,950.00', time: '2024-01-14 15:22', type: 'Usage' },
    { id: 'TXN003', amount: '$1,000.00', balance: '$2,039.50', time: '2024-01-10 09:15', type: 'Crypto' },
    { id: 'TXN004', amount: '-$125.30', balance: '$1,039.50', time: '2024-01-08 12:45', type: 'Usage' },
    { id: 'TXN005', amount: '$200.00', balance: '$1,164.80', time: '2024-01-07 11:00', type: 'Credit Card' },
    { id: 'TXN006', amount: '-$45.00', balance: '$1,119.80', time: '2024-01-06 09:30', type: 'Usage' },
    { id: 'TXN007', amount: '$750.00', balance: '$1,869.80', time: '2024-01-05 14:00', type: 'Crypto' },
    { id: 'TXN008', amount: '-$60.20', balance: '$1,809.60', time: '2024-01-04 10:10', type: 'Usage' },
    { id: 'TXN009', amount: '$150.00', balance: '$1,959.60', time: '2024-01-03 16:40', type: 'Credit Card' },
    { id: 'TXN010', amount: '-$99.00', balance: '$1,860.60', time: '2024-01-02 08:00', type: 'Usage' },
    { id: 'TXN011', amount: '$300.00', balance: '$2,160.60', time: '2024-01-01 13:00', type: 'Crypto' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [purchaseTimePeriod, setPurchaseTimePeriod] = useState("last7days");

  const getPurchaseData = () => {
    if (purchaseTimePeriod === "last7days") {
      return { value: "$89.50", trend: { value: 5, label: 'vs previous week', isPositive: false } };
    } else if (purchaseTimePeriod === "last30days") {
      return { value: "$342.80", trend: { value: 8, label: 'vs last month', isPositive: true } };
    }
    return { value: "$0.00", trend: { value: 0, label: '', isPositive: true } }; // Default or error case
  };

  const purchaseData = getPurchaseData();

  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const transactions = allTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Monitor your account and team activity</p>
          </div>
          {/* Top Up button functionality moved to Header.tsx */}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Account Balance"
            value="$2,450.00"
            icon="💰"
            trend={{ value: 12, label: 'vs last month', isPositive: true }}
          />
          <div className="relative">
            <MetricCard
              title="Purchase"
              value={purchaseData.value}
              trend={purchaseData.trend}
              className="pr-24"
            />
            <div className="absolute top-4 right-4">
              <Select defaultValue="last7days" onValueChange={setPurchaseTimePeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Last 7 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <MetricCard
            title="Total eSIM codes generated"
            value="5000"
            icon="📱"
          />
          <MetricCard
            title="Active Team Members"
            value="12"
            icon="👥"
            subtitle="8 active this week"
          />
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Top-Up Transactions</CardTitle>
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
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 last:border-b-0">
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
                &lt; Previous
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
                Next &gt;
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
