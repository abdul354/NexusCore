import { motion } from 'motion/react';
import { Search, Bell, Command, ChevronDown, Menu } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onToggleSidebar: () => void;
  onSearchClick: () => void;
}

export function Header({ onToggleSidebar, onSearchClick }: HeaderProps) {
  return (
    <motion.header 
      className="fixed top-0 left-0 md:left-64 right-0 h-16 border-b border-black/10 bg-white/80 backdrop-blur-xl z-40"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className="h-full w-full px-4 md:px-8 flex items-center justify-between">
        {/* Left Side - Workspace Selector */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[#f7f7f7] md:hidden transition-colors mr-1 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-black" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#f7f7f7] transition-colors">
            <span className="text-[14px] font-[500]">Production</span>
            <ChevronDown className="w-4 h-4 text-black/40" />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button 
            onClick={onSearchClick}
            className="flex items-center gap-3 px-3 md:px-4 py-2 rounded-lg border border-black/10 hover:border-black/20 transition-colors min-w-[40px] md:min-w-[280px] cursor-pointer"
          >
            <Search className="w-4 h-4 text-black/40" strokeWidth={1.5} />
            <span className="text-[13px] text-black/40 flex-1 text-left hidden md:inline">Search...</span>
            <div className="hidden md:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[11px] font-[500] bg-[#f7f7f7] rounded border border-black/10">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-[11px] font-[500] bg-[#f7f7f7] rounded border border-black/10">K</kbd>
            </div>
          </button>

          {/* Notifications */}
          <motion.button 
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-[18px] h-[18px] text-black/60" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />
          </motion.button>

          {/* Command Palette */}
          <motion.button 
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Command className="w-[18px] h-[18px] text-black/60" strokeWidth={1.5} />
          </motion.button>

          {/* User Profile */}
          <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#f7f7f7] transition-colors">
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
              <span className="text-white text-[12px] font-[600]">JD</span>
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
