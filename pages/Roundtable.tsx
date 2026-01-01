
import React from 'react';
import { Users, MessageSquare, Video, Calendar, MoreHorizontal, UserPlus } from 'lucide-react';

const TEAM = [
  { name: 'Alex Rivera', role: 'Architect', status: 'Online', avatar: '1' },
  { name: 'Sarah Chen', role: 'Data Engineer', status: 'Coding', avatar: '2' },
  { name: 'Marcus Bell', role: 'Security', status: 'In Meeting', avatar: '3' },
  { name: 'Luna Stark', role: 'Ops Lead', status: 'Offline', avatar: '4' },
];

const Roundtable: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Roundtable</h1>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <UserPlus size={18} /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Active Members Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Team Members</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2">
            {TEAM.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${member.avatar}/50/50`} className="w-10 h-10 rounded-full border border-slate-700" alt={member.name} />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      member.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-700 rounded-lg">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Central Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[600px] flex flex-col">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><MessageSquare size={20} /></div>
              <div>
                <h3 className="font-bold">#project-nebula</h3>
                <p className="text-xs text-slate-500">Discussing new multi-agent clusters</p>
              </div>
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
              <div className="flex gap-4">
                <img src="https://picsum.photos/seed/1/50/50" className="w-8 h-8 rounded-full h-fit" alt="" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">Alex Rivera</span>
                    <span className="text-[10px] text-slate-500">10:45 AM</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-slate-300 max-w-md">
                    Just pushed the new validation agent to the staging cluster. Can someone review the logic in <span className="text-indigo-400 underline cursor-pointer">AgentDev</span>?
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <img src="https://picsum.photos/seed/2/50/50" className="w-8 h-8 rounded-full h-fit" alt="" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">Sarah Chen</span>
                    <span className="text-[10px] text-slate-500">10:48 AM</span>
                  </div>
                  <div className="bg-indigo-600/10 border border-indigo-500/20 p-3 rounded-2xl rounded-tl-none text-sm text-indigo-100 max-w-md">
                    Looking now. The resource allocation looks a bit high, maybe we should scale down the replica count?
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-4">
              <input 
                type="text" 
                placeholder="Type a message or use / to trigger agents..." 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl transition-colors">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Meeting & Events Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Upcoming</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded">LIVE NOW</span>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <img key={i} src={`https://picsum.photos/seed/${i}/30/30`} className="w-6 h-6 rounded-full border-2 border-slate-900" alt="" />)}
                </div>
              </div>
              <h4 className="text-sm font-bold">Weekly Architecture Sync</h4>
              <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-xs font-bold">
                <Video size={14} /> Join Call
              </button>
            </div>

            <div className="space-y-3">
              {[
                { time: 'Tomorrow, 2:00 PM', title: 'Sprint Planning', icon: Calendar },
                { time: 'Friday, 11:00 AM', title: 'Security Audit', icon: Calendar },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700">
                  <div className="p-2 bg-slate-800 rounded-lg"><event.icon size={16} className="text-slate-400" /></div>
                  <div>
                    <p className="text-xs font-bold">{event.title}</p>
                    <p className="text-[10px] text-slate-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roundtable;
