
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Cpu, DollarSign } from 'lucide-react';

const EXECUTION_DATA = [
  { month: 'Jan', workflows: 4000, agents: 2400 },
  { month: 'Feb', workflows: 3000, agents: 1398 },
  { month: 'Mar', workflows: 2000, agents: 9800 },
  { month: 'Apr', workflows: 2780, agents: 3908 },
  { month: 'May', workflows: 1890, agents: 4800 },
  { month: 'Jun', workflows: 2390, agents: 3800 },
  { month: 'Jul', workflows: 3490, agents: 4300 },
];

const COST_DISTRIBUTION = [
  { name: 'API Costs', value: 400 },
  { name: 'Compute', value: 300 },
  { name: 'Storage', value: 100 },
  { name: 'Network', value: 80 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Performance & Insights</h1>
          <p className="text-slate-400">Deep dive into cluster performance and resource utilization.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 24 Hours</option>
          </select>
          <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium border border-slate-700">Export PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Executions', val: '45.2k', icon: TrendingUp, color: 'text-indigo-400' },
          { label: 'Active Users', val: '892', icon: Users, color: 'text-emerald-400' },
          { label: 'Avg GPU Load', val: '64%', icon: Cpu, color: 'text-amber-400' },
          { label: 'Cloud Spend', val: '$1,204', icon: DollarSign, color: 'text-rose-400' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <item.icon size={18} className={item.color} />
              <span className="text-sm text-slate-500 font-medium">{item.label}</span>
            </div>
            <p className="text-2xl font-bold tracking-tight">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6">Workflow vs Agent Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EXECUTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="workflows" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="agents" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold mb-6">Resource Allocation</h3>
          <div className="flex-1 flex flex-col md:flex-row items-center">
            <div className="h-64 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COST_DISTRIBUTION}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COST_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {COST_DISTRIBUTION.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">${item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
