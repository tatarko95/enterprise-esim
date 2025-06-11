import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from "date-fns";
import { usePromoGroups } from '@/hooks/usePromoGroups';
import { PromoGroup, IndividualPromoCode } from '@/data/promoGroups';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const EsimGroupView: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPromoGroupById, updatePromoGroup } = usePromoGroups();

  const [viewingGroup, setViewingGroup] = useState<PromoGroup | null>(null);

  useEffect(() => {
    if (groupId) {
      const groupToView = getPromoGroupById(groupId);
      if (groupToView) {
        setViewingGroup(groupToView);
      } else {
        toast({
          title: "Group Not Found",
          description: "The requested promo code group was not found.",
          variant: "destructive",
        });
        navigate('/esim-codes');
      }
    }
  }, [groupId, navigate, toast, getPromoGroupById]);

  const handleUpdatePromoCodeStatus = (codeIndex: number, newStatus: IndividualPromoCode['status']) => {
    if (viewingGroup && viewingGroup.promoCodes) {
      const updatedPromoCodes = viewingGroup.promoCodes.map((code, index) => {
        if (index === codeIndex) {
          return { ...code, status: newStatus };
        }
        return code;
      });
      // Instead of direct state update, call updatePromoGroup from the hook
      updatePromoGroup({ ...viewingGroup, promoCodes: updatedPromoCodes });
      setViewingGroup({ ...viewingGroup, promoCodes: updatedPromoCodes }); // Also update local state for immediate visual feedback
      toast({
        title: "Promo Code Status Updated",
        description: `Status for promo code ${viewingGroup.promoCodes?.[codeIndex]?.code} updated to ${newStatus}.`,
      });
    }
  };

  const handleClose = () => {
    navigate('/esim-codes');
  };

  if (!viewingGroup) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Loading Group Details...</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/esim-codes')} className="cursor-pointer">eSIM Code Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>View Group: {viewingGroup.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold text-gray-900">Group Promo Code Details</h1>
        <p className="text-gray-600">View the details and individual promo codes for this group.</p>

        <Card>
          <CardHeader>
            <CardTitle>Group Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Group ID:</p>
                <p className="text-sm font-semibold">{viewingGroup.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Name:</p>
                <p className="text-sm font-semibold">{viewingGroup.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Description:</p>
                <p className="text-sm font-semibold">{viewingGroup.description || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Quantity:</p>
                <p className="text-sm font-semibold">{viewingGroup.quantity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Valid Period:</p>
                <p className="text-sm font-semibold">{format(viewingGroup.startDate, "PPP HH:mm")} - {format(viewingGroup.endDate, "PPP HH:mm")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Gift Reward:</p>
                <p className="text-sm font-semibold">{viewingGroup.giftReward}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Reward Amount:</p>
                <p className="text-sm font-semibold">{viewingGroup.rewardAmount} MB</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Status:</p>
                <p className="text-sm font-semibold">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    viewingGroup.status === 'Active' ? 'bg-green-100 text-green-800' :
                    viewingGroup.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {viewingGroup.status}
                  </span>
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Individual Promo Codes</h3>

            {viewingGroup.promoCodes && viewingGroup.promoCodes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Redeem Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewingGroup.promoCodes.map((code, index) => (
                      <tr key={code.code}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{code.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(code.createdTime, "PPP HH:mm") || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.redeemTime ? format(code.redeemTime, "PPP HH:mm") : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            code.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                            code.status === 'Used' ? 'bg-green-100 text-green-800' :
                            code.status === 'Distributed' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {code.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.userId || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.userEmail || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Select value={code.status} onValueChange={(newStatus) => handleUpdatePromoCodeStatus(index, newStatus as IndividualPromoCode['status'])}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Change Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="Used">Used</SelectItem>
                              <SelectItem value="Distributed">Distributed</SelectItem>
                              <SelectItem value="Suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No individual promo codes found for this group.</p>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleClose}>Back to Management</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EsimGroupView; 