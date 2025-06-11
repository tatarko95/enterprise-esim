export interface TeamUsage {
  totalDataUsedGB: number;
  totalCreditsUsed: number;
  // Add more usage metrics as needed
}

export interface TeamLimits {
  maxDataGB: number;
  maxCredits: number;
  defaultMemberDataLimitGB: number;
  defaultMemberCreditLimit: number;
  // Add more limit parameters as needed
}

export const initialTeamUsage: TeamUsage = {
  totalDataUsedGB: 750,
  totalCreditsUsed: 1500,
};

export const initialTeamLimits: TeamLimits = {
  maxDataGB: 1000,
  maxCredits: 5000,
  defaultMemberDataLimitGB: 50,
  defaultMemberCreditLimit: 100,
}; 