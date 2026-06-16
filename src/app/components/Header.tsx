import { motion } from 'motion/react';
import { Search, Bell, Command, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';

import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';
import { useNavigate } from 'react-router';

interface HeaderProps {
  onToggleSidebar: () => void;
  onSearchClick: () => void;
}

export function Header({ onToggleSidebar, onSearchClick }: HeaderProps) {
  const navigate = useNavigate();

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
          <Popover>
            <PopoverTrigger asChild>
              <motion.button 
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] transition-colors relative cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-[18px] h-[18px] text-black/60" strokeWidth={1.5} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 border border-black/10 shadow-xl rounded-xl bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-[#f7f7f7]/50">
                <h3 className="text-[14px] font-[600] text-black">Notifications</h3>
                <span className="text-[11px] font-[600] text-black/40 bg-black/5 px-2 py-0.5 rounded-md">0 new</span>
              </div>
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
                  <Bell className="w-5 h-5 text-black/40" />
                </div>
                <p className="text-[14px] font-[600] text-black mb-1">You're all caught up</p>
                <p className="text-[13px] font-[500] text-black/50">No new notifications to show right now.</p>
              </div>
            </PopoverContent>
          </Popover>

          {/* Command Palette */}
          <motion.button 
            onClick={onSearchClick}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Command className="w-[18px] h-[18px] text-black/60" strokeWidth={1.5} />
          </motion.button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#f7f7f7] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black/20">
                <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-[12px] font-[600]">JD</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-black/10">
              <DropdownMenuLabel className="font-normal py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-[14px] font-medium leading-none text-black">John Doe</p>
                  <p className="text-[12px] leading-none text-black/50">john.doe@nexuscore.ai</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/5 my-1" />
              <DropdownMenuItem className="cursor-pointer text-[13px] py-2 rounded-lg focus:bg-[#f7f7f7]">
                <User className="mr-2 h-4 w-4 text-black/60" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-[13px] py-2 rounded-lg focus:bg-[#f7f7f7]"
                onClick={() => navigate('/settings')}
              >
                <Settings className="mr-2 h-4 w-4 text-black/60" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/5 my-1" />
              <DropdownMenuItem className="cursor-pointer text-[13px] py-2 rounded-lg focus:bg-[#fcf5f5] text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4 text-red-600/70" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
