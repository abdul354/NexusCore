import { motion, AnimatePresence } from 'motion/react';
import { Bot } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Message {
  id: number;
  agent: string;
  message: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    agent: 'Architect Agent',
    message: 'Proposed OAuth2 architecture using token rotation pattern.',
    timestamp: '10:21'
  },
  {
    id: 2,
    agent: 'Conflict Agent',
    message: 'Potential duplication detected with existing auth service.',
    timestamp: '10:22'
  },
  {
    id: 3,
    agent: 'Architect Agent',
    message: 'Revised plan: Reusing existing auth service infrastructure.',
    timestamp: '10:23'
  },
];

const newMessages: Message[] = [
  {
    id: 4,
    agent: 'Security Agent',
    message: 'Validating authentication flow against OWASP standards.',
    timestamp: '10:24'
  },
  {
    id: 5,
    agent: 'Engineer Agent',
    message: 'Generating authentication middleware components.',
    timestamp: '10:25'
  },
];

export function LiveAgentFeed() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < newMessages.length) {
        const msg = newMessages[currentIndex];
        currentIndex++;
        setMessages((prev) => [...prev, msg]);
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="bg-white border border-black/10 rounded-xl p-6 h-full flex flex-col"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
    >
      <div className="mb-6">
        <h3 className="text-[16px] font-[600] mb-1">Live Agent Collaboration</h3>
        <p className="text-[12px] text-black/60">Real-time decision making</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#f7f7f7] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-black" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[13px] font-[600]">{msg.agent}</span>
                  <span className="text-[11px] text-black/40">{msg.timestamp}</span>
                </div>
                <p className="text-[13px] text-black/80 leading-relaxed">{msg.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Typing Indicator */}
      <motion.div
        className="mt-4 pt-4 border-t border-black/10 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-black/40 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
        <span className="text-[12px] text-black/60">Agents are collaborating...</span>
      </motion.div>
    </motion.div>
  );
}
