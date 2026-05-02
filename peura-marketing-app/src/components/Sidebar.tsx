'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Calendar, LayoutDashboard, Play, Settings, Sparkles, CheckCircle2, Menu, X, Rocket, Target, Layers, Plus, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeProvider';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Smart Calendar', icon: Calendar, path: '/', id: 'calendar' },
    { label: 'The Peura Journal', icon: Layers, path: '/blog', id: 'blog' },
    { label: 'Create Blog', icon: Plus, path: '/blog/create', id: 'blog-create' },
    { label: '30-Day Launch', icon: Rocket, path: '/action-plan', id: 'action-plan', badge: 'New' },
    { label: 'Brand FAQs', icon: HelpCircle, path: '/faqs', id: 'faqs' },
    { label: 'CreatedPeura', icon: CheckCircle2, path: '/created', id: 'created' },
    { label: 'Creative Studio', icon: Sparkles, path: '/creative-studio', id: 'studio' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-40">
        <div className="text-xl font-black uppercase tracking-wider text-black dark:text-white">
          Peura <span className="text-accent">AI</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-8 shadow-2xl lg:shadow-sm flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex justify-between items-center mb-12">
          <div className="text-2xl font-black uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            Peura <span className="text-accent">AI</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button 
              key={item.id}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium group ${isActive(item.path) ? 'bg-amber-50 dark:bg-amber-900/20 text-accent' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-accent'}`}
              onClick={() => { router.push(item.path); setIsOpen(false); }}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive(item.path) ? 'text-accent' : 'group-hover:text-accent transition-colors'} />
                {item.label}
              </div>
              {item.badge && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-accent text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Theme</span>
              <ThemeToggle />
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium">
                <Settings size={20} /> Settings
            </button>
        </div>
      </aside>
    </>
  );
}
