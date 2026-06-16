import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function StatCard({ title, value, unit, icon: Icon, trend, delay = 0 }: StatCardProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now() + delay * 1000;
    let raf: number;

    function tick(now: number) {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.round(easeOutExpo(progress) * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, delay]);

  return (
    <motion.div
      className="bg-white border border-black/10 rounded-xl p-6 hover:border-black/20 transition-all duration-300"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#f7f7f7] flex items-center justify-center">
          <Icon className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        {trend && (
          <span className="text-[12px] font-[500] text-black/60">{trend}</span>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-[36px] font-[600] leading-none tracking-tight">
          {displayed}
          {unit && <span className="text-[24px] text-black/40 ml-1">{unit}</span>}
        </div>
        <div className="text-[13px] text-black/60 font-[500]">{title}</div>
      </div>
    </motion.div>
  );
}
