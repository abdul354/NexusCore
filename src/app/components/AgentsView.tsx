import { useState } from 'react';
import { useApp, Agent, AgentConfig } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, GitBranch, Shield, FileCheck, AlertCircle, Settings2, 
  Check, Cpu, Sliders, Database, Activity, Play, Sparkles, X, Terminal
} from 'lucide-react';
import { toast } from 'sonner';

// Map icon name to Lucide icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot: Bot,
  GitBranch: GitBranch,
  AlertCircle: AlertCircle,
  Shield: Shield,
  FileCheck: FileCheck
};

export function AgentsView() {
  const { agents, updateAgentConfig } = useApp();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  // Local state for configuration editing
  const [editedModel, setEditedModel] = useState('');
  const [editedTemp, setEditedTemp] = useState(0.2);
  const [editedMemory, setEditedMemory] = useState(8192);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const handleConfigureClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditedModel(agent.config.model);
    setEditedTemp(agent.config.temperature);
    setEditedMemory(agent.config.memoryLimit);
    setEditedPrompt(agent.config.systemPrompt);
  };

  const handleSave = () => {
    if (!selectedAgent) return;
    
    updateAgentConfig(selectedAgent.name, {
      model: editedModel,
      temperature: editedTemp,
      memoryLimit: editedMemory,
      systemPrompt: editedPrompt
    });
    
    setSelectedAgent(null);
  };

  const handleTestAgent = (agentName: string) => {
    setIsTesting(agentName);
    toast.info(`Running execution diagnostic suite for ${agentName}...`);

    setTimeout(() => {
      setIsTesting(null);
      const latency = Math.floor(Math.random() * 300) + 150;
      toast.success(`${agentName} diagnostics passed! Response latency: ${latency}ms.`);
    }, 2500);
  };

  return (
    <div className="w-full p-8 pt-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[36px] font-[700] leading-tight tracking-tight mb-2">Autonomous agents</h1>
        <p className="text-[15px] text-black/60 font-[500]">
          Configure neural models, specialized weights, and parameters of the development swarm.
        </p>
      </motion.div>

      {/* Swarm Status Indicator */}
      <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-[600] text-black">Swarm Orchestration Mode</h3>
            <p className="text-[13px] text-black/60">6 active LLM agents routing tasks via asynchronous protocols.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-black rounded-full animate-pulse"></span>
          <span className="text-[12px] font-[700] text-black uppercase tracking-wider">Swarm Ready</span>
        </div>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => {
          const IconComponent = iconMap[agent.iconName] || Bot;
          const isCurrentTesting = isTesting === agent.name;

          return (
            <motion.div
              key={agent.name}
              className="bg-white border border-black/10 rounded-xl p-6 flex flex-col justify-between gap-6 hover:shadow-sm transition-all"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              {/* Agent Title Section */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black border border-black/5">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {/* Status Badge */}
                  {agent.status === 'idle' ? (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#f7f7f7] border border-black/5 text-[11px] font-[600] rounded-full text-black/60">
                      <span className="w-1.5 h-1.5 bg-black/30 rounded-full" />
                      Idle
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[11px] font-[600] rounded-full">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      {agent.status}
                    </span>
                  )}
                </div>

                <h3 className="text-[17px] font-[700] tracking-tight text-black mb-1">{agent.name}</h3>
                <p className="text-[13px] text-black/50 font-[500] mb-4">{agent.role}</p>
                
                {/* Specs */}
                <div className="space-y-2.5 pt-4 border-t border-black/5 text-[13px]">
                  <div className="flex justify-between items-center text-black/60">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-black/40" />
                      Model
                    </span>
                    <span className="font-mono text-[11px] bg-[#f7f7f7] px-2 py-0.5 rounded border border-black/5 text-black font-[600]">
                      {agent.config.model}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-black/60">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-black/40" />
                      Memory
                    </span>
                    <span className="font-[600] text-black">{(agent.config.memoryLimit / 1024).toFixed(0)}k tokens</span>
                  </div>
                  <div className="flex justify-between items-center text-black/60">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-black/40" />
                      Temperature
                    </span>
                    <span className="font-[600] text-black">{agent.config.temperature}</span>
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="pt-4 border-t border-black/5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#f7f7f7]/50 p-2.5 rounded-lg border border-black/5">
                  <div>
                    <div className="text-black/50 font-[500]">Tasks Handled</div>
                    <div className="text-[14px] font-[700] text-black mt-0.5">{agent.tasksHandled}</div>
                  </div>
                  <div>
                    <div className="text-black/50 font-[500]">Success Rate</div>
                    <div className="text-[14px] font-[700] text-black mt-0.5">{agent.successRate}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestAgent(agent.name)}
                    disabled={isCurrentTesting}
                    className="flex-1 h-9 border border-black/15 bg-white text-black hover:bg-black/[0.02] text-[12px] font-[600] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isCurrentTesting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    Test Swarm
                  </button>
                  <button
                    onClick={() => handleConfigureClick(agent)}
                    className="h-9 w-9 border border-black/15 bg-white text-black hover:bg-black/[0.02] rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Configure Agent"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Configuration Slider Panel */}
      <AnimatePresence>
        {selectedAgent && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-[99]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgent(null)}
            />

            {/* Slider Panel */}
            <motion.div
              className="fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-white border-l border-black/10 z-[100] p-8 flex flex-col justify-between shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="overflow-y-auto pr-2 flex-1">
                {/* Panel Title */}
                <div className="flex items-center justify-between pb-6 border-b border-black/10 mb-6">
                  <div>
                    <h2 className="text-[20px] font-[700] tracking-tight text-black mb-1">
                      Configure Swarm Agent
                    </h2>
                    <p className="text-[13px] text-black/50 font-[500]">{selectedAgent.name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="p-1.5 rounded-lg hover:bg-black/5 text-black/60 hover:text-black cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Configurations */}
                <div className="space-y-6">
                  {/* Model Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-[600] text-black/70">LLM Routing Model</label>
                    <select
                      value={editedModel}
                      onChange={(e) => setEditedModel(e.target.value)}
                      className="w-full h-10 px-3 bg-[#f7f7f7] border border-black/15 rounded-lg text-[13px] font-[500] outline-none focus:border-black/30 transition-all"
                    >
                      <option value="gemini-1.5-pro">gemini-1.5-pro (Recommended)</option>
                      <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                      <option value="gpt-4o">gpt-4o</option>
                      <option value="claude-3-5-haiku">claude-3-5-haiku</option>
                    </select>
                  </div>

                  {/* Temperature slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[13px] font-[600] text-black/70">LLM Temperature</label>
                      <span className="text-[12px] font-mono font-[700] bg-black/5 px-2 py-0.5 rounded border border-black/5">
                        {editedTemp.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={editedTemp}
                      onChange={(e) => setEditedTemp(parseFloat(e.target.value))}
                      className="w-full accent-black cursor-pointer bg-black/10 rounded-lg h-1.5"
                    />
                    <div className="flex justify-between text-[10px] text-black/40 font-[500]">
                      <span>Deterministic (0.0)</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>

                  {/* Memory Context Limit */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[13px] font-[600] text-black/70">Context Window Memory Limit</label>
                      <span className="text-[12px] font-mono font-[700] bg-black/5 px-2 py-0.5 rounded border border-black/5">
                        {(editedMemory / 1024).toFixed(0)}k tokens
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1024"
                      max="32768"
                      step="1024"
                      value={editedMemory}
                      onChange={(e) => setEditedMemory(parseInt(e.target.value))}
                      className="w-full accent-black cursor-pointer bg-black/10 rounded-lg h-1.5"
                    />
                    <div className="flex justify-between text-[10px] text-black/40 font-[500]">
                      <span>1k</span>
                      <span>32k</span>
                    </div>
                  </div>

                  {/* Custom System instructions */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-[600] text-black/70">System Swarm Prompts</label>
                    <textarea
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      rows={6}
                      className="w-full p-3 bg-[#f7f7f7] border border-black/15 rounded-lg text-[12px] font-mono leading-relaxed outline-none focus:border-black/30 focus:bg-white transition-all resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-black/10 pt-6 mt-6 flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="flex-1 h-10 border border-black/15 bg-white text-black hover:bg-black/[0.02] text-[13px] font-[600] rounded-lg cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-10 bg-black text-white hover:bg-black/90 text-[13px] font-[700] rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  Save config
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
