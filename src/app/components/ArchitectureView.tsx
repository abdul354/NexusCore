import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Bot, GitBranch, Shield, FileCheck, AlertCircle, 
  ArrowRight, Info, CheckCircle2, ChevronRight, Terminal, RefreshCw
} from 'lucide-react';

interface Node {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  icon: typeof Bot;
  color: string;
  details: {
    inputs: string[];
    outputs: string[];
    schema: string;
  };
}

interface Connection {
  from: string;
  to: string;
  label: string;
  path: string;
}

const nodes: Node[] = [
  {
    id: 'master',
    name: 'Master Agent',
    role: 'Swarm Orchestration',
    x: 80,
    y: 200,
    icon: Bot,
    color: '#000000',
    details: {
      inputs: ['User Feature Specifications', 'Sub-agent Execution Logs', 'Approval Tokens'],
      outputs: ['Refined Task Scopes', 'Route Configurations', 'Pull Request Merges'],
      schema: `{\n  "event": "workflow_init",\n  "feature_id": "feat-9402",\n  "agent_targets": ["architect", "engineer", "security"],\n  "status": "routing"\n}`
    }
  },
  {
    id: 'architect',
    name: 'Architect Agent',
    role: 'System Design',
    x: 300,
    y: 80,
    icon: GitBranch,
    color: '#000000',
    details: {
      inputs: ['Orchestrator Task Parameters', 'API Design Protocols'],
      outputs: ['Architecture Specification Markdown', 'Modular Class Schemas'],
      schema: `{\n  "target": "engineer",\n  "components": [\n    {\n      "name": "AuthService",\n      "methods": ["login", "refreshToken", "validateSession"]\n    }\n  ],\n  "dependencies": ["redis", "postgres"]\n}`
    }
  },
  {
    id: 'conflict',
    name: 'Conflict Agent',
    role: 'Git AST Refactoring',
    x: 300,
    y: 200,
    icon: AlertCircle,
    color: '#000000',
    details: {
      inputs: ['Raw Code Diffs', 'Workspace File Paths'],
      outputs: ['Clean Refactored Diffs', 'Merge Integrity Signatures'],
      schema: `{\n  "git_ref": "feature/auth",\n  "conflicts_resolved": 3,\n  "files_modified": ["src/db/client.ts"],\n  "compilation_check": "passed"\n}`
    }
  },
  {
    id: 'engineer',
    name: 'Engineer Agent',
    role: 'Code Generation',
    x: 300,
    y: 320,
    icon: Bot,
    color: '#000000',
    details: {
      inputs: ['Architecture Specifications', 'Conflict Assessment Reports'],
      outputs: ['Target Source Files', 'Automated Unit Tests'],
      schema: `{\n  "files": [\n    {\n      "path": "src/auth/oauth.ts",\n      "lines_generated": 142,\n      "unit_tests": "src/auth/__tests__/oauth.test.ts"\n    }\n  ]\n}`
    }
  },
  {
    id: 'security',
    name: 'Security Agent',
    role: 'CVE & Code Auditor',
    x: 520,
    y: 140,
    icon: Shield,
    color: '#000000',
    details: {
      inputs: ['Generated Source Files', 'Dependency Configs'],
      outputs: ['AST Audit Reports', 'Vulnerability Flag Ledgers'],
      schema: `{\n  "files_scanned": 4,\n  "vulnerabilities": [],\n  "sast_score": 100,\n  "status": "passed_audit"\n}`
    }
  },
  {
    id: 'compliance',
    name: 'Compliance Agent',
    role: 'Policy Guardrail',
    x: 520,
    y: 260,
    icon: FileCheck,
    color: '#000000',
    details: {
      inputs: ['AST Audit Reports', 'Agent Execution Trails'],
      outputs: ['SOC2 Attestation Tokens', 'Human Gatekeeper Hold Tokens'],
      schema: `{\n  "soc2_policy_check": "passed",\n  "require_manual_signoff": true,\n  "compliance_id": "COMP-901"\n}`
    }
  }
];

