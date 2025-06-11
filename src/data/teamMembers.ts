export interface TeamMember {
  id: string;
  email: string;
  referralCode: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

// Function to generate dummy team members
const generateDummyTeamMembers = (count: number): TeamMember[] => {
  const members: TeamMember[] = [];
  for (let i = 1; i <= count; i++) {
    const statusOptions: TeamMember['status'][] = ['Active', 'Inactive', 'Pending'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    members.push({
      id: `member${i}`,
      email: `member${i}@example.com`,
      referralCode: `REF_MEMBER${i}`,
      status: randomStatus,
    });
  }
  return members;
};

export const initialTeamMembers: TeamMember[] = generateDummyTeamMembers(50); 