import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { TeamMember } from '@/data/teamMembers';
import { PlusCircle, MoreHorizontal, User, Mail, Code, X, Upload, Search, RefreshCcw } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useTeamUsageAndLimits } from '@/hooks/useTeamUsageAndLimits';
import { TeamLimits, TeamMemberUsage } from '@/data/teamUsageAndLimits';

const TeamSettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const { teamLimits, updateTeamLimits, initialTeamMemberUsage } = useTeamUsageAndLimits();

  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberReferralCode, setNewMemberReferralCode] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  // State for Team Members pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(10); // Display 10 members per page

  // State for Email Controls tab
  const [domainInput, setDomainInput] = useState('');
  const [domains, setDomains] = useState<string[]>(['partner.com', 'example.org']);
  const [bulkEmailWhitelistInput, setBulkEmailWhitelistInput] = useState('');
  const [emailWhitelist, setEmailWhitelist] = useState<string[]>(['admin@partner.com', 'manager@example.org']);
  const [whitelistSearchTerm, setWhitelistSearchTerm] = useState('');
  const [bulkEmailBlacklistInput, setBulkEmailBlacklistInput] = useState('');
  const [emailBlacklist, setEmailBlacklist] = useState<string[]>(['blocked@example.com']);
  const [blacklistSearchTerm, setBlacklistSearchTerm] = useState('');

  // State for Usage & Limits tab (now integrated)
  const [editingLimits, setEditingLimits] = useState<TeamLimits>(teamLimits);

  // Local state for active tab
  const [currentTab, setCurrentTab] = useState('members'); // Default tab

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleAddMember = () => {
    if (!newMemberEmail || !newMemberReferralCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addTeamMember({
      email: newMemberEmail,
      referralCode: newMemberReferralCode,
    });
    toast({
      title: "Team Member Added",
      description: `New team member ${newMemberEmail} has been added.`,
    });
    setNewMemberEmail('');
    setNewMemberReferralCode('');
    setIsAddMemberDialogOpen(false);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditMemberDialogOpen(true);
  };

  const handleUpdateMember = () => {
    if (editingMember) {
      updateTeamMember(editingMember);
      toast({
        title: "Team Member Updated",
        description: `Team member ${editingMember.email} has been updated.`,
      });
      setIsEditMemberDialogOpen(false);
      setEditingMember(null);
    }
  };

  const handleDeleteMember = (id: string, email: string) => {
    deleteTeamMember(id);
    toast({
      title: "Team Member Deleted",
      description: `Team member ${email} has been removed.`,
    });
    // Reset to first page if current page becomes empty after deletion
    if (currentPage > Math.ceil((teamMembers.length - 1) / membersPerPage) && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination logic for team members
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const filteredMembers = teamMembers.filter(member =>
    member.email.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Functions for Email Controls tab
  const addDomain = () => {
    if (domainInput.trim() && !domains.includes(domainInput.trim())) {
      setDomains([...domains, domainInput.trim()]);
      setDomainInput('');
      toast({
        title: "Domain Added",
        description: `${domainInput.trim()} has been added to the domain whitelist.`,
      });
    }
  };

  const removeDomain = (domainToRemove: string) => {
    setDomains(domains.filter(domain => domain !== domainToRemove));
    toast({
      title: "Domain Removed",
      description: `${domainToRemove} has been removed from the domain whitelist.`,
    });
  };

  const addEmailToWhitelist = () => {
    const newEmails = bulkEmailWhitelistInput
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email !== '' && !emailWhitelist.includes(email));

    if (newEmails.length > 0) {
      setEmailWhitelist([...emailWhitelist, ...newEmails]);
      setBulkEmailWhitelistInput('');
      toast({
        title: "Emails Added to Whitelist",
        description: `${newEmails.length} email(s) added to the email whitelist.`,
      });
    }
  };

  const removeEmailFromWhitelist = (emailToRemove: string) => {
    setEmailWhitelist(emailWhitelist.filter(email => email !== emailToRemove));
    toast({
      title: "Email Removed from Whitelist",
      description: `${emailToRemove} has been removed from the email whitelist.`,
    });
  };

  const clearEmailWhitelist = () => {
    setEmailWhitelist([]);
    toast({
      title: "Email Whitelist Cleared",
      description: "All emails have been removed from the whitelist.",
    });
  };

  const addEmailToBlacklist = () => {
    const newEmails = bulkEmailBlacklistInput
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email !== '' && !emailBlacklist.includes(email));

    if (newEmails.length > 0) {
      setEmailBlacklist([...emailBlacklist, ...newEmails]);
      setBulkEmailBlacklistInput('');
      toast({
        title: "Emails Added to Blacklist",
        description: `${newEmails.length} email(s) added to the email blacklist.`,
      });
    }
  };

  const removeEmailFromBlacklist = (emailToRemove: string) => {
    setEmailBlacklist(emailBlacklist.filter(email => email !== emailToRemove));
    toast({
      title: "Email Removed from Blacklist",
      description: `${emailToRemove} has been removed from the email blacklist.`,
    });
  };

  const clearEmailBlacklist = () => {
    setEmailBlacklist([]);
    toast({
      title: "Email Blacklist Cleared",
      description: "All emails have been removed from the blacklist.",
    });
  };

  // Functions for Usage & Limits tab (now integrated into Team Members)
  const handleLimitInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLimits(prev => ({ ...prev, maxCreditPerUser: parseFloat(e.target.value) || 0 }));
  };

  const handleSaveLimits = () => {
    updateTeamLimits(editingLimits);
    toast({
      title: "Limit Updated",
      description: "Maximum credit per user limit has been updated.",
    });
  };

  const handleResetLimit = (memberEmail: string) => {
    // Find the member and reset their usage/limits in teamUsage and teamLimits
    // This is dummy for now, actual implementation would require a backend call or more complex state management
    console.log(`Resetting limit for ${memberEmail}`);
    toast({
      title: "Limit Reset",
      description: `Limit for ${memberEmail} has been reset.`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading file:', file.name);
      toast({
        title: "File Uploaded",
        description: `File ${file.name} has been uploaded.`,
      });
      // Implement actual file parsing and member addition logic here
    }
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxButtons = 7;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            onClick={() => paginate(i)}
            className="mx-1 w-10"
          >
            {i}
          </Button>
        );
      }
    } else {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          onClick={() => paginate(1)}
          className="mx-1 w-10"
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        pages.push(<span key="ellipsis-start" className="mx-1">...</span>);
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 5);
      }
      if (currentPage > totalPages - 3) {
        start = Math.max(2, totalPages - 4);
      }

      for (let i = start; i <= end; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            onClick={() => paginate(i)}
            className="mx-1 w-10"
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="ellipsis-end" className="mx-1">...</span>);
      }

      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          onClick={() => paginate(totalPages)}
          className="mx-1 w-10"
        >
          {totalPages}
        </Button>
      );
    }
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Settings</h1>
          <p className="text-gray-600">Manage team members, email controls, usage, and limits.</p>
        </div>

        <Tabs defaultValue="members" className="space-y-6" value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="members">Team members</TabsTrigger>
            <TabsTrigger value="email-controls">Email Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maximum $ Amount of Credit per User</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="$ Amount"
                  value={editingLimits.maxCreditPerUser}
                  onChange={handleLimitInputChange}
                  className="w-fit"
                />
                <Button onClick={handleSaveLimits}>Set Limit</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Team Members</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search team members by email"
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                    <DialogTrigger asChild>
                      <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Member</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Team Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-member-email">Email</Label>
                          <Input
                            id="new-member-email"
                            type="email"
                            placeholder="Enter email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-member-referral-code">Referral Code</Label>
                          <Input
                            id="new-member-referral-code"
                            placeholder="Enter referral code"
                            value={newMemberReferralCode}
                            onChange={(e) => setNewMemberReferralCode(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddMember}>Add Member</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" onClick={() => document.getElementById('upload-csv-input')?.click()}><Upload className="mr-2 h-4 w-4" /> Upload .csv</Button>
                  <input
                    type="file"
                    id="upload-csv-input"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Email</TableHead>
                        <TableHead>Codes Used</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Available Limit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentMembers.map((member) => {
                        const memberUsage = initialTeamMemberUsage.find(usage => usage.memberId === member.id);
                        const currentLimit = teamLimits.maxCreditPerUser;
                        const usageAmount = memberUsage?.usedCredit || 0;
                        const availableLimit = currentLimit - usageAmount;
                        return (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium"><Link to={`/team/members/${member.id}`} className="text-blue-600 hover:underline">{member.email}</Link></TableCell>
                            <TableCell>{memberUsage?.codesUsed || 0}</TableCell>
                            <TableCell className="text-red-600">-${usageAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-green-600">${availableLimit.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleResetLimit(member.email)}>
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Reset Limit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                    <User className="mr-2 h-4 w-4" /> Edit Member
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDeleteMember(member.id, member.email)} className="text-red-600">
                                    <X className="mr-2 h-4 w-4" /> Delete Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex">
                    {renderPaginationButtons()}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>

                <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-member-email">Email</Label>
                        <Input
                          id="edit-member-email"
                          type="email"
                          value={editingMember?.email || ''}
                          onChange={(e) => setEditingMember(prev => prev ? { ...prev, email: e.target.value } : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-member-referral-code">Referral Code</Label>
                        <Input
                          id="edit-member-referral-code"
                          value={editingMember?.referralCode || ''}
                          onChange={(e) => setEditingMember(prev => prev ? { ...prev, referralCode: e.target.value } : null)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditMemberDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleUpdateMember}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email-controls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Domain Whitelist</CardTitle>
                <p className="text-gray-500">Only allow eSIM top-up codes to be distributed to emails within these domains.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add domain, e.g., example.com"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                  />
                  <Button onClick={addDomain}>Add Domain</Button>
                </div>
                <div className="space-y-2">
                  {domains.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <span>{domain}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeDomain(domain)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Whitelist</CardTitle>
                <p className="text-gray-500">Only allow eSIM top-up codes to be distributed to these specific email addresses.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add emails, separated by commas or new lines"
                  value={bulkEmailWhitelistInput}
                  onChange={(e) => setBulkEmailWhitelistInput(e.target.value)}
                  rows={5}
                />
                <Button onClick={addEmailToWhitelist}>Add Emails to Whitelist</Button>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search whitelisted emails..."
                    value={whitelistSearchTerm}
                    onChange={(e) => setWhitelistSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                  {emailWhitelist.filter(email => email.toLowerCase().includes(whitelistSearchTerm.toLowerCase())).map((email, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span>{email}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeEmailFromWhitelist(email)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                {emailWhitelist.length > 0 && (
                  <div className="text-right">
                    <Button variant="link" className="text-red-600" onClick={clearEmailWhitelist}>Clear All</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Blacklist</CardTitle>
                <p className="text-gray-500">Prevent eSIM top-up codes from being distributed to these specific email addresses.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add emails, separated by commas or new lines"
                  value={bulkEmailBlacklistInput}
                  onChange={(e) => setBulkEmailBlacklistInput(e.target.value)}
                  rows={5}
                />
                <Button onClick={addEmailToBlacklist}>Add Emails to Blacklist</Button>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search blacklisted emails..."
                    value={blacklistSearchTerm}
                    onChange={(e) => setBlacklistSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                  {emailBlacklist.filter(email => email.toLowerCase().includes(blacklistSearchTerm.toLowerCase())).map((email, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span>{email}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeEmailFromBlacklist(email)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                {emailBlacklist.length > 0 && (
                  <div className="text-right">
                    <Button variant="link" className="text-red-600" onClick={clearEmailBlacklist}>Clear All</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeamSettings;
