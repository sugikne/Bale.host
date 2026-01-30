
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types.js';

const ClientCommunicationView = ({ 
  onNavigate, 
  messages = [], 
  onSendMessage, 
  onEditMessage, 
  onDeleteMessage, 
  userProfile 
}) => {
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile) return;
    onSendMessage(userProfile.id, inputText, 'client', userProfile.full_name);
    setInputText('');
  };

  const startEditing = (m) => {
    setEditingId(m.id);
    setEditText(m.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (e) => {
    e?.preventDefault();
    if (!editText.trim() || !editingId) return;
    onEditMessage(editingId, editText);
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id) => {
    if (confirm('Hapus pesan ini?')) {
      onDeleteMessage(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
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
          <SidebarItem icon="forum" label="Chat Support" active />
          <SidebarItem icon="settings" label="Pengaturan" onClick={() => onNavigate(AppView.SETTINGS)} />
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        <header className="p-8 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Chat Support</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="size-2 bg-green-500 rounded-full"></span> Konsultasi Langsung dengan Staff Ahli Kami
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-gray-400">Response Time</p>
              <p className="text-[11px] font-bold text-gray-900">&lt; 15 Menit</p>
            </div>
            <div className="size-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <span className="material-symbols-outlined">support_agent</span>
            </div>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="size-20 bg-white rounded-full flex items-center justify-center mx-auto text-gray-200 border border-gray-100">
                <span className="material-symbols-outlined text-4xl">chat_bubble</span>
              </div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[3px]">Belum ada pesan. Mulai kirim pertanyaan Anda!</p>
            </div>
          )}
          
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.role === 'client' ? 'items-end' : 'items-start'} animate-fade-in group`}>
              <div className={`relative max-w-[75%] p-6 rounded-[28px] ${
                m.role === 'client' 
                  ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10' 
                  : 'bg-white text-gray-700 rounded-tl-none border border-gray-100 shadow-sm'
              }`}>
                {editingId === m.id ? (
                  <div className="space-y-3">
                    <textarea 
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white text-[13px] outline-none focus:bg-white/20"
                      rows="3"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={cancelEditing} className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/20">Batal</button>
                      <button onClick={saveEdit} className="px-3 py-1.5 bg-white text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-100">Simpan</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[13px] font-medium leading-relaxed">{m.content}</p>
                    {/* Action buttons for client messages */}
                    {m.role === 'client' && (
                      <div className="absolute right-0 -bottom-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditing(m)} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-primary">Edit</button>
                        <span className="text-gray-300">•</span>
                        <button onClick={() => handleDelete(m.id)} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500">Hapus</button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2.5 px-3 ${editingId === m.id ? 'hidden' : ''}`}>
                {m.sender} • {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100 flex gap-4">
          <input 
            type="text" 
            placeholder="Tanya apapun tentang website Anda..."
            className="flex-1 h-14 bg-gray-50 border-gray-100 rounded-2xl px-6 text-gray-900 focus:ring-primary focus:border-primary font-medium outline-none transition-all"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={!!editingId}
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || !!editingId}
            className={`size-14 bg-primary text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-primary/20 ${!inputText.trim() || !!editingId ? 'opacity-50 scale-95 grayscale' : 'hover:scale-105 active:scale-95'}`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
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

export default ClientCommunicationView;
