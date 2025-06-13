import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, Search } from "lucide-react";
import { usePromoGroups } from '@/hooks/usePromoGroups';
import { PromoGroup, IndividualPromoCode } from '@/data/promoGroups';
import { format } from "date-fns";
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const ViewGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { getPromoGroupById } = usePromoGroups();
  const [groupDetails, setGroupDetails] = useState<PromoGroup | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of promo codes per page

  useEffect(() => {
    if (groupId) {
      const foundGroup = getPromoGroupById(groupId);
      if (foundGroup) {
        setGroupDetails(foundGroup);
      } else {
        setGroupDetails(null);
      }
    }
  }, [groupId, getPromoGroupById]);

  if (!groupDetails) {
    return <div className="p-6">Loading or Group not found...</div>;
  }

  console.log("groupDetails:", groupDetails); // Log groupDetails

  const totalPages = Math.ceil((groupDetails.promoCodes?.length || 0) / itemsPerPage);
  const currentPromoCodes = groupDetails.promoCodes?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  console.log("currentPromoCodes:", currentPromoCodes); // Log currentPromoCodes

  const getPromoCodeStatusClasses = (status: IndividualPromoCode['status']) => {
    switch (status) {
      case 'Open':
        return 'text-green-600';
      case 'Distributed':
        return 'text-blue-600';
      case 'Suspended':
        return 'text-red-600';
      case 'Used':
        return 'text-yellow-600';
      default:
        return '';
    }
  };

  const renderPaginationButtons = () => {
    const pages = [];
    // Show first page
    pages.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        onClick={() => setCurrentPage(1)}
        className="mx-1"
      >
        1
      </Button>
    );

    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage - 1 <= 3) {
      endPage = Math.min(totalPages - 1, 5);
    }
    if (totalPages - currentPage <= 3) {
      startPage = Math.max(2, totalPages - 5);
    }

    if (startPage > 2) {
      pages.push(<span key="dots-start" className="mx-1">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => setCurrentPage(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(<span key="dots-end" className="mx-1">...</span>);
    }

    // Show last page if there are more than 1 page and not already shown
    if (totalPages > 1 && !pages.some(p => p.key === totalPages)) {
        pages.push(
            <Button
                key={totalPages}
                variant={currentPage === totalPages ? "default" : "outline"}
                onClick={() => setCurrentPage(totalPages)}
                className="mx-1"
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
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/esim-codes" className="hover:underline">eSIM Codes Management</Link>
          <span className="mx-2">&gt;</span>
          <span>View Group: {groupDetails.name}</span>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Group Details</CardTitle>
            <p className="text-gray-500">View the details and individual promo codes for this group.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
              <div>
                <Label className="text-gray-500">Group Name</Label>
                <p className="font-semibold">{groupDetails.name}</p>
              </div>
              <div>
                <Label className="text-gray-500">Group ID</Label>
                <p className="font-semibold">{groupDetails.id}</p>
              </div>
              <div>
                <Label className="text-gray-500">Quantity</Label>
                <p className="font-semibold">{groupDetails.quantity}</p>
              </div>
              <div>
                <Label className="text-gray-500">Valid Period</Label>
                <p className="font-semibold">{format(groupDetails.startDate, "MM/dd/yyyy")} - {format(groupDetails.endDate, "MM/dd/yyyy")}</p>
              </div>
              <div>
                <Label className="text-gray-500">Reward in $</Label>
                <p className="font-semibold text-green-600">${groupDetails.rewardAmount} USD</p>
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-gray-500">Auto distributed</Label>
                <Switch checked={groupDetails.status === 'Distributed'} disabled />
              </div>
              <div>
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Individual Promo Codes</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">
                <span className="mr-2">📸</span> Distributed
              </Button>
              <Button variant="outline">
                <span className="mr-2">✉️</span> Suspende
              </Button>
              <Button variant="outline">Download .csv</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search promo codes..." className="pl-8" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"><Input type="checkbox" /></TableHead>
                  <TableHead>Promo Code</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Created Date & Time</TableHead>
                  <TableHead>Redeemed Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPromoCodes.map((code) => (
                  <TableRow key={code.code}>
                    <TableCell><Input type="checkbox" /></TableCell>
                    <TableCell className="font-medium">{code.code}</TableCell>
                    <TableCell>{code.userEmail || 'N/A'}</TableCell>
                    <TableCell>{code.createdTime ? format(code.createdTime, "MM/dd/yyyy HH:mm") : 'N/A'}</TableCell>
                    <TableCell>{code.redeemTime ? format(code.redeemTime, "MM/dd/yyyy HH:mm") : 'N/A'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className={`capitalize ${getPromoCodeStatusClasses(code.status)}`}>
                            {code.status} <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Open</DropdownMenuItem>
                          <DropdownMenuItem>Distributed</DropdownMenuItem>
                          <DropdownMenuItem>Suspended</DropdownMenuItem>
                          <DropdownMenuItem>Used</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex">
                {renderPaginationButtons()}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

export default ViewGroup;