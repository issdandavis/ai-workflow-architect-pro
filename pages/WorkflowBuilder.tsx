
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow from 'reactflow';
import { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap, 
  applyEdgeChanges, 
  applyNodeChanges,
  Panel
} from 'reactflow';
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  NodeMouseHandler
} from 'reactflow';
import { 
  Sparkles, 
  Save, 
  Share2, 
  Download, 
  Figma, 
  Plus, 
  Trash2, 
  X, 
  ExternalLink, 
  CheckCircle2,
  Terminal,
  Cpu,
  Database,
  ArrowRight,
  Upload,
  FileJson,
  FileDown,
  AlertCircle
} from 'lucide-react';
import { getWorkflowSuggestions } from '../services/geminiService';
import { exportWorkflowToFigma } from '../services/figmaService';
import { ConfigurationPanel } from '../components/ConfigurationPanel';

const AVAILABLE_AGENTS = [
  { id: 'agent-01', name: 'Data Scraper v1', role: 'Ingestion' },
  { id: 'agent-02', name: 'NLP Summarizer', role: 'Processing' },
  { id: 'agent-03', name: 'Image Analyzer', role: 'Vision' },
  { id: 'agent-04', name: 'Validation Node', role: 'QA' },
  { id: 'agent-05', name: 'Slack Hook', role: 'Output' },
];

const NODE_TYPES_CONFIG = {
  input: {
    label: 'Input Source',
    border: '#10b981',
    bg: '#064e3b',
    shadow: '0 0 12px rgba(16, 185, 129, 0.2)'
  },
  default: {
    label: 'Process Node',
    border: '#6366f1',
    bg: '#1e1b4b',
    shadow: '0 0 12px rgba(99, 102, 241, 0.2)'
  },
  output: {
    label: 'Output Sink',
    border: '#f59e0b',
    bg: '#451a03',
    shadow: '0 0 12px rgba(245, 158, 11, 0.2)'
  }
};

const getNodeStyle = (type: string) => {
  const config = NODE_TYPES_CONFIG[type as keyof typeof NODE_TYPES_CONFIG] || NODE_TYPES_CONFIG.default;
  return {
    background: '#1e293b',
    color: '#f8fafc',
    border: `2px solid ${config.border}`,
    borderRadius: '12px',
    boxShadow: config.shadow,
    padding: '10px',
    fontSize: '12px',
    fontWeight: '600',
    width: 160,
    textAlign: 'center' as const
  };
};

