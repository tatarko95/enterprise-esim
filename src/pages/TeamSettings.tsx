import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
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
import { PlusCircle, MoreHorizontal, User, Mail, Code, X, Upload } from 'lucide-react';
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
import { TeamUsage, TeamLimits } from '@/data/teamUsageAndLimits';

const TeamSettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const { teamUsage, teamLimits, updateTeamLimits } = useTeamUsageAndLimits();

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

  // State for Usage & Limits tab
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

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = teamMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(teamMembers.length / membersPerPage);

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

  // Functions for Usage & Limits tab
  const handleLimitInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditingLimits(prevLimits => ({ ...prevLimits, [id]: parseFloat(value) || 0 }));
  };

  const handleSaveLimits = () => {
    updateTeamLimits(editingLimits);
    toast({
      title: "Limits Updated",
      description: "Team usage limits have been updated successfully.",
    });
  };

  const filteredWhitelistEmails = emailWhitelist.filter(email =>
    email.toLowerCase().includes(whitelistSearchTerm.toLowerCase())
  );

  const filteredBlacklistEmails = emailBlacklist.filter(email =>
    email.toLowerCase().includes(blacklistSearchTerm.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n');
        const teamMembers = rows.map(row => {
          const [email, referralCode] = row.split(',');
          return {
            email: email.trim(),
            referralCode: referralCode.trim(),
          };
        });
        teamMembers.forEach(member => addTeamMember(member));
        toast({
          title: "Team Members Added",
          description: `${teamMembers.length} team members have been added.`,
        });
        setNewMemberEmail('');
        setNewMemberReferralCode('');
        setIsAddMemberDialogOpen(false);
      };
      reader.readAsText(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Settings</h1>
          <p className="text-gray-600">Manage team members, email controls, usage, and limits.</p>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="h-9 bg-white w-full justify-start">
            <TabsTrigger 
              value="members" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Members ({teamMembers.length})
            </TabsTrigger>
            <TabsTrigger 
              value="email-controls"
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Email Controls
            </TabsTrigger>
            <TabsTrigger 
              value="usage-limits"
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Usage & Limits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  <div className="flex space-x-2">
                    <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add New Team Member</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Team Member</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                              placeholder="Enter member's email"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="referralCode">Referral Code</Label>
                            <Input
                              id="referralCode"
                              type="text"
                              value={newMemberReferralCode}
                              onChange={(e) => setNewMemberReferralCode(e.target.value)}
                              placeholder="Enter referral code"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleAddMember}>Add Member</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button size="sm" onClick={() => document.getElementById('csv-upload')?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> Upload .csv
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search team members..."
                  value={memberSearchTerm}
                  onChange={(e) => setMemberSearchTerm(e.target.value)}
                  className="mb-4 max-w-sm"
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Referral Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMembers.length > 0 ? (
                      currentMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.email}</TableCell>
                          <TableCell>{member.referralCode}</TableCell>
                          <TableCell>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.status === 'Active' ? 'bg-green-100 text-green-800' :
                              member.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditMember(member)}>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteMember(member.id, member.email)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No team members found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Team Member</DialogTitle>
                </DialogHeader>
                {editingMember && (
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editingMember.email}
                        onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-referralCode">Referral Code</Label>
                      <Input
                        id="edit-referralCode"
                        type="text"
                        value={editingMember.referralCode}
                        onChange={(e) => setEditingMember({ ...editingMember, referralCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select
                        value={editingMember.status}
                        onValueChange={(value) => setEditingMember({ ...editingMember, status: value as TeamMember['status'] })}
                      >
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit" onClick={handleUpdateMember}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="email-controls" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Whitelist & Blacklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Domain Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="domain-input">Add Domain</Label>
                        <div className="flex space-x-2 mt-1">
                          <Input
                            id="domain-input"
                            type="text"
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                            placeholder="example.com"
                          />
                          <Button onClick={addDomain}>Add</Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Any email with this domain can request "eSIM Top-Up Code"
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Whitelisted Domains</h3>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          {domains.map((domain, index) => (
                            <li key={index} className="flex items-center justify-between">
                              {domain}
                              <Button variant="ghost" size="sm" onClick={() => removeDomain(domain)}>
                                Remove
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Whitelist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email-whitelist-input">Add Emails to Whitelist</Label>
                      <div className="flex space-x-2 mt-1">
                        <Textarea
                          id="email-whitelist-input"
                          value={bulkEmailWhitelistInput}
                          onChange={(e) => setBulkEmailWhitelistInput(e.target.value)}
                          placeholder="Enter emails, separated by commas or new lines (e.g., user1@example.com, user2@example.com)"
                          rows={5}
                        />
                        <Button onClick={addEmailToWhitelist} className="shrink-0">Add Emails</Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        All the emails in this list can request "eSIM Top-Up Code"
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Whitelisted Emails ({emailWhitelist.length})</h3>
                        <Button variant="outline" size="sm" onClick={clearEmailWhitelist} disabled={emailWhitelist.length === 0}>Clear All</Button>
                      </div>
                      <Input
                        type="text"
                        placeholder="Search whitelisted emails..."
                        value={whitelistSearchTerm}
                        onChange={(e) => setWhitelistSearchTerm(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[80px]">
                        {filteredWhitelistEmails.length > 0 ? (
                          filteredWhitelistEmails.map((email) => (
                            <span
                              key={email}
                              className="flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                            >
                              {email}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-5 h-5 ml-1 rounded-full hover:bg-gray-200"
                                onClick={() => removeEmailFromWhitelist(email)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No whitelisted emails found.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Blacklist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email-blacklist-input">Add Emails to Blacklist</Label>
                      <div className="flex space-x-2 mt-1">
                        <Textarea
                          id="email-blacklist-input"
                          value={bulkEmailBlacklistInput}
                          onChange={(e) => setBulkEmailBlacklistInput(e.target.value)}
                          placeholder="Enter emails, separated by commas or new lines (e.g., user1@example.com, user2@example.com)"
                          rows={5}
                        />
                        <Button onClick={addEmailToBlacklist} className="shrink-0">Add Emails</Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Users in blacklist can't successfully request "eSIM Top-Up Code" even if they meet domain verification.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Blacklisted Emails ({emailBlacklist.length})</h3>
                        <Button variant="outline" size="sm" onClick={clearEmailBlacklist} disabled={emailBlacklist.length === 0}>Clear All</Button>
                      </div>
                      <Input
                        type="text"
                        placeholder="Search blacklisted emails..."
                        value={blacklistSearchTerm}
                        onChange={(e) => setBlacklistSearchTerm(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[80px]">
                        {filteredBlacklistEmails.length > 0 ? (
                          filteredBlacklistEmails.map((email) => (
                            <span
                              key={email}
                              className="flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                            >
                              {email}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-5 h-5 ml-1 rounded-full hover:bg-gray-200"
                                onClick={() => removeEmailFromBlacklist(email)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No blacklisted emails found.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage-limits" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage & Limits Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Usage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Used: {teamUsage.totalDataUsedGB} GB</p>
                        <p className="text-sm font-medium">Limit: {teamLimits.maxDataGB} GB</p>
                      </div>
                      <Progress value={(teamUsage.totalDataUsedGB / teamLimits.maxDataGB) * 100} className="h-2" />
                      <p className="text-xs text-gray-500 mt-2">{(teamLimits.maxDataGB - teamUsage.totalDataUsedGB)} GB remaining</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Credits Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Used: {teamUsage.totalCreditsUsed} Credits</p>
                        <p className="text-sm font-medium">Limit: {teamLimits.maxCredits} Credits</p>
                      </div>
                      <Progress value={(teamUsage.totalCreditsUsed / teamLimits.maxCredits) * 100} className="h-2" />
                      <p className="text-xs text-gray-500 mt-2">{(teamLimits.maxCredits - teamUsage.totalCreditsUsed)} Credits remaining</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Configure Limits */}
                <Card>
                  <CardHeader>
                    <CardTitle>Configure Limits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxDataGB">Total Team Data Limit (GB)</Label>
                        <Input
                          id="maxDataGB"
                          type="number"
                          min="0"
                          value={editingLimits.maxDataGB}
                          onChange={handleLimitInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxCredits">Total Team Credits Limit</Label>
                        <Input
                          id="maxCredits"
                          type="number"
                          min="0"
                          value={editingLimits.maxCredits}
                          onChange={handleLimitInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="defaultMemberDataLimitGB">Default Member Data Limit (GB)</Label>
                        <Input
                          id="defaultMemberDataLimitGB"
                          type="number"
                          min="0"
                          value={editingLimits.defaultMemberDataLimitGB}
                          onChange={handleLimitInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="defaultMemberCreditLimit">Default Member Credits Limit</Label>
                        <Input
                          id="defaultMemberCreditLimit"
                          type="number"
                          min="0"
                          value={editingLimits.defaultMemberCreditLimit}
                          onChange={handleLimitInputChange}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveLimits}>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeamSettings;
