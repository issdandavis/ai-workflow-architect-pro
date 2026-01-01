
import React, { useState, useEffect } from 'react';
import { Trash2, AlertCircle, CheckCircle2, Terminal, Cpu, Database, Settings2, X, ArrowRightLeft } from 'lucide-react';

interface NodeData {
  label: string;
  agentId: string;
  config: string;
  type?: string;
}

interface Props {
  selectedNode: any | null;
  onUpdateNode: (id: string, data: Partial<NodeData>) => void;
  onDeleteNode: (id: string) => void;
  availableAgents: { id: string, name: string, role: string }[];
  onClose: () => void;
}

export const ConfigurationPanel: React.FC<Props> = ({ 
  selectedNode, 
  onUpdateNode, 
  onDeleteNode,
  availableAgents,
  onClose
}) => {
  const [formData, setFormData] = useState<NodeData>({ label: '', agentId: '', config: '{}', type: 'default' });
  const [isValidJson, setIsValidJson] = useState(true);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Sync effect: Pre-fill editing when selection changes
  useEffect(() => {
    if (selectedNode) {
      setFormData({
        label: selectedNode.data.label || '',
        agentId: selectedNode.data.agentId || '',
        config: typeof selectedNode.data.config === 'string' 
          ? selectedNode.data.config 
          : JSON.stringify(selectedNode.data.config || {}, null, 2),
        type: selectedNode.type || 'default'
      });
      setIsConfirmingDelete(false); // Reset delete state on new selection
      setIsValidJson(true);
    }
  }, [selectedNode]);

  // JSON Validation Logic
  const handleConfigChange = (value: string) => {
    setFormData(prev => ({ ...prev, config: value }));
    try {
      if (value.trim()) JSON.parse(value);
      setIsValidJson(true);
      // Update parent state only if JSON is valid to keep workflow stable
      onUpdateNode(selectedNode.id, { config: value });
    } catch (e) {
      setIsValidJson(false);
    }
  };

  const handleLabelChange = (val: string) => {
    setFormData(prev => ({ ...prev, label: val }));
    onUpdateNode(selectedNode.id, { label: val });
  };

  const handleAgentChange = (val: string) => {
    setFormData(prev => ({ ...prev, agentId: val }));
    onUpdateNode(selectedNode.id, { agentId: val });
  };

  const handleTypeChange = (val: string) => {
    setFormData(prev => ({ ...prev, type: val }));
    onUpdateNode(selectedNode.id, { type: val });
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center backdrop-blur-sm">
        <div className="p-4 bg-slate-800 rounded-full mb-4 text-slate-600">
          <Settings2 size={32} />
        </div>
        <p className="text-slate-500 text-sm font-medium">Select a node on the canvas to configure its properties</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300 shadow-2xl overflow-y-auto max-h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Settings2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Node Settings</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">ID:</span>
              <span className="text-[10px] text-slate-500 font-mono">{selectedNode.id}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-6">
        {/* Category / Type Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ArrowRightLeft size={12} /> Node Category
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {['input', 'default', 'output'].map(t => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  formData.type === t 
                    ? `text-white bg-indigo-600 shadow-lg shadow-indigo-600/20` 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
              >
                {t === 'default' ? 'PROC' : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Display Label */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Terminal size={12} /> Display Label
          </label>
          <input 
            type="text" 
            value={formData.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-slate-200"
            placeholder="e.g. Scrape News"
          />
        </div>

        {/* Agent Assignment */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={12} /> Assigned Agent
          </label>
          <div className="relative group">
            <select 
              value={formData.agentId}
              onChange={(e) => handleAgentChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer text-slate-200"
            >
              <option value="">No Agent Assigned</option>
              {availableAgents.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
              <Settings2 size={12} />
            </div>
          </div>
        </div>

        {/* JSON Configuration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Database size={12} /> Parameters (JSON)
            </label>
            {isValidJson ? (
              <span className="flex items-center text-emerald-400 text-[9px] font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 uppercase tracking-tighter">
                <CheckCircle2 size={10} className="mr-1"/> Valid JSON
              </span>
            ) : (
              <span className="flex items-center text-rose-400 text-[9px] font-bold bg-rose-400/10 px-1.5 py-0.5 rounded border border-rose-400/20 uppercase tracking-tighter">
                <AlertCircle size={10} className="mr-1"/> Invalid Syntax
              </span>
            )}
          </div>
          <textarea
            className={`w-full h-48 font-mono text-[11px] bg-slate-950 border rounded-xl p-3 outline-none transition-all leading-relaxed resize-none text-indigo-100 ${
              isValidJson ? 'border-slate-800 focus:ring-1 focus:ring-indigo-500' : 'border-rose-500/50 focus:ring-1 focus:ring-rose-500'
            }`}
            value={formData.config}
            onChange={(e) => handleConfigChange(e.target.value)}
            spellCheck={false}
          />
          <p className="text-[10px] text-slate-600 italic leading-snug">Changes are synced in real-time if the JSON is valid.</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-800">
        {!isConfirmingDelete ? (
          <button
            onClick={() => setIsConfirmingDelete(true)}
            className="flex items-center justify-center w-full py-2.5 text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all text-[11px] font-bold gap-2 border border-rose-500/10 hover:border-rose-500/30 group"
          >
            <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> 
            Remove Node from Canvas
          </button>
        ) : (
          <div className="flex flex-col gap-3 animate-in fade-in zoom-in duration-200">
            <p className="text-[10px] font-bold text-center text-rose-500 uppercase tracking-widest">Are you absolutely sure?</p>
            <div className="flex gap-2">
              <button
                onClick={() => onDeleteNode(selectedNode.id)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors shadow-lg shadow-rose-600/20"
              >
                Delete
              </button>
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
