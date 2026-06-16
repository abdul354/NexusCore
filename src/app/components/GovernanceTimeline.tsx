import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

const events = [
  { time: '10:21', event: 'Architecture Created', status: 'complete' },
  { time: '10:22', event: 'Conflict Detected', status: 'complete' },
  { time: '10:23', event: 'Architecture Revised', status: 'complete' },
  { time: '10:25', event: 'Approved', status: 'complete' },
  { time: '10:28', event: 'Code Generated', status: 'complete' },
  { time: '10:31', event: 'Security Review', status: 'active' },
  { time: '10:35', event: 'Compliance Approved', status: 'pending' },
];

export function GovernanceTimeline() {
  return (
    <motion.div
      className="bg-white border border-black/10 rounded-xl p-8"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
    >
      <div className="mb-8">
        <h3 className="text-[20px] font-[600] mb-1">Governance Timeline</h3>
        <p className="text-[13px] text-black/60">Complete audit trail of all decisions</p>
      </div>

      <div className="space-y-0">
        {events.map((item, index) => {
          const isComplete = item.status === 'complete';
          const isActive = item.status === 'active';
          const isPending = item.status === 'pending';

          return (
            <div key={index} className="relative">
              {/* Connecting Line */}
              {index < events.length - 1 && (
                <div className="absolute left-[19px] top-10 w-0.5 h-12">
                  <div className={`w-full h-full ${isComplete ? 'bg-black/20' : 'bg-black/10'}`} />
                </div>
              )}

              {/* Event */}
              <motion.div
                className="relative flex items-start gap-4 pb-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
              >
                {/* Time Indicator */}
                <div className="flex items-center gap-3 min-w-[100px]">
                  <Clock className="w-4 h-4 text-black/40" strokeWidth={1.5} />
                  <span className="text-[13px] font-[500] text-black/60">{item.time}</span>
                </div>

                {/* Node */}
                <div className="relative mt-0.5">
                  <motion.div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border
                      ${isComplete ? 'bg-black border-black' : ''}
                      ${isActive ? 'bg-black border-black' : ''}
                      ${isPending ? 'bg-white border-black/20' : ''}
                    `}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                  >
                    <div
                      className={`
                        w-2 h-2 rounded-full
                        ${isComplete ? 'bg-white' : ''}
                        ${isActive ? 'bg-white' : ''}
                        ${isPending ? 'bg-black/20' : ''}
                      `}
                    />
                  </motion.div>

                  {/* Pulse for active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-black"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 pt-1.5">
                  <div className="text-[14px] font-[600]">{item.event}</div>
                  {isActive && (
                    <div className="text-[12px] text-black/60 mt-0.5">In progress...</div>
                  )}
                </div>

                {/* Status Badge */}
                {isComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[11px] font-[600] px-2 py-1 bg-[#f7f7f7] rounded-full mt-1"
                  >
                    Complete
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
