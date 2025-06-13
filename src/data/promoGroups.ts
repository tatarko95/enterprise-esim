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
  status: 'Active' | 'Suspended' | 'Expired' | 'Distributed' | 'Inactive';
  promoCodes?: IndividualPromoCode[];
}

export const initialPromoGroups: PromoGroup[] = [
  {
    id: uuidv4(),
    name: 'ByBit Team',
    description: 'Special promo for ByBit Team',
    quantity: 1000,
    startDate: new Date(2024, 11, 20, 0, 0, 0),
    endDate: new Date(2025, 11, 31, 23, 59, 59),
    giftReward: 'eSIM Data',
    rewardAmount: 500,
    status: 'Active',
    promoCodes: Array.from({ length: 166 * 5 }).map((_, i) => ({
      code: `SOLANA2025FGR-${i}`,
      createdTime: new Date(2024, 11, 20, 15, 43 + i),
      redeemTime: i % 3 === 0 ? new Date(2024, 11, 20, 19, 34 + i) : null,
      status: ['Open', 'Distributed', 'Suspended', 'Used'][Math.floor(Math.random() * 4)] as 'Open' | 'Distributed' | 'Suspended' | 'Used',
      userId: i % 2 === 0 ? uuidv4() : null,
      userEmail: i % 2 === 0 ? `user${i}@example.com` : null,
    })),
  },
  {
    id: uuidv4(),
    name: 'Team 2',
    description: 'Bonus data for Team 2',
    quantity: 100,
    startDate: new Date(2024, 11, 20, 0, 0, 0),
    endDate: new Date(2025, 3, 20, 23, 59, 59),
    giftReward: 'eSIM Data',
    rewardAmount: 2000,
    status: 'Inactive',
    promoCodes: [],
  },
  {
    id: uuidv4(),
    name: 'Team 3',
    description: 'Limited time offer for Team 3',
    quantity: 900,
    startDate: new Date(2024, 11, 20, 0, 0, 0),
    endDate: new Date(2025, 3, 20, 23, 59, 59),
    giftReward: 'eSIM Data',
    rewardAmount: 900,
    status: 'Expired',
    promoCodes: [],
  },
  {
    id: uuidv4(),
    name: 'Group 4',
    description: 'Another promo group',
    quantity: 90,
    startDate: new Date(2024, 11, 20, 0, 0, 0),
    endDate: new Date(2025, 3, 20, 23, 59, 59),
    giftReward: 'eSIM Data',
    rewardAmount: 900,
    status: 'Suspended',
    promoCodes: [],
  },
]; 