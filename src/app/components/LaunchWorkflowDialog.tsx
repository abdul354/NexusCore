import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from './ui/dialog';
import { toast } from 'sonner';
import { Play, Sparkles } from 'lucide-react';

interface LaunchWorkflowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchSuccess: (featureName: string, agentName: string) => void;
}

export function LaunchWorkflowDialog({ 
  isOpen, 
  onClose, 
  onLaunchSuccess 
}: LaunchWorkflowDialogProps) {
  const [featureName, setFeatureName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Master Agent');
  const [mode, setMode] = useState('Dry Run');
  const [enableSecurity, setEnableSecurity] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!featureName.trim()) {
      toast.error("Please enter a feature name.");
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay for premium feel
    setTimeout(() => {
      setIsSubmitting(false);
      onLaunchSuccess(featureName, selectedAgent);
      toast.success(`Workflow successfully launched!`, {
        description: `Orchestrating ${selectedAgent} for "${featureName}"`,
      });
      // Reset form
      setFeatureName('');
      setSelectedAgent('Master Agent');
      setMode('Dry Run');
      setEnableSecurity(true);
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f7f7f7] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <DialogTitle className="text-[18px] font-[600] tracking-tight">Launch AI Agent Workflow</DialogTitle>
          </div>
          <DialogDescription className="text-[13px] text-black/60 font-[500] leading-normal">
            Configure and trigger a new autonomous software development run.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          {/* Feature Name Input */}
          <div className="space-y-1.5">
            <label htmlFor="feature-name" className="text-[12px] font-[600] text-black/60 uppercase tracking-wider">
              Feature Description
            </label>
            <input 
              id="feature-name"
              type="text"
              placeholder="e.g. Implement OAuth2 login flow with JWT validation"
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-black/10 text-[13px] outline-none focus:border-black/30 placeholder-black/30 bg-[#f7f7f7]/30 transition-all font-[500]"
              required
            />
          </div>

          {/* Agent Selector */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-[600] text-black/60 uppercase tracking-wider">
              Select Orchestrator Agent
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Master Agent', 'Architect Agent', 'Engineer Agent'].map((agent) => (
                <button
                  key={agent}
                  type="button"
                  onClick={() => setSelectedAgent(agent)}
                  className={`
                    px-3 py-2.5 rounded-md border text-[12px] font-[600] text-center transition-all cursor-pointer
                    ${selectedAgent === agent 
                      ? 'border-black bg-black text-white' 
                      : 'border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black'
                    }
                  `}
                >
                  {agent.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Mode selector */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-[600] text-black/60 uppercase tracking-wider">
              Execution Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Dry Run', 'Production Commit'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`
                    px-3 py-2.5 rounded-md border text-[12px] font-[600] text-center transition-all cursor-pointer
                    ${mode === m 
                      ? 'border-black bg-[#f7f7f7] text-black shadow-inner' 
                      : 'border-black/10 bg-white text-black/60 hover:border-black/20 hover:text-black'
                    }
                  `}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Checkbox Security scan */}
          <div className="flex items-center justify-between p-3 rounded-md bg-[#f7f7f7] border border-black/5">
            <div className="flex flex-col">
              <span className="text-[12px] font-[600] text-black">Enable Automated Security Checks</span>
              <span className="text-[10px] text-black/50 font-[500]">Runs OWASP static analyses on build</span>
            </div>
            <input 
              type="checkbox"
              checked={enableSecurity}
              onChange={(e) => setEnableSecurity(e.target.checked)}
              className="w-4 h-4 accent-black border-black/10 rounded cursor-pointer"
            />
          </div>

          <DialogFooter className="border-t border-black/5 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-[600] hover:bg-gray-100 rounded-md transition-colors cursor-pointer text-black/60 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-black text-white text-[13px] font-[600] rounded-md hover:bg-black/90 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Orchestrating...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" fill="white" />
                  Run Workflow
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
