import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export interface FeatureStage {
  name: string;
  status: 'complete' | 'active' | 'pending' | 'failed';
}

export interface Feature {
  id: string;
  name: string;
  repo: string;
  agent: string;
  status: 'completed' | 'running' | 'failed' | 'awaiting_approval';
  createdAt: string;
  elapsed: string; // in minutes
  currentStageIndex: number;
  stages: FeatureStage[];
  logs: string[];
}

export interface AgentConfig {
  model: string;
  temperature: number;
  memoryLimit: number;
  systemPrompt: string;
}

export interface Agent {
  name: string;
  role: string;
  status: 'idle' | 'active' | 'generating' | 'scanning' | 'reviewing';
  tasksHandled: number;
  successRate: number;
  iconName: string;
  config: AgentConfig;
}

export interface SecurityFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  file: string;
  line: number;
  status: 'open' | 'resolved';
  detectedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  category: 'workflow' | 'policy' | 'security' | 'approval';
  details: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AppSettings {
  teamName: string;
  defaultBranch: string;
  workspaceUrl: string;
  openaiKey: string;
  githubToken: string;
  slackWebhook: string;
  emailAlerts: boolean;
}

interface AppContextType {
  metrics: {
    featuresGeneratedThisMonth: number;
    featuresGenerated: number;
    activeAgents: number;
    securityFindings: number;
    costSavings: number;
  };
  features: Feature[];
  agents: Agent[];
  securityFindings: SecurityFinding[];
  auditLogs: AuditLog[];
  policies: GovernancePolicy[];
  settings: AppSettings;
  launchWorkflow: (name: string, repo: string, agentName: string) => void;
  approveFeature: (id: string) => void;
  rejectFeature: (id: string) => void;
  runSecurityScan: () => Promise<void>;
  updateAgentConfig: (name: string, config: Partial<AgentConfig>) => void;
  saveSettings: (newSettings: AppSettings) => Promise<void>;
  togglePolicy: (id: string) => void;
  isScanning: boolean;
  activeFeatureId: string | null;
  setActiveFeatureId: (id: string | null) => void;
}

const defaultStages: FeatureStage[] = [
  { name: 'Planning', status: 'pending' },
  { name: 'Architecture', status: 'pending' },
  { name: 'Conflict Review', status: 'pending' },
  { name: 'Engineering', status: 'pending' },
  { name: 'Security Review', status: 'pending' },
  { name: 'Compliance', status: 'pending' },
  { name: 'Approved', status: 'pending' }
];

