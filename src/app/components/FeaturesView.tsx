import { useState, useMemo, useEffect, useRef } from 'react';
import { useApp, Feature } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Sparkles, Loader2, CheckCircle2, XCircle, AlertTriangle, 
  Terminal, ShieldCheck, Clock, GitBranch, ArrowRight, Play, Check, X
} from 'lucide-react';

export function FeaturesView() {
  const { 
    features, 
    approveFeature, 
    rejectFeature, 
    activeFeatureId, 
    setActiveFeatureId 
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'completed' | 'failed' | 'awaiting_approval'>('all');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-select the first feature if none is active
  useEffect(() => {
    if (features.length > 0 && !activeFeatureId) {
      setActiveFeatureId(features[0].id);
    }
  }, [features, activeFeatureId, setActiveFeatureId]);

  // Find active feature
  const activeFeature = useMemo(() => {
    return features.find(f => f.id === activeFeatureId) || features[0];
  }, [features, activeFeatureId]);

  // Scroll logs to bottom when they change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [activeFeature?.logs]);

  // Filter features
  const filteredFeatures = useMemo(() => {
    return features.filter(feat => {
      const matchesSearch = feat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            feat.repo.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && feat.status === statusFilter;
    });
  }, [features, searchQuery, statusFilter]);

  // Features metrics
  const stats = useMemo(() => {
    const total = features.length;
    const completed = features.filter(f => f.status === 'completed').length;
    const running = features.filter(f => f.status === 'running').length;
    const awaiting = features.filter(f => f.status === 'awaiting_approval').length;
    const failed = features.filter(f => f.status === 'failed').length;
    const rate = total > 0 ? Math.round((completed / (completed + failed)) * 100) : 0;

    return { total, completed, running, awaiting, failed, rate };
  }, [features]);

  return (
    <div className="w-full p-8 pt-8">
      {/* Page Title */}
      <motion.div
        className="mb-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[36px] font-[700] leading-tight tracking-tight mb-2">Features pipeline</h1>
        <p className="text-[15px] text-black/60 font-[500]">
          Track code generation jobs, review changes, and manage compliance approvals.
        </p>
      </motion.div>

      {/* Mini-KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-5">
          <div className="text-[12px] text-black/60 font-[500] uppercase tracking-wider mb-1">Total Features</div>
          <div className="text-[28px] font-[700]">{stats.total}</div>
        </div>
        <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-5">
          <div className="text-[12px] text-black/60 font-[500] uppercase tracking-wider mb-1">Active Pipeline</div>
          <div className="text-[28px] font-[700] flex items-center gap-2">
            {stats.running + stats.awaiting}
            {(stats.running + stats.awaiting) > 0 && (
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/30 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-black"></span>
              </span>
            )}
          </div>
        </div>
        <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-5">
          <div className="text-[12px] text-black/60 font-[500] uppercase tracking-wider mb-1">Awaiting Approval</div>
          <div className="text-[28px] font-[700] text-black">{stats.awaiting}</div>
        </div>
        <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-5">
          <div className="text-[12px] text-black/60 font-[500] uppercase tracking-wider mb-1">Success Rate</div>
          <div className="text-[28px] font-[700]">{stats.rate}%</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Search, Filters, and Feature List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input
              type="text"
              placeholder="Search features or repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f7f7f7] border border-black/10 rounded-xl text-[14px] font-[500] focus:bg-white transition-all outline-none focus:border-black/30 !outline-none"
              style={{ outline: 'none' }}
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#f7f7f7] border border-black/5 rounded-xl">
            {(['all', 'running', 'awaiting_approval', 'completed', 'failed'] as const).map((tab) => {
              const isActive = statusFilter === tab;
              const label = tab === 'all' ? 'All' 
                            : tab === 'running' ? 'Running' 
                            : tab === 'awaiting_approval' ? 'Hold' 
                            : tab === 'completed' ? 'Done' 
                            : 'Failed';
              
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`
                    px-3 py-1.5 rounded-lg text-[12px] font-[600] transition-all cursor-pointer capitalize
                    ${isActive 
                      ? 'bg-white text-black shadow-sm' 
                      : 'text-black/60 hover:text-black hover:bg-black/5'
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Features list */}
          <div className="flex-1 max-h-[600px] overflow-y-auto pr-1 space-y-3">
            {filteredFeatures.length === 0 ? (
              <div className="text-center py-12 bg-white border border-black/5 rounded-xl">
                <Sparkles className="w-8 h-8 text-black/20 mx-auto mb-3" />
                <p className="text-[14px] text-black/50 font-[500]">No features matching current filters.</p>
              </div>
            ) : (
              filteredFeatures.map((feat) => {
                const isActive = feat.id === activeFeature?.id;
                
                return (
                  <motion.div
                    key={feat.id}
                    onClick={() => setActiveFeatureId(feat.id)}
                    className={`
                      p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2
                      ${isActive 
                        ? 'bg-[#f7f7f7] border-black/20 shadow-sm' 
                        : 'bg-white border-black/10 hover:border-black/20 hover:bg-[#f7f7f7]/30'
                      }
                    `}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-[15px] font-[600] leading-tight text-black tracking-tight">
                        {feat.name}
                      </h4>
                      
                      {/* Status Badges */}
                      {feat.status === 'completed' && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[11px] font-[600] rounded-full shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          Done
                        </span>
                      )}
                      {feat.status === 'running' && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-black/5 text-black border border-black/15 text-[11px] font-[600] rounded-full shrink-0">
                          <Loader2 className="w-3 h-3 animate-spin text-black" />
                          Running
                        </span>
                      )}
                      {feat.status === 'awaiting_approval' && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[11px] font-[600] rounded-full shrink-0">
                          <AlertTriangle className="w-3 h-3 text-white" />
                          Hold
                        </span>
                      )}
                      {feat.status === 'failed' && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#fcf5f5] text-black border border-black/10 text-[11px] font-[600] rounded-full shrink-0">
                          <XCircle className="w-3 h-3 text-black" />
                          Failed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[12px] text-black/50 font-[500] mt-1">
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 shrink-0" />
                        {feat.repo}
                      </span>
                      <span>{feat.createdAt.split(' ')[1] || feat.createdAt}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Feature Details & Execution Graph */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeFeature ? (
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-black/10 rounded-xl p-6 md:p-8 flex flex-col gap-6"
              >
                {/* Feature Header */}
                <div className="border-b border-black/10 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-[22px] font-[700] tracking-tight text-black mb-1">
                        {activeFeature.name}
                      </h2>
                      <p className="text-[13px] text-black/60 font-[500] flex items-center gap-2">
                        <span>Repo: <strong className="text-black font-[600]">{activeFeature.repo}</strong></span>
                        <span className="text-black/30">•</span>
                        <span>Owner: <strong className="text-black font-[600]">{activeFeature.agent}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[13px] text-black/60 font-[500]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        Elapsed: <strong className="text-black font-[600] ml-0.5">{activeFeature.elapsed}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Manual Approval Actions */}
                  {activeFeature.status === 'awaiting_approval' && (
                    <motion.div 
                      className="bg-black text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-6"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-[600]">Human approval required</h4>
                          <p className="text-[12px] text-white/75">Review generated files and accept changes to branch.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
                        <button
                          onClick={() => rejectFeature(activeFeature.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-all text-white text-[12px] font-[600] rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => approveFeature(activeFeature.id)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black hover:bg-white/95 transition-all text-[12px] font-[700] rounded-lg cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          Approve Merge
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Agent Pipeline View */}
                <div>
                  <h3 className="text-[15px] font-[600] text-black mb-4">Pipeline stages</h3>
                  <div className="relative flex flex-col md:flex-row justify-between gap-4 md:gap-0 pt-2 pb-6 border-b border-black/10">
                    
                    {/* Horizontal Connection bar for desktop */}
                    <div className="absolute top-7 left-0 right-0 h-0.5 bg-black/10 hidden md:block z-0">
                      <div 
                        className="h-full bg-black transition-all duration-500" 
                        style={{ 
                          width: `${
                            activeFeature.status === 'failed' 
                              ? 100 * (activeFeature.currentStageIndex / (activeFeature.stages.length - 1))
                              : 100 * (activeFeature.currentStageIndex / (activeFeature.stages.length - 1))
                          }%` 
                        }}
                      />
                    </div>

                    {activeFeature.stages.map((stage, idx) => {
                      const isComplete = stage.status === 'complete' || idx < activeFeature.currentStageIndex;
                      const isActive = idx === activeFeature.currentStageIndex && activeFeature.status === 'running';
                      const isFailed = stage.status === 'failed' || (idx === activeFeature.currentStageIndex && activeFeature.status === 'failed');
                      const isAwaiting = idx === activeFeature.currentStageIndex && activeFeature.status === 'awaiting_approval';
                      const isPending = !isComplete && !isActive && !isFailed && !isAwaiting;

                      return (
                        <div key={stage.name} className="flex md:flex-col items-center gap-3 md:gap-0 relative z-10 flex-1">
                          
                          {/* Node bubble */}
                          <div 
                            className={`
                              w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-300
                              ${isComplete ? 'bg-black border-black text-white' : ''}
                              ${isActive ? 'border-black text-black' : ''}
                              ${isAwaiting ? 'bg-black border-black text-white' : ''}
                              ${isFailed ? 'bg-white border-black/45 text-black' : ''}
                              ${isPending ? 'border-black/10 text-black/30' : ''}
                            `}
                          >
                            {isComplete && <Check className="w-4 h-4 text-white" strokeWidth={2.5} />}
                            {isActive && (
                              <Loader2 className="w-4 h-4 animate-spin text-black" />
                            )}
                            {isAwaiting && (
                              <Clock className="w-4 h-4 animate-pulse text-white" />
                            )}
                            {isFailed && <X className="w-4 h-4 text-black" strokeWidth={2.5} />}
                            {isPending && <div className="w-1.5 h-1.5 rounded-full bg-black/20" />}
                          </div>

                          {/* Stage Name */}
                          <div className="md:mt-3 flex flex-col items-start md:items-center">
                            <span 
                              className={`
                                text-[12px] font-[600]
                                ${isComplete || isActive || isAwaiting ? 'text-black font-[700]' : 'text-black/45'}
                                ${isFailed ? 'text-black' : ''}
                              `}
                            >
                              {stage.name}
                            </span>
                            {isActive && (
                              <span className="text-[10px] text-black/50 font-[500] md:hidden lg:inline-block">In progress</span>
                            )}
                            {isAwaiting && (
                              <span className="text-[10px] text-black/70 font-[600] md:hidden lg:inline-block">Pending manual signoff</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Console Logs */}
                <div className="flex-1 flex flex-col min-h-[200px]">
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <h3 className="text-[15px] font-[600] text-black flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-black/60" />
                      Execution agent logs
                    </h3>
                    <span className="text-[11px] font-[600] px-2 py-0.5 bg-[#f7f7f7] border border-black/5 rounded-md text-black/60">
                      STDOUT
                    </span>
                  </div>

                  <div 
                    ref={logContainerRef}
                    className="flex-1 bg-[#f7f7f7] rounded-xl p-4 font-mono text-[12px] text-black/75 overflow-y-auto max-h-[300px] border border-black/5 space-y-2 leading-relaxed"
                  >
                    {activeFeature.logs.map((log, idx) => (
                      <div key={idx} className="break-all whitespace-pre-wrap select-text">
                        {log}
                      </div>
                    ))}
                    {activeFeature.status === 'running' && (
                      <div className="flex items-center gap-2 text-black/50 text-[11px] mt-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Streaming agent telemetry...</span>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="h-full bg-white border border-black/10 rounded-xl p-16 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 animate-spin text-black/40 mb-3" />
                <p className="text-black/50 font-[500]">Loading feature workspace...</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
