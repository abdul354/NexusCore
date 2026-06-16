import { useState, useMemo } from 'react';
import { useApp, SecurityFinding } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShieldAlert, ShieldCheck, Play, Loader2, AlertTriangle, 
  Terminal, Search, CheckCircle2, ChevronRight, ArrowRight, Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { SecurityInsightsChart } from './SecurityInsightsChart';

export function SecurityView() {
  const { securityFindings, runSecurityScan, isScanning, metrics } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [localFindings, setLocalFindings] = useState<SecurityFinding[]>([]);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);

  // Sync with context findings
  const findings = useMemo(() => {
    // Merge context findings with any local resolutions for immediate feedback
    const base = securityFindings;
    if (localFindings.length === 0) return base;
    return base.map(f => {
      const resolvedLocally = localFindings.find(lf => lf.id === f.id);
      return resolvedLocally ? resolvedLocally : f;
    });
  }, [securityFindings, localFindings]);

  // Filtered findings list
  const filteredFindings = useMemo(() => {
    return findings.filter(f => {
      const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (severityFilter === 'all') return matchesSearch;
      return matchesSearch && f.severity === severityFilter;
    });
  }, [findings, searchQuery, severityFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const open = findings.filter(f => f.status === 'open');
    const openCount = open.length;
    const criticalCount = open.filter(f => f.severity === 'critical').length;
    const highCount = open.filter(f => f.severity === 'high').length;
    const mediumCount = open.filter(f => f.severity === 'medium').length;
    const lowCount = open.filter(f => f.severity === 'low').length;
    const score = Math.max(0, 100 - (criticalCount * 15) - (highCount * 8) - (mediumCount * 3) - (lowCount * 1));

    return { openCount, criticalCount, highCount, mediumCount, lowCount, score };
  }, [findings]);

  const handleRemediate = (findingId: string, title: string) => {
    setRemediatingId(findingId);
    toast.info(`Initiating AI remediation agent for "${title}"...`);

    setTimeout(() => {
      setLocalFindings(prev => {
        const existing = prev.find(f => f.id === findingId);
        if (existing) {
          return prev.map(f => f.id === findingId ? { ...f, status: 'resolved' as const } : f);
        }
        const baseFinding = findings.find(f => f.id === findingId);
        if (baseFinding) {
          return [...prev, { ...baseFinding, status: 'resolved' as const }];
        }
        return prev;
      });

      setRemediatingId(null);
      toast.success(`Successfully patched vulnerability: ${findingId}. Pull request created.`);
    }, 3000);
  };

  return (
    <div className="w-full p-8 pt-8">
      {/* Title */}
      <motion.div
        className="mb-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[36px] font-[700] leading-tight tracking-tight mb-2">Security audits</h1>
        <p className="text-[15px] text-black/60 font-[500]">
          Monitor automated vulnerability logs, run AST scans, and deploy AI auto-remediation patches.
        </p>
      </motion.div>

      {/* Security Health banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* KPI Score card */}
        <div className="lg:col-span-4 bg-[#f7f7f7] border border-black/5 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[14px] font-[600] text-black/50 uppercase tracking-wider mb-1">Security Health Index</h3>
              <p className="text-[12px] text-black/40">Based on open vulnerability severity scores.</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <div className="my-6">
            <span className="text-[64px] font-[800] leading-none tracking-tight">{stats.score}</span>
            <span className="text-[20px] text-black/40 font-[600]">/100</span>
          </div>
          <div className="text-[12px] text-black/60 font-[500] flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${stats.score >= 90 ? 'bg-black' : 'bg-black/30'}`} />
            {stats.score >= 90 ? 'Excellent posture. Keep code patched.' : 'Warnings detected. Resolve alerts.'}
          </div>
        </div>

        {/* Scan controller card */}
        <div className="lg:col-span-8 bg-white border border-black/10 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
            <div>
              <h3 className="text-[16px] font-[700] text-black">SAST & Dependency Scanner</h3>
              <p className="text-[13px] text-black/50">Run static code analysis on active branches.</p>
            </div>
            <button
              onClick={runSecurityScan}
              disabled={isScanning}
              className="h-10 px-5 bg-black text-white hover:bg-black/95 transition-all rounded-lg text-[13px] font-[700] flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Auditing files...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white fill-white" />
                  Run security audit
                </>
              )}
            </button>
          </div>

          <div className="py-4">
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex justify-between items-center text-[12px] text-black/60 font-mono">
                    <span className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-black/45" />
                      $ bin/sast-scanner --all-repos
                    </span>
                    <span className="animate-pulse">Scanning dependency matrix...</span>
                  </div>
                  {/* Progress simulator */}
                  <div className="w-full bg-black/5 rounded-full h-1 overflow-hidden">
                    <motion.div 
                      className="bg-black h-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3.8, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-wrap gap-4 text-[13px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex-1 min-w-[140px] bg-[#f7f7f7] border border-black/5 p-3 rounded-lg">
                    <div className="text-black/50 font-[500]">Critical</div>
                    <div className="text-[20px] font-[700] text-black mt-1">{stats.criticalCount}</div>
                  </div>
                  <div className="flex-1 min-w-[140px] bg-[#f7f7f7] border border-black/5 p-3 rounded-lg">
                    <div className="text-black/50 font-[500]">High</div>
                    <div className="text-[20px] font-[700] text-black mt-1">{stats.highCount}</div>
                  </div>
                  <div className="flex-1 min-w-[140px] bg-[#f7f7f7] border border-black/5 p-3 rounded-lg">
                    <div className="text-black/50 font-[500]">Medium</div>
                    <div className="text-[20px] font-[700] text-black mt-1">{stats.mediumCount}</div>
                  </div>
                  <div className="flex-1 min-w-[140px] bg-[#f7f7f7] border border-black/5 p-3 rounded-lg">
                    <div className="text-black/50 font-[500]">Low</div>
                    <div className="text-[20px] font-[700] text-black mt-1">{stats.lowCount}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Grid of Chart and Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Vulnerability Trend Chart */}
        <div className="lg:col-span-5 bg-white border border-black/10 rounded-xl p-6">
          <h3 className="text-[16px] font-[700] text-black mb-4">Vulnerability Trends</h3>
          <SecurityInsightsChart />
        </div>

        {/* Findings Audit Table */}
        <div className="lg:col-span-7 bg-white border border-black/10 rounded-xl p-6">
          {/* Table Header and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-[16px] font-[700] text-black shrink-0">Open vulnerabilities</h3>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40" />
                <input
                  type="text"
                  placeholder="Filter by ID/File..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#f7f7f7] border border-black/10 rounded-lg text-[12px] font-[500] outline-none focus:border-black/30 transition-all w-[150px] sm:w-[180px]"
                />
              </div>

              {/* Severity filter dropdown */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-[#f7f7f7] border border-black/10 rounded-lg text-[12px] font-[600] outline-none cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-black/10 text-black/45 font-[600]">
                  <th className="pb-3 pr-2 w-[80px]">ID</th>
                  <th className="pb-3 px-2 w-[100px]">Severity</th>
                  <th className="pb-3 px-2">Finding</th>
                  <th className="pb-3 px-2 w-[100px]">Status</th>
                  <th className="pb-3 pl-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFindings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-black/40 font-[500]">
                      No vulnerabilities found in active scans. Workspace is secure!
                    </td>
                  </tr>
                ) : (
                  filteredFindings.map((find) => {
                    const isRemediating = remediatingId === find.id;
                    const isResolved = find.status === 'resolved';

                    return (
                      <tr 
                        key={find.id} 
                        className={`
                          border-b border-black/5 hover:bg-[#f7f7f7]/30 transition-colors
                          ${isResolved ? 'opacity-55' : ''}
                        `}
                      >
                        {/* ID */}
                        <td className="py-4 pr-2 font-mono text-[11px] font-[700] text-black">
                          {find.id}
                        </td>
                        
                        {/* Severity Badge */}
                        <td className="py-4 px-2">
                          <span 
                            className={`
                              px-2 py-0.5 rounded-full text-[10px] font-[700] uppercase tracking-wider
                              ${find.severity === 'critical' ? 'bg-black text-white' : ''}
                              ${find.severity === 'high' ? 'bg-black text-white' : ''}
                              ${find.severity === 'medium' ? 'bg-black/10 text-black' : ''}
                              ${find.severity === 'low' ? 'bg-black/5 text-black/60' : ''}
                            `}
                          >
                            {find.severity}
                          </span>
                        </td>

                        {/* Title and File info */}
                        <td className="py-4 px-2">
                          <div className="font-[600] text-black leading-snug">{find.title}</div>
                          <div className="text-[11px] text-black/50 font-mono mt-1 select-text">
                            {find.file} : L{find.line}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-2">
                          {isResolved ? (
                            <span className="text-black font-[700] text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                              Patched
                            </span>
                          ) : (
                            <span className="text-black/60 font-[500] text-[11px] flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-black/40" />
                              Open
                            </span>
                          )}
                        </td>

                        {/* Remediation button */}
                        <td className="py-4 pl-2 text-right">
                          <button
                            onClick={() => handleRemediate(find.id, find.title)}
                            disabled={isResolved || isRemediating}
                            className={`
                              h-8 px-3 rounded-lg text-[11px] font-[700] transition-all cursor-pointer inline-flex items-center gap-1
                              ${isResolved 
                                ? 'bg-transparent text-black/40 border border-black/5 cursor-default' 
                                : 'bg-[#f7f7f7] border border-black/10 text-black hover:bg-black hover:text-white hover:border-black'
                              }
                            `}
                          >
                            {isRemediating ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Patching...
                              </>
                            ) : isResolved ? (
                              'Remediated'
                            ) : (
                              'Auto Patch'
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
