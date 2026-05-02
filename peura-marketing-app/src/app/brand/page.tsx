'use client';

import { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Sparkles, 
  Target, 
  MessageSquare, 
  Heart, 
  Hash,
  Save,
  Loader2,
  CheckCircle2,
  Plus
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function BrandIdentityPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [identity, setIdentity] = useState({
    brandName: 'Peura Opticals',
    tone: '',
    targetAudience: '',
    coreValues: [] as string[],
    productUVP: '',
    hashtags: [] as string[]
  });

  const [newValue, setNewValue] = useState({ value: '', type: 'coreValues' as 'coreValues' | 'hashtags' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  useEffect(() => {
    fetchIdentity();
  }, []);

  const fetchIdentity = async () => {
    try {
      const res = await fetch(`${API_URL}/api/brand`);
      const data = await res.json();
      setIdentity(data);
    } catch (e) {
      console.error("Failed to fetch brand identity:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/brand/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(identity)
      });
      if (res.ok) {
        alert('Brand Identity updated! Your AI Director is now more personalized.');
      }
    } catch (e) {
      console.error("Failed to save identity:", e);
    } finally {
      setSaving(false);
    }
  };

  const addTag = (type: 'coreValues' | 'hashtags') => {
    if (!newValue.value.trim()) return;
    const current = [...identity[type]];
    if (!current.includes(newValue.value.trim())) {
      setIdentity({ ...identity, [type]: [...current, newValue.value.trim()] });
    }
    setNewValue({ ...newValue, value: '' });
  };

  const removeTag = (type: 'coreValues' | 'hashtags', tag: string) => {
    setIdentity({ ...identity, [type]: identity[type].filter(t => t !== tag) });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-5 lg:p-10 overflow-y-auto mt-16 lg:mt-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-amber-100 dark:bg-amber-900/30 text-accent text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                AI Personalization
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">Define your Brand DNA</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight dark:text-white flex items-center gap-4">
              Brand <span className="text-accent">Identity</span>
              <Fingerprint size={32} className="text-accent opacity-50" />
            </h1>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-accent text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Brand DNA
          </button>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: core text fields */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-accent">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-sm">Brand Tone</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">How should the AI speak?</p>
                  </div>
                </div>
                <textarea 
                  rows={3}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-medium focus:outline-none focus:border-accent transition-all text-sm leading-relaxed"
                  placeholder="e.g. Elegant, modern, high-fashion yet approachable..."
                  value={identity.tone}
                  onChange={(e) => setIdentity({...identity, tone: e.target.value})}
                />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-accent">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-sm">Target Audience</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Who are we talking to?</p>
                  </div>
                </div>
                <textarea 
                  rows={3}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-medium focus:outline-none focus:border-accent transition-all text-sm leading-relaxed"
                  placeholder="e.g. Urban professionals, Gen Z trend-setters..."
                  value={identity.targetAudience}
                  onChange={(e) => setIdentity({...identity, targetAudience: e.target.value})}
                />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-accent">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-sm">Product UVP</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">What makes Peura special?</p>
                  </div>
                </div>
                <textarea 
                  rows={3}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-medium focus:outline-none focus:border-accent transition-all text-sm leading-relaxed"
                  placeholder="e.g. Premium Italian acetate, Zeiss lenses, direct-to-consumer value..."
                  value={identity.productUVP}
                  onChange={(e) => setIdentity({...identity, productUVP: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Tags & Values */}
          <div className="space-y-8">
            {/* Core Values */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <Heart className="text-rose-500" size={20} />
                <h3 className="font-black uppercase tracking-tight text-sm">Core Values</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {identity.coreValues.map(value => (
                  <span key={value} className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                    {value}
                    <button onClick={() => removeTag('coreValues', value)} className="hover:text-rose-500 transition-colors">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Add value..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-accent"
                  onKeyDown={(e) => e.key === 'Enter' && addTag('coreValues')}
                  value={newValue.type === 'coreValues' ? newValue.value : ''}
                  onChange={(e) => setNewValue({ value: e.target.value, type: 'coreValues' })}
                />
                <button onClick={() => addTag('coreValues')} className="bg-slate-900 text-white p-2 rounded-xl">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Brand Hashtags */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <Hash className="text-blue-500" size={20} />
                <h3 className="font-black uppercase tracking-tight text-sm">Brand Hashtags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {identity.hashtags.map(tag => (
                  <span key={tag} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-2 border border-blue-100 dark:border-blue-800">
                    {tag}
                    <button onClick={() => removeTag('hashtags', tag)} className="hover:text-rose-500 transition-colors">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="#addtag..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-accent"
                  onKeyDown={(e) => e.key === 'Enter' && addTag('hashtags')}
                  value={newValue.type === 'hashtags' ? newValue.value : ''}
                  onChange={(e) => setNewValue({ value: e.target.value, type: 'hashtags' })}
                />
                <button onClick={() => addTag('hashtags')} className="bg-slate-900 text-white p-2 rounded-xl">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* AI Confirmation */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 shadow-xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-black uppercase text-xs tracking-widest">AI Director Status</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                Your AI Creative Director is currently analyzing your brand DNA. Every script and blog post generated will be steered by these parameters.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 size={12} /> AI ENGINE SYNCHRONIZED
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