const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'input', 
    data: { label: 'Web Trigger', agentId: 'agent-01', config: '{}' }, 
    position: { x: 250, y: 5 },
    style: getNodeStyle('input')
  },
  { 
    id: '2', 
    data: { label: 'Summarizer Agent', agentId: 'agent-02', config: '{"maxLength": 500}' }, 
    position: { x: 100, y: 150 },
    style: getNodeStyle('default')
  },
  { 
    id: '3', 
    type: 'output',
    data: { label: 'Slack Notifier', agentId: 'agent-05', config: '{"channel": "#alerts"}' }, 
    position: { x: 400, y: 150 },
    style: getNodeStyle('output')
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1' } },
  { id: 'e1-3', source: '1', target: '3', style: { stroke: '#475569' } },
];

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showFigmaModal, setShowFigmaModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState('');
  const [figmaConfig, setFigmaConfig] = useState({
    fileKey: 'Architect_Live_Draft',
    frameName: 'Agent_Cluster_v1',
    scale: 2,
    includeComments: true
  });

  const showStatus = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      changes.forEach(change => {
        if (change.type === 'remove' && selectedNode && change.id === selectedNode.id) {
          setSelectedNode(null);
        }
      });
    },
    [selectedNode]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds)),
    []
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleUpdateNode = useCallback((id: string, data: any) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === id) {
          const updatedNode = {
            ...node,
            data: { ...node.data, ...data }
          };
          
          if (data.type) {
            updatedNode.type = data.type;
            updatedNode.style = getNodeStyle(data.type);
          }
          
          return updatedNode;
        }
        return node;
      })
    );
  }, []);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setSelectedNode(null);
  }, []);

  const handleAIRequest = async () => {
    setIsSuggesting(true);
    try {
      const prompt = "How can I improve this workflow for a customer support automation pipeline?";
      const data = await getWorkflowSuggestions(nodes, prompt);
      setSuggestions(data);
    } catch (e) {
      console.error(e);
      showStatus("AI suggestion failed", "error");
    } finally {
      setIsSuggesting(false);
    }
  };

  const addNode = (title: string, type: string = 'default') => {
    const newNode: Node = {
      id: `${nodes.length + Date.now()}`,
      type: type,
      data: { label: title, agentId: '', config: '{}' },
      position: { 
        x: Math.random() * 200 + 100, 
        y: Math.random() * 200 + 100 
      },
      style: getNodeStyle(type)
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Workflow Persistence Logic
  const exportToJson = () => {
    try {
      const workflowData = {
        nodes,
        edges,
        exportedAt: new Date().toISOString(),
        version: "1.0.0"
      };
      const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workflow-export-${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showStatus("Workflow exported successfully!");
    } catch (error) {
      console.error("Export failed", error);
      showStatus("Export failed", "error");
    }
  };

  const importFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
          // Re-apply styles based on types in case styles were missing or slightly different
          const validatedNodes = data.nodes.map((node: any) => ({
            ...node,
            style: getNodeStyle(node.type || 'default')
          }));
          
          setNodes(validatedNodes);
          setEdges(data.edges);
          setSelectedNode(null);
          showStatus("Workflow imported successfully!");
        } else {
          throw new Error("Invalid workflow file structure");
        }
      } catch (error) {
        console.error("Import failed", error);
        showStatus("Invalid workflow file", "error");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFigmaExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportWorkflowToFigma(nodes, edges, figmaConfig);
      setFigmaUrl(result.url);
      setExportComplete(true);
      showStatus("Pushed to Figma");
    } catch (e) {
      showStatus("Figma export failed", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const resetFigmaModal = () => {
    setShowFigmaModal(false);
    setExportComplete(false);
    setIsExporting(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Visual Architect</h1>
          <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Editor Beta</span>
          
          {/* Status Message Overlay */}
          {statusMessage && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold animate-in fade-in slide-in-from-left-2 duration-300 ${
              statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              statusMessage.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
              'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 size={14} /> : statusMessage.type === 'error' ? <AlertCircle size={14} /> : <FileJson size={14} />}
              {statusMessage.text}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* AI Suggestions Button */}
          <button 
            onClick={handleAIRequest}
            disabled={isSuggesting}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
          >
            <Sparkles size={18} className={isSuggesting ? 'animate-spin' : ''} />
            {isSuggesting ? 'Thinking...' : 'AI Suggestions'}
          </button>
          
          <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>
          
          {/* Import/Export Tools */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" 
              title="Import JSON Workflow"
            >
              <FileJson size={18} />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={importFromJson} 
                accept=".json" 
                className="hidden" 
              />
            </button>
            <button 
              onClick={exportToJson}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" 
              title="Export JSON Workflow"
            >
              <FileDown size={18} />
            </button>
          </div>

          <button onClick={() => setShowFigmaModal(true)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Export to Figma">
            <Figma size={20} />
          </button>
          
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Share Workflow">
            <Share2 size={20} />
          </button>
          
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium border border-slate-700 transition-colors">
            <Save size={18} /> Save Draft
          </button>
          
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-600/20 transition-all">
            Deploy <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative shadow-inner group/flow">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
          >
            <Background color="#1e293b" gap={20} />
            <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-200" />
            <MiniMap 
              nodeColor={(node) => {
                if (node.type === 'input') return '#10b981';
                if (node.type === 'output') return '#f59e0b';
                return '#6366f1';
              }} 
              maskColor="rgba(15, 23, 42, 0.8)" 
              className="!bg-slate-900 !border-slate-800"
            />

            {/* Floating Node Palette - Modern pill-shaped toolbar */}
            <Panel position="top-center" className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-1.5 rounded-2xl flex items-center gap-1 shadow-2xl mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1 border-r border-slate-700 mr-1">
                <Plus size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Node Palette</span>
              </div>
              <button 
                onClick={() => addNode('Input Source', 'input')} 
                className="flex items-center gap-2 text-[10px] font-bold px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all group"
              >
                <Terminal size={12} className="group-hover:scale-110 transition-transform" /> Input
              </button>
              <button 
                onClick={() => addNode('Process Node', 'default')} 
                className="flex items-center gap-2 text-[10px] font-bold px-3 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all group"
              >
                <Cpu size={12} className="group-hover:scale-110 transition-transform" /> Process
              </button>
              <button 
                onClick={() => addNode('Output Sink', 'output')} 
                className="flex items-center gap-2 text-[10px] font-bold px-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 hover:border-amber-500/40 transition-all group"
              >
                <Database size={12} className="group-hover:scale-110 transition-transform" /> Output
              </button>
              <div className="w-[1px] h-4 bg-slate-700 mx-2" />
              <button 
                onClick={() => setNodes([])} 
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Clear Canvas"
              >
                <Trash2 size={16} />
              </button>
            </Panel>
          </ReactFlow>

          {suggestions.length > 0 && (
            <div className="absolute top-4 left-4 w-72 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles size={16} />
                  <h4 className="text-sm font-bold uppercase tracking-widest">AI Suggestions</h4>
                </div>
                <button onClick={() => setSuggestions([])} className="text-slate-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <div key={i} className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer group rounded-xl" onClick={() => addNode(s.title, s.nodeType)}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-indigo-300 group-hover:text-indigo-200">{s.title}</p>
                      <ArrowRight size={14} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                    <div className="mt-2 text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 inline-block uppercase tracking-tighter">
                      {s.nodeType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configuration Side Panel */}
        <ConfigurationPanel 
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          availableAgents={AVAILABLE_AGENTS}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      {/* Figma Export Modal */}
      {showFigmaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="bg-slate-800 p-6 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <Figma className="text-indigo-400" size={24} />
                <h2 className="text-xl font-bold">Export to Figma</h2>
              </div>
              <button onClick={resetFigmaModal} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {!exportComplete ? (
                <>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Convert your live agent topology into editable Figma design components. Our API will map your nodes, connections, and logic into a design system.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Target Figma File Key</label>
                      <input 
                        type="text" 
                        value={figmaConfig.fileKey}
                        onChange={(e) => setFigmaConfig({...figmaConfig, fileKey: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. ABC123XYZ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Destination Frame Name</label>
                      <input 
                        type="text" 
                        value={figmaConfig.frameName}
                        onChange={(e) => setFigmaConfig({...figmaConfig, frameName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleFigmaExport}
                    disabled={isExporting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/10"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                        Processing Nodes...
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        Confirm Export
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Handoff Successful</h3>
                    <p className="text-slate-400 text-sm">
                      Your workflow has been serialized and pushed to Figma Project: <span className="text-white font-mono">{figmaConfig.fileKey}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a 
                      href={figmaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
                    >
                      Open in Figma <ExternalLink size={16} />
                    </a>
                    <button onClick={resetFigmaModal} className="text-slate-500 hover:text-white text-sm">Return to Editor</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
