
import React, { useState } from 'react';
import { AppView } from '../types.js';

const LandingView = ({ onNavigate }) => {
  const [lang, setLang] = useState('ID');

  const content = {
    EN: {
      services: "Services",
      portal: "Client Portal",
      pricing: "Pricing",
      login: "Staff Login",
      getStarted: "Get Started",
      heroBadge: "Modern Web Agency Portal",
      heroTitle: "Premium Digital Solutions,",
      heroTitleSpan: "Engineered for Growth.",
      heroDesc: "Professional website development with an integrated client dashboard for real-time tracking, direct communication, and asset management.",
      orderNow: "Pesan Sekarang",
      pricingTitle: "Transparent Pricing Plans",
      pricingDesc: "Choose the perfect foundation for your digital presence. No hidden fees.",
      servicesTitle: "Complete Digital Ecosystem",
      servicesDesc: "Beyond just code, we build tools that empower your business to scale globally.",
      processTitle: "Our Workflow",
      processDesc: "Simple steps to transform your vision into a live digital product.",
      starter: "Starter Launch",
      business: "Professional Business",
      custom: "Enterprise Solution",
      popular: "MOST POPULAR",
      perProject: "starting from",
      quote: "Get Custom Quote",
      footerHome: "Home",
      footerDash: "Dashboard",
      footerStaff: "Staff Portal",
      footerSupport: "Support",
      features: {
        starter: [
          "Modern 3-Page Responsive Design",
          "Basic On-Page SEO Optimization",
          "Contact Form & Map Integration",
          "1 Month Technical Support",
          "Free .com Domain (1 Year)",
          "Standard SSD Hosting"
        ],
        business: [
          "Unlimited Dynamic Pages",
          "Full E-Commerce Functionality",
          "Payment Gateway Integration",
          "Premium UI/UX Design",
          "Advanced SEO & Analytics",
          "6 Months Priority Support",
          "High-Speed Cloud Hosting",
          "Professional Business Emails"
        ],
        custom: [
          "Tailor-made System Architecture",
          "Enterprise API Integrations",
          "Dedicated Project Manager",
          "24/7 VIP Support Access",
          "Scalable Infrastructure",
          "Full Source Code Ownership",
          "Performance Maintenance Plan"
        ]
      }
    },
    ID: {
      services: "Layanan",
      portal: "Portal Klien",
      pricing: "Paket Harga",
      login: "Login Staff",
      getStarted: "Mulai Sekarang",
      heroBadge: "Portal Agency Web Modern",
      heroTitle: "Solusi Digital Premium,",
      heroTitleSpan: "Dibuat Untuk Berkembang.",
      heroDesc: "Pembuatan website profesional dengan dashboard terintegrasi untuk pelacakan real-time, komunikasi langsung, dan manajemen aset.",
      orderNow: "Pesan Sekarang",
      pricingTitle: "Paket Harga Transparan",
      pricingDesc: "Pilih fondasi sempurna untuk kehadiran digital Anda. Tanpa biaya tersembunyi.",
      servicesTitle: "Ekosistem Digital Lengkap",
      servicesDesc: "Lebih dari sekadar kode, kami membangun alat yang memberdayakan bisnis Anda untuk berkembang.",
      processTitle: "Alur Kerja Kami",
      processDesc: "Langkah sederhana untuk mengubah visi Anda menjadi produk digital yang aktif.",
      starter: "Starter Launch",
      business: "Professional Business",
      custom: "Enterprise Solution",
      popular: "PALING POPULER",
      perProject: "mulai dari",
      quote: "Hubungi Kami",
      footerHome: "Beranda",
      footerDash: "Dashboard",
      footerStaff: "Portal Staff",
      footerSupport: "Bantuan",
      features: {
        starter: [
          "Desain 3 Halaman Responsif",
          "Optimasi SEO Dasar",
          "Integrasi Google Maps & Kontak",
          "Support Teknis 1 Bulan",
          "Gratis Domain .com (1 Tahun)",
          "Hosting SSD Standar"
        ],
        business: [
          "Halaman Dinamis Tak Terbatas",
          "Fitur E-Commerce Lengkap",
          "Integrasi Payment Gateway",
          "Desain UI/UX Premium",
          "SEO Lanjutan & Analytics",
          "Support Prioritas 6 Bulan",
          "High-Speed Cloud Hosting",
          "Email Bisnis Profesional"
        ],
        custom: [
          "Arsitektur Sistem Kustom",
          "Integrasi API Enterprise",
          "Project Manager Khusus",
          "Akses Support VIP 24/7",
          "Infrastruktur Skalabel",
          "Kepemilikan Kode Sumber Penuh",
          "Rencana Pemeliharaan Performa"
        ]
      }
    }
  };

  const t = content[lang];

  const scrollTo = (id) => {
    if (id === 'root') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#f6f6f8] min-h-screen font-display scroll-smooth">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#f0f2f4]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('root')}>
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">Bale.Host</h2>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => scrollTo('services')} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors cursor-pointer">{t.services}</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors cursor-pointer">{t.pricing}</button>
            <button onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-blue-700 transition-colors cursor-pointer">{t.portal}</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
              <button onClick={() => setLang('ID')} className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${lang === 'ID' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>ID</button>
              <button onClick={() => setLang('EN')} className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${lang === 'EN' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>EN</button>
            </div>
            <button onClick={() => onNavigate(AppView.CLIENT_LOGIN)} className="bg-primary text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
              Login / Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-32 animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary w-fit border border-primary/10">{t.heroBadge}</span>
              <h1 className="text-[#111318] text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                {t.heroTitle}<br/><span className="text-primary">{t.heroTitleSpan}</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-[500px] leading-relaxed font-medium">{t.heroDesc}</p>
            </div>
            <div className="flex flex-wrap gap-5">
              <button onClick={() => onNavigate(AppView.ORDER_FORM, 'BUSINESS')} className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all">
                {t.orderNow}
              </button>
              <button onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)} className="bg-white border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-700 hover:border-primary hover:text-primary transition-all">
                Akses Portal Saya
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-[48px] blur-2xl"></div>
            <div className="relative bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-2xl p-4">
               <div className="rounded-[32px] overflow-hidden aspect-[4/3]">
                 <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" alt="Platform Dashboard" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight text-[#111318]">{t.processTitle}</h2>
          <p className="text-gray-500 mt-4 text-lg font-medium">{t.processDesc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ProcessStep number="01" title="Consult" desc="Diskusi mendalam mengenai kebutuhan dan target bisnis Anda." />
          <ProcessStep number="02" title="Design" desc="Pembuatan desain UI/UX modern yang sesuai identitas brand." />
          <ProcessStep number="03" title="Build" desc="Proses development dengan teknologi terbaru & optimasi." />
          <ProcessStep number="04" title="Launch" desc="Review akhir, deployment, dan training penggunaan portal." />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 bg-white/60 backdrop-blur-sm rounded-[56px] border border-white mb-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black tracking-tight text-[#111318]">{t.servicesTitle}</h2>
          <p className="text-gray-500 mt-4 text-lg font-medium">{t.servicesDesc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ServiceItem icon="web" title="Custom Design" desc="Desain UI/UX unik dan eksklusif untuk setiap klien, bukan sekadar template." />
          <ServiceItem icon="shopping_cart" title="E-Commerce" desc="Platform toko online kuat dengan sistem pembayaran otomatis terintegrasi." />
          <ServiceItem icon="speed" title="Performance" desc="Kecepatan akses ultra-cepat dengan optimasi core web vitals terbaik." />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black tracking-tight text-[#111318]">{t.pricingTitle}</h2>
          <p className="text-gray-500 mt-4 text-lg font-medium">{t.pricingDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <PricingCard planId="STARTER" plan={t.starter} price="$299" features={t.features.starter} t={t} onNavigate={onNavigate} />
          <PricingCard planId="BUSINESS" plan={t.business} price="$599" features={t.features.business} t={t} onNavigate={onNavigate} popular />
          <PricingCard planId="CUSTOM" plan={t.custom} price="Custom" features={t.features.custom} t={t} onNavigate={onNavigate} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#f0f2f4] pt-24 pb-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col items-center gap-12 text-center">
          <div className="flex items-center gap-4">
            <div className="text-primary"><span className="material-symbols-outlined text-4xl">rocket_launch</span></div>
            <h2 className="text-2xl font-black tracking-tighter">Bale.Host</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] text-gray-400 font-black uppercase tracking-[4px]">
            <button className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollTo('root')}>{t.footerHome}</button>
            <button className="hover:text-primary transition-colors cursor-pointer" onClick={() => onNavigate(AppView.CLIENT_DASHBOARD)}>{t.footerDash}</button>
            <button className="hover:text-primary transition-colors cursor-pointer" onClick={() => onNavigate(AppView.STAFF_LOGIN)}>{t.footerStaff}</button>
            <button className="hover:text-primary transition-colors cursor-pointer" onClick={() => onNavigate(AppView.COMMUNICATION)}>{t.footerSupport}</button>
          </div>
          <div className="h-px w-full max-w-[400px] bg-gray-100"></div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2024 Bale.Host Digital Solutions. Dibuat dengan cinta untuk masa depan digital Anda.</p>
        </div>
      </footer>
    </div>
  );
};

const ProcessStep = ({ number, title, desc }) => (
  <div className="relative group p-8 rounded-[32px] hover:bg-white transition-all border border-transparent hover:border-gray-100 hover:shadow-xl">
    <span className="text-primary/10 text-6xl font-black absolute top-4 left-4 group-hover:text-primary/5 transition-colors">{number}</span>
    <div className="relative z-10">
      <h3 className="text-xl font-black text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ServiceItem = ({ icon, title, desc }) => (
  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
    <div className="size-16 bg-primary/5 rounded-[24px] flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const PricingCard = ({ planId, plan, price, features, t, onNavigate, popular }) => (
  <div className={`bg-white p-10 rounded-[48px] border-2 ${popular ? 'border-primary shadow-2xl scale-105 z-10' : 'border-gray-50 shadow-sm'} flex flex-col hover:border-primary/40 transition-all relative`}>
    {popular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-full tracking-[3px] uppercase shadow-xl shadow-primary/30">{t.popular}</div>}
    <div className="mb-10 text-center">
      <h3 className="text-[11px] font-black uppercase tracking-[4px] text-gray-400 mb-4">{plan}</h3>
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.perProject}</span>
        <span className="text-5xl font-black tracking-tighter text-gray-900">{price}</span>
      </div>
    </div>
    <ul className="space-y-4 mb-12 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-4 text-sm text-gray-600 font-medium">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
          <span>{f}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={() => onNavigate(AppView.ORDER_FORM, planId)} 
      className={`w-full py-5 font-black text-xs uppercase tracking-widest rounded-2xl transition-all ${popular ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02]' : 'bg-gray-50 text-gray-700 hover:bg-gray-900 hover:text-white'}`}
    >
      {price === 'Custom' ? t.quote : t.orderNow}
    </button>
  </div>
);

export default LandingView;
