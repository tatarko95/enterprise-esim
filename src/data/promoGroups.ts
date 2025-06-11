import { v4 as uuidv4 } from 'uuid';

export interface IndividualPromoCode {
  code: string;
  createdTime: Date;
  redeemTime: Date | null;
  status: 'Open' | 'Used' | 'Distributed' | 'Suspended';
  userId: string | null;
  userEmail: string | null;
}

export interface PromoGroup {
  id: string;
  name: string;
  description: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  giftReward: string;
  rewardAmount: number;
  status: 'Active' | 'Suspended' | 'Expired';
  promoCodes?: IndividualPromoCode[];
}

export const initialPromoGroups: PromoGroup[] = [
  {
    id: uuidv4(),
    name: 'Summer Promo 2024',
    description: 'Special promo for summer travel',
    quantity: 1000,
    startDate: new Date(2024, 5, 1, 0, 0, 0),
    endDate: new Date(2024, 7, 31, 23, 59, 59),
    giftReward: 'eSIM Data',
    rewardAmount: 5000,
    status: 'Active',
    promoCodes: Array.from({ length: 5 }, (_, i) => ({
      code: `SUMMER${i + 1}ABC`,
      createdTime: new Date(2024, 5, 1, 10 + i, 0, 0),
      redeemTime: i % 2 === 0 ? new Date(2024, 5, 5, 12 + i, 0, 0) : null,
      status: i % 3 === 0 ? 'Used' : (i % 3 === 1 ? 'Suspended' : 'Open'),
      userId: i % 2 === 0 ? `user${i}` : null,
      userEmail: i % 2 === 0 ? `user${i}@example.com` : null,
    })),
  },
  {
    id: uuidv4(),
    name: 'Winter Bonus',
    description: 'Bonus data for winter months',
    quantity: 500,
    startDate: new Date(2023, 11, 1, 0, 0, 0),
    endDate: new Date(2024, 1, 29, 23, 59, 59),
    giftReward: 'eSIM Data',
    rewardAmount: 2000,
    status: 'Expired',
    promoCodes: Array.from({ length: 3 }, (_, i) => ({
      code: `WINTER${i + 1}XYZ`,
      createdTime: new Date(2023, 11, 10, 10 + i, 0, 0),
      redeemTime: i % 2 === 0 ? new Date(2023, 11, 15, 12 + i, 0, 0) : null,
      status: i % 2 === 0 ? 'Used' : 'Open',
      userId: i % 2 === 0 ? `user${i + 10}` : null,
      userEmail: i % 2 === 0 ? `user${i + 10}@example.com` : null,
    })),
  },
  {
    id: uuidv4(),
    name: 'New Year Special',
    description: 'Limited time offer for new users',
    quantity: 200,
    startDate: new Date(2024, 0, 1, 0, 0, 0),
    endDate: new Date(2024, 0, 15, 23, 59, 59),
    giftReward: 'eSIM Data',
    rewardAmount: 1000,
    status: 'Suspended',
    promoCodes: Array.from({ length: 2 }, (_, i) => ({
      code: `NY2024${i + 1}DEF`,
      createdTime: new Date(2024, 0, 5, 10 + i, 0, 0),
      redeemTime: null,
      status: 'Open',
      userId: null,
      userEmail: null,
    })),
  },
]; 