'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  Image as ImageIcon, 
  Layers, 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Check, 
  Download,
  Trash2,
  Plus
} from 'lucide-react';
import CarouselForm from '@/components/creative-studio/CarouselForm';
import VideoForm from '@/components/creative-studio/VideoForm';
import ImageForm from '@/components/creative-studio/ImageForm';
import Sidebar from '@/components/Sidebar';

export default function CreativeStudio() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'carousel'>('carousel');
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header Area */}
        <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 mt-16 lg:mt-0">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                  Creative <span className="text-accent">Studio</span>
                  <Sparkles size={16} className="text-accent" />
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prompt Engineering Engine</p>
              </div>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
              <button 
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'video' ? 'bg-white dark:bg-slate-700 shadow-sm text-accent' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <Video size={16} /> Video
              </button>
              <button 
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'image' ? 'bg-white dark:bg-slate-700 shadow-sm text-accent' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <ImageIcon size={16} /> Image
              </button>
              <button 
                onClick={() => setActiveTab('carousel')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'carousel' ? 'bg-white dark:bg-slate-700 shadow-sm text-accent' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <Layers size={16} /> Carousel
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 mt-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
            {/* Form Side */}
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-black tracking-tight">
                  {activeTab === 'video' && 'Video Scene Builder'}
                  {activeTab === 'image' && 'Single Image Prompt'}
                  {activeTab === 'carousel' && 'Carousel Slide Prompt'}
                </h2>
              </div>

              {activeTab === 'carousel' && <CarouselForm onCopy={handleCopy} />}
              {activeTab === 'video' && <VideoForm onCopy={handleCopy} />}
              {activeTab === 'image' && <ImageForm onCopy={handleCopy} />}
            </div>

            {/* Preview/Help Side */}
            <aside className="sticky top-32 space-y-6">
              <div className="bg-slate-900 dark:bg-slate-800 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[60px] rounded-full"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-tight text-sm">Pro Tips</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">For Midjourney & Sora</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-xs font-bold text-accent mb-1">Lighting is Key</p>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">Use "Golden hour sunlight" or "Dramatic side lighting" to make the Peura frames pop with realistic reflections.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-xs font-bold text-accent mb-1">Shot Type</p>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">"Cinematic close-up" is best for showcasing frame details, while "Environmental portrait" sells the lifestyle.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-xs font-bold text-accent mb-1">Movement</p>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">For videos, use "Slow push-in" to create a premium, high-end commercial feel.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="font-black uppercase tracking-tight text-sm mb-4">Export Format</h3>
                  <div className="flex items-center gap-4">
                      <div className="flex-1 p-4 rounded-2xl border-2 border-accent bg-amber-50 dark:bg-amber-900/20 text-center">
                          <p className="text-[10px] font-black uppercase text-accent mb-1">Instagram</p>
                          <p className="text-lg font-black">{activeTab === 'carousel' ? '4:5' : activeTab === 'video' ? '9:16' : '1:1'}</p>
                      </div>
                      <div className="flex-1 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center opacity-50">
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Pinterest</p>
                          <p className="text-lg font-black text-slate-400">2:3</p>
                      </div>
                  </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Floating Action Button for Copying */}
      {copied && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100]">
          <Check size={20} className="text-green-400" />
          <p className="font-bold text-sm">Prompt copied to clipboard!</p>
        </div>
      )}
    </div>
  );
}
