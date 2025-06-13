import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PhoneTrackingService } from '@/services/phoneTrackingService';
import { Settings, Shield, Key, Globe, Apple, Smartphone } from 'lucide-react';

interface TrackingConfig {
  provider: 'life360' | 'google' | 'apple' | 'custom';
  credentials: {
    life360?: { username: string; password: string };
    google?: { apiKey: string };
    apple?: { teamId: string; keyId: string; privateKey: string };
    custom?: { apiUrl: string; apiKey: string };
  };
}

interface TrackingProviderConfigProps {
  onConfigSaved?: (config: TrackingConfig) => void;
}

const TrackingProviderConfig = ({ onConfigSaved }: TrackingProviderConfigProps) => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<TrackingConfig['provider']>('life360');
  const [config, setConfig] = useState<TrackingConfig>({
    provider: 'life360',
    credentials: {}
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleProviderChange = (provider: TrackingConfig['provider']) => {
    setSelectedProvider(provider);
    setConfig({
      provider,
      credentials: {}
    });
  };

  const handleCredentialChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [selectedProvider]: {
          ...prev.credentials[selectedProvider],
          [field]: value
        }
      }
    }));
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // Validate configuration
      const credentials = config.credentials[selectedProvider];
      if (!credentials) {
        throw new Error('Please fill in all required credentials');
      }

      // Validate specific provider requirements
      switch (selectedProvider) {
        case 'life360':
          const life360Creds = credentials as { username?: string; password?: string };
          if (!life360Creds.username || !life360Creds.password) {
            throw new Error('Life360 requires username and password');
          }
          break;
        case 'google':
          const googleCreds = credentials as { apiKey?: string };
          if (!googleCreds.apiKey) {
            throw new Error('Google Find My requires API key');
          }
          break;
        case 'apple':
          const appleCreds = credentials as { teamId?: string; keyId?: string; privateKey?: string };
          if (!appleCreds.teamId || !appleCreds.keyId || !appleCreds.privateKey) {
            throw new Error('Apple Find My requires Team ID, Key ID, and Private Key');
          }
          break;
        case 'custom':
          const customCreds = credentials as { apiUrl?: string; apiKey?: string };
          if (!customCreds.apiUrl || !customCreds.apiKey) {
            throw new Error('Custom provider requires API URL and API key');
          }
          break;
      }

      // Initialize the tracking service with the configuration
      PhoneTrackingService.initialize(config);

      toast({
        title: "Configuration Saved",
        description: `Successfully configured ${selectedProvider} tracking provider`,
      });

      onConfigSaved?.(config);
    } catch (error) {
      console.error('Configuration error:', error);
      toast({
        title: "Configuration Error",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderProviderForm = () => {
    const credentials = config.credentials[selectedProvider] || {};

    switch (selectedProvider) {
      case 'life360':
        const life360Creds = credentials as { username?: string; password?: string };
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Life360 Username/Email</Label>
              <Input
                id="username"
                type="email"
                placeholder="your.email@example.com"
                value={life360Creds.username || ''}
                onChange={(e) => handleCredentialChange('username', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Life360 Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your Life360 password"
                value={life360Creds.password || ''}
                onChange={(e) => handleCredentialChange('password', e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Life360 is a family tracking service. You need:</p>
              <ul className="list-disc list-inside mt-1">
                <li>A Life360 account with family members added</li>
                <li>Family members must have Life360 app installed</li>
                <li>Location sharing enabled in the app</li>
              </ul>
            </div>
          </div>
        );

      case 'google':
        const googleCreds = credentials as { apiKey?: string };
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">Google API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="AIza..."
                value={googleCreds.apiKey || ''}
                onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Google Find My Device requires:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Google Cloud Console project with Find My Device API enabled</li>
                <li>OAuth 2.0 credentials configured</li>
                <li>Android devices with Find My Device enabled</li>
                <li>Proper device permissions and authentication</li>
              </ul>
            </div>
          </div>
        );

      case 'apple':
        const appleCreds = credentials as { teamId?: string; keyId?: string; privateKey?: string };
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamId">Apple Team ID</Label>
              <Input
                id="teamId"
                placeholder="ABC123DEF4"
                value={appleCreds.teamId || ''}
                onChange={(e) => handleCredentialChange('teamId', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="keyId">Key ID</Label>
              <Input
                id="keyId"
                placeholder="XYZ123ABC4"
                value={appleCreds.keyId || ''}
                onChange={(e) => handleCredentialChange('keyId', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="privateKey">Private Key</Label>
              <Textarea
                id="privateKey"
                placeholder="-----BEGIN PRIVATE KEY-----..."
                value={appleCreds.privateKey || ''}
                onChange={(e) => handleCredentialChange('privateKey', e.target.value)}
                rows={6}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Apple Find My requires:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Apple Developer account</li>
                <li>Find My API access enabled</li>
                <li>Private key from Apple Developer console</li>
                <li>iOS devices with Find My enabled</li>
              </ul>
            </div>
          </div>
        );

      case 'custom':
        const customCreds = credentials as { apiUrl?: string; apiKey?: string };
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiUrl">API URL</Label>
              <Input
                id="apiUrl"
                placeholder="https://api.yourtracking.com"
                value={customCreds.apiUrl || ''}
                onChange={(e) => handleCredentialChange('apiUrl', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Your API key"
                value={customCreds.apiKey || ''}
                onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Custom tracking service should provide:</p>
              <ul className="list-disc list-inside mt-1">
                <li>RESTful API with authentication</li>
                <li>POST /devices/location endpoint</li>
                <li>JSON response with location data</li>
                <li>Proper error handling and rate limiting</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'life360':
        return <Shield className="h-5 w-5" />;
      case 'google':
        return <Globe className="h-5 w-5" />;
      case 'apple':
        return <Apple className="h-5 w-5" />;
      case 'custom':
        return <Key className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Tracking Provider Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="provider">Select Tracking Provider</Label>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a tracking provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="life360">
                <div className="flex items-center gap-2">
                  {getProviderIcon('life360')}
                  Life360 Family Tracker
                </div>
              </SelectItem>
              <SelectItem value="google">
                <div className="flex items-center gap-2">
                  {getProviderIcon('google')}
                  Google Find My Device
                </div>
              </SelectItem>
              <SelectItem value="apple">
                <div className="flex items-center gap-2">
                  {getProviderIcon('apple')}
                  Apple Find My
                </div>
              </SelectItem>
              <SelectItem value="custom">
                <div className="flex items-center gap-2">
                  {getProviderIcon('custom')}
                  Custom Tracking Service
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderProviderForm()}

        <Button 
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving Configuration...' : 'Save Configuration'}
        </Button>

        <div className="p-4 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-2">🔒 Security Notice:</p>
          <p>Your tracking provider credentials are stored locally and never sent to our servers. 
          All location requests are made directly from your browser to the tracking service.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingProviderConfig;