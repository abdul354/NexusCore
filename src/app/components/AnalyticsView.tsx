import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, LineChart, Line, Legend 
} from 'recharts';
import { 
  BarChart3, Calendar, Download, Loader2, Sparkles, TrendingUp, 
  Zap, Clock, DollarSign 
} from 'lucide-react';
import { toast } from 'sonner';

// Mock chart data structures for different timeframes
const chartDataByTimeframe = {
  '24h': {
    features: [
      { name: '00:00', count: 12 },
      { name: '04:00', count: 18 },
      { name: '08:00', count: 32 },
      { name: '12:00', count: 45 },
      { name: '16:00', count: 28 },
      { name: '20:00', count: 22 },
      { name: '24:00', count: 36 }
    ],
    savings: [
      { name: '00:00', manual: 1200, ai: 40 },
      { name: '04:00', manual: 1500, ai: 55 },
      { name: '08:00', manual: 3400, ai: 120 },
      { name: '12:00', manual: 4200, ai: 160 },
      { name: '16:00', manual: 2600, ai: 95 },
      { name: '20:00', manual: 2100, ai: 70 },
      { name: '24:00', manual: 3100, ai: 110 }
    ],
    latency: [
      { name: '00:00', latency: 450 },
      { name: '04:00', latency: 420 },
      { name: '08:00', latency: 610 },
      { name: '12:00', latency: 740 },
      { name: '16:00', latency: 530 },
      { name: '20:00', latency: 480 },
      { name: '24:00', latency: 460 }
    ]
  },
  '7d': {
    features: [
      { name: 'Mon', count: 24 },
      { name: 'Tue', count: 38 },
      { name: 'Wed', count: 42 },
      { name: 'Thu', count: 35 },
      { name: 'Fri', count: 48 },
      { name: 'Sat', count: 18 },
      { name: 'Sun', count: 22 }
    ],
    savings: [
      { name: 'Mon', manual: 3600, ai: 140 },
      { name: 'Tue', manual: 4800, ai: 180 },
      { name: 'Wed', manual: 5400, ai: 210 },
      { name: 'Thu', manual: 4600, ai: 165 },
      { name: 'Fri', manual: 6200, ai: 240 },
      { name: 'Sat', manual: 2400, ai: 90 },
      { name: 'Sun', manual: 2800, ai: 110 }
    ],
    latency: [
      { name: 'Mon', latency: 480 },
      { name: 'Tue', latency: 510 },
      { name: 'Wed', latency: 490 },
      { name: 'Thu', latency: 540 },
      { name: 'Fri', latency: 580 },
      { name: 'Sat', latency: 430 },
      { name: 'Sun', latency: 440 }
    ]
  },
  '30d': {
    features: [
      { name: 'Week 1', count: 98 },
      { name: 'Week 2', count: 124 },
      { name: 'Week 3', count: 142 },
      { name: 'Week 4', count: 110 }
    ],
    savings: [
      { name: 'Week 1', manual: 14200, ai: 540 },
      { name: 'Week 2', manual: 18400, ai: 680 },
      { name: 'Week 3', manual: 21300, ai: 820 },
      { name: 'Week 4', manual: 16500, ai: 610 }
    ],
    latency: [
      { name: 'Week 1', latency: 520 },
      { name: 'Week 2', latency: 495 },
      { name: 'Week 3', latency: 480 },
      { name: 'Week 4', latency: 510 }
    ]
  }
};

