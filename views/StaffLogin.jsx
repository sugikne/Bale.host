
import React, { useState } from 'react';
import { AppView } from '../types.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const StaffLoginView = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError('Sistem database belum aktif. Silakan gunakan Mode Demo.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 1. Autentikasi via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (authError) throw authError;

      // 2. Verifikasi apakah User ID ada di tabel staff_profiles
      const { data: staffProfile, error: profileError } = await supabase
        .from('staff_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !staffProfile) {
        // Jika bukan staff, paksa logout untuk keamanan
        await supabase.auth.signOut();
        throw new Error('Akses Ditolak. Akun Anda tidak terdaftar dalam database staff internal.');
      }

      // 3. Jika valid, kirim data ke App.jsx untuk login dan navigasi ke AdminDashboard
      if (onLogin) {
        onLogin({
          user: authData.user,
          role: 'admin',
          profile: staffProfile
        });
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Email atau Security Key salah.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (onLogin) {
      onLogin({
        user: { id: 'demo-admin', email: 'admin@bale.host' },
        role: 'admin',
        profile: { full_name: 'Super Admin (Demo)', id: 'demo-admin' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#11141b] p-10 md:p-12 rounded-[40px] border border-white/5 shadow-2xl animate-fade-in relative z-10">
        <button 
          onClick={() => onNavigate(AppView.LANDING)} 
          className="mb-10 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Beranda
        </button>
        
        <div className="mb-10 text-center">
          <div className="size-20 bg-white/5 rounded-[28px] flex items-center justify-center text-white mx-auto mb-6 border border-white/5 shadow-inner">
            <span className="material-symbols-outlined text-4xl">shield_person</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-none">Portal Staff</h2>
          <p className="text-gray-500 mt-3 font-bold text-[10px] uppercase tracking-[3px]">Internal Management Only</p>
        </div>
        
        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] rounded-2xl font-bold flex items-start gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">gpp_maybe</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Staff</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">alternate_email</span>
              <input 
                type="email" 
                required
                disabled={loading}
                placeholder="name@bale.host"
                className="w-full h-16 bg-black/40 border-white/5 rounded-2xl pl-14 pr-6 text-white focus:ring-primary/30 focus:border-primary font-medium transition-all"
                value={email} 
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Security Key</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">key</span>
              <input 
                type="password" 
                required
                disabled={loading}
                placeholder="••••••••"
                className="w-full h-16 bg-black/40 border-white/5 rounded-2xl pl-14 pr-6 text-white focus:ring-primary/30 focus:border-primary font-medium transition-all"
                value={password} 
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full h-18 bg-white text-black font-black uppercase text-[11px] tracking-[4px] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="size-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                Access Dashboard
                <span className="material-symbols-outlined">verified_user</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5">
          <button 
            type="button"
            onClick={handleDemoLogin}
            className="w-full h-14 bg-white/5 border border-dashed border-white/10 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-[18px]">science</span>
            Akses Mode Demo Admin
          </button>
        </div>
      </div>
      
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-600 uppercase tracking-[4px]">
        Encrypted & Secure Session
      </p>
    </div>
  );
};

export default StaffLoginView;
