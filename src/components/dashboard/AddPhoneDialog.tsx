
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { detectCountry } from '@/utils/phoneUtils';

interface AddPhoneDialogProps {
  onSuccess?: () => void;
}

export const AddPhoneDialog = ({ onSuccess }: AddPhoneDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [label, setLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    const country = detectCountry(value);
    setDetectedCountry(country ? `${country.flag} ${country.country}` : undefined);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      return toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(true);
    
    try {
      await api.addTrackedNumber(phoneNumber, label || 'Unknown');
      
      toast({
        title: "Success",
        description: "Phone number added successfully",
      });
      
      setOpen(false);
      setPhoneNumber('');
      setLabel('');
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add phone number",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Phone Number</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Phone Number</DialogTitle>
          <DialogDescription>
            Enter the phone number details to start tracking.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={handlePhoneChange}
            />
            {detectedCountry && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{detectedCountry}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="label">Label (Optional)</Label>
            <Input
              id="label"
              placeholder="E.g., John's iPhone"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Phone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
