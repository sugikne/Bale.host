
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView } from './types.js';
import LandingView from './views/Landing.jsx';
import ClientDashboardView from './views/ClientDashboard.jsx';
import OrderFormView from './views/OrderForm.jsx';
import StaffCommunicationView from './views/StaffCommunication.jsx';
import ClientCommunicationView from './views/ClientCommunication.jsx';
import AdminDashboardView from './views/AdminDashboard.jsx';
import StaffLoginView from './views/StaffLogin.jsx';
import ClientLoginView from './views/ClientLogin.jsx';
import MyOrdersView from './views/MyOrders.jsx';
import SettingsView from './views/Settings.jsx';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';

const App = () => {
  const [view, setView] = useState(AppView.LANDING);
  const [session, setSession] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null); // 'admin' | 'client'
  const [userProfile, setUserProfile] = useState(null);
  const [activeChatClientId, setActiveChatClientId] = useState(null);
  const [activeOrderPlan, setActiveOrderPlan] = useState('BUSINESS');
  const [isLoading, setIsLoading] = useState(true);
  
  // Centralized State
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allClients, setAllClients] = useState([]);

  // --- MOCK DATA ---
  const INITIAL_MOCK_PROJECTS = [
    { id: 'p1', client_id: 'demo-user', name: 'Website Portofolio Art', type: 'web', plan: 'STARTER', status: 'In Progress', progress: 65, amount: '$299', lastUpdate: new Date().toISOString() },
    { id: 'p2', client_id: 'demo-user', name: 'E-Commerce Fashion', type: 'shopping_cart', plan: 'BUSINESS', status: 'Briefing', progress: 15, amount: '$599', lastUpdate: new Date().toISOString() }
  ];
  const INITIAL_MOCK_CLIENTS = [{ id: 'demo-user', full_name: 'Guest User (Demo)', email: 'guest@bale.host' }];
  const INITIAL_MOCK_MESSAGES = [{ id: 'm1', client_id: 'demo-user', content: 'Halo! Selamat datang di Bale.Host. Ada yang bisa kami bantu?', role: 'staff', sender: 'Admin Bale', timestamp: new Date().toISOString() }];

  const identifyUser = useCallback(async (user) => {
    if (!user || !isSupabaseConfigured) return null;
    try {
      const { data: staff } = await supabase.from('staff_profiles').select('*').eq('id', user.id).single();
      if (staff) {
        setCurrentUserRole('admin');
        setUserProfile(staff);
        return 'admin';
      }
      const { data: client } = await supabase.from('client_profiles').select('*').eq('id', user.id).single();
      if (client) {
        setCurrentUserRole('client');
        setUserProfile(client);
        return 'client';
      }
      return null;
    } catch (e) {
      console.error("Identify user error:", e);
      return null;
    }
  }, []);

  const fetchData = useCallback(async (role, userId) => {
    if (!userId) return;
    
    if (userId.includes('demo') || !isSupabaseConfigured) {
      return;
    }

    try {
      if (role === 'client') {
        const { data: p } = await supabase.from('projects').select('*').eq('client_id', userId).order('lastUpdate', { ascending: false });
        const { data: m } = await supabase.from('messages').select('*').eq('client_id', userId).order('timestamp', { ascending: true });
        setProjects(p || []);
        setMessages(m || []);
      } else if (role === 'admin') {
        const { data: p } = await supabase.from('projects').select('*').order('lastUpdate', { ascending: false });
        const { data: m } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
        const { data: c } = await supabase.from('client_profiles').select('*').order('full_name');
        setProjects(p || []);
        setMessages(m || []);
        setAllClients(c || []);
      }
    } catch (err) {
      console.error("Data sync error:", err);
    }
  }, []);

  // Auth & Initial Data Loading
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!isSupabaseConfigured) {
        if (isMounted) setIsLoading(false);
        return;
      }
      
      const { data: { session: s } } = await supabase.auth.getSession();
      if (s && isMounted) {
        setSession(s);
        const role = await identifyUser(s.user);
        if (role) await fetchData(role, s.user.id);
      }
      if (isMounted) setIsLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      
      if (!newSession) {
        setSession(prev => (prev?.user?.id?.includes('demo') ? prev : null));
        if (!session?.user?.id?.includes('demo')) {
          setCurrentUserRole(null);
          setUserProfile(null);
        }
        return;
      }

      setSession(newSession);
      const role = await identifyUser(newSession.user);
      if (role) await fetchData(role, newSession.user.id);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [identifyUser, fetchData]);

  const handleManualLogin = (authData) => {
    setSession(authData);
    setCurrentUserRole(authData.role);
    setUserProfile(authData.profile);
    
    if (authData.user.id.includes('demo')) {
      setProjects(INITIAL_MOCK_PROJECTS);
      setAllClients(INITIAL_MOCK_CLIENTS);
      setMessages(INITIAL_MOCK_MESSAGES);
    }
    setView(authData.role === 'admin' ? AppView.ADMIN_DASHBOARD : AppView.CLIENT_DASHBOARD);
  };

  const handleSendMessage = async (clientId, content, role, senderName) => {
    const newMessage = { 
      id: 'm-' + Date.now(),
      client_id: clientId, 
      content, 
      role, 
      sender: senderName, 
      timestamp: new Date().toISOString() 
    };

    if (session?.user?.id?.includes('demo')) {
      setMessages(prev => [...prev, newMessage]);
    } else if (isSupabaseConfigured) {
      try {
        await supabase.from('messages').insert([newMessage]);
        await fetchData(currentUserRole, session?.user?.id);
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    if (session?.user?.id?.includes('demo')) {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: newContent } : m));
    } else if (isSupabaseConfigured) {
      try {
        await supabase.from('messages').update({ content: newContent }).eq('id', messageId);
        await fetchData(currentUserRole, session?.user?.id);
      } catch (err) {
        console.error("Failed to edit message:", err);
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (session?.user?.id?.includes('demo')) {
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } else if (isSupabaseConfigured) {
      try {
        await supabase.from('messages').delete().eq('id', messageId);
        await fetchData(currentUserRole, session?.user?.id);
      } catch (err) {
        console.error("Failed to delete message:", err);
      }
    }
  };

  const handleCreateProject = async (projectData) => {
    const currentClientId = session?.user?.id || 'demo-user';
    const newProject = { 
      ...projectData, 
      id: 'p-' + Date.now(), 
      client_id: currentClientId, 
      status: 'Briefing', 
      progress: 10, 
      lastUpdate: new Date().toISOString() 
    };

    if (currentClientId.includes('demo')) {
      setProjects(prev => [newProject, ...prev]);
      setView(AppView.CLIENT_DASHBOARD);
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('projects').insert([newProject]);
        if (error) throw error;
        await fetchData(currentUserRole, session?.user?.id);
        setView(AppView.CLIENT_DASHBOARD);
      } catch (err) {
        console.error("Failed to create project:", err);
        alert("Gagal menyimpan pesanan. Silakan coba lagi.");
        throw err;
      }
    }
  };

  const updateProjectStatus = async (id, newStatus) => {
    const progressMap = { 'Briefing': 10, 'In Progress': 50, 'Revision': 80, 'Completed': 100, 'Pending Payment': 5 };
    const newProgress = progressMap[newStatus] || 0;

    if (session?.user?.id?.includes('demo')) {
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, status: newStatus, progress: newProgress, lastUpdate: new Date().toISOString() } : p
      ));
    } else if (isSupabaseConfigured) {
      try {
        await supabase.from('projects').update({ 
          status: newStatus, 
          progress: newProgress, 
          lastUpdate: new Date().toISOString() 
        }).eq('id', id);
        await fetchData('admin', session?.user?.id);
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Hapus proyek ini secara permanen?')) return;
    if (session?.user?.id?.includes('demo')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    } else if (isSupabaseConfigured) {
      try {
        await supabase.from('projects').delete().eq('id', id);
        await fetchData('admin', session?.user?.id);
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  const handleNavigate = useCallback((newView, payload) => {
    const clientProtected = [AppView.CLIENT_DASHBOARD, AppView.MY_ORDERS, AppView.SETTINGS, AppView.ORDER_FORM, AppView.COMMUNICATION];
    if (clientProtected.includes(newView) && !session) {
      setView(AppView.CLIENT_LOGIN);
      return;
    }

    if (newView === AppView.ADMIN_DASHBOARD && currentUserRole !== 'admin' && !session?.user?.id?.includes('demo')) {
      setView(AppView.STAFF_LOGIN);
      return;
    }

    if (newView === AppView.ORDER_FORM) setActiveOrderPlan(payload || 'BUSINESS');
    if (newView === AppView.COMMUNICATION && currentUserRole === 'admin') {
      setActiveChatClientId(payload || allClients[0]?.id || 'demo-user');
    }

    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentUserRole, session, allClients]);

  const handleLogout = () => {
    if (isSupabaseConfigured && !session?.user?.id?.includes('demo')) {
      supabase.auth.signOut();
    }
    setSession(null);
    setCurrentUserRole(null);
    setUserProfile(null);
    setView(AppView.LANDING);
  };

  const handleRefreshData = async () => {
    if (session) {
      await fetchData(currentUserRole, session.user.id);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Memuat Bale.Host...</p>
      </div>
    );
  }

  const commonProps = { onNavigate: handleNavigate, userProfile, onLogout: handleLogout };
  const currentClientId = session?.user?.id || 'demo-user';
  const clientProjects = projects.filter(p => p.client_id === currentClientId);

  switch (view) {
    case AppView.LANDING: return <LandingView {...commonProps} />;
    case AppView.CLIENT_DASHBOARD: return <ClientDashboardView {...commonProps} projects={clientProjects} />;
    case AppView.MY_ORDERS: return <MyOrdersView {...commonProps} projects={clientProjects} />;
    case AppView.SETTINGS: return <SettingsView {...commonProps} />;
    case AppView.ORDER_FORM: return <OrderFormView {...commonProps} initialPlan={activeOrderPlan} onSubmit={handleCreateProject} />;
    case AppView.COMMUNICATION: 
      return currentUserRole === 'admin' ? 
        <StaffCommunicationView {...commonProps} clients={allClients} messages={messages} onSendMessage={handleSendMessage} onEditMessage={handleEditMessage} onDeleteMessage={handleDeleteMessage} initialClientId={activeChatClientId} /> :
        <ClientCommunicationView {...commonProps} messages={messages.filter(m => m.client_id === currentClientId)} onSendMessage={handleSendMessage} onEditMessage={handleEditMessage} onDeleteMessage={handleDeleteMessage} />;
    case AppView.ADMIN_DASHBOARD:
      return <AdminDashboardView {...commonProps} projects={projects} clients={allClients} onUpdateStatus={updateProjectStatus} onDeleteProject={deleteProject} onRefresh={handleRefreshData} />;
    case AppView.STAFF_LOGIN: return <StaffLoginView onNavigate={handleNavigate} onLogin={handleManualLogin} />;
    case AppView.CLIENT_LOGIN: return <ClientLoginView onNavigate={handleNavigate} onLogin={handleManualLogin} />;
    default: return <LandingView onNavigate={handleNavigate} />;
  }
};

export default App;
