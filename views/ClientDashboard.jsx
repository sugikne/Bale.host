
import React, { useMemo } from 'react';
import { AppView } from '../types.js';

const ClientDashboardView = ({ onNavigate, projects = [], userProfile, onLogout }) => {
  const stats = useMemo(() => {
    const active = projects.filter(p => p.status !== 'Completed');
    const completed = projects.filter(p => p.status === 'Completed');
    const investment = projects.reduce((acc, curr) => {
      const val = typeof curr.amount === 'string' ? parseInt(curr.amount.replace(/[^0-9.-]+/g, "")) : 0;
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    return { active, completed, investment };
  }, [projects]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - Consistent with Communication View */}
      <aside className="w-full md:w-72 bg-white border-b md:border-r border-gray-100 p-8 flex flex-col shrink-0 md:h-screen sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
          <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900">Bale.Host</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarItem icon="grid_view" label="Overview" active onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)} />
          <SidebarItem icon="shopping_bag" label="Proyek Saya" onClick={() => onNavigate(AppView.MY_ORDERS)} />
          <SidebarItem icon="forum" label="Chat Support" onClick={() => onNavigate(AppView.ClientCommunication)} />
          <SidebarItem icon="settings" label="Pengaturan" onClick={() => onNavigate(AppView.SETTINGS)} />
        </nav>

        {/* User Profile Section at bottom of sidebar */}
        <div className="mt-auto pt-6 border-t border-gray-50">
          {userProfile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase border border-primary/5">
                  {userProfile.full_name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[13px] font-black truncate text-gray-900 leading-tight">{userProfile.full_name}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Premium Client</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full h-11 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> Log Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate(AppView.CLIENT_LOGIN)}
              className="w-full h-12 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[2px] bg-primary text-white rounded-xl shadow-lg shadow-primary/20"
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scroll-smooth">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
              {userProfile ? `Halo, ${userProfile.full_name.split(' ')[0]}!` : 'Dashboard Portal'}
            </h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
               Ringkasan Aktifitas Digital Anda
            </p>
          </div>
          <button 
            onClick={() => onNavigate(AppView.ORDER_FORM)}
            className="h-14 px-8 bg-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
          >
            Mulai Proyek Baru
            <span className="material-symbols-outlined text-lg">add_circle</span>
          </button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          <StatCard label="Dalam Pengerjaan" value={stats.active.length} icon="pending_actions" color="text-blue-500" bg="bg-blue-50" />
          <StatCard label="Proyek Selesai" value={stats.completed.length} icon="task_alt" color="text-green-500" bg="bg-green-50" />
          <StatCard label="Total Investasi" value={`$${stats.investment.toLocaleString()}`} icon="payments" color="text-primary" bg="bg-primary/5" />
        </div>

        {/* Recent Active Projects */}
        <section className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[11px] uppercase tracking-[4px] text-gray-400">Pengerjaan Aktif</h3>
            <button onClick={() => onNavigate(AppView.MY_ORDERS)} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">Lihat Riwayat Lengkap</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stats.active.length > 0 ? stats.active.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="size-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-gray-100/50">
                      <span className="material-symbols-outlined text-3xl">
                        {p.type === 'shopping_cart' ? 'shopping_cart' : p.type === 'rocket_launch' ? 'rocket_launch' : 'web'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-primary transition-colors">{p.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{p.plan} Package</p>
                    </div>
                  </div>
                  <span className="px-4 py-1.5 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-xl border border-primary/10 tracking-widest">{p.status}</span>
                </div>
                
                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">Progress Pengerjaan</span>
                    <span className="text-primary">{p.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full border border-gray-100 overflow-hidden p-0.5">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(19,91,236,0.3)]" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate(AppView.COMMUNICATION, p.id)}
                  className="w-full h-14 bg-gray-50 text-gray-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-3 group/btn"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover/btn:translate-x-1 transition-transform">forum</span> 
                  Konsultasi Staff Ahli
                </button>
              </div>
            )) : (
              <div className="lg:col-span-2 py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 border border-gray-50 shadow-inner">
                  <span className="material-symbols-outlined text-5xl">inventory_2</span>
                </div>
                <h4 className="text-xl font-black text-gray-900">Belum Ada Proyek Aktif</h4>
                <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[3px] mt-4 max-w-[340px] mx-auto leading-relaxed">
                  Transformasikan bisnis Anda ke dunia digital bersama tim ahli Bale.Host.
                </p>
                <button 
                  onClick={() => onNavigate(AppView.ORDER_FORM)}
                  className="mt-10 px-10 h-14 bg-primary text-white font-black uppercase text-[11px] tracking-[3px] rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105"
                >
                  Mulai Pesan Website
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-xl transition-all border-b-4 border-b-transparent hover:border-b-primary/30 group">
    <div className={`size-16 ${bg} ${color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900 tracking-tight leading-none">{value}</p>
    </div>
  </div>
);

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[18px] transition-all group ${
      active ? 'bg-primary text-white shadow-xl shadow-primary/25' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    <span className={`material-symbols-outlined text-[22px] ${active ? 'fill-1' : ''}`}>{icon}</span>
    <span className="text-[13px] font-black uppercase tracking-widest text-left leading-none">{label}</span>
  </button>
);

export default ClientDashboardView;
