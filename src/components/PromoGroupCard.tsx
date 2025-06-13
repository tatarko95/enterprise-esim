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
  const formattedRewardAmount = `$${group.rewardAmount} USD`;

  const getStatusClasses = (status: PromoGroup['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-200 text-gray-800';
      case 'Expired':
        return 'bg-orange-100 text-orange-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      case 'Distributed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: PromoGroup['status']) => {
    switch (status) {
      case 'Active':
        return 'active';
      case 'Inactive':
        return 'Not active';
      case 'Expired':
        return 'All used';
      case 'Suspended':
        return 'suspended';
      case 'Distributed':
        return 'Distributed';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 flex flex-col justify-between h-full transition-shadow duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 leading-tight pr-4">{group.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0">
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
      <div className="space-y-1 flex-grow">
        <p className="text-sm text-gray-700"><span className="font-bold">ID:</span> <span className="font-normal text-gray-600">{group.id}</span></p>
        <p className="text-sm text-gray-700"><span className="font-bold">Quantity:</span> <span className="font-normal text-gray-600">{group.quantity}</span></p>
        <p className="text-sm text-gray-700"><span className="font-bold">Valid Period:</span> <span className="font-normal text-gray-600">{format(group.startDate, "MM/dd/yyyy")} - {format(group.endDate, "MM/dd/yyyy")}</span></p>
      </div>
      <hr className="my-3 border-t border-gray-200" />
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-gray-700"><span className="font-bold">Reward:</span> <span className="font-bold text-green-700">{formattedRewardAmount}</span></p>
        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded ${getStatusClasses(group.status)}`}>
          {getStatusText(group.status)}
        </span>
      </div>
    </div>
  );
};

export default PromoGroupCard;