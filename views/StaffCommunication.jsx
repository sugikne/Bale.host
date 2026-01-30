
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView } from '../types.js';
import { GoogleGenAI, Modality } from '@google/genai';

// Helper for Audio Decoding
const decode = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(data, ctx, sampleRate, numChannels) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const StaffCommunicationView = ({ onNavigate, clients = [], messages = [], onSendMessage, initialClientId }) => {
  const [selectedClientId, setSelectedClientId] = useState(initialClientId || (clients.length > 0 ? clients[0].id : null));
  const [searchTerm, setSearchTerm] = useState('');
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callTime, setCallTime] = useState(0);
  
  const chatEndRef = useRef(null);
  const sessionRef = useRef(null);
  const audioContextRef = useRef(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set());

  useEffect(() => {
    if (initialClientId) setSelectedClientId(initialClientId);
  }, [initialClientId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedClientId]);

  useEffect(() => {
    let timer;
    if (isCalling) {
      timer = setInterval(() => setCallTime(prev => prev + 1), 1000);
    } else {
      setCallTime(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  const filteredMessages = useMemo(() => 
    messages.filter(m => m.client_id === selectedClientId),
    [messages, selectedClientId]
  );

  const selectedClient = useMemo(() => 
    clients.find(c => c.id === selectedClientId),
    [clients, selectedClientId]
  );

  const displayedClients = useMemo(() => {
    return clients.filter(c => 
      c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(client => {
      const clientMessages = messages.filter(m => m.client_id === client.id);
      const lastMsg = clientMessages[clientMessages.length - 1];
      return { ...client, lastMessage: lastMsg };
    }).sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return timeB - timeA;
    });
  }, [clients, searchTerm, messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedClientId) return;
    onSendMessage(selectedClientId, inputText, 'staff', 'Admin Bale.Host');
    setInputText('');
  };

  const startCall = async () => {
    if (isCalling) {
      stopCall();
      return;
    }

    try {
      setIsCalling(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onclose: () => stopCall(),
          onerror: (e) => {
            console.error("Call error:", e);
            stopCall();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `Anda adalah asisten proyek Bale.Host yang berbicara langsung dengan staff agency. Nama klien saat ini adalah ${selectedClient?.full_name}. Bantu staff mendiskusikan detail proyek, memberikan saran teknis, atau merangkum poin pembicaraan klien ini secara verbal.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start call:", err);
      setIsCalling(false);
    }
  };

  const stopCall = () => {
    setIsCalling(false);
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    if (audioContextRef.current) {
      audioContextRef.current.input.close();
      audioContextRef.current.output.close();
    }
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-[#0a0c10] text-white flex overflow-hidden">
      {/* Sidebar: Client List */}
      <aside className="w-80 bg-[#11141b] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <button 
            onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)} 
            className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 hover:text-primary transition-colors flex items-center gap-2 mb-6"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Dashboard
          </button>
          <h2 className="text-xl font-black tracking-tight mb-6">Support Chat</h2>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">search</span>
            <input 
              type="text"
              placeholder="Cari Klien..."
              className="w-full h-11 bg-white/5 border border-white/5 rounded-xl pl-11 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
          {displayedClients.length > 0 ? displayedClients.map(c => (
            <button 
              key={c.id}
              onClick={() => setSelectedClientId(c.id)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all relative group ${
                selectedClientId === c.id 
                  ? 'bg-primary shadow-xl shadow-primary/20' 
                  : 'hover:bg-white/5'
              }`}
            >
              <div className={`size-11 rounded-xl flex items-center justify-center font-black uppercase text-xs transition-colors ${
                selectedClientId === c.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                {c.full_name?.charAt(0)}
              </div>
              
              <div className="text-left overflow-hidden flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="text-sm font-black truncate max-w-[120px]">{c.full_name}</p>
                  {c.lastMessage && (
                    <span className="text-[8px] font-bold text-gray-500 group-hover:text-gray-400">
                      {new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] truncate ${selectedClientId === c.id ? 'text-white/70' : 'text-gray-500'}`}>
                  {c.lastMessage ? c.lastMessage.content : 'Mulai percakapan baru...'}
                </p>
              </div>
            </button>
          )) : (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-white/5 mb-4">search_off</span>
              <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">Klien tidak ditemukan</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col bg-[#0d0f14] relative">
        {selectedClient ? (
          <>
            <header className="p-6 border-b border-white/5 bg-[#11141b]/80 backdrop-blur-md flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black uppercase border border-primary/5">
                  {selectedClient.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-lg leading-none">{selectedClient.full_name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                      <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                    </p>
                    <span className="text-white/10">•</span>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedClient.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={startCall}
                  className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
                    isCalling ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{isCalling ? 'call_end' : 'call'}</span>
                  {isCalling && <span className="text-[10px] font-black">{formatTime(callTime)}</span>}
                </button>
                <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">info</span>
                </button>
              </div>
            </header>

            {/* Calling Overlay */}
            {isCalling && (
              <div className="absolute inset-x-0 top-[89px] bottom-0 z-20 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
                <div className="size-32 rounded-full bg-primary/20 flex items-center justify-center relative mb-8">
                   <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping opacity-25"></div>
                   <div className="size-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-black">
                     {selectedClient.full_name?.charAt(0)}
                   </div>
                </div>
                <h4 className="text-2xl font-black mb-2">Voice Assistance Active</h4>
                <p className="text-primary font-black text-[11px] uppercase tracking-[4px] mb-12">Berbicara dengan Asisten Proyek...</p>
                
                <div className="flex gap-1 items-center h-12">
                   {[...Array(12)].map((_, i) => (
                     <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }}></div>
                   ))}
                </div>

                <button 
                  onClick={stopCall}
                  className="mt-12 px-8 py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center gap-3 shadow-2xl shadow-red-500/20"
                >
                  <span className="material-symbols-outlined">call_end</span> Akhiri Panggilan
                </button>
              </div>
            )}

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
              {filteredMessages.length > 0 ? filteredMessages.map((m, i) => (
                <div key={m.id || i} className={`flex flex-col ${m.role === 'staff' ? 'items-end' : 'items-start'} animate-fade-in`}>
                  <div className={`max-w-[65%] p-6 rounded-[28px] ${
                    m.role === 'staff' 
                      ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10' 
                      : 'bg-[#1a1e26] text-white rounded-tl-none border border-white/5'
                  }`}>
                    <p className="text-[13px] font-medium leading-relaxed">{m.content}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mt-2.5 px-3">
                    {m.sender} • {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <span className="material-symbols-outlined text-7xl mb-4">forum</span>
                  <p className="font-black text-[10px] uppercase tracking-[5px]">Belum ada pesan</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-6 bg-[#11141b] border-t border-white/5 flex gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder={`Tulis balasan untuk ${selectedClient.full_name?.split(' ')[0]}...`}
                  className="w-full h-14 bg-black/40 border-white/5 rounded-2xl px-6 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium transition-all"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   <button type="button" className="p-2 text-gray-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">attach_file</span>
                   </button>
                   <button type="button" className="p-2 text-gray-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                   </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className={`size-14 bg-primary text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-primary/20 ${
                  !inputText.trim() ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="max-w-xs space-y-8">
              <div className="relative mx-auto size-32 bg-white/5 rounded-full flex items-center justify-center">
                 <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                 <span className="material-symbols-outlined text-6xl text-primary relative z-10">chat_bubble</span>
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">Pilih Chat Klien</h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[4px] leading-relaxed">
                  Pilih salah satu klien dari daftar di samping untuk mulai memberikan bantuan teknis.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffCommunicationView;
