import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();

  // State for Account Information
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@example.com');

  // State for Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // State for Credit Cards (dummy data)
  const [creditCards, setCreditCards] = useState([
    { id: 'card1', last4: '1234', type: 'Visa', expiry: '12/26' },
    { id: 'card2', last4: '5678', type: 'Mastercard', expiry: '08/25' },
  ]);

  const handleSaveAccountInfo = () => {
    toast({
      title: "Account Info Saved",
      description: "Your account information has been updated.",
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }
    // Add password change logic here
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleAddCreditCard = () => {
    toast({
      title: "Add Credit Card",
      description: "Functionality to add credit card.",
    });
    // Implement credit card addition flow
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  disabled
                />
              </div>
            </div>
            <Button onClick={handleSaveAccountInfo}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {creditCards.length > 0 ? (
              <div className="space-y-2">
                {creditCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 border rounded-md">
                    <span>{card.type} ending in {card.last4} (Exp: {card.expiry})</span>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No credit cards added yet.</p>
            )}
            <Button onClick={handleAddCreditCard}>Add New Credit Card</Button>
          </CardContent>
        </Card>

        {/* Other Settings Example: Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input type="checkbox" id="emailNotifications" className="h-4 w-4" />
              <Label htmlFor="emailNotifications">Receive email notifications</Label>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default Settings; 