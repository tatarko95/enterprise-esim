import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Edit, Eye, Trash2, Plus } from 'lucide-react';
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { usePromoGroups } from '@/hooks/usePromoGroups';
import { PromoGroup } from '@/data/promoGroups';
import PromoGroupCard from '@/components/PromoGroupCard';

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
            <h1 className="text-2xl font-bold text-gray-900">eSIM Top-Up Codes Management</h1>
            <p className="text-gray-600">Manage your eSIM Top-Up codes</p>
          </div>
          <Button onClick={() => navigate('/esim-codes/create')}><Plus className="mr-2 h-4 w-4" /> Add eSIM Top-Up Code</Button>
        </div>

        {/* Search and Add Group */}
        <div className="flex items-center space-x-2">
          <Input placeholder="Search top-up codes" className="flex-1" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">All eSIM Top-Up Codes</h2>

        {/* Group Promo Codes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {promoGroups.map((group) => (
            <PromoGroupCard
              key={group.id}
              group={group}
              onEdit={handleEditGroup}
              onView={handleViewDetails}
              onDelete={handleDeleteGroup}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EsimManagement;
