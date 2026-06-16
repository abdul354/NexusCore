import { motion } from 'motion/react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const stages = [
  { name: 'Planning', status: 'complete' },
  { name: 'Architecture', status: 'complete' },
  { name: 'Conflict Review', status: 'complete' },
  { name: 'Engineering', status: 'active' },
  { name: 'Security Review', status: 'pending' },
  { name: 'Compliance', status: 'pending' },
  { name: 'Approved', status: 'pending' },
];

export function FeatureExecution() {
  return (
    <motion.div
      className="bg-white border border-black/10 rounded-xl p-8"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[20px] font-[600] mb-1">Feature Execution</h3>
            <p className="text-[13px] text-black/60">OAuth Authentication System</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f7f7f7] rounded-full">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[13px] font-[600]">In Progress</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-black/10">
          <motion.div
            className="h-full bg-black"
            initial={{ width: '0%' }}
            animate={{ width: `${(3 / (stages.length - 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          />
        </div>

        {/* Stages */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isComplete = stage.status === 'complete';
            const isActive = stage.status === 'active';
            const isPending = stage.status === 'pending';

            return (
              <div key={stage.name} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Node */}
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2
                    transition-all duration-300 bg-white
                    ${isComplete ? 'border-black bg-black' : ''}
                    ${isActive ? 'border-black' : ''}
                    ${isPending ? 'border-black/20' : ''}
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                >
                  {isComplete && (
                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2} />
                  )}
                  {isActive && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5 text-black" strokeWidth={2} />
                    </motion.div>
                  )}
                  {isPending && (
                    <Circle className="w-5 h-5 text-black/20" strokeWidth={2} />
                  )}
                </motion.div>

                {/* Label */}
                <motion.div
                  className={`
                    mt-3 text-[12px] font-[500] text-center whitespace-nowrap
                    ${isComplete || isActive ? 'text-black' : 'text-black/40'}
                  `}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                >
                  {stage.name}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-black/10">
        <div>
          <div className="text-[24px] font-[600]">3/7</div>
          <div className="text-[12px] text-black/60 mt-0.5">Stages Complete</div>
        </div>
        <div>
          <div className="text-[24px] font-[600]">42m</div>
          <div className="text-[12px] text-black/60 mt-0.5">Elapsed Time</div>
        </div>
        <div>
          <div className="text-[24px] font-[600]">~18m</div>
          <div className="text-[12px] text-black/60 mt-0.5">Remaining</div>
        </div>
      </div>
    </motion.div>
  );
}
