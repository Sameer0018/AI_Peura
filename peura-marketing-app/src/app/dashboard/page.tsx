'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  BarChart3,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const D2C_STRATEGY: Record<number, { format: string, color: string, tip: string }> = {
  0: { format: 'Story', color: 'bg-amber-100 text-amber-800 border-amber-200', tip: 'Sunday: Casual & Behind the scenes' },
  1: { format: 'Video', color: 'bg-rose-100 text-rose-800 border-rose-200', tip: 'Monday: Reels for High Reach' },
  2: { format: 'Carousel', color: 'bg-violet-100 text-violet-800 border-violet-200', tip: 'Tuesday: High Engagement & Saves' },
  3: { format: 'Story', color: 'bg-amber-100 text-amber-800 border-amber-200', tip: 'Wednesday: Community Interaction' },
  4: { format: 'Post', color: 'bg-sky-100 text-sky-800 border-sky-200', tip: 'Thursday: Value & Information' },
  5: { format: 'Video', color: 'bg-rose-100 text-rose-800 border-rose-200', tip: 'Friday: Entertainment for weekend' },
  6: { format: 'Carousel', color: 'bg-violet-100 text-violet-800 border-violet-200', tip: 'Saturday: Weekend scrolling saves' },
};

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ideasRes, strategyRes] = await Promise.all([
        fetch(`${API_URL}/api/scrape`),
        fetch(`${API_URL}/api/ai/strategy`)
      ]);
      const ideasData = await ideasRes.json();
      const strategyData = await strategyRes.json();
      setIdeas(ideasData);
      setStrategy(strategyData.strategy);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const gaps = next7Days.filter(dateStr => {
    const dayOfWeek = new Date(dateStr).getDay();
    const recommended = D2C_STRATEGY[dayOfWeek].format;
    const hasContent = ideas.some(idea => idea.scheduledDate && idea.scheduledDate.startsWith(dateStr) && idea.contentType === recommended);
    return !hasContent;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-5 lg:p-10 overflow-y-auto mt-16 lg:mt-0">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-black tracking-tight">Growth <span className="text-accent">Analytics</span></h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-12">Performance metrics and AI-driven content strategy.</p>
        </header>

        <div className="space-y-10">
          {/* Strategy Hero */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 lg:p-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-all duration-700"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-accent/10 rounded-[32px] flex items-center justify-center text-accent shrink-0 border border-accent/20 animate-pulse">
                <Sparkles size={48} />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">Today's Strategy</span>
                </div>
                <h2 className="text-xl lg:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                  {strategy || "Analyzing your brand DNA..."}
                </h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 text-center shadow-sm">
              <h4 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] tracking-widest mb-3">Content Planned</h4>
              <div className="text-4xl font-black text-slate-800 dark:text-white">{ideas.length}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 text-center shadow-sm">
              <h4 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] tracking-widest mb-3">Potential Reach</h4>
              <div className="text-4xl font-black text-slate-800 dark:text-white">{(ideas.length * 2500).toLocaleString()}+</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 text-center shadow-sm">
              <h4 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] tracking-widest mb-3">ROI Impact</h4>
              <div className="text-4xl font-black text-emerald-500">12.4x</div>
            </div>
            <div className="bg-gradient-to-br from-accent to-amber-500 rounded-[32px] p-8 text-center shadow-lg shadow-accent/20 text-white">
              <h4 className="text-white/70 font-bold uppercase text-[9px] tracking-widest mb-3">Readiness</h4>
              <div className="text-4xl font-black">84%</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-8 lg:p-12 shadow-sm">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
              <BarChart3 className="text-accent" />
              Content Gap Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {next7Days.map((dateStr, i) => {
                const date = new Date(dateStr);
                const dayOfWeek = date.getDay();
                const recommendation = D2C_STRATEGY[dayOfWeek];
                const hasContent = ideas.some(idea => idea.scheduledDate && idea.scheduledDate.startsWith(dateStr) && idea.contentType === recommendation.format);

                return (
                  <div key={i} className={`p-6 rounded-3xl border transition-all ${hasContent ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-900 border-accent/20 shadow-lg'}`}>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <h4 className="text-sm font-black mb-1">{recommendation.format}</h4>
                    <p className="text-[10px] text-slate-500 font-bold leading-tight">{recommendation.tip}</p>
                    {hasContent && <CheckCircle2 size={16} className="text-green-500 mt-4" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