const initialFeatures: Feature[] = [
  {
    id: 'feat-1',
    name: 'OAuth2 Authentication Module',
    repo: 'nexus-gateway',
    agent: 'Master Agent',
    status: 'completed',
    createdAt: '2026-06-16 10:15',
    elapsed: '12m',
    currentStageIndex: 6,
    stages: defaultStages.map(s => ({ ...s, status: 'complete' })),
    logs: [
      '[10:15:02] Master Agent: Registered request for "OAuth2 Authentication Module". Starting feature planning. Architect Agent: analyze this request in Band room.',
      '[10:15:20] Architect Agent: Posted initial spec draft to Band room:\n\nARCHITECTURE PLAN:\n- New module: auth-service\n- Dependencies: user-service (read), token-service (write)\n- Key components: OAuth2 handler, JWT factory, refresh rotator\n- Entry point: POST /auth/login, POST /auth/refresh',
      '[10:16:05] Conflict Agent: Posted conflict assessment to Band room:\n\nCONFLICT FOUND:\n- legacy/session-handler.js handles some auth flows\n- Overlap with planned OAuth2 handler\n- Recommendation: deprecate session-handler or integrate',
      '[10:16:30] Architect Agent: Responded in Band room:\n\nPLAN UPDATED:\n- Will wrap legacy session-handler, not duplicate it\n- Added migration path: session-handler marked deprecated\n- Auth-service will call session-handler for backward compatibility',
      '[10:17:15] Master Agent: Conflict resolved. SPEC APPROVED. Storing to shared memory. Engineer Agent: begin implementation.',
      `[10:17:40] Engineer Agent: Generated code skeleton and posted to Band room:\n\n# auth_service.py\nclass AuthService:\n    def __init__(self, user_service, token_service):\n        self.user_service = user_service\n        self.token_service = token_service\n\n    def oauth2_login(self, provider, code):\n        user = self.user_service.find_or_create(provider, code)\n        access_token = self.token_service.generate_jwt(user.id)\n        refresh_token = self.token_service.generate_refresh(user.id)\n        return {"access": access_token, "refresh": refresh_token}\n\n    def refresh_tokens(self, refresh_token):\n        payload = self.token_service.verify_refresh(refresh_token)\n        new_access = self.token_service.generate_jwt(payload.user_id)\n        new_refresh = self.token_service.rotate_refresh(refresh_token)\n        return {"access": new_access, "refresh": new_refresh}`,
      '[10:18:10] Security Agent: Audited code and posted findings to Band room:\n\nSECURITY FINDINGS:\n1. Line 12: JWT secret hardcoded as string — use env variable\n2. Line 18: refresh_token not validated for expiry before rotation\n   Risk: expired tokens could be rotated indefinitely\nAction required before approval.',
      '[10:18:50] Engineer Agent: Patched issues and posted fix to Band room:\n\nFIXES APPLIED:\n1. JWT secret moved to os.environ[\'JWT_SECRET\']\n2. Added expiry validation in verify_refresh() call',
      '[10:19:30] Compliance Agent: Audited code against spec. Posted review to Band room:\n\nCOMPLIANCE CHECK: PASSED\n- OAuth2 handler: implemented ✓\n- JWT generation: implemented ✓\n- Refresh rotation: implemented ✓\n- Backward compat with session-handler: implemented ✓',
      '[10:20:10] Standards Agent: Audited styling conventions. Posted review to Band room:\n\nSTANDARDS CHECK: PASSED\n- Naming: snake_case consistent ✓\n- Error handling: uses project exception pattern ✓\n- Missing: docstrings on public methods — recommend adding',
      '[10:21:00] Master Agent: final APPROVED decision signed.\n\nMASTER DECISION: APPROVED\nAll security issues resolved. Spec fully implemented.\nRecommendation: add docstrings before final commit.\nToken cost this run: 31,200 tokens.\nAudit log saved to Band room [auth-2026-001].'
    ]
  },
  {
    id: 'feat-2',
    name: 'Redis Cluster Caching Strategy',
    repo: 'nexus-data-cache',
    agent: 'Architect Agent',
    status: 'completed',
    createdAt: '2026-06-15 14:30',
    elapsed: '8m',
    currentStageIndex: 6,
    stages: defaultStages.map(s => ({ ...s, status: 'complete' })),
    logs: [
      '[14:30:11] Master Agent: Cluster strategy cache request registered in Band room.',
      '[14:31:05] Architect Agent: Posted designed node failover configuration schema in Band.',
      '[14:32:40] Conflict Agent: Merge conflict resolved in local configuration files in Band.',
      '[14:34:10] Engineer Agent: Redis connector and connection pool classes written and posted.',
      '[14:36:20] Security Agent: Checked TLS configurations and signed off on SSL cert parsing.',
      '[14:37:15] Compliance Agent: Compliance rules met for data encryption.',
      '[14:37:45] Standards Agent: Code standards check passed.',
      '[14:38:00] Master Agent: Automatic deployment to production succeeded. PR merged.'
    ]
  },
  {
    id: 'feat-3',
    name: 'Real-time Analytics Webhook',
    repo: 'nexus-analytics-hub',
    agent: 'Engineer Agent',
    status: 'completed',
    createdAt: '2026-06-15 09:12',
    elapsed: '15m',
    currentStageIndex: 6,
    stages: defaultStages.map(s => ({ ...s, status: 'complete' })),
    logs: [
      '[09:12:00] Master Agent: Started feature request in Band room.',
      '[09:13:40] Architect Agent: Configured webhook retry system architecture and posted to Band.',
      '[09:15:12] Conflict Agent: Clean workspace verified.',
      '[09:19:22] Engineer Agent: Generated fastify server hooks and pubsub event dispatchers.',
      '[09:23:45] Security Agent: Secure signature verification code review passed.',
      '[09:25:30] Compliance Agent: Data leak controls verified.',
      '[09:26:15] Standards Agent: Code style verified.',
      '[09:27:00] Master Agent: PR automatically reviewed and merged. Shared memory updated.'
    ]
  },
  {
    id: 'feat-4',
    name: 'Auto-scaler Configuration Agent',
    repo: 'nexus-infra-ops',
    agent: 'Master Agent',
    status: 'failed',
    createdAt: '2026-06-14 18:22',
    elapsed: '6m',
    currentStageIndex: 4,
    stages: [
      { name: 'Planning', status: 'complete' },
      { name: 'Architecture', status: 'complete' },
      { name: 'Conflict Review', status: 'complete' },
      { name: 'Engineering', status: 'complete' },
      { name: 'Security Review', status: 'failed' },
      { name: 'Compliance', status: 'pending' },
      { name: 'Approved', status: 'pending' }
    ],
    logs: [
      '[18:22:10] Master Agent: Auto-scaling configuration initiated in Band.',
      '[18:23:05] Architect Agent: Defined memory pressure thresholds.',
      '[18:24:20] Conflict Agent: Synced with upstream repository.',
      '[18:25:40] Engineer Agent: Written deployment configuration yaml.',
      '[18:27:15] Security Agent: CRITICAL VULNERABILITY DETECTED in Band room: Execution shell command strings are built using unescaped parameters (Remote Code Execution risk). Aborting workflow.'
    ]
  }
];

