'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, LayoutDashboard, Play, Settings, RefreshCw, Sparkles, CheckCircle2, Menu, X, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeProvider';

const D2C_STRATEGY: Record<number, { format: string, color: string, tip: string }> = {
  0: { format: 'Story', color: 'bg-amber-100 text-amber-800 border-amber-200', tip: 'Sunday: Casual & Behind the scenes' },
  1: { format: 'Video', color: 'bg-rose-100 text-rose-800 border-rose-200', tip: 'Monday: Reels for High Reach' },
  2: { format: 'Carousel', color: 'bg-violet-100 text-violet-800 border-violet-200', tip: 'Tuesday: High Engagement & Saves' },
  3: { format: 'Story', color: 'bg-amber-100 text-amber-800 border-amber-200', tip: 'Wednesday: Community Interaction' },
  4: { format: 'Post', color: 'bg-sky-100 text-sky-800 border-sky-200', tip: 'Thursday: Value & Information' },
  5: { format: 'Video', color: 'bg-rose-100 text-rose-800 border-rose-200', tip: 'Friday: Entertainment for weekend' },
  6: { format: 'Carousel', color: 'bg-violet-100 text-violet-800 border-violet-200', tip: 'Saturday: Weekend scrolling saves' },
};

export default function App() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('calendar');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error', action?: { label: string, tab: string } } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);


  useEffect(() => {
    fetchIdeas();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  const fetchIdeas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/scrape`);
      const data = await res.json();
      setIdeas(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleScrape = async () => {
    setIsScraping(true);
    try {
      const res = await fetch(`${API_URL}/api/scrape`, { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setNotification({ message: data.message || "Scraping complete!", type: 'success' });
      await fetchIdeas();
    } catch (e: any) {
      console.error("Scrape Failed:", e);
      setNotification({ message: `Scrape Failed: ${e.message}`, type: 'error' });
    } finally {
      setIsScraping(false);
    }
  };

  const handleGenerate = async (id: string) => {
    const idea = ideas.find(i => i._id === id);
    if (!idea) return;

    setIdeas(prev => prev.map(i => i._id === id ? { ...i, generationStatus: 'pending' } : i));
    setSelectedIdea((prev: any) => ({ ...prev, generationStatus: 'pending' }));
    
    try {
      const res = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });
      
      const { script, error } = await res.json();
      if (error) throw new Error(error);

      // Create a NEW idea record for the generated content
      const newCreatedIdea = {
        ...idea,
        _id: undefined, // Let backend generate new ID
        script,
        generationStatus: 'completed',
        generationCount: (idea.generationCount || 0) + 1,
        status: 'approved'
      };

      const created = await handleCreateIdea(newCreatedIdea);
      
      if (created) {
        // Keep the original idea in the calendar, but maybe update its locally tracked count
        setIdeas(prev => prev.map(i => i._id === id ? { ...i, generationStatus: 'none', generationCount: (i.generationCount || 0) + 1 } : i));

        setNotification({ 
          message: "Peura Script Generated Successfully!", 
          type: 'success',
          action: { label: 'View in CreatedPeura', tab: 'created' }
        });

        // Send email notification
        try {
          const notifyRes = await fetch(`${API_URL}/api/notify/success`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: created._id })
          });
          const notifyData = await notifyRes.json();
          if (notifyData.warning === 'EMAIL_FAILED') {
            setNotification({ message: "Script saved, but email failed. Check your Brevo key!", type: 'error' });
          }
        } catch (emailErr) {
          console.error("Email notification failed:", emailErr);
        }
      }


    } catch (e: any) {
      console.error("AI Generation Failed:", e);
      setIdeas(prev => prev.map(i => i._id === id ? { ...i, generationStatus: 'failed' } : i));
      setSelectedIdea((prev: any) => ({ ...prev, generationStatus: 'failed' }));
      setNotification({ message: `Generation Failed: ${e.message}`, type: 'error' });
    }
  };



  const handleCreateIdea = async (newIdea: any) => {
    try {
      const res = await fetch(`${API_URL}/api/idea/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIdea)
      });
      const created = await res.json();
      if (created.error) throw new Error(created.error);
      setIdeas(prev => [created, ...prev]);
      return created;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleUpdateIdea = async (id: string, updates: any) => {
    try {
      const res = await fetch(`${API_URL}/api/idea/${id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setIdeas(prev => prev.map(i => i._id === id ? updated : i));
      setSelectedIdea(updated);
      return updated;
    } catch (e) {
      console.error(e);
      return null;
    }
  };


  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-40">
        <div className="text-xl font-black uppercase tracking-wider text-black dark:text-white">
          Peura <span className="text-accent">AI</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-8 shadow-2xl lg:shadow-sm flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex justify-between items-center mb-12">
          <div className="text-2xl font-black uppercase tracking-wider text-black dark:text-white">
            Peura <span className="text-accent">AI</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'calendar' ? 'bg-amber-50 dark:bg-amber-900/20 text-accent' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-accent'}`}
            onClick={() => { setActiveTab('calendar'); setIsSidebarOpen(false); }}
          >
            <Calendar size={20} /> Smart Calendar
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard' ? 'bg-amber-50 dark:bg-amber-900/20 text-accent' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-accent'}`}
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'created' ? 'bg-amber-50 dark:bg-amber-900/20 text-accent' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-accent'}`}
            onClick={() => { setActiveTab('created'); setIsSidebarOpen(false); }}
          >
            <CheckCircle2 size={20} /> CreatedPeura
          </button>
        </nav>


        <div className="mt-auto space-y-2">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Theme</span>
              <ThemeToggle />
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium">
                <Settings size={20} /> Settings
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 lg:p-10 overflow-y-auto mt-16 lg:mt-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight dark:text-white">Content Engine</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm lg:text-base">AI-powered marketing automation for D2C growth.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button 
                    onClick={handleScrape}
                    disabled={isScraping}
                    className="flex-1 md:flex-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                >
                    <RefreshCw size={18} className={isScraping ? 'animate-spin' : ''} />
                    {isScraping ? 'Scraping...' : 'Scrape New Ideas'}
                </button>
                <button className="flex-1 md:flex-none bg-accent text-white px-7 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-accent/30 transition-all">
                    + New Campaign
                </button>
            </div>
        </header>

        <div className="view-container">
            {activeTab === 'calendar' && <CalendarView ideas={ideas} onSelectIdea={setSelectedIdea} />}
            {activeTab === 'dashboard' && <DashboardView ideasCount={ideas.length} />}
            {activeTab === 'created' && <CreatedPeuraView ideas={ideas} onSelectIdea={setSelectedIdea} />}
        </div>

        {/* Global Notification */}
        {notification && (
            <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${notification.type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'}`}>
                {notification.type === 'success' ? <CheckCircle2 size={20} className="text-green-400" /> : <Sparkles size={20} className="text-rose-200" />}
                <div className="flex flex-col">
                    <p className="font-bold text-sm">{notification.message}</p>
                    {notification.action && (
                        <button 
                            onClick={() => { setActiveTab(notification.action!.tab); setNotification(null); }}
                            className="text-[10px] font-black uppercase tracking-widest text-accent mt-1 hover:underline text-left"
                        >
                            {notification.action.label} →
                        </button>
                    )}
                </div>
                <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100">×</button>
            </div>
        )}


        {/* Content Planning Modal */}
        {selectedIdea && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedIdea(null)}>
        <div className="bg-white dark:bg-slate-900 rounded-[30px] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 lg:px-8 lg:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Content Planning</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Review and reschedule your daily content</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => router.push(`/edit-script/${selectedIdea._id}`)}
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                <Sparkles size={16} /> Edit in Studio
                            </button>
                            <button className="text-slate-400 hover:text-black dark:hover:text-white text-3xl transition-colors" onClick={() => setSelectedIdea(null)}>×</button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-10">
                        {/* Left Column: Editor */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Scheduled Date</label>
                                <input 
                                    type="date" 
                                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                                    value={selectedIdea.scheduledDate ? new Date(selectedIdea.scheduledDate).toISOString().split('T')[0] : ''} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Content Format</label>
                                  {selectedIdea.scheduledDate && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent bg-amber-50 px-2 py-1 rounded-md">
                                      <Sparkles size={12} />
                                      {D2C_STRATEGY[new Date(selectedIdea.scheduledDate).getDay()].tip}
                                    </div>
                                  )}
                                </div>
                                <select 
                                    className={`w-full px-5 py-3.5 rounded-2xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm ${selectedIdea.scheduledDate && selectedIdea.contentType === D2C_STRATEGY[new Date(selectedIdea.scheduledDate).getDay()].format ? 'border-green-400 ring-1 ring-green-400 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-800'}`}
                                    value={selectedIdea.contentType}
                                    onChange={(e) => handleUpdateIdea(selectedIdea._id, { contentType: e.target.value })}
                                >
                                    <option value="Video">Reel / Video</option>
                                    <option value="Carousel">Carousel Post</option>
                                    <option value="Post">Static Post</option>
                                    <option value="Story">IG Story</option>
                                </select>
                                {selectedIdea.scheduledDate && selectedIdea.contentType === D2C_STRATEGY[new Date(selectedIdea.scheduledDate).getDay()].format && (
                                  <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-2">
                                    <CheckCircle2 size={14} /> Perfect format for algorithm growth today!
                                  </p>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-accent mb-4">Strategic Creative Direction</h3>
                                <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                                    <div>
                                      <p className="text-[10px] font-black text-accent tracking-widest mb-1">HOOK</p>
                                      <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-bold">{selectedIdea.script?.hook}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-[10px] font-black text-accent tracking-widest mb-1">STORYLINE (AD SCRIPT)</p>
                                      <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-wrap">{selectedIdea.script?.storyline || selectedIdea.script?.mid}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <div>
                                          <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1">VISUAL DIRECTION</p>
                                          <p className="text-[13px] text-slate-600 leading-relaxed">{selectedIdea.script?.visualDirection || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1">PRODUCT FRAMING</p>
                                          <p className="text-[13px] text-slate-600 leading-relaxed">{selectedIdea.script?.productFraming || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div>
                                      <p className="text-[10px] font-black text-accent tracking-widest mb-2">VARIATIONS / ANGLES</p>
                                      <div className="space-y-2">
                                        {selectedIdea.script?.variations?.map((v: any, i: number) => (
                                            <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="text-[13px] font-bold text-slate-800">"{v.hook}"</p>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">Angle: {v.angle}</p>
                                            </div>
                                        )) || <p className="text-xs text-slate-400 italic">No variations generated.</p>}
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-[10px] font-black text-accent tracking-widest mb-1">CTA</p>
                                      <p className="text-[14px] text-slate-900 font-black">{selectedIdea.script?.cta}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Media Preview */}
                        <div className="h-full">
                            <div className="h-full min-h-[500px] bg-slate-900 rounded-[32px] flex items-center justify-center text-white text-center p-0 shadow-xl relative overflow-hidden group">
                                {/* Media Background Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                
                                {selectedIdea.generationStatus === 'completed' ? (
                                    <>
                                        {/* Dynamic Media Preview */}
                                        <div className="absolute inset-0 z-0">
                                          <img 
                                            src={`https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800&h=${selectedIdea.contentType === 'Video' || selectedIdea.contentType === 'Story' ? '1200' : '800'}`} 
                                            alt="Peura Preview" 
                                            className="w-full h-full object-cover"
                                          />
                                        </div>

                                        <div className="z-20 flex flex-col items-center p-10">
                                            <div className="w-20 h-20 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-2xl cursor-pointer hover:scale-110 transition-all border border-white/30 dark:border-white/10">
                                              {selectedIdea.contentType === 'Video' ? <Play size={32} fill="white" className="ml-1" /> : <Sparkles size={32} className="text-white" />}
                                            </div>
                                            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">
                                              {selectedIdea.contentType === 'Video' ? 'Reel Ready' : 
                                               selectedIdea.contentType === 'Story' ? 'Story Design' : 'Asset Ready'}
                                            </h3>
                                            <p className="text-slate-300 text-sm mb-8 font-medium italic">
                                              AI {selectedIdea.contentType === 'Video' ? 'Video' : 'Visual'} Production Complete
                                            </p>
                                            <div className="flex flex-col w-full gap-3 mt-6">
                                              <div className="flex gap-4 justify-center">
                                                <a 
                                                  href={`https://images.unsplash.com/photo-1572635196237-14b3f281503f`}
                                                  download={`Peura_${selectedIdea.contentType}_${selectedIdea._id}.jpg`}
                                                  target="_blank"
                                                  className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-slate-100 transition-all hover:scale-105"
                                                >
                                                  Download {selectedIdea.contentType === 'Video' ? 'MP4' : 'JPG'}
                                                </a>
                                                <button 
                                                  onClick={() => handleGenerate(selectedIdea._id)}
                                                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2"
                                                >
                                                  <RefreshCw size={18} /> Regenerate
                                                </button>
                                              </div>
                                              <div className="flex gap-4 justify-center mt-2">
                                                <a 
                                                  href={`https://wa.me/917987732171?text=${encodeURIComponent(`*${selectedIdea.title}*\n\n*Hook:* ${selectedIdea.script?.hook || ''}\n\n*Storyline:* ${selectedIdea.script?.storyline || ''}\n\n*Visuals:* ${selectedIdea.script?.visualDirection || ''}\n\n*CTA:* ${selectedIdea.script?.cta || ''}`)}`}
                                                  target="_blank"
                                                  className="bg-green-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 flex-1"
                                                >
                                                  <MessageCircle size={18} /> Send to WhatsApp
                                                </a>
                                                <a 
                                                  href="https://www.instagram.com/lenskart/"
                                                  target="_blank"
                                                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 flex-1"
                                                >
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                                  </svg>
                                                  Open Instagram
                                                </a>
                                              </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="z-20 flex flex-col items-center max-w-xs mx-auto p-10">
                                        <div className="absolute inset-0 bg-slate-900 z-0"></div>
                                        <div className="z-10 flex flex-col items-center">
                                          <RefreshCw size={40} className={`mb-6 text-accent ${selectedIdea.generationStatus === 'pending' ? 'animate-spin' : ''}`} />
                                          <p className="text-slate-300 font-bold mb-8 leading-relaxed uppercase tracking-widest text-[10px]">
                                            {selectedIdea.generationStatus === 'pending' 
                                              ? 'Peura AI is processing your cinematic sequence...' 
                                              : 'Ready to turn this script into a viral asset.'}
                                          </p>
                                          <button 
                                              className="bg-accent text-white px-8 py-4 rounded-2xl font-black w-full shadow-lg shadow-accent/40 hover:-translate-y-1 hover:shadow-accent/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider text-xs"
                                              disabled={selectedIdea.generationStatus === 'pending'}
                                              onClick={() => handleGenerate(selectedIdea._id)}
                                          >
                                              {selectedIdea.generationStatus === 'pending' ? 'Generating...' : 'Create with Peura AI'}
                                          </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

function CalendarView({ ideas, onSelectIdea }: { ideas: any[], onSelectIdea: (idea: any) => void }) {
  const daysInMonth = 31;
  const startDay = 5; // May 2026 starts on Friday (5)
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1 - startDay);
  
  return (
    <div className="pb-4">
      {/* Desktop Calendar View (lg and up) */}
      <div className="hidden lg:grid min-w-[800px] grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-[24px] overflow-hidden shadow-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <div key={day} className="bg-slate-50 dark:bg-slate-900 py-4 text-center text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800">
            {day}
          </div>
        ))}
        {calendarDays.map((dayNum, idx) => {
          const dateStr = dayNum > 0 && dayNum <= daysInMonth ? `2026-05-${dayNum.toString().padStart(2, '0')}` : null;
          const dayIdeas = ideas.filter(idea => idea.scheduledDate && idea.scheduledDate.startsWith(dateStr));
          const dayOfWeek = idx % 7;
          const recommendation = D2C_STRATEGY[dayOfWeek];
          
          return (
            <div key={idx} className={`bg-white dark:bg-slate-900 min-h-[160px] p-3 flex flex-col gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${dayNum <= 0 || dayNum > daysInMonth ? 'opacity-40 bg-slate-50 dark:bg-slate-950' : ''}`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-bold ${dayNum > 0 && dayNum <= daysInMonth ? 'text-slate-700' : 'text-slate-400'}`}>
                  {dayNum > 0 && dayNum <= daysInMonth ? dayNum : ''}
                </span>
                {dayNum > 0 && dayNum <= daysInMonth && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${recommendation.color} whitespace-nowrap hidden xl:inline-block`} title={recommendation.tip}>
                    ★ {recommendation.format}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-1.5 flex-1">
                {dayIdeas.map((idea, i) => {
                  let typeStyles = "bg-slate-50 border-slate-200 text-slate-600";
                  if (idea.contentType === 'Video') typeStyles = "border-l-4 border-l-rose-500 bg-rose-50 text-rose-700";
                  if (idea.contentType === 'Carousel') typeStyles = "border-l-4 border-l-violet-500 bg-violet-50 text-violet-700";
                  if (idea.contentType === 'Post') typeStyles = "border-l-4 border-l-sky-500 bg-sky-50 text-sky-700";
                  if (idea.contentType === 'Story') typeStyles = "border-l-4 border-l-amber-500 bg-amber-50 text-amber-700";

                  return (
                    <div 
                      key={i} 
                      className={`px-2.5 py-2 rounded-lg border text-[11px] flex items-center gap-2 font-bold cursor-pointer shadow-sm hover:shadow transition-all ${typeStyles}`}
                      onClick={() => onSelectIdea(idea)}
                    >
                      <Play size={10} className="shrink-0" />
                      <span className="truncate">{idea.contentType}: {idea.title.substring(0, 20)}...</span>
                    </div>
                  );
                })}
                
                {dayNum > 0 && dayNum <= daysInMonth && dayIdeas.length === 0 && (
                  <div className="mt-auto opacity-0 hover:opacity-100 transition-opacity p-2 text-center text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    + Plan {recommendation.format}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet List View (up to lg) */}
      <div className="lg:hidden flex flex-col gap-4">
        {calendarDays.filter(dayNum => dayNum > 0 && dayNum <= daysInMonth).map((dayNum, idx) => {
          const dateStr = `2026-05-${dayNum.toString().padStart(2, '0')}`;
          const dayIdeas = ideas.filter(idea => idea.scheduledDate && idea.scheduledDate.startsWith(dateStr));
          // Calculate correct day of week for mobile view
          const dayOfWeek = (startDay + dayNum - 1) % 7;
          const recommendation = D2C_STRATEGY[dayOfWeek];
          
          return (
            <div key={`mob-${dayNum}`} className="bg-white dark:bg-slate-900 rounded-[20px] p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl">
                    {dayNum}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">May 2026</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border ${recommendation.color}`}>
                  {recommendation.format}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {dayIdeas.map((idea, i) => {
                  let typeStyles = "bg-slate-50 border-slate-200 text-slate-600";
                  if (idea.contentType === 'Video') typeStyles = "border-l-4 border-l-rose-500 bg-rose-50 text-rose-700";
                  if (idea.contentType === 'Carousel') typeStyles = "border-l-4 border-l-violet-500 bg-violet-50 text-violet-700";
                  if (idea.contentType === 'Post') typeStyles = "border-l-4 border-l-sky-500 bg-sky-50 text-sky-700";
                  if (idea.contentType === 'Story') typeStyles = "border-l-4 border-l-amber-500 bg-amber-50 text-amber-700";

                  return (
                    <div 
                      key={i} 
                      className={`px-4 py-3 rounded-xl border text-sm flex items-center gap-3 font-bold cursor-pointer shadow-sm hover:shadow transition-all ${typeStyles}`}
                      onClick={() => onSelectIdea(idea)}
                    >
                      <Play size={14} className="shrink-0" />
                      <span className="truncate">{idea.contentType}: {idea.title}</span>
                    </div>
                  );
                })}
                {dayIdeas.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    + Plan your {recommendation.format}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardView({ ideasCount }: { ideasCount: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-[24px] p-8 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <h4 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider mb-3">Content Planned</h4>
        <div className="text-5xl font-black text-slate-800 dark:text-white">{ideasCount}</div>
      </div>
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-[24px] p-8 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <h4 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider mb-3">Videos Ready</h4>
        <div className="text-5xl font-black text-slate-800 dark:text-white">12</div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-8 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <h4 className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-3">Production Goal</h4>
        <div className="text-5xl font-black text-slate-800">100%</div>
      </div>
    </div>
  );
}
function CreatedPeuraView({ ideas, onSelectIdea }: { ideas: any[], onSelectIdea: (idea: any) => void }) {
  const createdIdeas = ideas.filter(i => i.generationStatus === 'completed' || (i.script && (i.script.hook || i.script.storyline)));
  
  // Group by date
  const grouped = createdIdeas.reduce((acc: any, idea) => {
    const date = idea.scheduledDate ? new Date(idea.scheduledDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unscheduled';
    if (!acc[date]) acc[date] = [];
    acc[date].push(idea);
    return acc;
  }, {});

  if (createdIdeas.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-slate-200" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No content created yet</h3>
        <p className="text-slate-500 mt-2">Generate your first Peura script from the Smart Calendar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([date, items]: [string, any]) => (
        <div key={date}>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-accent mb-6 flex items-center gap-4">
            {date}
            <div className="h-px bg-slate-100 flex-1"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((idea: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => onSelectIdea(idea)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        idea.contentType === 'Video' ? 'bg-rose-50 text-rose-600' :
                        idea.contentType === 'Carousel' ? 'bg-violet-50 text-violet-600' :
                        idea.contentType === 'Post' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                        {idea.contentType}
                    </div>
                    {idea.generationCount > 0 && (
                        <div className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-1 rounded-md">
                            #{idea.generationCount}
                        </div>
                    )}
                  </div>
                  <div className="text-slate-300 group-hover:text-accent transition-colors">
                    <Play size={18} />
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mb-3 leading-tight">{idea.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">{idea.script?.hook}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 w-fit px-3 py-1.5 rounded-lg">
                  <CheckCircle2 size={12} /> AI Script Ready
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
