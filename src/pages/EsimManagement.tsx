import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { usePromoGroups } from '@/hooks/usePromoGroups';
import { PromoGroup } from '@/data/promoGroups';

const EsimManagement: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { promoGroups, deletePromoGroup } = usePromoGroups();

  const handleDeleteGroup = (id: string) => {
    deletePromoGroup(id);
    toast({
      title: "Group Deleted",
      description: "Promo code group deleted successfully.",
    });
  };

  const handleEditGroup = (group: PromoGroup) => {
    navigate(`/esim-codes/${group.id}/edit`);
  };

  const handleViewDetails = (group: PromoGroup) => {
    navigate(`/esim-codes/${group.id}/view`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">eSIM Code Management</h1>
            <p className="text-gray-600">Manage your group promo codes</p>
          </div>
          <Button onClick={() => navigate('/esim-codes/create')}>Add another Group</Button>
        </div>

        {/* Search and Add Group */}
        <div className="flex items-center space-x-2">
          <Input placeholder="Search groups..." className="flex-1" />
        </div>

        {/* Group Promo Codes Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Group Promo Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gift Reward</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Amount per code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promoGroups.map((group) => (
                    <tr key={group.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(group.startDate, "PPP")} - {format(group.endDate, "PPP")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.giftReward}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.rewardAmount} MB</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          group.status === 'Active' ? 'bg-green-100 text-green-800' :
                          group.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {group.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="icon" onClick={() => handleEditGroup(group)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(group)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(group.id)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EsimManagement;
