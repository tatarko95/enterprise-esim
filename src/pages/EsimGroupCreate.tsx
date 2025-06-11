import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from "date-fns";
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { usePromoGroups } from '@/hooks/usePromoGroups';
import { PromoGroup } from '@/data/promoGroups';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const EsimGroupCreate: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addPromoGroup } = usePromoGroups();

  const [newGroup, setNewGroup] = useState<Omit<PromoGroup, 'id' | 'status' | 'promoCodes'> & { startDate: Date | undefined; endDate: Date | undefined }> ({
    name: '',
    description: '',
    quantity: 0,
    startDate: undefined,
    endDate: undefined,
    giftReward: 'eSIM Data',
    rewardAmount: 0,
  });

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.quantity || !newGroup.startDate || !newGroup.endDate || !newGroup.rewardAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Ensure startDate and endDate are not undefined before passing to addPromoGroup
    if (newGroup.startDate && newGroup.endDate) {
      addPromoGroup({
        ...newGroup,
        startDate: newGroup.startDate,
        endDate: newGroup.endDate,
      });

      toast({
        title: "Group Created",
        description: `Promo code group '${newGroup.name}' created successfully.`,
      });
      navigate('/esim-codes'); // Navigate back to the management page after creation
    }
  };

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
              <BreadcrumbPage>Create Group Promo Code</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold text-gray-900">Create Group Promo Codes</h1>
        <p className="text-gray-600">Fill in the details to create a new group of promo codes.</p>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              placeholder="Enter group name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-description">Group Description</Label>
            <Textarea
              id="group-description"
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              placeholder="Enter group description (optional)"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promo-quantity">Promo Code Quantity</Label>
              <Input
                id="promo-quantity"
                type="number"
                min="1"
                value={newGroup.quantity === 0 ? '' : newGroup.quantity}
                onChange={(e) => setNewGroup({ ...newGroup, quantity: parseInt(e.target.value) || 0 })}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gift-reward">Gift Reward</Label>
              <Select value={newGroup.giftReward} onValueChange={(value) => setNewGroup({ ...newGroup, giftReward: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reward type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eSIM Data">eSIM Data</SelectItem>
                  <SelectItem value="Credits">Credits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Code Start Using Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newGroup.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newGroup.startDate ? format(newGroup.startDate, "PPP HH:mm") : <span>Pick a date and time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newGroup.startDate}
                    onSelect={(date) => setNewGroup({ ...newGroup, startDate: date || undefined })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="close-time">Code Close Using Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newGroup.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newGroup.endDate ? format(newGroup.endDate, "PPP HH:mm") : <span>Pick a date and time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newGroup.endDate}
                    onSelect={(date) => setNewGroup({ ...newGroup, endDate: date || undefined })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reward-amount">Rewards Amount (e.g., 5000MB)</Label>
            <Input
              id="reward-amount"
              type="number"
              min="0"
              value={newGroup.rewardAmount === 0 ? '' : newGroup.rewardAmount}
              onChange={(e) => setNewGroup({ ...newGroup, rewardAmount: parseInt(e.target.value) || 0 })}
              placeholder="Enter amount"
            />
            <p className="text-sm text-gray-500 mt-1">This amount is for the *whole* promo code group.</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => navigate('/esim-codes')}>Cancel</Button>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EsimGroupCreate; 