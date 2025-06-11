import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const Usage: React.FC = () => {
  const [exportPeriod, setExportPeriod] = useState('');
  const [usagePeriod, setUsagePeriod] = useState('7-days');

  const usageStats = {
    '7-days': {
      value: "$89.50",
      trend: { value: 5, label: 'vs previous week', isPositive: false }
    },
    '30-days': {
      value: "$342.80",
      trend: { value: 8, label: 'vs last month', isPositive: true }
    }
  };

  const currentUsageStats = usageStats[usagePeriod as keyof typeof usageStats];

  const allUsageData = [
    { date: '2024-01-15 14:30', code: 'ESIM002', creditDeducted: '50.00', receiverEmail: 'john@partner.com', referrerCode: 'REF001' },
    { date: '2024-01-12 09:15', code: 'ESIM004', creditDeducted: '100.00', receiverEmail: 'jane@partner.com', referrerCode: 'REF002' },
    { date: '2024-01-10 16:45', code: 'ESIM006', creditDeducted: '25.00', receiverEmail: 'mike@partner.com', referrerCode: 'REF001' },
    { date: '2024-01-08 11:20', code: 'ESIM008', creditDeducted: '75.00', receiverEmail: 'sarah@partner.com', referrerCode: 'REF003' },
    { date: '2024-01-07 10:00', code: 'ESIM010', creditDeducted: '30.00', receiverEmail: 'david@partner.com', referrerCode: 'REF001' },
    { date: '2024-01-05 15:00', code: 'ESIM012', creditDeducted: '120.00', receiverEmail: 'lisa@partner.com', referrerCode: 'REF004' },
    { date: '2024-01-03 08:30', code: 'ESIM014', creditDeducted: '40.00', receiverEmail: '' , referrerCode: 'REF002' },
    { date: '2024-01-01 11:00', code: 'ESIM016', creditDeducted: '60.00', receiverEmail: 'chris@partner.com', referrerCode: 'REF005' },
  ];

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: 'date', direction: 'descending' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(allUsageData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortedUsageData = useMemo(() => {
    let sortableItems = [...allUsageData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortConfig.direction === 'ascending') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          if (sortConfig.direction === 'ascending') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        }
        // Fallback for other types or if types mismatch, can extend as needed
        return 0;
      });
    }
    return sortableItems;
  }, [allUsageData, sortConfig]);

  const currentPagedUsageData = sortedUsageData.slice(startIndex, endIndex);

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return ' ';
    }
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting ${exportPeriod} data as ${format}`);
    // Implement actual export logic here, e.g., using a library like js-xlsx or jspdf
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usage Analytics</h1>
          <p className="text-gray-600">Track credit usage and redemption patterns</p>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Total Usage"
            value={currentUsageStats.value}
            icon="📊"
            trend={currentUsageStats.trend}
            className="hover:shadow-lg hover:scale-105 transition-all duration-200 relative"
          >
            <Select value={usagePeriod} onValueChange={setUsagePeriod}>
              <SelectTrigger className="w-[120px] h-8 text-xs absolute top-2 right-2">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7-days">Last 7 days</SelectItem>
                <SelectItem value="30-days">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </MetricCard>
          <MetricCard
            title="Total eSIM codes generated"
            value="5000"
            icon="📱"
            className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={() => window.location.href = '/esim-codes'}
          />
        </div>

        {/* Usage Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Usage History</CardTitle>
            <div className="flex gap-2">
              <Select value={exportPeriod} onValueChange={setExportPeriod}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => handleExport('csv')}
                disabled={!exportPeriod}
                variant="outline"
                className="h-8 text-xs"
              >
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport('pdf')}
                disabled={!exportPeriod}
                variant="outline"
                className="h-8 text-xs"
              >
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('date')}
                    >
                      Date & Time {getSortIndicator('date')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('code')}
                    >
                      eSIM Top-Up Codes {getSortIndicator('code')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('creditDeducted')}
                    >
                      Credit Amount {getSortIndicator('creditDeducted')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('receiverEmail')}
                    >
                      Receiver Email {getSortIndicator('receiverEmail')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('referrerCode')}
                    >
                      Referral Code {getSortIndicator('referrerCode')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPagedUsageData.map((usage, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-600">{usage.date}</td>
                      <td className="py-3 px-2 font-mono text-sm">{usage.code}</td>
                      <td className="py-3 px-2 font-medium text-red-600">${usage.creditDeducted}</td>
                      <td className="py-3 px-2">{usage.receiverEmail}</td>
                      <td className="py-3 px-2 font-mono text-sm">{usage.referrerCode}</td>
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
              >
                &lt; Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default Usage;
