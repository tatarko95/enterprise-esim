import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

const Permissions = () => {
  const [domainInput, setDomainInput] = useState('');
  const [domains, setDomains] = useState<string[]>(['partner.com', 'example.org']);
  
  const [bulkEmailWhitelistInput, setBulkEmailWhitelistInput] = useState('');
  const [emailWhitelist, setEmailWhitelist] = useState<string[]>(['admin@partner.com', 'manager@example.org']);
  const [whitelistSearchTerm, setWhitelistSearchTerm] = useState('');

  const [bulkEmailBlacklistInput, setBulkEmailBlacklistInput] = useState('');
  const [emailBlacklist, setEmailBlacklist] = useState<string[]>(['blocked@partner.com']);
  const [blacklistSearchTerm, setBlacklistSearchTerm] = useState('');

  const { toast } = useToast();

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

  const filteredWhitelistEmails = emailWhitelist.filter(email =>
    email.toLowerCase().includes(whitelistSearchTerm.toLowerCase())
  );

  const filteredBlacklistEmails = emailBlacklist.filter(email =>
    email.toLowerCase().includes(blacklistSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default Permissions; 