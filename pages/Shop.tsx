
import React from 'react';
import { ShoppingBag, Star, Download, Search, Filter, Cpu, Globe, Zap } from 'lucide-react';

const TEMPLATES = [
  { id: 1, name: 'SaaS Customer Flow', author: 'LogicMaster', price: 'Free', rating: 4.8, downloads: '12.4k', tags: ['SaaS', 'Automation'], icon: Zap, color: 'text-amber-400' },
  { id: 2, name: 'E-commerce Engine', author: 'StoreBot', price: '$29', rating: 4.9, downloads: '5.2k', tags: ['Retail', 'API'], icon: Globe, color: 'text-indigo-400' },
  { id: 3, name: 'AI Research Cluster', author: 'NuraLabs', price: '$149', rating: 5.0, downloads: '890', tags: ['Research', 'Compute'], icon: Cpu, color: 'text-emerald-400' },
  { id: 4, name: 'Social Media Sync', author: 'BuzzBot', price: 'Free', rating: 4.5, downloads: '45k', tags: ['Social', 'Marketing'], icon: Zap, color: 'text-rose-400' },
];

const Shop: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="relative h-64 rounded-2xl overflow-hidden mb-12">
        <img src="https://picsum.photos/seed/shop-banner/1200/400" className="w-full h-full object-cover opacity-40" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        <div className="absolute bottom-8 left-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Agent Marketplace</h1>
          <p className="text-slate-300 max-w-lg">Discover and deploy battle-tested agent workflows, specialized models, and orchestration patterns built by the community.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search templates, authors, or categories..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 hover:bg-slate-700">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEMPLATES.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative">
              <item.icon size={48} className={`${item.color} group-hover:scale-110 transition-transform`} />
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold">
                {item.price}
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-slate-500">by <span className="text-indigo-400">{item.author}</span></p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span>{item.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download size={14} />
                  <span>{item.downloads}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">#{tag}</span>
                ))}
              </div>
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors">
                Quick Deploy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
