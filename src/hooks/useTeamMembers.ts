import { useState } from 'react';
import { initialTeamMembers, TeamMember } from '@/data/teamMembers';
import { v4 as uuidv4 } from 'uuid';

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

  const getTeamMemberById = (id: string): TeamMember | undefined => {
    return teamMembers.find(member => member.id === id);
  };

  const addTeamMember = (newMember: Omit<TeamMember, 'id' | 'status'> & { status?: TeamMember['status'] }): TeamMember => {
    const createdMember: TeamMember = {
      ...newMember,
      id: uuidv4(),
      status: newMember.status || 'Pending', // Default to 'Pending' if not provided
    };
    setTeamMembers(prevMembers => [...prevMembers, createdMember]);
    return createdMember;
  };

  const updateTeamMember = (updatedMember: TeamMember): void => {
    setTeamMembers(prevMembers =>
      prevMembers.map(member => (member.id === updatedMember.id ? updatedMember : member))
    );
  };

  const deleteTeamMember = (id: string): void => {
    setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== id));
  };

  return {
    teamMembers,
    getTeamMemberById,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
}; 