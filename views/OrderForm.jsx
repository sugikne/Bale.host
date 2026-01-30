
import React, { useState } from 'react';
import { AppView } from '../types.js';

const OrderFormView = ({ onNavigate, onSubmit, userProfile, initialPlan = 'BUSINESS' }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'web',
    plan: initialPlan,
    description: '',
    amount: initialPlan === 'STARTER' ? '$299' : initialPlan === 'BUSINESS' ? '$599' : 'Custom'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-12 animate-fade-in relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] -mr-20 -mt-20"></div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <button 
          onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)}
          className="group flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[2px] mb-10 hover:text-primary transition-all"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span> Kembali ke Dashboard
        </button>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-primary/10">
            <span className="material-symbols-outlined text-sm">rocket</span> Step: Order Details
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Mulai Proyek Baru</h2>
          <p className="text-gray-500 mt-4 font-medium leading-relaxed">Berikan detail visi Anda, dan tim ahli kami akan mewujudkannya dalam waktu singkat.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nama Proyek</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">label</span>
              <input 
                required
                disabled={loading}
                type="text" 
                placeholder="Misal: Redesign Landing Page Toko"
                className="w-full h-16 px-14 rounded-2xl border-gray-100 bg-gray-50 focus:ring-primary/20 focus:border-primary font-medium transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tipe Website</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">language</span>
                <select 
                  disabled={loading}
                  className="w-full h-16 pl-14 pr-6 rounded-2xl border-gray-100 bg-gray-50 focus:ring-primary/20 focus:border-primary font-medium transition-all appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="web">Company Profile</option>
                  <option value="shopping_cart">E-Commerce Store</option>
                  <option value="rocket_launch">High-Conv Landing Page</option>
                  <option value="custom">Web Application</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Pilih Paket</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">package_2</span>
                <select 
                  disabled={loading}
                  className="w-full h-16 pl-14 pr-6 rounded-2xl border-gray-100 bg-gray-50 focus:ring-primary/20 focus:border-primary font-medium transition-all appearance-none"
                  value={formData.plan}
                  onChange={e => {
                    const p = e.target.value;
                    const amt = p === 'STARTER' ? '$299' : p === 'BUSINESS' ? '$599' : 'Custom';
                    setFormData({...formData, plan: p, amount: amt});
                  }}
                >
                  <option value="STARTER">Starter Launch ($299)</option>
                  <option value="BUSINESS">Business Pro ($599)</option>
                  <option value="CUSTOM">Custom Enterprise (Contact)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Deskripsi & Kebutuhan</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-6 text-gray-400 text-[20px]">description</span>
              <textarea 
                required
                disabled={loading}
                rows="5"
                placeholder="Ceritakan tentang bisnis Anda, target audiens, dan fitur khusus yang Anda inginkan..."
                className="w-full pl-14 pr-6 py-6 rounded-2xl border-gray-100 bg-gray-50 focus:ring-primary/20 focus:border-primary font-medium transition-all"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-blue-50">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Total Investasi</p>
                <p className="text-xl font-black text-gray-900 leading-none mt-0.5">{formData.amount}</p>
              </div>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Billing Monthly / One-time</p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-20 bg-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-[4px] shadow-2xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? (
              <>
                <div className="size-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                Memproses Pesanan...
              </>
            ) : (
              <>
                Konfirmasi & Pesan Sekarang
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-10">
          Pesanan Anda akan ditinjau oleh tim kami dalam &lt; 24 jam.
        </p>
      </div>
    </div>
  );
};

export default OrderFormView;
