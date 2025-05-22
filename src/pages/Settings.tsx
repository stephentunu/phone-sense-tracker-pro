
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Bell,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Lock,
  UserCog
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    callAlerts: true,
    messageAlerts: true,
    locationAlerts: true,
    appUsageAlerts: false,
    dailySummary: true,
    emailNotifications: false,
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    storeLocationHistory: true,
    storeCalls: true,
    storeMessages: true,
    dataRetentionDays: 30,
  });
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email: 'user@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };
  
  const handlePrivacyChange = (key: keyof typeof privacySettings) => {
    if (typeof privacySettings[key] === 'boolean') {
      setPrivacySettings({
        ...privacySettings,
        [key]: !privacySettings[key],
      });
    } else {
      setPrivacySettings({
        ...privacySettings,
        [key]: (event.target as HTMLInputElement).value,
      });
    }
  };
  
  const handleSaveSettings = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleChangePassword = () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    
    if (!accountSettings.currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully",
      });
      setIsSubmitting(false);
      setAccountSettings({
        ...accountSettings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1000);
  };
  
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notification Settings
            </CardTitle>
            <CardDescription>
              Control how and when you receive alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Call Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about incoming and missed calls
                </p>
              </div>
              <Switch 
                checked={notificationSettings.callAlerts} 
                onCheckedChange={() => handleNotificationChange('callAlerts')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Message Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new messages
                </p>
              </div>
              <Switch 
                checked={notificationSettings.messageAlerts} 
                onCheckedChange={() => handleNotificationChange('messageAlerts')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Location Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when location changes
                </p>
              </div>
              <Switch 
                checked={notificationSettings.locationAlerts} 
                onCheckedChange={() => handleNotificationChange('locationAlerts')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">App Usage Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when specific apps are used
                </p>
              </div>
              <Switch 
                checked={notificationSettings.appUsageAlerts} 
                onCheckedChange={() => handleNotificationChange('appUsageAlerts')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Daily Summary</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a daily summary of all activity
                </p>
              </div>
              <Switch 
                checked={notificationSettings.dailySummary} 
                onCheckedChange={() => handleNotificationChange('dailySummary')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch 
                checked={notificationSettings.emailNotifications} 
                onCheckedChange={() => handleNotificationChange('emailNotifications')}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Privacy Settings
            </CardTitle>
            <CardDescription>
              Control what data is stored and for how long
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Store Location History</Label>
                <p className="text-sm text-muted-foreground">
                  Keep records of tracked phone locations
                </p>
              </div>
              <Switch 
                checked={privacySettings.storeLocationHistory} 
                onCheckedChange={() => handlePrivacyChange('storeLocationHistory')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Store Call Records</Label>
                <p className="text-sm text-muted-foreground">
                  Keep records of phone calls
                </p>
              </div>
              <Switch 
                checked={privacySettings.storeCalls} 
                onCheckedChange={() => handlePrivacyChange('storeCalls')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Store Message Records</Label>
                <p className="text-sm text-muted-foreground">
                  Keep records of messages
                </p>
              </div>
              <Switch 
                checked={privacySettings.storeMessages} 
                onCheckedChange={() => handlePrivacyChange('storeMessages')}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="dataRetention">Data Retention (days)</Label>
              <Input
                id="dataRetention"
                type="number"
                min="1"
                max="365"
                value={privacySettings.dataRetentionDays}
                onChange={(e) => setPrivacySettings({
                  ...privacySettings,
                  dataRetentionDays: parseInt(e.target.value) || 30
                })}
              />
              <p className="text-xs text-muted-foreground">
                Data older than this will be automatically deleted
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" /> Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account information and security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={accountSettings.email}
                onChange={(e) => setAccountSettings({
                  ...accountSettings,
                  email: e.target.value
                })}
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="font-medium">Change Password</h3>
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={accountSettings.currentPassword}
                  onChange={(e) => setAccountSettings({
                    ...accountSettings,
                    currentPassword: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={accountSettings.newPassword}
                  onChange={(e) => setAccountSettings({
                    ...accountSettings,
                    newPassword: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={accountSettings.confirmPassword}
                  onChange={(e) => setAccountSettings({
                    ...accountSettings,
                    confirmPassword: e.target.value
                  })}
                />
              </div>
              
              <Button 
                onClick={handleChangePassword} 
                disabled={isSubmitting || !accountSettings.currentPassword || !accountSettings.newPassword || !accountSettings.confirmPassword}
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
