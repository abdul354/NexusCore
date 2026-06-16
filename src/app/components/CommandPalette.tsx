import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router';
import { 
  Search, 
  LayoutDashboard, 
  Sparkles, 
  Bot, 
  Network, 
  Shield, 
  FileCheck, 
  BarChart3, 
  Settings,
  Play,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLaunchWorkflow: () => void;
  onViewArchitecture: () => void;
}

export function CommandPalette({ 
  isOpen, 
  setIsOpen,
  onLaunchWorkflow,
  onViewArchitecture
}: CommandPaletteProps) {
  const navigate = useNavigate();

  // Keyboard shortcut to toggle the menu
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const runCommand = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Container */}
      <Command 
        className="relative w-full max-w-[540px] bg-white border border-black/10 rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200"
        label="Global Command Menu"
      >
        <div className="flex items-center border-b border-black/5 px-4">
          <Search className="w-[18px] h-[18px] text-black/40 mr-3 shrink-0" strokeWidth={1.5} />
          <Command.Input 
            placeholder="Type a command or search..."
            className="w-full py-4 bg-transparent text-[14px] text-black placeholder-black/40 border-none outline-none focus:outline-none focus:ring-0 !outline-none"
            autoFocus
            style={{ outline: 'none' }}
          />
        </div>

        <Command.List className="max-h-[330px] overflow-y-auto p-2 space-y-1">
          <Command.Empty className="px-4 py-8 text-center text-[13px] text-black/40 font-[500]">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="text-[10px] font-[600] text-black/40 px-3 py-1.5 uppercase tracking-wider">
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/'))}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-black/80 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors data-[selected=true]:bg-gray-100 data-[selected=true]:text-black outline-none"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-[16px] h-[16px] text-black/60" strokeWidth={1.5} />
                <span>Go to Dashboard</span>
              </div>
              <kbd className="text-[10px] text-black/30 font-[500]">G D</kbd>
            </Command.Item>

            <Command.Item 
              onSelect={() => runCommand(() => navigate('/features'))}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-black/80 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors data-[selected=true]:bg-gray-100 data-[selected=true]:text-black outline-none"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-[16px] h-[16px] text-black/60" strokeWidth={1.5} />
                <span>Go to Features</span>
              </div>
              <kbd className="text-[10px] text-black/30 font-[500]">G F</kbd>
            </Command.Item>

            <Command.Item 
              onSelect={() => runCommand(() => navigate('/agents'))}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-black/80 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors data-[selected=true]:bg-gray-100 data-[selected=true]:text-black outline-none"
            >
              <div className="flex items-center gap-3">
                <Bot className="w-[16px] h-[16px] text-black/60" strokeWidth={1.5} />
                <span>Go to Agents</span>
              </div>
              <kbd className="text-[10px] text-black/30 font-[500]">G A</kbd>
            </Command.Item>

            <Command.Item 
              onSelect={() => runCommand(() => navigate('/settings'))}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-black/80 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors data-[selected=true]:bg-gray-100 data-[selected=true]:text-black outline-none"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-[16px] h-[16px] text-black/60" strokeWidth={1.5} />
                <span>Go to Settings</span>
              </div>
              <kbd className="text-[10px] text-black/30 font-[500]">G S</kbd>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Quick Actions" className="text-[10px] font-[600] text-black/40 px-3 py-1.5 uppercase tracking-wider border-t border-black/5 mt-2 pt-2">
            <Command.Item 
              onSelect={() => runCommand(onLaunchWorkflow)}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-black/80 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors data-[selected=true]:bg-gray-100 data-[selected=true]:text-black outline-none"
            >
              <div className="flex items-center gap-3">
                <Play className="w-[16px] h-[16px] text-black/60" strokeWidth={1.5} />
                <span>Launch Workflow</span>
              </div>
              <kbd className="text-[10px] text-black/30 font-[500]">⏎</kbd>
            </Command.Item>

            <Command.Item 
              onSelect={() => runCommand(onViewArchitecture)}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-black/80 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors data-[selected=true]:bg-gray-100 data-[selected=true]:text-black outline-none"
            >
              <div className="flex items-center gap-3">
                <ArrowRight className="w-[16px] h-[16px] text-black/60" strokeWidth={1.5} />
                <span>View Architecture</span>
              </div>
              <kbd className="text-[10px] text-black/30 font-[500]">⌥ A</kbd>
            </Command.Item>
          </Command.Group>
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/5 px-4 py-2.5 bg-[#f7f7f7] text-[11px] text-black/40 font-[500]">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="bg-white border border-black/10 px-1 py-0.5 rounded shadow-sm">↑↓</kbd> to navigate</span>
            <span><kbd className="bg-white border border-black/10 px-1 py-0.5 rounded shadow-sm">enter</kbd> to select</span>
          </div>
          <span>Esc to close</span>
        </div>
      </Command>
    </div>
  );
}
