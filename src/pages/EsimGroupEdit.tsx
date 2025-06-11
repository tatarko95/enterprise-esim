import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from "date-fns";
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { usePromoGroups } from '@/hooks/usePromoGroups';
import { PromoGroup } from '@/data/promoGroups';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const EsimGroupEdit: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPromoGroupById, updatePromoGroup } = usePromoGroups();

  const [editingGroup, setEditingGroup] = useState<PromoGroup | null>(null);

  useEffect(() => {
    if (groupId) {
      const groupToEdit = getPromoGroupById(groupId);
      if (groupToEdit) {
        setEditingGroup(groupToEdit);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (editingGroup) {
      setEditingGroup({
        ...editingGroup,
        [id]: id === 'quantity' || id === 'rewardAmount' ? parseInt(value) || 0 : value,
      });
    }
  };

  const handleDateChange = (date: Date | undefined, field: 'startDate' | 'endDate') => {
    if (editingGroup) {
      setEditingGroup({
        ...editingGroup,
        [field]: date || undefined,
      });
    }
  };

  const handleSave = () => {
    if (editingGroup) {
      updatePromoGroup(editingGroup);
      toast({
        title: "Group Updated",
        description: `Promo code group '${editingGroup.name}' updated successfully.`,
      });
      navigate('/esim-codes');
    }
  };

  const handleCancel = () => {
    navigate('/esim-codes');
  };

  if (!editingGroup) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Loading Group...</h1>
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
              <BreadcrumbPage>Edit Group: {editingGroup.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold text-gray-900">Edit Promo Code Group</h1>
        <p className="text-gray-600">Modify the details of the promo code group.</p>

        <Card>
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={editingGroup.name}
                  onChange={handleInputChange}
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Group Description</Label>
                <Textarea
                  id="description"
                  value={editingGroup.description}
                  onChange={handleInputChange}
                  placeholder="Enter group description (optional)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Promo Code Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={editingGroup.quantity === 0 ? '' : editingGroup.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id">Group ID</Label>
                  <Input
                    id="id"
                    value={editingGroup.id}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Code Start Using Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editingGroup.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingGroup.startDate ? format(editingGroup.startDate, "PPP HH:mm") : <span>Pick a date and time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingGroup.startDate}
                        onSelect={(date) => handleDateChange(date, 'startDate')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Code Close Using Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editingGroup.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingGroup.endDate ? format(editingGroup.endDate, "PPP HH:mm") : <span>Pick a date and time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingGroup.endDate}
                        onSelect={(date) => handleDateChange(date, 'endDate')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="giftReward">Gift Reward</Label>
                  <Select value={editingGroup.giftReward} onValueChange={(value) => setEditingGroup({ ...editingGroup, giftReward: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eSIM Data">eSIM Data</SelectItem>
                      <SelectItem value="Credits">Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rewardAmount">Rewards Amount (e.g., 5000MB)</Label>
                  <Input
                    id="rewardAmount"
                    type="number"
                    min="0"
                    value={editingGroup.rewardAmount === 0 ? '' : editingGroup.rewardAmount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                  />
                  <p className="text-sm text-gray-500 mt-1">This amount is for the *whole* promo code group.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editingGroup.status} onValueChange={(value) => setEditingGroup({ ...editingGroup, status: value as 'Active' | 'Suspended' | 'Expired' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EsimGroupEdit; 