const initialAgents: Agent[] = [
  {
    name: 'Master Agent',
    role: 'Swarm Orchestration & Routing',
    status: 'idle',
    tasksHandled: 142,
    successRate: 98.5,
    iconName: 'Bot',
    config: {
      model: 'gemini-1.5-pro',
      temperature: 0.1,
      memoryLimit: 8192,
      systemPrompt: 'You are the Master Orchestration Agent. Coordinate features, route subtasks to agents, and manage pull requests.'
    }
  },
  {
    name: 'Architect Agent',
    role: 'System Design Planner',
    status: 'idle',
    tasksHandled: 98,
    successRate: 97.2,
    iconName: 'GitBranch',
    config: {
      model: 'claude-3-5-sonnet',
      temperature: 0.2,
      memoryLimit: 16384,
      systemPrompt: 'You are the Architect Agent. Design system components, database schemas, and API contracts. Focus on modularity.'
    }
  },
  {
    name: 'Conflict Agent',
    role: 'Git AST Conflict Reviewer',
    status: 'idle',
    tasksHandled: 64,
    successRate: 95.8,
    iconName: 'AlertCircle',
    config: {
      model: 'gpt-4o',
      temperature: 0.0,
      memoryLimit: 4096,
      systemPrompt: 'You are the Conflict Agent (devil\'s advocate). Find overlaps or conflicts with legacy modules or other branches.'
    }
  },
  {
    name: 'Engineer Agent',
    role: 'Code Generation Foundation Builder',
    status: 'idle',
    tasksHandled: 212,
    successRate: 96.7,
    iconName: 'Bot',
    config: {
      model: 'gemini-1.5-pro',
      temperature: 0.3,
      memoryLimit: 8192,
      systemPrompt: 'You are the Lead Engineering Agent. Implement optimal, readable code structures. Generate unit tests automatically.'
    }
  },
  {
    name: 'Security Agent',
    role: 'SAST & Vulnerability Scanner',
    status: 'idle',
    tasksHandled: 154,
    successRate: 99.1,
    iconName: 'Shield',
    config: {
      model: 'gpt-4o',
      temperature: 0.1,
      memoryLimit: 8192,
      systemPrompt: 'You are the Security Auditor Agent. Perform static analysis, scan dependencies for CVEs, and inspect code for secrets or OWASP issues.'
    }
  },
  {
    name: 'Compliance Agent',
    role: 'Governance & Spec Enforcer',
    status: 'idle',
    tasksHandled: 110,
    successRate: 100.0,
    iconName: 'FileCheck',
    config: {
      model: 'claude-3-5-haiku',
      temperature: 0.0,
      memoryLimit: 4096,
      systemPrompt: 'You are the Policy Compliance Agent. Cross-reference all code and architectures against SOC2, GDPR, and organizational policies.'
    }
  },
  {
    name: 'Standards Agent',
    role: 'Team Convention & Code Style Keeper',
    status: 'idle',
    tasksHandled: 120,
    successRate: 99.4,
    iconName: 'FileCheck',
    config: {
      model: 'claude-3-5-haiku',
      temperature: 0.0,
      memoryLimit: 4096,
      systemPrompt: 'You are the Standards Agent. Validate code against team style sheets, conventions, naming patterns, and comment practices.'
    }
  }
];

