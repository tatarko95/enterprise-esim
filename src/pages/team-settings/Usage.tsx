import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TeamUsageRecord {
  email: string;
  requestedCodes: string[];
  requestedValue: number;
  redeemedValue: number;
}

const Usage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 5 pages as requested
  const [sortConfig, setSortConfig] = useState<{ key: keyof TeamUsageRecord; direction: 'ascending' | 'descending' } | null>(null);
  const { toast } = useToast();

  const teamUsage: TeamUsageRecord[] = [
    {
      email: 'john@partner.com',
      requestedCodes: ['ESIM-123', 'ESIM-456'],
      requestedValue: 250,
      redeemedValue: 200
    },
    {
      email: 'jane@partner.com',
      requestedCodes: ['ESIM-789', 'ESIM-012', 'ESIM-345'],
      requestedValue: 400,
      redeemedValue: 350
    },
    {
      email: 'mike@partner.com',
      requestedCodes: ['ESIM-678'],
      requestedValue: 150,
      redeemedValue: 100
    },
    {
      email: 'alice@example.org',
      requestedCodes: ['ESIM-901', 'ESIM-234'],
      requestedValue: 300,
      redeemedValue: 280
    },
    {
      email: 'bob@example.org',
      requestedCodes: ['ESIM-567'],
      requestedValue: 100,
      redeemedValue: 100
    },
    {
      email: 'charlie@partner.com',
      requestedCodes: ['ESIM-890', 'ESIM-111', 'ESIM-222', 'ESIM-333'],
      requestedValue: 600,
      redeemedValue: 550
    },
    {
      email: 'diana@partner.com',
      requestedCodes: ['ESIM-444', 'ESIM-555'],
      requestedValue: 200,
      redeemedValue: 180
    },
  ];

  const sortedUsageData = useMemo(() => {
    let sortableItems = [...teamUsage];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [teamUsage, sortConfig]);

  const totalPages = Math.ceil(sortedUsageData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPagedUsageData = sortedUsageData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const requestSort = (key: keyof TeamUsageRecord) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof TeamUsageRecord) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />;
  };

  const resetUserLimit = (email: string) => {
    toast({
      title: "Limit Reset",
      description: `Maximum request limit reset for ${email}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('email')}>
                    Email {getSortIndicator('email')}
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">eSIM Top-Up Codes</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('requestedValue')}>
                    Top-Up value requested {getSortIndicator('requestedValue')}
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 cursor-pointer" onClick={() => requestSort('redeemedValue')}>
                    Top-up value redeemed {getSortIndicator('redeemedValue')}
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPagedUsageData.map((user, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-2">{user.email}</td>
                    <td className="py-3 px-2">{user.requestedCodes.join(', ')}</td>
                    <td className="py-3 px-2">${user.requestedValue.toFixed(2)}</td>
                    <td className="py-3 px-2">${user.redeemedValue.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetUserLimit(user.email)}
                      >
                        Reset Limit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <nav className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </nav>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usage; 