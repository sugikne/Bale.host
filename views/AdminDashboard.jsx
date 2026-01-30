
import React, { useState, useMemo } from 'react';
import { AppView, ProjectStatuses } from '../types.js';

const AdminDashboardView = ({ 
  onNavigate, 
  projects = [], 
  clients = [],
  onUpdateStatus, 
  onDeleteProject, 
  onLogout,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState('PIPELINE'); // 'PIPELINE' | 'CLIENTS' | 'FINANCE'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = useMemo(() => {
    const totalRevenue = projects.reduce((acc, curr) => {
      const val = typeof curr.amount === 'string' ? parseInt(curr.amount.replace(/[^0-9.-]+/g, "")) : 0;
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    
    return {
      total: projects.length,
      active: projects.filter(p => p.status !== 'Completed').length,
      revenue: totalRevenue,
      clientsCount: clients.length
    };
  }, [projects, clients]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'CLIENTS':
        return (
          <div className="bg-[#11141b] rounded-[32px] border border-white/5 overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr className="text-[9px] font-black uppercase tracking-[3px] text-gray-400">
                  <th className="px-8 py-6">Nama Klien</th>
                  <th className="px-8 py-6">ID Klien</th>
                  <th className="px-8 py-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clients.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-sm">{c.full_name}</p>
                      <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold">{c.email || 'No Email'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] text-gray-500 bg-black/30 px-2 py-1 rounded">{c.id}</code>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => onNavigate(AppView.COMMUNICATION, c.id)}
                        className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 ml-auto"
                      >
                        <span className="material-symbols-outlined text-sm">forum</span>
                        <span className="text-[9px] font-black uppercase">Chat Klien</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-gray-600 font-bold uppercase text-[10px] tracking-widest">Belum ada klien terdaftar</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'FINANCE':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
             <div className="bg-[#11141b] p-8 rounded-[32px] border border-white/5 shadow-xl">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Total Revenue</p>
                <p className="text-4xl font-black text-primary">${stats.revenue.toLocaleString()}</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                   <p className="text-[10px] text-gray-400 font-medium">Berdasarkan total nilai semua proyek terdaftar.</p>
                </div>
             </div>
             <div className="bg-[#11141b] p-8 rounded-[32px] border border-white/5 shadow-xl">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Average Value</p>
                <p className="text-4xl font-black text-green-400">
                  ${stats.total > 0 ? Math.round(stats.revenue / stats.total).toLocaleString() : 0}
                </p>
                <div className="mt-6 pt-6 border-t border-white/5">
                   <p className="text-[10px] text-gray-400 font-medium">Rata-rata investasi per proyek.</p>
                </div>
             </div>
             <div className="bg-[#11141b] p-8 rounded-[32px] border border-white/5 shadow-xl">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Active Pipeline</p>
                <p className="text-4xl font-black text-blue-400">
                   {stats.active}
                </p>
                <div className="mt-6 pt-6 border-t border-white/5">
                   <p className="text-[10px] text-gray-400 font-medium">Proyek yang masih dalam proses pengerjaan.</p>
                </div>
             </div>
          </div>
        );

      case 'PIPELINE':
      default:
        return (
          <div className="bg-[#11141b] rounded-[32px] border border-white/5 overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr className="text-[9px] font-black uppercase tracking-[3px] text-gray-400">
                  <th className="px-8 py-6">Nama Proyek</th>
                  <th className="px-8 py-6">Status Pengerjaan</th>
                  <th className="px-8 py-6">Nilai Proyek</th>
                  <th className="px-8 py-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-sm">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[9px] text-gray-500 uppercase font-bold">{p.plan}</p>
                        <span className="text-[8px] text-gray-700 font-black px-1 border border-gray-800 rounded">ID: {p.id.slice(-4)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={p.status}
                        onChange={(e) => onUpdateStatus(p.id, e.target.value)}
                        className="bg-black/40 border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest px-3 py-1.5 focus:ring-primary outline-none text-blue-400 cursor-pointer"
                      >
                        {ProjectStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-8 py-6 font-bold text-gray-400">{p.amount}</td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button 
                        onClick={() => onNavigate(AppView.COMMUNICATION, p.client_id)} 
                        title="Chat Client"
                        className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">forum</span>
                      </button>
                      <button 
                        onClick={() => onDeleteProject(p.id)} 
                        title="Delete Project"
                        className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-600 font-bold uppercase text-[10px] tracking-widest">Belum ada proyek yang masuk</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#11141b] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
            <div className="bg-primary size-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </div>
            <h1 className="text-lg font-black tracking-tighter">Bale.Admin</h1>
          </div>
          
          <nav className="space-y-2">
            <SidebarButton 
              icon="account_tree" 
              label="Pipeline" 
              active={activeTab === 'PIPELINE'} 
              onClick={() => setActiveTab('PIPELINE')} 
            />
            <SidebarButton 
              icon="group" 
              label="Clients" 
              active={activeTab === 'CLIENTS'} 
              onClick={() => setActiveTab('CLIENTS')} 
            />
            <SidebarButton 
              icon="payments" 
              label="Finance" 
              active={activeTab === 'FINANCE'} 
              onClick={() => setActiveTab('FINANCE')} 
            />
            <div className="h-px bg-white/5 my-4"></div>
            <SidebarButton 
              icon="forum" 
              label="Support Chat" 
              onClick={() => onNavigate(AppView.COMMUNICATION)} 
            />
          </nav>
        </div>
        
        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={handleRefresh} 
            className={`w-full py-3 bg-white/5 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all ${isRefreshing ? 'animate-pulse' : ''}`}
          >
            <span className={`material-symbols-outlined text-sm ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
            Sync Data
          </button>
          <button 
            onClick={onLogout} 
            className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
              {activeTab === 'PIPELINE' ? 'Manajemen Proyek' : activeTab === 'CLIENTS' ? 'Daftar Klien' : 'Ringkasan Keuangan'}
              {isRefreshing && <span className="text-primary text-xs font-black uppercase tracking-widest animate-pulse">Syncing...</span>}
            </h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[3px] mt-1">Sistem Kontrol Internal Bale.Host</p>
          </div>
          
          <div className="flex items-center gap-4">
            <StatSmall label="Revenue" value={`$${stats.revenue.toLocaleString()}`} color="text-primary" />
            <StatSmall label="Clients" value={stats.clientsCount} color="text-blue-400" />
            <StatSmall label="Projects" value={stats.total} color="text-green-400" />
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

const SidebarButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className={`material-symbols-outlined text-[20px] ${active ? 'fill-1' : ''}`}>{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-widest leading-none">{label}</span>
  </button>
);

const StatSmall = ({ label, value, color }) => (
  <div className="bg-[#11141b] px-6 py-4 rounded-2xl border border-white/5 shadow-inner">
    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xl font-black ${color} tracking-tight`}>{value}</p>
  </div>
);

export default AdminDashboardView;
