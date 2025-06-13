export interface TeamUsage {
  totalDataUsedGB: number;
  totalCreditsUsed: number;
  // Add more usage metrics as needed
}

export interface TeamMemberUsage {
  memberId: string;
  codesUsed: number;
  usedCredit: number;
}

export interface TeamLimits {
  maxDataGB: number;
  maxCredits: number;
  defaultMemberDataLimitGB: number;
  defaultMemberCreditLimit: number;
  maxCreditPerUser: number;
  // Add more limit parameters as needed
}

export const initialTeamUsage: TeamUsage = {
  totalDataUsedGB: 750,
  totalCreditsUsed: 1500,
};

export const initialTeamMemberUsage: TeamMemberUsage[] = [
  {
    memberId: "d9385b2e-7f61-4a1d-8b0f-8f8f8f8f8f8f", // Dummy ID, replace with actual UIDs if needed
    codesUsed: 5,
    usedCredit: 200,
  },
  {
    memberId: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // Dummy ID
    codesUsed: 8,
    usedCredit: 200,
  },
  {
    memberId: "f8e7d6c5-b4a3-2109-fedc-ba9876543210", // Dummy ID
    codesUsed: 7,
    usedCredit: 200,
  },
  {
    memberId: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d", // Dummy ID
    codesUsed: 1,
    usedCredit: 200,
  },
];

export const initialTeamLimits: TeamLimits = {
  maxDataGB: 1000,
  maxCredits: 5000,
  defaultMemberDataLimitGB: 50,
  defaultMemberCreditLimit: 100,
  maxCreditPerUser: 600,
}; 