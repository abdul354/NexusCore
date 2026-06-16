import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  Network,
  Shield,
  FileCheck,
  BarChart3,
  Settings,
  X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Use the real logo image stored in the imports folder
import logoImg from '@/imports/image.png';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Sparkles, label: 'Features', path: '/features' },
  { icon: Bot, label: 'Agents', path: '/agents' },
  { icon: Network, label: 'Architecture', path: '/architecture' },
  { icon: Shield, label: 'Security', path: '/security' },
  { icon: FileCheck, label: 'Governance', path: '/governance' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <motion.div 
        className={`
          fixed left-0 top-0 h-screen w-64 border-r border-black/10 bg-white flex flex-col z-50 transition-transform duration-300 ease-in-out
          md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo and Mobile Close button */}
        <div className="px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ImageWithFallback
              src={logoImg}
              alt="NexusCore logo"
              className="w-8 h-8 object-contain rounded-md"
            />
            <span className="text-[15px] font-[600] tracking-tight">NexusCore</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-[500] transition-colors cursor-pointer
                  ${isActive
                    ? 'bg-gray-100 text-black font-[600]'
                    : 'bg-transparent text-black/60 hover:bg-gray-100 hover:text-black'
                  }
                `}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-black/10">
          <div className="text-[11px] text-black/40 font-[500]">
            v1.0.0
          </div>
        </div>
      </motion.div>
    </>
  );
}
