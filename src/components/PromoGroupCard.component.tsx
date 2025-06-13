import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { format } from "date-fns";
import { PromoGroup } from '@/data/promoGroups';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PromoGroupCardProps {
  group: PromoGroup;
  onEdit: (group: PromoGroup) => void;
  onView: (group: PromoGroup) => void;
  onDelete: (id: string) => void;
}

const PromoGroupCard: React.FC<PromoGroupCardProps> = ({
  group,
  onEdit,
  onView,
  onDelete,
}) => {
  // Assume rewardAmount is always in USD for display based on the screenshot
  const formattedRewardAmount = `$${group.rewardAmount} USD`;

  const getStatusClasses = (status: PromoGroup['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'; // Matches 'Open' in screenshot
      case 'Expired':
        return 'bg-yellow-100 text-yellow-800'; // Matches 'Used' in screenshot
      case 'Suspended':
        return 'bg-red-100 text-red-800'; // Matches 'Suspended' in screenshot
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col justify-between h-full transition-shadow duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 leading-tight pr-4">{group.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(group)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(group)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(group.id)} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-1 text-sm text-gray-700 flex-grow">
        <p className="text-xs text-gray-500"><span className="font-normal">ID:</span> {group.id.substring(0, 8)}...</p>
        <p><span className="font-normal">Quantity:</span> {group.quantity}</p>
        <p><span className="font-normal">Valid Period:</span> {format(group.startDate, "MM/dd/yyyy")} - {format(group.endDate, "MM/dd/yyyy")}</p>
        <p className="font-semibold">Reward: {formattedRewardAmount}</p>
      </div>
      <div className="mt-3">
        <span className={`px-2 py-0.5 inline-flex text-xs font-medium rounded-md ${getStatusClasses(group.status)}`}>
          {group.status === 'Active' ? 'Open' : group.status === 'Expired' ? 'Used' : group.status}
        </span>
      </div>
    </div>
  );
};

export default PromoGroupCard; 