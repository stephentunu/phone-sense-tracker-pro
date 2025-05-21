
import { cn } from '@/lib/utils';
import { Home, PhoneCall, Map, Users, Activity, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavItem {
  icon: React.ReactElement;
  label: string;
  path: string;
}

export const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems: NavItem[] = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/' },
    { icon: <PhoneCall className="h-5 w-5" />, label: 'Call History', path: '/calls' },
    { icon: <Map className="h-5 w-5" />, label: 'Location Tracking', path: '/location' },
    { icon: <Users className="h-5 w-5" />, label: 'Contacts', path: '/contacts' },
    { icon: <Activity className="h-5 w-5" />, label: 'Activity Log', path: '/activity' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-200 ease-in-out",
        isMobile && !open && "-translate-x-full",
        !isMobile && "relative transform-none"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <h1 className="text-xl font-bold bg-clip-text text-transparent phone-tracker-gradient">PhoneSense</h1>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </div>
      
      <nav className="p-2 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              location.pathname === item.path ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""
            )}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                onOpenChange(false);
              }
            }}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </nav>
      
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Separator className="my-4" />
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            PhoneSense Tracker v1.0
          </div>
        </div>
      </div>
    </aside>
  );
};
