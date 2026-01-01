
import React from 'react';
import { User, Bell, Shield, Eye, Github, Monitor } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">System Preferences</h1>
        <p className="text-slate-400">Manage your workspace configuration and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold mb-2">
            <User size={18} className="text-indigo-400" />
            <span>Profile Information</span>
          </div>
          <p className="text-xs text-slate-500">Update your account details and public persona.</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-6">
              <img src="https://picsum.photos/seed/arch/200/200" className="w-20 h-20 rounded-2xl" alt="" />
              <button className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">Change Avatar</button>
              <button className="text-red-400 text-sm hover:underline">Remove</button>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
                <input type="text" defaultValue="Alex Rivera" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <input type="email" defaultValue="alex@architect.pro" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-slate-800 w-full" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold mb-2">
            <Monitor size={18} className="text-emerald-400" />
            <span>Interface & Display</span>
          </div>
          <p className="text-xs text-slate-500">Configure how you interact with the system.</p>
        </div>
        <div className="md:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Haptic Feedback</p>
                <p className="text-xs text-slate-500">Subtle vibration when completing major workflow deployments.</p>
              </div>
              <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Real-time Collaboration</p>
                <p className="text-xs text-slate-500">Show who else is viewing the current workflow.</p>
              </div>
              <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button className="px-6 py-2 rounded-lg text-slate-400 hover:text-white font-medium">Cancel Changes</button>
        <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-500/20">Save Preferences</button>
      </div>
    </div>
  );
};

export default Settings;
