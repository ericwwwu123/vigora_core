import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  ListTodo, 
  Brain, 
  MapPin, 
  Bell, 
  Settings 
} from 'lucide-react';

export default function NavBar() {
  const [location] = useLocation();
  
  // Helper to determine if link is active
  const isActive = (path: string): boolean => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-[#161a1d] border-b border-gray-800 px-6 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-primary font-bold text-xl">VIGORA CORE</div>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">BETA</span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex space-x-8">
          <Link href="/dashboard">
            <a className={`nav-link ${isActive('/dashboard') || isActive('/') ? 'active text-white' : 'text-gray-400'} font-medium relative`}>
              Dashboard
            </a>
          </Link>
          <Link href="/tasks">
            <a className={`nav-link ${isActive('/tasks') ? 'active text-white' : 'text-gray-400'} font-medium relative`}>
              Tasks
            </a>
          </Link>
          <Link href="/insights">
            <a className={`nav-link ${isActive('/insights') ? 'active text-white' : 'text-gray-400'} font-medium relative`}>
              Insights
            </a>
          </Link>
          <Link href="/tracks">
            <a className={`nav-link ${isActive('/tracks') ? 'active text-white' : 'text-gray-400'} font-medium relative`}>
              Tracks
            </a>
          </Link>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 bg-primary text-white">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
