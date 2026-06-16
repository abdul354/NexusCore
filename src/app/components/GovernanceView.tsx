import { useState, useMemo } from 'react';
import { useApp, AuditLog } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck, Shield, Lock, UserCheck, Search, Clock, 
  Check, X, ChevronRight, AlertTriangle, ShieldCheck, Play
} from 'lucide-react';

export function GovernanceView() {
  const { 
    policies, 
    auditLogs, 
    togglePolicy, 
    features, 
    approveFeature, 
    rejectFeature 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'workflow' | 'policy' | 'security' | 'approval'>('all');

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            log.actor.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (categoryFilter === 'all') return matchesSearch;
      return matchesSearch && log.category === categoryFilter;
    });
  }, [auditLogs, searchQuery, categoryFilter]);

  // Find features holding for approval
  const pendingApprovals = useMemo(() => {
    return features.filter(f => f.status === 'awaiting_approval');
  }, [features]);

  return (
    <div className="w-full p-8 pt-8">
      {/* Title */}
      <motion.div
        className="mb-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[36px] font-[700] leading-tight tracking-tight mb-2">Swarm governance</h1>
        <p className="text-[15px] text-black/60 font-[500]">
          Enforce compliance policies, review audit logs, and approve automated deployment commits.
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Policies & Approvals */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          
          {/* Policy controls card */}
          <div className="bg-white border border-black/10 rounded-xl p-6">
            <h3 className="text-[17px] font-[700] text-black mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-black/60" />
              Compliance guardrails
            </h3>
            
            <div className="space-y-6">
              {policies.map((policy) => (
                <div key={policy.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-[14px] font-[600] text-black mb-1">{policy.name}</h4>
                    <p className="text-[12px] text-black/55 leading-normal">{policy.description}</p>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={() => togglePolicy(policy.id)}
                    className={`
                      w-11 h-6 rounded-full p-0.5 transition-all duration-200 focus:outline-none shrink-0 cursor-pointer
                      ${policy.enabled ? 'bg-black' : 'bg-black/10'}
                    `}
                  >
                    <div 
                      className={`
                        w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-sm
                        ${policy.enabled ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approval Requests */}
          <div className="bg-white border border-black/10 rounded-xl p-6">
            <h3 className="text-[17px] font-[700] text-black mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-black/60" />
              Pending deployment approvals ({pendingApprovals.length})
            </h3>

            {pendingApprovals.length === 0 ? (
              <div className="border border-black/5 bg-[#f7f7f7]/55 rounded-xl p-6 text-center">
                <ShieldCheck className="w-8 h-8 text-black/30 mx-auto mb-3" />
                <p className="text-[13px] text-black/50 font-[500]">No features holding for human signoff.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {pendingApprovals.map((feat) => (
                    <motion.div
                      key={feat.id}
                      className="border border-black/15 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-4"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-[14px] font-[700] text-black mb-0.5">{feat.name}</h4>
                          <span className="text-[11px] font-mono text-black/50">Repo: {feat.repo}</span>
                        </div>
                        <span className="text-[11px] font-[700] px-2 py-0.5 bg-black text-white rounded-full">
                          Hold
                        </span>
                      </div>

                      <div className="flex items-center gap-2 justify-end pt-3 border-t border-black/5">
                        <button
                          onClick={() => rejectFeature(feat.id)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-black/10 hover:bg-[#fcf5f5] text-black text-[12px] font-[600] rounded-lg cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => approveFeature(feat.id)}
                          className="flex items-center gap-1 px-4 py-1.5 bg-black text-white hover:bg-black/90 text-[12px] font-[700] rounded-lg cursor-pointer transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          Approve merge
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Audit Log Ledger */}
        <div className="lg:col-span-6 bg-white border border-black/10 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-5 mb-6">
            <div>
              <h3 className="text-[17px] font-[700] text-black">Audit ledger</h3>
              <p className="text-[12px] text-black/50">Immutable logs of agent interactions and merges.</p>
            </div>
            
            {/* Search */}
            <div className="relative shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#f7f7f7] border border-black/10 rounded-lg text-[12px] font-[500] outline-none focus:border-black/30 transition-all w-[180px]"
              />
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {(['all', 'workflow', 'approval', 'policy', 'security'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`
                  px-2.5 py-1 rounded-full text-[11px] font-[600] capitalize transition-colors cursor-pointer
                  ${categoryFilter === cat 
                    ? 'bg-black text-white' 
                    : 'bg-[#f7f7f7] border border-black/5 text-black/60 hover:text-black'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Audit Ledger Scroll Feed */}
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-black/40 font-[500]">
                No audit entries match current query.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-4 rounded-xl bg-[#f7f7f7]/40 border border-black/5 flex items-start gap-3.5"
                >
                  {/* Category icon indicator */}
                  <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center shrink-0 border border-black/5">
                    {log.category === 'security' && <Shield className="w-4 h-4 text-black" />}
                    {log.category === 'policy' && <Lock className="w-4 h-4 text-black" />}
                    {log.category === 'approval' && <UserCheck className="w-4 h-4 text-black" />}
                    {log.category === 'workflow' && <FileCheck className="w-4 h-4 text-black" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <h4 className="text-[13.5px] font-[700] text-black leading-none">{log.action}</h4>
                      <span className="text-[11px] text-black/40 font-mono flex items-center gap-1 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="text-[12.5px] text-black/70 leading-normal mb-2">{log.details}</p>
                    
                    <div className="text-[11px] font-[600] text-black/50">
                      Operator: <span className="font-mono text-black font-[700]">{log.actor}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
