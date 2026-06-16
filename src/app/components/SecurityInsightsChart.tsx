import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

const data = [
  { day: 'Mon', scans: 40, passed: 39 },
  { day: 'Tue', scans: 55, passed: 52 },
  { day: 'Wed', scans: 48, passed: 48 },
  { day: 'Thu', scans: 75, passed: 73 },
  { day: 'Fri', scans: 94, passed: 92 },
  { day: 'Sat', scans: 60, passed: 60 },
  { day: 'Sun', scans: 110, passed: 109 },
];

export function SecurityInsightsChart() {
  return (
    <motion.div
      className="bg-white border border-black/10 rounded-xl p-6 h-full flex flex-col justify-between"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
    >
      {/* Chart Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[18px] font-[600] tracking-tight text-black">Security Insights</h3>
          <p className="text-[12px] text-black/60 font-[500]">Weekly autonomous code vulnerability scans</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-[600] text-black/60">
            <span className="w-2.5 h-2.5 rounded-full bg-black/10 border border-black/20" />
            Scans Run
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-[600] text-black">
            <span className="w-2.5 h-2.5 rounded-full bg-black" />
            Passed Checks
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[220px] text-[11px] font-medium text-black/40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(0,0,0,0.08)" stopOpacity={1}/>
                <stop offset="95%" stopColor="rgba(0,0,0,0)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="passedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(0,0,0,0.18)" stopOpacity={1}/>
                <stop offset="95%" stopColor="rgba(0,0,0,0)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontSize: '12px',
                color: '#000000',
              }}
              labelClassName="font-[600] text-black"
              cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="scans" 
              stroke="rgba(0,0,0,0.2)" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#scansGrad)" 
            />
            <Area 
              type="monotone" 
              dataKey="passed" 
              stroke="#000000" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#passedGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-4 mt-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f7f7f7] flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4 text-black" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[11px] text-black/50 font-[600] uppercase tracking-wider">Success Rate</div>
            <div className="text-[15px] font-[700] text-black">98.4%</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f7f7f7] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-black" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[11px] text-black/50 font-[600] uppercase tracking-wider">Vulnerabilities</div>
            <div className="text-[15px] font-[700] text-black">0 Critical</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
