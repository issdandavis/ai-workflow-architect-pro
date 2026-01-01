
import React from 'react';
import { Activity, Zap, Server, Globe, ArrowUpRight, Plus, Play, MoreVertical } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_STATS = [
  { name: '00:00', val: 400 },
  { name: '04:00', val: 300 },
  { name: '08:00', val: 900 },
  { name: '12:00', val: 1200 },
  { name: '16:00', val: 1500 },
  { name: '20:00', val: 1100 },
  { name: '23:59', val: 1800 },
];

const AGENTS = [
  { id: '1', name: 'DataScraper-01', role: 'Ingestion', status: 'running', load: '45%' },
  { id: '2', name: 'Summarizer-Pro', role: 'NLP', status: 'idle', load: '0%' },
  { id: '3', name: 'ImageGen-v2', role: 'Creative', status: 'running', load: '82%' },
  { id: '4', name: 'Validator-Node', role: 'QA', status: 'offline', load: '-' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orchestration Hub</h1>
          <p className="text-slate-400">Monitoring 24 active agent clusters across 3 nodes.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Deploy New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', val: '1,284', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Avg Latency', val: '124ms', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Node Capacity', val: '78%', icon: Server, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Cloud Reach', val: '12 regions', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                +12% <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.val}</p>
            <p className="text-slate-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6">Workflow Executions (24h)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_STATS}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="val" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Live Agents</h3>
            <button className="text-xs text-indigo-400 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4 flex-1">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'running' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' : 
                    agent.status === 'idle' ? 'bg-amber-500' : 'bg-slate-600'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-slate-500">{agent.role} • Load: {agent.load}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:text-indigo-400"><Play size={14} /></button>
                  <button className="p-1 hover:text-slate-300"><MoreVertical size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
            Optimize Cluster
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
