
import React from 'react';
import { AppView } from '../types.js';

const SettingsView = ({ onNavigate, userProfile, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - Consistent with Dashboard & My Orders */}
      <aside className="w-full md:w-72 bg-white border-b md:border-r border-gray-100 p-8 flex flex-col shrink-0 md:h-screen sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
          <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900">Bale.Host</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarItem icon="grid_view" label="Overview" onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)} />
          <SidebarItem icon="shopping_bag" label="Proyek Saya" onClick={() => onNavigate(AppView.MY_ORDERS)} />
          <SidebarItem icon="forum" label="Chat Support" onClick={() => onNavigate(AppView.COMMUNICATION)} />
          <SidebarItem icon="settings" label="Pengaturan" active />
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
        <header className="mb-12">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pengaturan Akun</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Kelola Profil dan Keamanan</p>
        </header>

        <div className="max-w-2xl bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-6 mb-12">
            <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary font-black text-3xl uppercase border border-primary/5 shadow-inner">
              {userProfile?.full_name?.charAt(0)}
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-900 tracking-tight">{userProfile?.full_name}</h4>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Verified Client Account</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="size-2 bg-green-500 rounded-full"></span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Akun Aktif</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nama Lengkap</label>
                <div className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 flex items-center text-gray-900 font-medium">
                  {userProfile?.full_name}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Registrasi</label>
                <div className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-6 flex items-center text-gray-500 font-medium italic overflow-hidden truncate">
                  {userProfile?.email || "Protected Data"}
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 space-y-4">
              <h5 className="text-[11px] font-black uppercase tracking-widest text-primary">Keamanan Akun</h5>
              <p className="text-sm text-gray-500 leading-relaxed">Sistem kami menggunakan enkripsi end-to-end untuk melindungi data proyek dan komunikasi Anda dengan staff kami.</p>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Pelajari Selengkapnya</button>
            </div>
            
            <button 
              disabled
              className="w-full h-16 bg-gray-50 text-gray-300 font-black uppercase text-[10px] tracking-widest rounded-2xl cursor-not-allowed border border-dashed border-gray-200"
            >
              Update Profile (Coming Soon)
            </button>
          </div>
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

export default SettingsView;
