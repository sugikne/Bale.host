
import React from 'react';
import { AppView } from '../types.js';

const MyOrdersView = ({ onNavigate, projects = [], userProfile, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - Consistent with Dashboard & Communication */}
      <aside className="w-full md:w-72 bg-white border-b md:border-r border-gray-100 p-8 flex flex-col shrink-0 md:h-screen sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
          <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900">Bale.Host</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarItem icon="grid_view" label="Overview" onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)} />
          <SidebarItem icon="shopping_bag" label="Proyek Saya" active />
          <SidebarItem icon="forum" label="Chat Support" onClick={() => onNavigate(AppView.COMMUNICATION)} />
          <SidebarItem icon="settings" label="Pengaturan" onClick={() => onNavigate(AppView.SETTINGS)} />
        </nav>

        {/* User Profile Section - Matching Dashboard */}
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
      <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 animate-fade-in scroll-smooth">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">Riwayat Proyek</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              Daftar seluruh pesanan dan progres pengerjaan Anda
            </p>
          </div>
          <button 
            onClick={() => onNavigate(AppView.ORDER_FORM)}
            className="h-14 px-8 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-3"
          >
            Pesan Lagi
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {projects.length > 0 ? (
            projects.map(p => (
              <div key={p.id} className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-xl hover:border-primary/10 transition-all">
                <div className="flex items-center gap-6">
                  <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-inner border border-gray-100/50">
                    <span className="material-symbols-outlined text-3xl">
                      {p.type === 'shopping_cart' ? 'shopping_cart' : p.type === 'rocket_launch' ? 'rocket_launch' : 'web'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 tracking-tight">{p.name}</h4>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.plan} Package</span>
                       <span className="text-gray-200">•</span>
                       <span className="text-[10px] text-primary font-black uppercase tracking-widest">{p.amount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                  <div className="w-full md:w-48 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-primary">{p.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-50 rounded-full border border-gray-100 overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-8">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Status Proyek</p>
                      <span className="px-4 py-1.5 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-xl border border-primary/10 tracking-widest">
                        {p.status}
                      </span>
                    </div>
                    <button 
                      onClick={() => onNavigate(AppView.COMMUNICATION, p.id)}
                      className="size-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all shadow-inner border border-gray-100"
                    >
                      <span className="material-symbols-outlined">forum</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 border border-gray-50 shadow-inner">
                <span className="material-symbols-outlined text-5xl">inventory_2</span>
              </div>
              <h4 className="text-xl font-black text-gray-900">Belum Memiliki Pesanan</h4>
              <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[3px] mt-4 max-w-[340px] mx-auto leading-relaxed">
                Anda belum memiliki proyek aktif. Klik tombol di bawah untuk memulai website impian Anda.
              </p>
              <button 
                onClick={() => onNavigate(AppView.ORDER_FORM)}
                className="mt-10 px-10 h-14 bg-primary text-white font-black uppercase text-[11px] tracking-[3px] rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105"
              >
                Buat Pesanan Pertama
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

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

export default MyOrdersView;
