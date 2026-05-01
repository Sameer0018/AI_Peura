'use client';

import { useState, useEffect } from 'react';
import { Calendar, LayoutDashboard, Play, Settings, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('calendar');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any | null>(null);

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

  const handleGenerate = async (id: string) => {
    // Optimistic update for UI
    setIdeas(ideas.map(i => i._id === id ? { ...i, generationStatus: 'pending' } : i));
    setSelectedIdea((prev: any) => ({ ...prev, generationStatus: 'pending' }));
    
    // Simulate generation time
    setTimeout(() => {
        setIdeas(ideas.map(i => i._id === id ? { ...i, generationStatus: 'completed' } : i));
        setSelectedIdea((prev: any) => ({ ...prev, generationStatus: 'completed' }));
    }, 4000);
  };

  const handleUpdateIdea = async (id: string, updates: any) => {
    try {
      const res = await fetch(`${API_URL}/api/idea/${id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setIdeas(ideas.map(i => i._id === id ? updated : i));
      setSelectedIdea(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-8 shadow-sm flex flex-col">
        <div className="text-2xl font-black uppercase tracking-wider mb-12 text-black">
          Peura <span className="text-accent">AI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'calendar' ? 'bg-amber-50 text-accent' : 'text-slate-500 hover:bg-slate-50 hover:text-accent'}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={20} /> Smart Calendar
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard' ? 'bg-amber-50 text-accent' : 'text-slate-500 hover:bg-slate-50 hover:text-accent'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
        </nav>

        <div className="mt-auto">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-medium">
                <Settings size={20} /> Settings
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Content Engine</h1>
                <p className="text-slate-500 mt-1 font-medium">AI-powered marketing automation for D2C growth.</p>
            </div>
            <button className="bg-accent text-white px-7 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-accent/30 transition-all">
                + New Campaign
            </button>
        </header>

        <div className="view-container">
            {activeTab === 'calendar' && <CalendarView ideas={ideas} onSelectIdea={setSelectedIdea} />}
            {activeTab === 'dashboard' && <DashboardView ideasCount={ideas.length} />}
        </div>

        {/* Content Planning Modal */}
        {selectedIdea && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedIdea(null)}>
                <div className="bg-white rounded-[30px] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Content Planning</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Review and reschedule your daily content</p>
                        </div>
                        <button className="text-slate-400 hover:text-black text-3xl transition-colors" onClick={() => setSelectedIdea(null)}>×</button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-10">
                        {/* Left Column: Editor */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Scheduled Date</label>
                                <input 
                                    type="date" 
                                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                                    value={selectedIdea.scheduledDate ? new Date(selectedIdea.scheduledDate).toISOString().split('T')[0] : ''} 
                                    onChange={(e) => handleUpdateIdea(selectedIdea._id, { scheduledDate: e.target.value })}
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
                                    className={`w-full px-5 py-3.5 rounded-2xl border bg-white text-slate-800 font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm ${selectedIdea.scheduledDate && selectedIdea.contentType === D2C_STRATEGY[new Date(selectedIdea.scheduledDate).getDay()].format ? 'border-green-400 ring-1 ring-green-400 bg-green-50' : 'border-slate-200'}`}
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
                                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-accent mb-4">Generated Peura Script</h3>
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <div>
                                      <p className="text-[10px] font-black text-accent tracking-widest mb-1">HOOK</p>
                                      <p className="text-[15px] text-slate-700 leading-relaxed font-medium">{selectedIdea.script?.hook}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black text-accent tracking-widest mb-1 mt-4">STORY</p>
                                      <p className="text-[15px] text-slate-700 leading-relaxed font-medium">{selectedIdea.script?.mid}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black text-accent tracking-widest mb-1 mt-4">CTA</p>
                                      <p className="text-[15px] text-slate-700 leading-relaxed font-medium font-bold">{selectedIdea.script?.cta}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Video Generation */}
                        <div className="h-full">
                            <div className="h-full min-h-[500px] bg-slate-900 rounded-[32px] flex items-center justify-center text-white text-center p-10 shadow-xl relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/20 to-transparent opacity-50"></div>
                                
                                {selectedIdea.generationStatus === 'completed' ? (
                                    <div className="z-10 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-2xl cursor-pointer hover:bg-white/30 transition-all">
                                          <Play size={32} color="#fff" className="ml-2" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Video Ready</h3>
                                        <p className="text-slate-300 text-sm mb-8">AI production complete</p>
                                        <button className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-slate-100 transition-colors">
                                          Download MP4
                                        </button>
                                    </div>
                                ) : (
                                    <div className="z-10 flex flex-col items-center max-w-xs mx-auto">
                                        <RefreshCw size={40} color="rgba(255,255,255,0.5)" className={`mb-6 ${selectedIdea.generationStatus === 'pending' ? 'animate-spin' : ''}`} />
                                        <p className="text-slate-300 font-medium mb-8 leading-relaxed">
                                          {selectedIdea.generationStatus === 'pending' 
                                            ? 'Google Veo is currently generating your cinematic video sequence...' 
                                            : 'Ready to turn this script into a high-converting video.'}
                                        </p>
                                        <button 
                                            className="bg-accent text-white px-8 py-4 rounded-2xl font-bold w-full shadow-lg shadow-accent/20 hover:-translate-y-1 hover:shadow-accent/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            disabled={selectedIdea.generationStatus === 'pending'}
                                            onClick={() => handleGenerate(selectedIdea._id)}
                                        >
                                            {selectedIdea.generationStatus === 'pending' ? 'Processing...' : 'Create with Google Veo'}
                                        </button>
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
    <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
        <div key={day} className="bg-slate-50 py-4 text-center text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-200">
          {day}
        </div>
      ))}
      {calendarDays.map((dayNum, idx) => {
        const dateStr = dayNum > 0 && dayNum <= daysInMonth ? `2026-05-${dayNum.toString().padStart(2, '0')}` : null;
        const dayIdeas = ideas.filter(idea => idea.scheduledDate && idea.scheduledDate.startsWith(dateStr));
        const dayOfWeek = idx % 7;
        const recommendation = D2C_STRATEGY[dayOfWeek];
        
        return (
          <div key={idx} className={`bg-white min-h-[160px] p-3 flex flex-col gap-2 transition-colors hover:bg-slate-50 ${dayNum <= 0 || dayNum > daysInMonth ? 'opacity-40 bg-slate-50' : ''}`}>
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
                // Determine styling based on content type
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
              
              {/* If no idea is scheduled, show recommendation hint */}
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
  );
}

function DashboardView({ ideasCount }: { ideasCount: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-8 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <h4 className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-3">Content Planned</h4>
        <div className="text-5xl font-black text-slate-800">{ideasCount}</div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-8 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <h4 className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-3">Videos Ready</h4>
        <div className="text-5xl font-black text-slate-800">12</div>
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-[24px] p-8 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <h4 className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-3">Production Goal</h4>
        <div className="text-5xl font-black text-slate-800">100%</div>
      </div>
    </div>
  );
}
