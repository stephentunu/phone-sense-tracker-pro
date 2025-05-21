
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main 
          className={cn(
            "flex-1 overflow-auto p-4 sm:p-6 transition-all",
            isMobile && sidebarOpen && "opacity-50"
          )}
          onClick={() => isMobile && sidebarOpen && setSidebarOpen(false)}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