const initialFindings: SecurityFinding[] = [
  {
    id: 'SEC-104',
    severity: 'high',
    title: 'Hardcoded SSH Private Key in Environment Config',
    file: 'config/production.json',
    line: 42,
    status: 'open',
    detectedAt: '2026-06-16 11:24'
  },
  {
    id: 'SEC-105',
    severity: 'medium',
    title: 'SQL Injection Vulnerability in User Repository',
    file: 'src/db/userRepository.ts',
    line: 87,
    status: 'open',
    detectedAt: '2026-06-15 15:45'
  },
  {
    id: 'SEC-106',
    severity: 'low',
    title: 'Outdated dependency: lodash < 4.17.21 (Prototype Pollution)',
    file: 'package.json',
    line: 52,
    status: 'open',
    detectedAt: '2026-06-14 09:10'
  }
];

const initialLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-06-16 10:21',
    action: 'Code Auto-Merge Approved',
    actor: 'Compliance Agent',
    category: 'workflow',
    details: 'OAuth2 Authentication Module merged to main after passing SOC2 rules.'
  },
  {
    id: 'log-2',
    timestamp: '2026-06-16 09:00',
    action: 'Governance Policy Changed',
    actor: 'admin@nexuscore.ai',
    category: 'policy',
    details: 'Policy "Require Human Approval for Commits" was toggled to ON.'
  },
  {
    id: 'log-3',
    timestamp: '2026-06-15 14:38',
    action: 'Automatic Deployment Succeeded',
    actor: 'Master Agent',
    category: 'workflow',
    details: 'Redis Cluster Caching Strategy successfully built and shipped to prod.'
  },
  {
    id: 'log-4',
    timestamp: '2026-06-14 18:27',
    action: 'Workflow Blocked by Security Policy',
    actor: 'Security Agent',
    category: 'security',
    details: 'Auto-scaler Configuration Agent blocked. RCE risk detected in shell string building.'
  }
];

const initialPolicies: GovernancePolicy[] = [
  {
    id: 'pol-1',
    name: 'Require Human Approval for Code Commits',
    description: 'When enabled, the automated pipeline will hold code merges in the "Compliance" step until a team member manually approves.',
    enabled: true
  },
  {
    id: 'pol-2',
    name: 'Block Insecure LLM Model Versions',
    description: 'Ensure only models passing enterprise security validation protocols can be mapped inside agent configurations.',
    enabled: true
  },
  {
    id: 'pol-3',
    name: 'Strict SOC2 Compliance Validation',
    description: 'Reject workflows that alter identity mechanisms, storage schemas, or encryption keys without strict audit trails.',
    enabled: false
  }
];

