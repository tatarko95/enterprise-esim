import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UsageRecord {
  topUpCode: string;
  groupId: string;
  amount: number;
  balance: number;
  email: string;
  referralCode: string;
  redeemedAt: string;
}

const Usage: React.FC = () => {
  const [usagePeriod, setUsagePeriod] = useState('Last 7 days');
  const [filterTopUpCode, setFilterTopUpCode] = useState('');
  const [filterGroupId, setFilterGroupId] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterReferralCode, setFilterReferralCode] = useState('');

  const usageStats = {
    'Last 7 days': {
      totalUsage: 100.00,
      eSimCodesUsage: 4342,
    },
    'Last 30 days': {
      totalUsage: 342.80,
      eSimCodesUsage: 15000,
    },
  };

  const currentUsageStats = usageStats[usagePeriod as keyof typeof usageStats];

  const allUsageData: UsageRecord[] = [
    {
      topUpCode: "SOLANA2025FGR",
      groupId: "1343423443",
      amount: -10,
      balance: 90,
      email: "example@email.com",
      referralCode: "7879998787",
      redeemedAt: "12/02/2025 14:23",
    },
    {
      topUpCode: "SOLANA2025FGR",
      groupId: "1343423443",
      amount: -10,
      balance: 90,
      email: "example@email.com",
      referralCode: "7879998787",
      redeemedAt: "12/02/2025 14:23",
    },
    {
      topUpCode: "SOLANA2025FGR",
      groupId: "1343423443",
      amount: -10,
      balance: 90,
      email: "example@email.com",
      referralCode: "7879998787",
      redeemedAt: "12/02/2025 14:23",
    },
    {
      topUpCode: "SOLANA2025FGR",
      groupId: "1343423443",
      amount: -10,
      balance: 90,
      email: "example@email.com",
      referralCode: "7879998787",
      redeemedAt: "12/02/2025 14:23",
    },
    // Add more dummy data as needed to match 16 pages
    ...Array.from({ length: 15 * 5 }).map((_, i) => ({
      topUpCode: `CODE${1000 + i}`,
      groupId: `GROUP${2000 + i}`,
      amount: -(i % 5 + 1) * 10,
      balance: 100 - ((i % 5 + 1) * 10),
      email: `user${i}@example.com`,
      referralCode: `REF${3000 + i}`,
      redeemedAt: `12/02/2025 1${i}:23`,
    }))
  ];

  const [sortConfig, setSortConfig] = useState<{ key: keyof UsageRecord; direction: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsageData = useMemo(() => {
    return allUsageData.filter(record => {
      return (
        record.topUpCode.toLowerCase().includes(filterTopUpCode.toLowerCase()) &&
        record.groupId.toLowerCase().includes(filterGroupId.toLowerCase()) &&
        record.email.toLowerCase().includes(filterEmail.toLowerCase()) &&
        record.referralCode.toLowerCase().includes(filterReferralCode.toLowerCase())
      );
    });
  }, [allUsageData, filterTopUpCode, filterGroupId, filterEmail, filterReferralCode]);

  const sortedUsageData = useMemo(() => {
    let sortableItems = [...filteredUsageData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

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
        return 0;
      });
    }
    return sortableItems;
  }, [filteredUsageData, sortConfig]);

  const totalPages = Math.ceil(sortedUsageData.length / itemsPerPage);
  const currentPagedUsageData = sortedUsageData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof UsageRecord) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof UsageRecord) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page on applying filters
    // Filtering is already handled by useMemo, so no explicit action needed here beyond resetting page
  };

  const handleResetFilters = () => {
    setFilterTopUpCode('');
    setFilterGroupId('');
    setFilterEmail('');
    setFilterReferralCode('');
    setCurrentPage(1); // Reset to first page on resetting filters
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxButtons = 7; // Max number of pagination buttons to show at once

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            onClick={() => setCurrentPage(i)}
            className="mx-1 w-10"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Always show first button
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          onClick={() => setCurrentPage(1)}
          className="mx-1 w-10"
        >
          1
        </Button>
      );

      // Logic for showing ellipsis and dynamic page numbers
      if (currentPage > 3) {
        pages.push(<span key="ellipsis-start" className="mx-1">...</span>);
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 5);
      }
      if (currentPage > totalPages - 3) {
        start = Math.max(2, totalPages - 4);
      }

      for (let i = start; i <= end; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            onClick={() => setCurrentPage(i)}
            className="mx-1 w-10"
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="ellipsis-end" className="mx-1">...</span>);
      }

      // Always show last button
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          onClick={() => setCurrentPage(totalPages)}
          className="mx-1 w-10"
        >
          {totalPages}
        </Button>
      );
    }
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usage Analytics</h1>
            <p className="text-gray-600">Monitor all the "eSIM Top-Up Codes" redeemed and credit deducted.</p>
          </div>
          {/* Top-Up button can be here or in Header, based on overall layout decisions */}
        </div>

        {/* Usage Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Select value={usagePeriod} onValueChange={setUsagePeriod}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                  <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentUsageStats.totalUsage.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage of eSIM Codes</CardTitle>
              {/* Graph icon placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-area-chart"><path d="M3 3v18h18"/><path d="M7 12v5h12V8l-5 5-4-4Z"/></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentUsageStats.eSimCodesUsage}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Enter top-up code"
                value={filterTopUpCode}
                onChange={(e) => setFilterTopUpCode(e.target.value)}
              />
              <Input
                placeholder="Enter group id"
                value={filterGroupId}
                onChange={(e) => setFilterGroupId(e.target.value)}
              />
              <Input
                placeholder="Enter email"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
              <Input
                placeholder="Enter referral code"
                value={filterReferralCode}
                onChange={(e) => setFilterReferralCode(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleResetFilters}>Reset</Button>
              <Button onClick={handleApplyFilters}>Apply</Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage History Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Usage History</CardTitle>
            <Button variant="outline" className="h-8 text-sm" onClick={() => console.log('Download .csv clicked')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download .csv
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <thead className="[&_tr]:border-b">
                  <tr className="border-b border-gray-200">
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('topUpCode')}
                    >
                      Top-Up Code {getSortIndicator('topUpCode')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('groupId')}
                    >
                      Group ID {getSortIndicator('groupId')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('amount')}
                    >
                      Amount {getSortIndicator('amount')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('balance')}
                    >
                      Balance {getSortIndicator('balance')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('email')}
                    >
                      Email {getSortIndicator('email')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('referralCode')}
                    >
                      Referral Code {getSortIndicator('referralCode')}
                    </th>
                    <th
                      className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => requestSort('redeemedAt')}
                    >
                      Redeemed at {getSortIndicator('redeemedAt')}
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {currentPagedUsageData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-2 px-2">{record.topUpCode}</TableCell>
                      <TableCell className="py-2 px-2">{record.groupId}</TableCell>
                      <TableCell className={`py-2 px-2 ${record.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{record.amount > 0 ? `+$${record.amount.toFixed(2)}` : `-$${Math.abs(record.amount).toFixed(2)}`}</TableCell>
                      <TableCell className="py-2 px-2 text-green-600">${record.balance.toFixed(2)}</TableCell>
                      <TableCell className="py-2 px-2">{record.email}</TableCell>
                      <TableCell className="py-2 px-2">{record.referralCode}</TableCell>
                      <TableCell className="py-2 px-2">{record.redeemedAt}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex">
                {renderPaginationButtons()}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default Usage;
