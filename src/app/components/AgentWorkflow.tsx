import { motion } from 'motion/react';
import { Bot, GitBranch, Shield, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Master Agent': Bot,
  'Architect Agent': GitBranch,
  'Conflict Agent': AlertCircle,
  'Engineer Agent': Bot,
  'Security Agent': Shield,
  'Compliance Agent': FileCheck,
  'Standards Agent': CheckCircle2
};

export function AgentWorkflow() {
  const { agents: contextAgents, features } = useApp();
  
  // Find if there is an active running/hold workflow
  const runningFeature = features.find(
    f => f.status === 'running' || f.status === 'awaiting_approval'
  );

  const [cycleIndex, setCycleIndex] = useState(2);

  // Auto-cycle agents when idle for a live demonstration feel
  useEffect(() => {
    if (runningFeature) return;
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % contextAgents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [runningFeature, contextAgents.length]);

  const activeIndex = runningFeature ? runningFeature.currentStageIndex : cycleIndex;

  return (
    <motion.div
      className="bg-white border border-black/10 rounded-xl p-8"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    >
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h3 className="text-[20px] font-[600] mb-1">AI Agent Workflow</h3>
          <p className="text-[13px] text-black/60">Real-time autonomous software development pipeline</p>
        </div>
        {runningFeature && (
          <span className="text-[11px] font-[600] px-2.5 py-1 bg-black text-white rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            Tracking job
          </span>
        )}
      </div>

      <div className="space-y-0">
        {contextAgents.map((agent, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          const isPending = index > activeIndex;
          const IconComponent = iconMap[agent.name] || Bot;

          return (
            <div key={agent.name} className="relative">
              {/* Connecting Line */}
              {index < contextAgents.length - 1 && (
                <div className="absolute left-[39px] top-12 w-0.5 h-16 overflow-hidden">
                  <motion.div
                    className="w-full h-full bg-black/10"
                    initial={false}
                  >
                    <motion.div
                      className="w-full bg-black"
                      initial={{ height: isComplete ? '100%' : '0%' }}
                      animate={{ height: isComplete || isActive ? '100%' : '0%' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.div>
                </div>
              )}

              {/* Agent Node */}
              <motion.div
                className={`
                  relative flex items-start gap-4 p-4 rounded-lg transition-all duration-300 origin-left
                  ${isActive ? 'bg-[#f7f7f7]' : 'hover:bg-[#f7f7f7]/50'}
                `}
                initial={false}
                animate={{
                  scale: isActive ? 1.02 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300 border
                    ${isComplete ? 'bg-black border-black' : ''}
                    ${isActive ? 'bg-black border-black' : ''}
                    ${isPending ? 'bg-white border-black/20' : ''}
                  `}
                  initial={false}
                  animate={{
                    scale: isActive ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-colors ${
                      isComplete || isActive ? 'text-white' : 'text-black/40'
                    }`}
                  />

                  {/* Pulse Animation for Active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-black"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[15px] font-[600]">{agent.name}</h4>
                    <div className="flex items-center gap-2">
                      {isComplete && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-[11px] font-[600] px-2 py-1 bg-black text-white rounded-full"
                        >
                          Complete
                        </motion.div>
                      )}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-[11px] font-[600] px-2 py-1 bg-black text-white rounded-full flex items-center gap-1.5"
                        >
                          <motion.div
                            className="w-1.5 h-1.5 bg-white rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          Active
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <p className="text-[13px] text-black/60 mt-0.5">{agent.role}</p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