const initialSettings: AppSettings = {
  teamName: 'Nexus Core Core team',
  defaultBranch: 'main',
  workspaceUrl: 'https://github.com/nexuscore-ai/command-center',
  openaiKey: '',
  githubToken: '',
  slackWebhook: '',
  emailAlerts: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState({
    featuresGeneratedThisMonth: 247,
    featuresGenerated: 247,
    activeAgents: 0,
    securityFindings: 3,
    costSavings: 89
  });

  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [securityFindings, setSecurityFindings] = useState<SecurityFinding[]>(initialFindings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialLogs);
  const [policies, setPolicies] = useState<GovernancePolicy[]>(initialPolicies);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isScanning, setIsScanning] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);

  // Update active agents metric based on actual statuses
  useEffect(() => {
    const activeCount = agents.filter(a => a.status !== 'idle').length;
    setMetrics(prev => ({
      ...prev,
      activeAgents: activeCount
    }));
  }, [agents]);

  // Simulate active workflow progression
  const launchWorkflow = (name: string, repo: string, agentName: string) => {
    const newId = `feat-${Date.now()}`;
    const customStages = defaultStages.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'active' as const : 'pending' as const
    }));

    const newFeature: Feature = {
      id: newId,
      name,
      repo,
      agent: agentName,
      status: 'running',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      elapsed: '0m',
      currentStageIndex: 0,
      stages: customStages,
      logs: [`[${new Date().toLocaleTimeString()}] Master Agent: Registered request for feature "${name}" on repository "${repo}". Starting feature planning in Band room.`]
    };

    setFeatures(prev => [newFeature, ...prev]);
    setActiveFeatureId(newId);
    toast.success(`Workflow started: "${name}"`);

    // Add audit log
    const newAudit: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Workflow Launched',
      actor: 'User Dashboard',
      category: 'workflow',
      details: `Started workflow "${name}" routing through ${agentName}.`
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    // Background workflow simulator
    let stage = 0;
    const stageDurations = [3000, 3500, 3000, 4000, 4500, 4000, 3000];
    
    const runNextStage = () => {
      setFeatures(prevFeatures => {
        const feat = prevFeatures.find(f => f.id === newId);
        if (!feat || feat.status !== 'running') return prevFeatures;

        const nextStageIndex = stage + 1;
        const updatedStages = feat.stages.map((st, idx) => {
          if (idx < stage) return { ...st, status: 'complete' as const };
          if (idx === stage) return { ...st, status: 'complete' as const };
          if (idx === nextStageIndex) return { ...st, status: 'active' as const };
          return st;
        });

        // Generate simulated logs
        const logMsgs = [...feat.logs];
        const time = new Date().toLocaleTimeString();
        
        if (stage === 0) {
          logMsgs.push(`[${time}] Architect Agent: Creating system architecture models in Band room.`);
          setAgents(prev => prev.map(a => a.name === 'Architect Agent' ? { ...a, status: 'active' } : a));
        } else if (stage === 1) {
          logMsgs.push(`[${time}] Conflict Agent: Analyzing git trees for merge overlaps. Posted findings to Band.`);
          setAgents(prev => prev.map(a => 
            a.name === 'Architect Agent' ? { ...a, status: 'idle', tasksHandled: a.tasksHandled + 1 } :
            a.name === 'Conflict Agent' ? { ...a, status: 'active' } : a
          ));
        } else if (stage === 2) {
          logMsgs.push(`[${time}] Engineer Agent: Generating target source files skeleton.`);
          setAgents(prev => prev.map(a => 
            a.name === 'Conflict Agent' ? { ...a, status: 'idle', tasksHandled: a.tasksHandled + 1 } :
            a.name === 'Engineer Agent' ? { ...a, status: 'generating' } : a
          ));
        } else if (stage === 3) {
          logMsgs.push(`[${time}] Security Agent: Reviewing code for vulnerabilities & AST scans in Band.`);
          setAgents(prev => prev.map(a => 
            a.name === 'Engineer Agent' ? { ...a, status: 'idle', tasksHandled: a.tasksHandled + 1 } :
            a.name === 'Security Agent' ? { ...a, status: 'scanning' } : a
          ));
        } else if (stage === 4) {
          logMsgs.push(`[${time}] Compliance Agent: Validating code structure against approved spec schema.`);
          setAgents(prev => prev.map(a => 
            a.name === 'Security Agent' ? { ...a, status: 'idle', tasksHandled: a.tasksHandled + 1 } :
            a.name === 'Compliance Agent' ? { ...a, status: 'reviewing' } : a
          ));
        } else if (stage === 5) {
          logMsgs.push(`[${time}] Standards Agent: Checking naming conventions and style patterns.`);
          setAgents(prev => prev.map(a => 
            a.name === 'Compliance Agent' ? { ...a, status: 'idle', tasksHandled: a.tasksHandled + 1 } :
            a.name === 'Standards Agent' ? { ...a, status: 'reviewing' } : a
          ));
        }

        stage = nextStageIndex;

        // Is human approval policy active? Hold feature at Compliance stage!
        const approvalPolicyActive = policies.find(p => p.id === 'pol-1')?.enabled;

        if (stage === 6 && approvalPolicyActive) {
          // Pause and request human approval
          logMsgs.push(`[${time}] Standards Agent: Code standards check passed. Holding feature for Human Gatekeeper Approval.`);
          
          setAgents(prev => prev.map(a => a.name === 'Standards Agent' ? { ...a, status: 'idle', tasksHandled: a.tasksHandled + 1 } : a));

          // Log audit entry
          const approvalAudit: AuditLog = {
            id: `log-${Date.now()}-app`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            action: 'Approval Gate Triggered',
            actor: 'Compliance Agent',
            category: 'approval',
            details: `Feature "${name}" requires manual approval before merge.`
          };
          setAuditLogs(prev => [approvalAudit, ...prev]);
          toast.info(`Workflow "${name}" is holding for manual code approval.`);

          return prevFeatures.map(f => f.id === newId ? {
            ...f,
            status: 'awaiting_approval' as const,
            currentStageIndex: 5,
            stages: updatedStages.map((s, idx) => idx === 5 ? { ...s, status: 'active' as const } : s),
            logs: logMsgs,
            elapsed: '3m'
          } : f);
        }

        // Finalize completed feature (if no approval needed)
        if (stage === 7) {
          logMsgs.push(`[${time}] Master Agent: Merging pull request. Auto-deployment succeeded.`);
          setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
          
          setTimeout(() => {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 }
            });
            toast.success(`Workflow "${name}" completed successfully!`);
          }, 300);

          setMetrics(prev => ({
            ...prev,
            featuresGenerated: prev.featuresGenerated + 1,
            featuresGeneratedThisMonth: prev.featuresGeneratedThisMonth + 1
          }));

          const completionAudit: AuditLog = {
            id: `log-${Date.now()}-comp`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            action: 'Deployment Completed',
            actor: 'Master Agent',
            category: 'workflow',
            details: `Feature "${name}" automatically merged and deployed to production.`
          };
          setAuditLogs(prev => [completionAudit, ...prev]);

          return prevFeatures.map(f => f.id === newId ? {
            ...f,
            status: 'completed' as const,
            currentStageIndex: 6,
            stages: updatedStages.map(s => ({ ...s, status: 'complete' as const })),
            logs: logMsgs,
            elapsed: '4m'
          } : f);
        }

        // Loop next stage
        setTimeout(runNextStage, stageDurations[stage]);

        return prevFeatures.map(f => f.id === newId ? {
          ...f,
          currentStageIndex: Math.min(6, stage),
          stages: updatedStages,
          logs: logMsgs,
          elapsed: `${Math.floor((stage * 40) / 60) + 1}m`
        } : f);
      });
    };

    setTimeout(runNextStage, stageDurations[0]);
  };

  const approveFeature = (id: string) => {
    setFeatures(prev => {
      const feat = prev.find(f => f.id === id);
      if (!feat || feat.status !== 'awaiting_approval') return prev;

      const time = new Date().toLocaleTimeString();
      const updatedLogs = [
        ...feat.logs,
        `[${time}] User Approval: Merge request approved manually.`,
        `[${time}] Master Agent: Merged pull request. Deployment completed.`
      ];

      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.8 }
        });
        toast.success(`Workflow "${feat.name}" approved and deployed!`);
      }, 200);

      setMetrics(prevMetrics => ({
        ...prevMetrics,
        featuresGenerated: prevMetrics.featuresGenerated + 1,
        featuresGeneratedThisMonth: prevMetrics.featuresGeneratedThisMonth + 1
      }));

      const approvalAudit: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        action: 'Human Approved Merge',
        actor: 'User Dashboard',
        category: 'approval',
        details: `Approved merge of feature "${feat.name}" to main branch.`
      };
      setAuditLogs(prevLogs => [approvalAudit, ...prevLogs]);

      return prev.map(f => f.id === id ? {
        ...f,
        status: 'completed' as const,
        currentStageIndex: 6,
        stages: f.stages.map(s => ({ ...s, status: 'complete' as const })),
        logs: updatedLogs,
        elapsed: '5m'
      } : f);
    });
  };

  const rejectFeature = (id: string) => {
    setFeatures(prev => {
      const feat = prev.find(f => f.id === id);
      if (!feat || feat.status !== 'awaiting_approval') return prev;

      const time = new Date().toLocaleTimeString();
      const updatedLogs = [
        ...feat.logs,
        `[${time}] User Rejection: Merge request rejected by User.`,
        `[${time}] Master Agent: Code discarded. Workflow aborted.`
      ];

      toast.error(`Workflow "${feat.name}" rejected.`);

      const rejectAudit: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        action: 'Human Rejected Merge',
        actor: 'User Dashboard',
        category: 'approval',
        details: `Rejected merge of feature "${feat.name}" to main branch.`
      };
      setAuditLogs(prevLogs => [rejectAudit, ...prevLogs]);

      return prev.map(f => f.id === id ? {
        ...f,
        status: 'failed' as const,
        stages: f.stages.map((s, idx) => {
          if (idx === 6) return { ...s, status: 'failed' as const };
          return s;
        }),
        logs: updatedLogs
      } : f);
    });
  };

  const runSecurityScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    toast.info('Running vulnerability scanner across workspaces...');

    // Add audit log
    const scanStartAudit: AuditLog = {
      id: `log-${Date.now()}-scan`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Security Scan Initiated',
      actor: 'User Dashboard',
      category: 'security',
      details: 'Started automated static code review across all active repositories.'
    };
    setAuditLogs(prev => [scanStartAudit, ...prev]);

    // Simulate scan duration
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Randomize whether we find a new warning or resolve a current one
    setSecurityFindings(prev => {
      // Resolve SEC-106 as simulated fix
      const updated = prev.map(f => f.id === 'SEC-106' ? { ...f, status: 'resolved' as const } : f);
      
      // Add a minor new alert
      const hasAlert = Math.random() > 0.4;
      if (hasAlert) {
        const newFinding: SecurityFinding = {
          id: `SEC-${Math.floor(Math.random() * 100) + 110}`,
          severity: 'low',
          title: 'Unused packages containing CVE-2026 warning alerts',
          file: 'package-lock.json',
          line: 23,
          status: 'open',
          detectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        toast.warning('Scan complete: 1 new low severity vulnerability detected.');
        
        // Update metric
        const openFindingsCount = [...updated, newFinding].filter(f => f.status === 'open').length;
        setMetrics(prevMetrics => ({ ...prevMetrics, securityFindings: openFindingsCount }));
        
        return [...updated, newFinding];
      } else {
        toast.success('Scan complete: Workspace is clean. 1 dependency resolved.');
        const openFindingsCount = updated.filter(f => f.status === 'open').length;
        setMetrics(prevMetrics => ({ ...prevMetrics, securityFindings: openFindingsCount }));
        return updated;
      }
    });

    const scanEndAudit: AuditLog = {
      id: `log-${Date.now()}-scan-end`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Security Scan Completed',
      actor: 'Security Agent',
      category: 'security',
      details: 'Scan completed successfully. Code integrity validated.'
    };
    setAuditLogs(prev => [scanEndAudit, ...prev]);
    setIsScanning(false);
  };

  const updateAgentConfig = (name: string, config: Partial<AgentConfig>) => {
    setAgents(prev => prev.map(a => {
      if (a.name === name) {
        toast.success(`${name} configuration updated.`);
        
        // Audit log
        const configAudit: AuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: 'Agent Reconfigured',
          actor: 'User Dashboard',
          category: 'policy',
          details: `Updated parameters for ${name} (Model: ${config.model || a.config.model}).`
        };
        setAuditLogs(prevLogs => [configAudit, ...prevLogs]);

        return { ...a, config: { ...a.config, ...config } };
      }
      return a;
    }));
  };

  const saveSettings = async (newSettings: AppSettings) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSettings(newSettings);
    toast.success('System settings saved successfully.');

    // Audit log
    const settingsAudit: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'System Settings Saved',
      actor: 'User Dashboard',
      category: 'policy',
      details: 'General and integration settings updated by administrator.'
    };
    setAuditLogs(prevLogs => [settingsAudit, ...prevLogs]);
  };

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.enabled;
        toast.success(`Policy "${p.name}" turned ${nextState ? 'ON' : 'OFF'}`);

        // Audit log
        const policyAudit: AuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: 'Policy Toggle',
          actor: 'User Dashboard',
          category: 'policy',
          details: `Policy "${p.name}" changed to ${nextState ? 'ENABLED' : 'DISABLED'}.`
        };
        setAuditLogs(prevLogs => [policyAudit, ...prevLogs]);

        return { ...p, enabled: nextState };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        metrics,
        features,
        agents,
        securityFindings,
        auditLogs,
        policies,
        settings,
        launchWorkflow,
        approveFeature,
        rejectFeature,
        runSecurityScan,
        updateAgentConfig,
        saveSettings,
        togglePolicy,
        isScanning,
        activeFeatureId,
        setActiveFeatureId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
