
import React, { useState } from 'react';
import { AppView } from '../types.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const ClientLoginView = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (isRegistering) {
      if (!fullName.trim()) return 'Nama lengkap wajib diisi.';
      if (fullName.trim().length < 3) return 'Nama lengkap terlalu pendek.';
      if (password !== confirmPassword) return 'Konfirmasi kata sandi tidak cocok.';
    }
    
    if (password.length < 6) return 'Kata sandi minimal harus 6 karakter.';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Format email tidak valid.';
    
    return null;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    // Reset state
    setError('');
    
    // Validasi data
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Supabase belum dikonfigurasi. Silakan gunakan "Akses Mode Demo" atau hubungi admin.');
      return;
    }

    setLoading(true);
    
    try {
      if (isRegistering) {
        // 1. Daftar di Supabase Auth
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            }
          }
        });
        
        if (err) throw err;
        
        if (data?.user) {
          // 2. Buat profil di tabel client_profiles secara manual
          // Catatan: Biasanya ini dilakukan via trigger database, tapi kita lakukan di sini untuk memastikan.
          const { error: profileErr } = await supabase
            .from('client_profiles')
            .upsert({
              id: data.user.id,
              full_name: fullName.trim(),
              email: email.trim()
            });

          if (profileErr) {
            console.error("Gagal membuat profil klien:", profileErr);
            // Kita tetap lanjut jika user berhasil dibuat di Auth, 
            // karena profile bisa saja dibuat via trigger juga.
          }

          // 3. Cek jika butuh konfirmasi email atau langsung login
          if (data?.session) {
            onLogin({
              user: data.user,
              role: 'client',
              profile: { full_name: fullName.trim(), id: data.user.id, email: email.trim() }
            });
          } else {
            alert('Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi akun (jika diaktifkan) atau silakan coba masuk.');
            setIsRegistering(false);
          }
        }
      } else {
        // Login Biasa
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        
        // Verifikasi apakah user terdaftar sebagai klien di database
        const { data: clientProfile, error: profileErr } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !clientProfile) {
          // Jika tidak ada di client_profiles, mungkin ini staff atau akun belum lengkap
          console.warn("Profil klien tidak ditemukan di database.");
        }

        if (onLogin && data.session) {
          onLogin({
            user: data.user,
            role: 'client',
            profile: clientProfile || { full_name: data.user.user_metadata?.full_name || 'User', id: data.user.id }
          });
        }
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Email atau kata sandi salah.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (onLogin) {
      onLogin({
        user: { id: 'demo-user', email: 'guest@bale.host' },
        role: 'client',
        profile: { full_name: 'Guest User (Demo)', id: 'demo-user' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] size-[40%] bg-blue-400/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-white p-10 md:p-12 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100 animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <button 
            onClick={() => onNavigate(AppView.LANDING)}
            className="group flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[2px] mx-auto mb-8 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span> 
            Kembali ke Beranda
          </button>
          
          <div className="bg-primary size-16 rounded-[24px] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-primary/30 transform hover:rotate-12 transition-transform duration-500">
            <span className="material-symbols-outlined text-3xl">rocket_launch</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {isRegistering ? 'Daftar Akun' : 'Portal Klien'}
          </h2>
          <p className="text-gray-400 mt-2 font-bold text-[10px] uppercase tracking-[3px]">
            {isRegistering ? 'Mulai perjalanan digital Anda' : 'Kelola proyek website Anda'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 text-[11px] rounded-2xl font-bold flex items-start gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {isRegistering && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nama Lengkap</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">person</span>
                <input 
                  type="text" 
                  required
                  placeholder="Nama Lengkap Anda"
                  className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 pr-6 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
              <input 
                type="email" 
                required
                placeholder="email@perusahaan.com"
                className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 pr-6 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock</span>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 pr-6 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Konfirmasi Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock_reset</span>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 pr-6 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="w-full h-16 bg-primary text-white font-black uppercase text-[11px] tracking-[3px] rounded-2xl hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/25 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isRegistering ? 'Daftar Sekarang' : 'Masuk Portal'}
                <span className="material-symbols-outlined text-[18px]">login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4 items-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
          >
            {isRegistering ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar Gratis'}
          </button>

          <div className="w-full flex items-center gap-4 py-2">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Atau</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <button 
            onClick={handleDemoLogin}
            className="w-full h-14 bg-white border-2 border-dashed border-gray-200 text-gray-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Akses Mode Demo (Instan)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginView;
