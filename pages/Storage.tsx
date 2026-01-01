
import React from 'react';
import { FileText, Image, Code, Archive, MoreVertical, Plus, Grid, List as ListIcon, HardDrive } from 'lucide-react';

const FILES = [
  { name: 'Architecture_Draft_v2.pdf', type: 'PDF', size: '4.2 MB', updated: '2h ago', icon: FileText, color: 'text-rose-400' },
  { name: 'Model_Weights_Weights.bin', type: 'Binary', size: '1.2 GB', updated: 'Yesterday', icon: Archive, color: 'text-amber-400' },
  { name: 'Agent_Logo_Master.svg', type: 'Vector', size: '45 KB', updated: '3 days ago', icon: Image, color: 'text-indigo-400' },
  { name: 'Utility_Scripts.js', type: 'Script', size: '12 KB', updated: '1 week ago', icon: Code, color: 'text-emerald-400' },
];

const Storage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">File Storage</h1>
          <div className="bg-indigo-500/10 px-3 py-1 rounded-full flex items-center gap-2 border border-indigo-500/20">
            <HardDrive size={14} className="text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400">45% Used</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button className="p-1.5 bg-slate-800 rounded text-indigo-400 shadow-sm"><Grid size={18} /></button>
            <button className="p-1.5 text-slate-500 hover:text-slate-300"><ListIcon size={18} /></button>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Plus size={20} /> Upload Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FILES.map((file, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform`}>
                <file.icon size={24} className={file.color} />
              </div>
              <button className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm truncate" title={file.name}>{file.name}</h3>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{file.type} • {file.size}</span>
                <span>{file.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-700">
          <Plus size={32} className="text-slate-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Drop files here to upload</h3>
          <p className="text-sm text-slate-500">Max file size: 2GB. Supports models, logs, and workflow JSONs.</p>
        </div>
        <button className="text-indigo-400 text-sm font-bold hover:underline">Or browse system files</button>
      </div>
    </div>
  );
};

export default Storage;
