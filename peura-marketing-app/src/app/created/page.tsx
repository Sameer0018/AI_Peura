'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Play, Sparkles, Wand2, ArrowLeft, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function CreatedPeuraPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'scripts' | 'blogs' | 'visuals'>('all');
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ideasRes, blogsRes, promptsRes] = await Promise.all([
        fetch(`${API_URL}/api/scrape`),
        fetch(`${API_URL}/api/blog`),
        fetch(`${API_URL}/api/visual-prompt`)
      ]);

      const ideasData = await ideasRes.json();
      const blogsData = await blogsRes.json();
      const promptsData = await promptsRes.json();

      setIdeas(ideasData);
      setBlogs(blogsData);
      setPrompts(promptsData);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  };

  const createdIdeas = ideas.filter(i => i.generationStatus === 'completed' || (i.script && (i.script.hook || i.script.storyline)));
  
  const allItems = [
    ...createdIdeas.map(i => ({ ...i, type: 'script' })),
    ...blogs.map(b => ({ ...b, type: 'blog', contentType: 'Blog' })),
    ...prompts.map(p => ({ ...p, type: 'visual', contentType: 'Prompt' }))
  ].sort((a, b) => new Date(b.createdAt || b.scrapedAt || 0).getTime() - new Date(a.createdAt || a.scrapedAt || 0).getTime());

  const filteredItems = activeSubTab === 'all' ? allItems : 
                        activeSubTab === 'scripts' ? allItems.filter(i => i.type === 'script') : 
                        activeSubTab === 'blogs' ? allItems.filter(i => i.type === 'blog') :
                        allItems.filter(i => i.type === 'visual');

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-5 lg:p-10 overflow-y-auto mt-16 lg:mt-0">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-black tracking-tight">Created<span className="text-accent">Peura</span></h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-12">Your library of AI-generated assets, blogs, and creative prompts.</p>
        </header>

        <div className="space-y-10">
          <div className="flex gap-4 mb-8">
            {['all', 'scripts', 'blogs', 'visuals'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(tab as any)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-slate-200 dark:text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No items found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Try selecting a different filter or generate more content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item: any, idx: number) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
                  onClick={() => {
                    if (item.type === 'script') router.push(`/edit-script/${item._id}`);
                    else if (item.type === 'blog') router.push(`/blog/${item._id}`);
                    else {
                      navigator.clipboard.writeText(item.prompt);
                      alert('Prompt copied to clipboard!');
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.contentType === 'Video' ? 'bg-rose-50 text-rose-600' :
                          item.contentType === 'Carousel' ? 'bg-violet-50 text-violet-600' :
                          item.contentType === 'Blog' ? 'bg-emerald-50 text-emerald-600' :
                          item.contentType === 'Prompt' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          item.contentType === 'Post' ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                          {item.contentType === 'Prompt' ? `${item.type.toUpperCase()}` : item.contentType}
                      </div>
                    </div>
                    <div className="text-slate-300 group-hover:text-accent transition-colors">
                      {item.type === 'script' ? <Play size={18} /> : item.type === 'blog' ? <Sparkles size={18} /> : <Wand2 size={18} />}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mb-3 leading-tight flex-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {item.type === 'script' ? item.script?.hook : item.type === 'blog' ? item.excerpt : item.prompt}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/10 w-fit px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-800/30">
                    <CheckCircle2 size={12} /> {item.type === 'script' ? 'AI Script Ready' : item.type === 'blog' ? 'Published' : 'Prompt Saved'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
