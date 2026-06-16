import { useState } from 'react';
import { motion } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { AgentWorkflow } from './components/AgentWorkflow';
import { LiveAgentFeed } from './components/LiveAgentFeed';
import { FeatureExecution } from './components/FeatureExecution';
import { GovernanceTimeline } from './components/GovernanceTimeline';
import { CodeReviewPanel } from './components/CodeReviewPanel';
import { Sparkles, Bot, Shield, TrendingDown, ArrowRight, Play } from 'lucide-react';
import { Routes, Route, useLocation, useNavigate } from 'react-router';
import { CommandPalette } from './components/CommandPalette';
import { LaunchWorkflowDialog } from './components/LaunchWorkflowDialog';
import { Toaster } from './components/ui/sonner';
import { SecurityInsightsChart } from './components/SecurityInsightsChart';

// Import newly implemented views
import { AppContextProvider, useApp } from './context/AppContext';
import { FeaturesView } from './components/FeaturesView';
import { AgentsView } from './components/AgentsView';
import { ArchitectureView } from './components/ArchitectureView';
import { SecurityView } from './components/SecurityView';
import { GovernanceView } from './components/GovernanceView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';

interface DashboardViewProps {
  metrics: {
    featuresGeneratedThisMonth: number;
    featuresGenerated: number;
    activeAgents: number;
    securityFindings: number;
    costSavings: number;
  };
  onLaunchClick: () => void;
  onViewArchitecture: () => void;
}

function DashboardView({ metrics, onLaunchClick, onViewArchitecture }: DashboardViewProps) {
  return (
    <div className="w-full p-8">
      {/* Hero Section */}
      <motion.div
        className="mb-16 pt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-[48px] font-[700] leading-[1.1] tracking-tight mb-3">
          AI Engineering Command Center
        </h1>
        <p className="text-[18px] text-black/60 font-[500] mb-8">
          Orchestrate, govern, and scale autonomous software development.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={onLaunchClick}
            className="h-10 px-6 rounded-md bg-black text-white text-[14px] font-[600] tracking-tight hover:bg-black/90 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Play className="w-4 h-4" strokeWidth={2} />
            Launch Workflow
          </button>
          <button 
            onClick={onViewArchitecture}
            className="h-10 px-6 rounded-md border border-gray-200 bg-white text-black text-[14px] font-[600] tracking-tight hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            View Architecture
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
          <span className="text-[12px] text-black/40 font-[500] ml-2">
            {metrics.featuresGeneratedThisMonth} features generated this month
          </span>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard
          title="Features Generated"
          value={metrics.featuresGenerated}
          icon={Sparkles}
          trend="+23% this week"
          delay={0.1}
        />
        <StatCard
          title="Active Agents"
          value={metrics.activeAgents}
          icon={Bot}
          trend="Swarm active"
          delay={0.15}
        />
        <StatCard
          title="Security Findings"
          value={metrics.securityFindings}
          icon={Shield}
          trend="-67% vs last week"
          delay={0.2}
        />
        <StatCard
          title="Cost Savings"
          value={metrics.costSavings}
          unit="%"
          icon={TrendingDown}
          trend="vs manual dev"
          delay={0.25}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {/* Agent Workflow - 2 columns */}
        <div className="col-span-1 lg:col-span-2">
          <AgentWorkflow />
        </div>

        {/* Live Feed - 1 column */}
        <div className="col-span-1">
          <LiveAgentFeed />
        </div>
      </div>

      {/* Feature Execution */}
      <div className="mb-16">
        <FeatureExecution />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        <GovernanceTimeline />
        <div>
          <SecurityInsightsChart />
        </div>
      </div>

      {/* Code Review Panel */}
      <div className="mb-16">
        <CodeReviewPanel />
      </div>

      {/* Footer Spacing */}
      <div className="h-16" />
    </div>
  );
}

function PlaceholderView() {
  const location = useLocation();
  return (
    <div className="w-full p-8 pt-16">
      <motion.div
        className="bg-white border border-black/10 rounded-xl p-8 shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-[36px] font-[700] leading-tight mb-4 capitalize">
          {location.pathname.replace('/', '')}
        </h1>
        <p className="text-[16px] text-black/60 font-[500]">
          This section of the NexusCore command center is currently under development.
        </p>
      </motion.div>
    </div>
  );
}

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { metrics, launchWorkflow } = useApp();

  const handleLaunchSuccess = (featureName: string, agentName: string) => {
    launchWorkflow(featureName, 'nexuscore-workspace', agentName);
  };

  const handleViewArchitecture = () => {
    navigate('/architecture');
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onSearchClick={() => setCommandPaletteOpen(true)}
      />

      {/* Main Content */}
      <div className="ml-0 md:ml-64 pt-16 transition-all duration-300">
        <Routes>
          <Route path="/" element={
            <DashboardView 
              metrics={metrics} 
              onLaunchClick={() => setLaunchDialogOpen(true)} 
              onViewArchitecture={handleViewArchitecture}
            />
          } />
          <Route path="/features" element={<FeaturesView />} />
          <Route path="/agents" element={<AgentsView />} />
          <Route path="/architecture" element={<ArchitectureView />} />
          <Route path="/security" element={<SecurityView />} />
          <Route path="/governance" element={<GovernanceView />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="*" element={<PlaceholderView />} />
        </Routes>
      </div>

      {/* Command Menu (Ctrl/Cmd + K) */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        setIsOpen={setCommandPaletteOpen}
        onLaunchWorkflow={() => setLaunchDialogOpen(true)}
        onViewArchitecture={handleViewArchitecture}
      />

      {/* Launch Workflow Dialog */}
      <LaunchWorkflowDialog 
        isOpen={launchDialogOpen}
        onClose={() => setLaunchDialogOpen(false)}
        onLaunchSuccess={handleLaunchSuccess}
      />

      {/* Global Toaster notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppContextProvider>
      <MainLayout />
    </AppContextProvider>
  );
}