const connections: Connection[] = [
  // Master -> Others
  { from: 'master', to: 'architect', label: '1. Specs', path: 'M 130 185 L 250 100' },
  { from: 'master', to: 'conflict', label: '2. Check', path: 'M 130 200 L 250 200' },
  { from: 'master', to: 'engineer', label: '3. Scope', path: 'M 130 215 L 250 300' },
  // Core Engineering Flow
  { from: 'architect', to: 'engineer', label: 'Inherits Specs', path: 'M 300 130 L 300 270' },
  { from: 'conflict', to: 'engineer', label: 'Tree Clean', path: 'M 300 240 L 300 280' },
  // Engineer -> Quality/Audits
  { from: 'engineer', to: 'security', label: '4. Code Scan', path: 'M 350 305 L 470 170' },
  { from: 'engineer', to: 'compliance', label: '5. Policy Audit', path: 'M 350 320 L 470 270' },
  // Audits -> Master Completion
  { from: 'security', to: 'master', label: 'Security Pass', path: 'M 470 145 C 380 120, 200 120, 120 160' },
  { from: 'compliance', to: 'master', label: 'SOC2 Pass', path: 'M 470 280 C 380 340, 200 320, 120 230' }
];

export function ArchitectureView() {
  const [activeNodeId, setActiveNodeId] = useState<string>('master');
  const [hoveredLink, setHoveredLink] = useState<Connection | null>(null);

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  return (
    <div className="w-full p-8 pt-8">
      {/* Title */}
      <motion.div
        className="mb-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[36px] font-[700] leading-tight tracking-tight mb-2">Swarm architecture</h1>
        <p className="text-[15px] text-black/60 font-[500]">
          Inspect message pathways, active connections, and JSON integration contracts of the agent matrix.
        </p>
      </motion.div>

      {/* Main Graph Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid: SVG Agent Network */}
        <div className="xl:col-span-7 bg-white border border-black/10 rounded-xl p-6 relative overflow-hidden flex items-center justify-center">
          
          {/* Legend */}
          <div className="absolute top-4 left-4 text-[11px] text-black/40 font-[600] flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-black" />
              Direct Route
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 border-t border-dashed border-black/40" />
              Feedback Loop
            </span>
          </div>

          <div className="w-full max-w-[620px] aspect-[620/400]">
            <svg 
              viewBox="0 0 620 400" 
              className="w-full h-full select-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(0,0,0,0.25)" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                </marker>
              </defs>

              {/* Connections (Lines) */}
              {connections.map((conn, idx) => {
                const isHovered = hoveredLink === conn;
                const isFeedback = conn.path.includes('C');
                
                return (
                  <g 
                    key={idx}
                    onMouseEnter={() => setHoveredLink(conn)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="cursor-pointer"
                  >
                    {/* Thick touch-target for hover */}
                    <path
                      d={conn.path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={12}
                    />
                    
                    {/* Rendered line */}
                    <path
                      d={conn.path}
                      fill="none"
                      stroke={isHovered ? '#000000' : 'rgba(0,0,0,0.1)'}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      strokeDasharray={isFeedback ? '4,4' : undefined}
                      markerEnd={isHovered ? 'url(#arrow-active)' : 'url(#arrow)'}
                      className="transition-all duration-200"
                    />

                    {/* Flowing particle animation for hovered link */}
                    {isHovered && (
                      <path
                        d={conn.path}
                        fill="none"
                        stroke="#000000"
                        strokeWidth={2.5}
                        strokeDasharray="10,40"
                        className="animate-[dash_2s_linear_infinite]"
                        style={{
                          strokeDashoffset: 100,
                        }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes (Circles) */}
              {nodes.map((node) => {
                const isActive = activeNodeId === node.id;
                const Icon = node.icon;
                
                return (
                  <g 
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setActiveNodeId(node.id)}
                    className="cursor-pointer"
                  >
                    {/* Ring for active node */}
                    {isActive && (
                      <motion.circle
                        r={34}
                        fill="none"
                        stroke="#000000"
                        strokeWidth={1.5}
                        layoutId="activeArchitectureNodeRing"
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      />
                    )}

                    {/* Node bubble */}
                    <circle
                      r={26}
                      fill="#ffffff"
                      stroke={isActive ? '#000000' : 'rgba(0,0,0,0.1)'}
                      strokeWidth={isActive ? 2 : 1.5}
                      className="transition-all duration-300 hover:stroke-black"
                    />

                    {/* Icon */}
                    <g transform="translate(-11, -11)">
                      <Icon className={`w-5.5 h-5.5 ${isActive ? 'text-black' : 'text-black/40'} transition-colors duration-300`} />
                    </g>

                    {/* Label */}
                    <text
                      y={42}
                      textAnchor="middle"
                      className={`text-[11px] font-[600] tracking-tight ${isActive ? 'fill-black font-[700]' : 'fill-black/50'}`}
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Inline CSS for dash array animation */}
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -100;
                }
              }
            `}</style>
          </div>
        </div>

        {/* Right Grid: Inspector Panel */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-black/10 rounded-xl p-6 md:p-8 flex flex-col gap-6"
            >
              {/* Header Info */}
              <div className="border-b border-black/10 pb-6 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-[700] text-black/40 uppercase tracking-wider mb-1">
                    Interface Inspector
                  </div>
                  <h2 className="text-[22px] font-[700] tracking-tight text-black flex items-center gap-2">
                    {activeNode.name}
                  </h2>
                  <p className="text-[13px] text-black/50 font-[500] mt-0.5">{activeNode.role}</p>
                </div>
                
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center border border-black/5">
                  <activeNode.icon className="w-6 h-6 text-black" />
                </div>
              </div>

              {/* Input / Output Specs */}
              <div className="grid grid-cols-2 gap-4 border-b border-black/10 pb-6">
                <div>
                  <h4 className="text-[12px] font-[700] text-black/45 mb-2.5 uppercase tracking-wider">Inputs</h4>
                  <ul className="space-y-1.5">
                    {activeNode.details.inputs.map((inp, idx) => (
                      <li key={idx} className="text-[12px] font-[500] text-black/75 flex items-center gap-1.5 leading-tight">
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-black/30" />
                        {inp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[12px] font-[700] text-black/45 mb-2.5 uppercase tracking-wider">Outputs</h4>
                  <ul className="space-y-1.5">
                    {activeNode.details.outputs.map((out, idx) => (
                      <li key={idx} className="text-[12px] font-[500] text-black/75 flex items-center gap-1.5 leading-tight">
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 text-black/30" />
                        {out}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Payload Schema Console */}
              <div>
                <h4 className="text-[12px] font-[700] text-black/45 mb-2.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Contract JSON schema</span>
                  <span className="flex items-center gap-1 text-[10px] font-[600] text-black/60 bg-[#f7f7f7] border border-black/5 px-1.5 py-0.5 rounded uppercase font-sans">
                    <Terminal className="w-3 h-3 text-black/40" />
                    payload
                  </span>
                </h4>

                <div className="bg-[#f7f7f7] border border-black/5 rounded-xl p-4 font-mono text-[12px] text-black/75 overflow-x-auto whitespace-pre leading-relaxed select-text">
                  {activeNode.details.schema}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hovered Connection helper */}
          {hoveredLink && (
            <motion.div 
              className="bg-black text-white p-4 rounded-xl flex items-center justify-between"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-white/70" />
                <span className="text-[12px] font-[600]">
                  Connection Protocol: <strong className="font-[700] text-white ml-1">{hoveredLink.label}</strong>
                </span>
              </div>
              <span className="text-[11px] font-[600] text-white/50">{hoveredLink.from} $\rightarrow$ {hoveredLink.to}</span>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
