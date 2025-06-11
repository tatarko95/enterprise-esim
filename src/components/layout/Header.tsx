import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  // Dummy user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    balance: '1,250.00',
    avatarUrl: 'https://github.com/shadcn.png',
  };

  // Top Up related state and functions
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');

  const { toast } = useToast();

  const fixedAmounts = [
    { credits: 50, usd: 50 },
    { credits: 100, usd: 100 },
    { credits: 300, usd: 300 },
    { credits: 500, usd: 500 },
    { credits: 1000, usd: 1000 },
    { credits: 3000, usd: 3000 },
  ];

  const handleTopUp = (amount: number) => {
    if (!paymentMethod) {
      toast({
        title: "Select payment method",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'stripe' && (!cardNumber || !expiryDate || !cvc)) {
      toast({
        title: "Missing credit card details",
        description: "Please fill in all credit card information.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'pelago' && !cryptoAddress) {
      toast({
        title: "Missing crypto address",
        description: "Please enter the crypto address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Top-up initiated",
      description: `Processing $${amount} top-up via ${paymentMethod}`,
    });

    // Reset fields
    setTopUpAmount('');
    setPaymentMethod('');
    setCardNumber('');
    setExpiryDate('');
    setCvc('');
    setCryptoAddress('');
    setIsTopUpDialogOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 fixed top-0 z-10 left-0 right-0 lg:left-64">
      <div className="flex items-center justify-end h-full px-6">
        <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 px-4 mr-3 bg-black text-white hover:bg-gray-800 rounded-md text-sm font-medium">Top Up</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl p-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Top Up Credits</DialogTitle>
              <p className="text-gray-600 text-sm mt-2">
                User can top up credits by paying in US$. By default, 1 Credit = $1. Special rate can
                be applied for promotional purpose.
              </p>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Quick Top-Up</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {fixedAmounts.map((item) => (
                    <Button
                      key={item.credits}
                      variant={topUpAmount === String(item.credits) ? "default" : "outline"}
                      onClick={() => {
                        setTopUpAmount(String(item.credits));
                      }}
                      className="h-16 flex flex-col items-center justify-center text-center space-y-0.5"
                    >
                      <span className="text-sm font-medium">{item.credits} Credits</span>
                      <span className="text-xs text-gray-500">${item.usd} USD</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-amount" className="text-base font-semibold">Custom Amount ($10 - $9,999)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="10"
                    max="9999"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="mt-1 h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="mt-1 h-12 text-lg">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Credit Card (Stripe)</SelectItem>
                      <SelectItem value="pelago">Crypto (Pelago)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {paymentMethod === 'stripe' && (
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Credit Card Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input
                        id="expiry-date"
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="XXX"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'pelago' && (
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Crypto Payment Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="crypto-address">Wallet Address</Label>
                    <Input
                      id="crypto-address"
                      type="text"
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      placeholder="Enter your wallet address"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Please send the exact amount to the address above. Your credits will be added once the transaction is confirmed.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => topUpAmount && handleTopUp(parseInt(topUpAmount))}
                disabled={!topUpAmount || !paymentMethod}
                className="h-12 text-lg px-6"
              >
                Top Up ${topUpAmount || '0'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="inline-flex items-center space-x-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatarUrl} alt="@shadcn" />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm truncate min-w-0">{user.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Balance: ${user.balance}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }} className="cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
