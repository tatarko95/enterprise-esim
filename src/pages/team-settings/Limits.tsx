import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Limits = () => {
  const [maxRequestLimit, setMaxRequestLimit] = useState('1000.00');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setMaxRequestLimit(value);
    }
  };

  const saveLimitSettings = () => {
    toast({
      title: "Limit Saved",
      description: `Maximum request limit has been set to $${maxRequestLimit}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maximum Limit per User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="max-limit">Maximum Request Limit per User ($)</Label>
            <div className="relative mt-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="max-limit"
                type="text"
                value={maxRequestLimit}
                onChange={handleInputChange}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Maximum dollar amount of eSIM Top-Up Codes each user can request.
            </p>
          </div>
          <Button onClick={saveLimitSettings}>
            Save Limit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Limits; 