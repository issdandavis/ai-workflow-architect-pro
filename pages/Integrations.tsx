
import React, { useState } from 'react';
import { 
  Github, 
  Cloud, 
  Database, 
  Send, 
  Zap, 
  Slack, 
  Figma as FigmaIcon, 
  Chrome, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Lock,
  X,
  Key
} from 'lucide-react';

const INITIAL_CONNECTORS = [
  { id: 'gh', name: 'GitHub', icon: Github, desc: 'Sync agents with repo logic', status: 'connected', color: 'bg-slate-800' },
  { id: 'slack', name: 'Slack', icon: Slack, desc: 'Trigger workflows via commands', status: 'connected', color: 'bg-emerald-600' },
  { id: 'figma', name: 'Figma', icon: FigmaIcon, desc: 'Design to agent mapping', status: 'disconnected', color: 'bg-indigo-600' },
  { id: 'gdrive', name: 'Google Drive', icon: Cloud, desc: 'Fetch training data assets', status: 'disconnected', color: 'bg-blue-600' },
  { id: 'notion', name: 'Notion', icon: Send, desc: 'Publish results to workspace', status: 'connected', color: 'bg-slate-800' },
  { id: 'zapier', name: 'Zapier', icon: Zap, desc: 'Connect 5000+ external apps', status: 'disconnected', color: 'bg-orange-600' },
  { id: 'chrome', name: 'Chrome', icon: Chrome, desc: 'In-browser agent control', status: 'connected', color: 'bg-rose-600' },
  { id: 'vercel', name: 'Vercel', icon: Send, desc: 'Automated deployment hub', status: 'disconnected', color: 'bg-black' },
];

const Integrations: React.FC = () => {
  const [connectors, setConnectors] = useState(INITIAL_CONNECTORS);
  const [showFigmaSetup, setShowFigmaSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const toggleConnection = (id: string) => {
    if (id === 'figma' && connectors.find(c => c.id === 'figma')?.status === 'disconnected') {
      setShowFigmaSetup(true);
      return;
    }
    setConnectors(prev => prev.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'connected' ? 'disconnected' : 'connected' } 
        : c
    ));
  };

  const handleCompleteSetup = () => {
    setIsVerifying(true);
    // Simulate API verification
    setTimeout(() => {
      setConnectors(prev => prev.map(c => 
        c.id === 'figma' ? { ...c, status: 'connected' } : c
      ));
      setIsVerifying(false);
      setShowFigmaSetup(false);
      setSetupStep(1);
      setToken('');
    }, 2000);
  };

  const closeSetup = () => {
    setShowFigmaSetup(false);
    setSetupStep(1);
    setToken('');
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Connectors</h1>
          <p className="text-slate-400">Bridge your agent ecosystem with external services.</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/20 text-sm font-bold">
          {connectors.filter(c => c.status === 'connected').length} Active Services
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectors.map((item, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 hover:border-slate-600 transition-all flex flex-col group">
            <div className="flex items-start justify-between">
              <div className={`p-4 rounded-2xl ${item.color} text-white shadow-xl group-hover:scale-105 transition-transform`}>
                <item.icon size={24} />
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                item.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {item.status}
              </div>
            </div>
            
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>

            <button 
              onClick={() => toggleConnection(item.id)}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              item.status === 'connected' 
                ? 'bg-slate-800 hover:bg-red-900/30 hover:text-red-400 border border-slate-700' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
            }`}>
              {item.status === 'connected' ? 'Disconnect' : 'Connect Service'}
              {item.status === 'disconnected' && <ArrowRight size={16} />}
            </button>
          </div>
        ))}
      </div>

      {/* Figma Setup Modal */}
      {showFigmaSetup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="bg-slate-800 p-6 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <FigmaIcon size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Link Figma Workspace</h2>
                  <p className="text-xs text-slate-400">Step {setupStep} of 3</p>
                </div>
              </div>
              <button onClick={closeSetup} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              {setupStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 flex gap-4">
                    <Info className="text-indigo-400 shrink-0" size={20} />
                    <p className="text-sm text-indigo-100">To enable workflow exports, you need a Personal Access Token from your Figma account.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">1</span>
                      Navigate to Settings
                    </h3>
                    <p className="text-sm text-slate-400 pl-8">
                      Open Figma, click your name in the top left, and select <span className="text-white font-medium">Settings</span>. Scroll down to the <span className="text-white font-medium">Personal Access Tokens</span> section.
                    </p>
                    <div className="pl-8 pt-2">
                      <a 
                        href="https://www.figma.com/settings" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-bold group"
                      >
                        Open Figma Settings <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSetupStep(2)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
                  >
                    I'm in Settings <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {setupStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">2</span>
                      Generate Token
                    </h3>
                    <div className="pl-8 space-y-3">
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Click <span className="text-white font-medium">"Generate a new token"</span>. Give it a description like "Architect Pro" and ensure the following scopes are active:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {['File content: Write', 'File content: Read'].map(scope => (
                          <span key={scope} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex gap-4">
                    <Lock className="text-amber-400 shrink-0" size={20} />
                    <p className="text-sm text-amber-100/80 italic">Never share your token with anyone. We encrypt your token at rest using AES-256.</p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setSetupStep(1)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-colors">Back</button>
                    <button onClick={() => setSetupStep(3)} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold">Got the Token</button>
                  </div>
                </div>
              )}

              {setupStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">3</span>
                      Finalize Connection
                    </h3>
                    <p className="text-sm text-slate-400 pl-8">Paste your generated token below to link your workspaces.</p>
                    
                    <div className="pl-8 space-y-4">
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="password" 
                          placeholder="figd_..." 
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        />
                      </div>
                      
                      {token.length > 0 && !token.startsWith('figd_') && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <Info size={12} /> Standard Figma tokens usually start with "figd_"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setSetupStep(2)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-colors">Back</button>
                    <button 
                      onClick={handleCompleteSetup}
                      disabled={!token || isVerifying}
                      className="flex-[2] bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Complete Connection <CheckCircle2 size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-950/50 p-6 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 size={14} className={setupStep >= 1 ? 'text-emerald-500' : ''} />
                <div className={`h-[2px] w-8 rounded-full ${setupStep >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                <CheckCircle2 size={14} className={setupStep >= 2 ? 'text-emerald-500' : ''} />
                <div className={`h-[2px] w-8 rounded-full ${setupStep >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                <CheckCircle2 size={14} className={setupStep >= 3 ? 'text-emerald-500' : ''} />
              </div>
              <p className="text-[10px] text-slate-500 font-mono">ENCRYPTED END-TO-END</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