export function AnalyticsView() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [isExporting, setIsExporting] = useState(false);

  const activeData = useMemo(() => {
    return chartDataByTimeframe[timeframe];
  }, [timeframe]);

  const handleExport = () => {
    setIsExporting(true);
    toast.info('Compiling report data and generating PDF export...');

    setTimeout(() => {
      setIsExporting(false);
      toast.success('Analytics PDF report downloaded successfully.');
    }, 2500);
  };

  return (
    <div className="w-full p-8 pt-8">
      {/* Title */}
      <motion.div
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-[36px] font-[700] leading-tight tracking-tight mb-2 flex items-center gap-2.5">
            Analytics & telemetry
          </h1>
          <p className="text-[15px] text-black/60 font-[500]">
            Track performance metrics, compute cost efficiencies, and audit swarm response latencies.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {/* Time range selector */}
          <div className="flex p-1 bg-[#f7f7f7] border border-black/5 rounded-xl">
            {(['24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`
                  px-3 py-1.5 rounded-lg text-[12px] font-[600] transition-colors cursor-pointer uppercase
                  ${timeframe === t 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-black/60 hover:text-black'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Export Report */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="h-9 px-4 border border-black/15 bg-white text-black hover:bg-black/[0.02] text-[12px] font-[600] rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-sm"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Export report
          </button>
        </div>
      </motion.div>

      {/* Mini-KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Code generated */}
        <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-2 text-black/50 text-[12px] font-[600] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-black/45" />
            Generated volume
          </div>
          <div className="text-[28px] font-[700] text-black mb-1">24,580</div>
          <p className="text-[12px] text-black/50 font-[500]">Lines of code (LOC) merged to main.</p>
        </div>

        {/* Avg cycle time */}
        <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-2 text-black/50 text-[12px] font-[600] uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4 text-black/45" />
            Average cycle time
          </div>
          <div className="text-[28px] font-[700] text-black mb-1">4.8 mins</div>
          <p className="text-[12px] text-black/50 font-[500]">Elapsed time from launch to deploy.</p>
        </div>

        {/* Efficiency Ratio */}
        <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-2 text-black/50 text-[12px] font-[600] uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4 text-black/45" />
            Cost efficiency
          </div>
          <div className="text-[28px] font-[700] text-black mb-1">94.8%</div>
          <p className="text-[12px] text-black/50 font-[500]">Ratio comparing AI vs Manual overheads.</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Area Chart - Throughput */}
        <div className="lg:col-span-8 bg-white border border-black/10 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-[16px] font-[700] text-black mb-1">Swarm feature throughput</h3>
            <p className="text-[12px] text-black/50">Cumulative code execution jobs completed successfully.</p>
          </div>
          
          <div className="h-[300px] w-full text-[11px] font-mono select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData.features} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="rgba(0,0,0,0.4)" />
                <YAxis tickLine={false} axisLine={false} stroke="rgba(0,0,0,0.4)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#000000' }}
                />
                <Area type="monotone" dataKey="count" name="Features Completed" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency line chart */}
        <div className="lg:col-span-4 bg-white border border-black/10 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-[16px] font-[700] text-black mb-1">Swarm response latency</h3>
            <p className="text-[12px] text-black/50">Average time taken for sub-agents to process tokens.</p>
          </div>

          <div className="h-[300px] w-full text-[11px] font-mono select-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeData.latency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="rgba(0,0,0,0.4)" />
                <YAxis tickLine={false} axisLine={false} stroke="rgba(0,0,0,0.4)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#000000' }}
                />
                <Line type="monotone" dataKey="latency" name="Latency (ms)" stroke="#000000" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Second Row: Cost Savings Bar Chart */}
      <div className="bg-white border border-black/10 rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-[16px] font-[700] text-black mb-1">Financial comparison: AI vs manual developer</h3>
          <p className="text-[12px] text-black/50">Comparison of labor costs ($) across identical feature scopes.</p>
        </div>

        <div className="h-[320px] w-full text-[11px] font-mono select-none">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData.savings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="rgba(0,0,0,0.4)" />
              <YAxis tickLine={false} axisLine={false} stroke="rgba(0,0,0,0.4)" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}
                labelStyle={{ fontWeight: 'bold', color: '#000000' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="manual" name="Manual Engineering ($)" fill="rgba(0,0,0,0.2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ai" name="Autonomous Swarm ($)" fill="#000000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
