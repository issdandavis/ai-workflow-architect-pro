
import React, { useState } from 'react';
import { Code2, Terminal, Play, Save, Sparkles, Copy, Trash2, CheckCircle2 } from 'lucide-react';
import { generateAgentCode } from '../services/geminiService';

const AgentDev: React.FC = () => {
  const [code, setCode] = useState<string>(`// New AI Agent Scaffold
export default class MyAgent {
  async run(input: string) {
    console.log("Input received:", input);
    return "Process complete";
  }
}`);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string[]>(['[System] Ready for agent development...', '[System] Environment: production-v12']);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setOutput(prev => [...prev, `[AI] Generating agent for: "${prompt}"...`]);
    try {
      const result = await generateAgentCode(prompt);
      if (result) {
        setCode(result);
        setOutput(prev => [...prev, '[System] Code generated successfully.']);
      }
    } catch (e) {
      setOutput(prev => [...prev, '[Error] Failed to generate code. Please check API configuration.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const runCode = () => {
    setOutput(prev => [...prev, '[Runner] Executing sandbox...', '[Runner] Logic trace started...', '[Runner] Success: Node 200 OK']);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar Controls */}
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Sparkles size={18} />
            <h3 className="text-sm uppercase tracking-wider">AI Co-Architect</h3>
          </div>
          <p className="text-xs text-slate-500">Describe the capability you want to add to your agent cluster.</p>
          <textarea 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none min-h-[100px]"
            placeholder="e.g. An agent that validates JSON responses from external APIs and retries up to 3 times on failure."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? 'Drafting...' : 'Generate Scaffold'}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex-1">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" /> Validation Rules
          </h3>
          <ul className="space-y-2">
            {['TypeScript Strict', 'Async/Await only', 'Error boundary required', 'Unit test scaffold'].map((rule, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800/50 p-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-md border border-slate-700">
              <Code2 size={16} className="text-indigo-400" />
              <span className="text-xs font-mono">AgentLogic.ts</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-400" title="Copy to clipboard">
              <Copy size={18} />
            </button>
            <button 
              onClick={runCode}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all"
            >
              <Play size={14} /> Run Test
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all">
              <Save size={14} /> Save
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <textarea 
            className="flex-1 bg-slate-950 p-6 font-mono text-sm leading-relaxed text-indigo-100 outline-none resize-none"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="h-40 bg-slate-950 border-t border-slate-800 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Debug Output</span>
            </div>
            <button onClick={() => setOutput([])} className="text-slate-500 hover:text-white"><Trash2 size={12} /></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1">
            {output.map((line, i) => (
              <div key={i} className={`${line.startsWith('[Error]') ? 'text-red-400' : line.startsWith('[AI]') ? 'text-indigo-400' : 'text-slate-500'}`}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDev;
