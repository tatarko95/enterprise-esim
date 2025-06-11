import { useState } from 'react';
import { initialPromoGroups, PromoGroup } from '@/data/promoGroups';
import { v4 as uuidv4 } from 'uuid';

export const usePromoGroups = () => {
  const [promoGroups, setPromoGroups] = useState<PromoGroup[]>(initialPromoGroups);

  const getPromoGroupById = (id: string): PromoGroup | undefined => {
    return promoGroups.find(group => group.id === id);
  };

  const addPromoGroup = (newGroup: Omit<PromoGroup, 'id' | 'status' | 'promoCodes'> & { startDate: Date; endDate: Date }): PromoGroup => {
    const createdGroup: PromoGroup = {
      ...newGroup,
      id: uuidv4(),
      status: 'Active',
      promoCodes: Array.from({ length: newGroup.quantity }, (_, i) => ({
        code: `${newGroup.name.toUpperCase().replace(/\s/g, '').substring(0, 4)}${uuidv4().substring(0, 4)}`,
        createdTime: new Date(),
        redeemTime: null,
        status: 'Open',
        userId: null,
        userEmail: null,
      })),
    };
    setPromoGroups(prevGroups => [...prevGroups, createdGroup]);
    return createdGroup;
  };

  const updatePromoGroup = (updatedGroup: PromoGroup): void => {
    setPromoGroups(prevGroups =>
      prevGroups.map(group => (group.id === updatedGroup.id ? updatedGroup : group))
    );
  };

  const deletePromoGroup = (id: string): void => {
    setPromoGroups(prevGroups => prevGroups.filter(group => group.id !== id));
  };

  return {
    promoGroups,
    getPromoGroupById,
    addPromoGroup,
    updatePromoGroup,
    deletePromoGroup,
  };
}; 