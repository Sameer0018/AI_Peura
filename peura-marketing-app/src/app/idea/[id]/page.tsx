'use client';

import React, { useState, useEffect, use } from 'react';
import { Play, Calendar, Video, ArrowLeft, Share2, Download } from 'lucide-react';

export default function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [idea, setIdea] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  useEffect(() => {
    fetch(`${API_URL}/api/idea/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setIdea(data);
      });
  }, [id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call to Veo
    setTimeout(() => {
        setIdea((prev: any) => ({ ...prev, generationStatus: 'completed', videoUrl: 'https://sample-videos.com/video123.mp4' }));
        setIsGenerating(false);
    }, 3000);
  };

  if (!idea) return (
    <div className="flex items-center justify-center min-h-screen text-xl font-bold text-accent">
      Loading Peura Plan...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="flex justify-between items-center px-10 py-5 bg-white border-b border-slate-200">
        <button onClick={() => window.close()} className="flex items-center gap-2 bg-transparent border-none cursor-pointer font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} /> Close Window
        </button>
        <div className="flex gap-4">
          <button className="bg-slate-100 border-none w-10 h-10 rounded-xl cursor-pointer flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors">
            <Share2 size={18} />
          </button>
          <button className="bg-slate-100 border-none w-10 h-10 rounded-xl cursor-pointer flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-16 p-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col">
          <div className="flex gap-4 mb-8 items-center">
            <span className="bg-amber-50 text-accent px-4 py-1.5 rounded-full text-xs font-extrabold border border-amber-100 uppercase tracking-wide">
              {idea.contentType}
            </span>
            {idea.scheduledDate && (
              <span className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Calendar size={14} /> 
                {new Date(idea.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
          
          <h1 className="text-[42px] font-black leading-tight mb-10 text-slate-900 tracking-tight">
            {idea.title}
          </h1>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-[11px] uppercase text-accent tracking-widest mb-3 font-extrabold">The Hook</h3>
              <p className="text-[17px] leading-relaxed text-slate-700 font-medium">{idea.script?.hook}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-[11px] uppercase text-accent tracking-widest mb-3 font-extrabold">The Content</h3>
              <p className="text-[17px] leading-relaxed text-slate-700 font-medium">{idea.script?.mid}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-[11px] uppercase text-accent tracking-widest mb-3 font-extrabold">Call to Action</h3>
              <p className="text-[17px] leading-relaxed text-slate-700 font-bold">{idea.script?.cta}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200">
              <h3 className="text-[11px] uppercase text-accent tracking-widest mb-3 font-extrabold">Caption & Hashtags</h3>
              <p className="text-[17px] leading-relaxed text-slate-700 font-medium mb-4">{idea.script?.caption}</p>
              <div className="text-sm text-accent font-bold">{idea.script?.hashtags}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="bg-white rounded-[32px] h-[600px] flex items-center justify-center border border-slate-100 shadow-xl overflow-hidden sticky top-10">
            {idea.generationStatus === 'completed' ? (
              <div className="text-center p-10 flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center shadow-inner">
                  <Play size={48} className="text-accent ml-2" />
                </div>
                <p className="text-xl font-bold text-slate-800">Video Generated Successfully</p>
                <button className="bg-slate-900 text-white border-none px-8 py-3 rounded-xl font-bold cursor-pointer hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 mt-4">
                  Watch Preview
                </button>
              </div>
            ) : (
              <div className="text-center p-10 flex flex-col items-center max-w-sm mx-auto">
                <Video size={64} className="text-slate-300 mb-6" />
                <h2 className="text-2xl font-black text-slate-800 mb-4">AI Video Generation</h2>
                <p className="text-slate-500 leading-relaxed font-medium mb-10">
                  Ready to transform this script into a premium video using Google Veo?
                </p>
                <button 
                  className="bg-accent text-white border-none px-8 py-4 rounded-2xl font-bold cursor-pointer transition-all shadow-lg shadow-accent/20 hover:-translate-y-1 hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full text-lg"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Veo is generating...' : 'Generate with Google Veo'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
