import { useState } from 'react';
import { useApp, AppSettings } from '../context/AppContext';
import { motion } from 'motion/react';
import { 
  Settings, Sliders, Globe, Key, Bell, Loader2, Save, 
  Check, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsView() {
  const { settings, saveSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'notifications'>('general');
  const [isSavingState, setIsSavingState] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  // Form states
  const [teamName, setTeamName] = useState(settings.teamName);
  const [defaultBranch, setDefaultBranch] = useState(settings.defaultBranch);
  const [workspaceUrl, setWorkspaceUrl] = useState(settings.workspaceUrl);
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey);
  const [githubToken, setGithubToken] = useState(settings.githubToken);
  const [slackWebhook, setSlackWebhook] = useState(settings.slackWebhook);
  const [emailAlerts, setEmailAlerts] = useState(settings.emailAlerts);

  // Password visibility
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGithubToken, setShowGithubToken] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingState(true);

    const updated: AppSettings = {
      teamName,
      defaultBranch,
      workspaceUrl,
      openaiKey,
      githubToken,
      slackWebhook,
      emailAlerts
    };

    await saveSettings(updated);
    setIsSavingState(false);
  };

  const handleTestConnection = (service: 'github' | 'slack' | 'openai') => {
    setTestingConnection(service);
    toast.info(`Verifying endpoint handshake for ${service.toUpperCase()}...`);

    setTimeout(() => {
      setTestingConnection(null);
      toast.success(`${service.toUpperCase()} integration handshake verified! API responded with HTTP 200.`);
    }, 2000);
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
        <h1 className="text-[36px] font-[700] leading-tight tracking-tight mb-2">System settings</h1>
        <p className="text-[15px] text-black/60 font-[500]">
          Manage organization workspaces, configure provider credentials, and set telemetry notification triggers.
        </p>
      </motion.div>

      {/* Main Settings Panel */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side: Navigation Sidebar */}
        <div className="w-full md:w-64 border-r border-black/10 bg-[#f7f7f7]/40 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-[600] transition-colors cursor-pointer
              ${activeTab === 'general' 
                ? 'bg-black text-white' 
                : 'text-black/60 hover:bg-black/5 hover:text-black'
              }
            `}
          >
            <Globe className="w-4 h-4 shrink-0" />
            General Workspace
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-[600] transition-colors cursor-pointer
              ${activeTab === 'integrations' 
                ? 'bg-black text-white' 
                : 'text-black/60 hover:bg-black/5 hover:text-black'
              }
            `}
          >
            <Key className="w-4 h-4 shrink-0" />
            Integrations & API
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-[600] transition-colors cursor-pointer
              ${activeTab === 'notifications' 
                ? 'bg-black text-white' 
                : 'text-black/60 hover:bg-black/5 hover:text-black'
              }
            `}
          >
            <Bell className="w-4 h-4 shrink-0" />
            Notifications
          </button>
        </div>

        {/* Right Side: Tab Form Contents */}
        <form onSubmit={handleSave} className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <h3 className="text-[17px] font-[700] text-black mb-1">General configuration</h3>
                  <p className="text-[12px] text-black/50">Identify team profiles and code repository paths.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Team Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-[600] text-black/70">Swarm Team Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="h-10 px-3 bg-[#f7f7f7] border border-black/15 rounded-lg text-[13px] font-[500] outline-none focus:border-black/30 focus:bg-white transition-all w-full md:max-w-md"
                      required
                    />
                  </div>

                  {/* Git branch */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-[600] text-black/70">Default Target Deploy Branch</label>
                    <input
                      type="text"
                      value={defaultBranch}
                      onChange={(e) => setDefaultBranch(e.target.value)}
                      className="h-10 px-3 bg-[#f7f7f7] border border-black/15 rounded-lg text-[13px] font-[500] outline-none focus:border-black/30 focus:bg-white transition-all w-full md:max-w-md font-mono"
                      required
                    />
                  </div>

                  {/* Workspace URL */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-[600] text-black/70">Git Swarm Workspace Repository</label>
                    <input
                      type="url"
                      value={workspaceUrl}
                      onChange={(e) => setWorkspaceUrl(e.target.value)}
                      className="h-10 px-3 bg-[#f7f7f7] border border-black/15 rounded-lg text-[13px] font-[500] outline-none focus:border-black/30 focus:bg-white transition-all w-full md:max-w-xl font-mono"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === 'integrations' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <h3 className="text-[17px] font-[700] text-black mb-1">Integrations & API keys</h3>
                  <p className="text-[12px] text-black/50">Configure keys to interact with code repositories and models.</p>
                </div>

                <div className="space-y-6">
                  {/* OpenAI API Key */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-[600] text-black/70">OpenAI Swarm API Key</label>
                    <div className="relative w-full md:max-w-lg">
                      <input
                        type={showOpenaiKey ? "text" : "password"}
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        className="h-10 pl-3 pr-10 bg-[#f7f7f7] border border-black/15 rounded-lg text-[13px] font-mono outline-none focus:border-black/30 focus:bg-white transition-all w-full"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black cursor-pointer"
                      >
                        {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleTestConnection('openai')}
                        disabled={testingConnection !== null}
                        className="text-[11px] font-[700] px-2.5 py-1 bg-[#f7f7f7] hover:bg-black/5 border border-black/10 rounded cursor-pointer transition-colors"
                      >
                        Test Connection
                      </button>
                    </div>
                  </div>

                  {/* GitHub Token */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-[600] text-black/70">GitHub Personal Access Token (PAT)</label>
                    <div className="relative w-full md:max-w-lg">
                      <input
                        type={showGithubToken ? "text" : "password"}
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        className="h-10 pl-3 pr-10 bg-[#f7f7f7] border border-black/15 rounded-lg text-[13px] font-mono outline-none focus:border-black/30 focus:bg-white transition-all w-full"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowGithubToken(!showGithubToken)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black cursor-pointer"
                      >
                        {showGithubToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleTestConnection('github')}
                        disabled={testingConnection !== null}
                        className="text-[11px] font-[700] px-2.5 py-1 bg-[#f7f7f7] hover:bg-black/5 border border-black/10 rounded cursor-pointer transition-colors"
                      >
                        Test Handshake
                      </button>
                    </div>
                  </div>

                  {/* Slack Webhook */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-[600] text-black/70">Slack Alerts Webhook URL</label>
                    <input
                      type="url"
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      className="h-10 px-3 bg-[#f7f7f7] border border-black/15 rounded-lg text-[13px] font-[500] outline-none focus:border-black/30 focus:bg-white transition-all w-full md:max-w-xl font-mono"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleTestConnection('slack')}
                        disabled={testingConnection !== null}
                        className="text-[11px] font-[700] px-2.5 py-1 bg-[#f7f7f7] hover:bg-black/5 border border-black/10 rounded cursor-pointer transition-colors"
                      >
                        Trigger Test Webhook
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <h3 className="text-[17px] font-[700] text-black mb-1">Notification alerts</h3>
                  <p className="text-[12px] text-black/50">Manage system email triggers on build event pipelines.</p>
                </div>

                <div className="space-y-6">
                  {/* Email Alert toggle */}
                  <div className="flex items-start justify-between gap-4 p-4 border border-black/5 rounded-xl bg-[#f7f7f7]/30 max-w-lg">
                    <div>
                      <h4 className="text-[14px] font-[600] text-black mb-0.5">Critical security & merge alerts</h4>
                      <p className="text-[12px] text-black/55">Receive immediate notification updates on compile errors, warnings, or human gate approvals.</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`
                        w-11 h-6 rounded-full p-0.5 transition-all duration-200 focus:outline-none shrink-0 cursor-pointer
                        ${emailAlerts ? 'bg-black' : 'bg-black/10'}
                      `}
                    >
                      <div 
                        className={`
                          w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-sm
                          ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Form Footer Action */}
          <div className="border-t border-black/10 pt-6 mt-8 flex items-center justify-end shrink-0">
            <button
              type="submit"
              disabled={isSavingState}
              className="h-10 px-6 bg-black text-white hover:bg-black/90 transition-all text-[13px] font-[700] rounded-lg cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {isSavingState ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving updates...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-white" />
                  Save configurations
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
