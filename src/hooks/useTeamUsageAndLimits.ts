import { useState } from 'react';
import { initialTeamUsage, initialTeamLimits, TeamUsage, TeamLimits } from '@/data/teamUsageAndLimits';

export const useTeamUsageAndLimits = () => {
  const [teamUsage, setTeamUsage] = useState<TeamUsage>(initialTeamUsage);
  const [teamLimits, setTeamLimits] = useState<TeamLimits>(initialTeamLimits);

  const updateTeamUsage = (updatedUsage: TeamUsage): void => {
    setTeamUsage(updatedUsage);
  };

  const updateTeamLimits = (updatedLimits: TeamLimits): void => {
    setTeamLimits(updatedLimits);
  };

  return {
    teamUsage,
    teamLimits,
    updateTeamUsage,
    updateTeamLimits,
  };
}; 