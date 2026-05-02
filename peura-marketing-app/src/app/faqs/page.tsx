'use client';

import { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  ChevronDown, 
  Trash2, 
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/faq`);
      const data = await res.json();
      setFaqs(data);
    } catch (e) {
      console.error("Failed to fetch FAQs:", e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/faq/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq)
      });
      if (res.ok) {
        setIsAdding(false);
        setNewFaq({ question: '', answer: '', category: 'General' });
        fetchFaqs();
      }
    } catch (e) {
      console.error("Failed to create FAQ:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await fetch(`${API_URL}/api/faq/${id}`, { method: 'DELETE' });
      fetchFaqs();
    } catch (e) {
      console.error("Failed to delete FAQ:", e);
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-5 lg:p-10 overflow-y-auto mt-16 lg:mt-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Brand Knowledge
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">Customer & Team FAQ Hub</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight dark:text-white flex items-center gap-4">
              Peura <span className="text-accent">FAQs</span>
              <HelpCircle size={32} className="text-accent opacity-50" />
            </h1>
          </div>

          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-white px-7 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Add New FAQ
          </button>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-10 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search through brand knowledge..." 
              className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all shadow-sm group-hover:shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add FAQ Form Modal-style */}
          {isAdding && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
              <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-xl p-8 lg:p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black">Create <span className="text-accent">FAQ</span></h3>
                  <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-900 text-3xl transition-colors">×</button>
                </div>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Question</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. How do I choose the right frame size?"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-bold focus:outline-none focus:border-accent transition-all"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Answer</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Provide a clear, detailed answer..."
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-medium focus:outline-none focus:border-accent transition-all leading-relaxed"
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select 
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-bold focus:outline-none focus:border-accent transition-all"
                      value={newFaq.category}
                      onChange={(e) => setNewFaq({...newFaq, category: e.target.value})}
                    >
                      <option value="General">General</option>
                      <option value="Style">Style & Fit</option>
                      <option value="Shipping">Shipping & Delivery</option>
                      <option value="Product">Product Details</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-accent text-white py-4 rounded-2xl font-black shadow-xl shadow-accent/20 hover:shadow-accent/40 transition-all uppercase tracking-widest text-xs">
                    Save Knowledge
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div 
                  key={faq._id} 
                  className={`group bg-white dark:bg-slate-900 rounded-[28px] border transition-all duration-300 ${expandedId === faq._id ? 'border-accent shadow-xl shadow-accent/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                >
                  <div 
                    className="p-6 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedId === faq._id ? 'bg-accent text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent mb-1 block">{faq.category}</span>
                        <h3 className="text-lg font-black leading-tight">{faq.question}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(faq._id); }}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      <ChevronDown size={24} className={`text-slate-300 transition-transform duration-300 ${expandedId === faq._id ? 'rotate-180 text-accent' : ''}`} />
                    </div>
                  </div>
                  
                  {expandedId === faq._id && (
                    <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
                      <div className="h-px bg-slate-100 dark:bg-slate-800 mb-6"></div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium pl-14">
                        {faq.answer}
                      </p>
                      <div className="mt-8 flex items-center gap-3 pl-14">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 border border-emerald-100 dark:border-emerald-800">
                          <CheckCircle2 size={12} /> Live on Website
                        </div>
                        <div className="bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 border border-accent/10">
                          <Sparkles size={12} /> AI Verified
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle size={40} className="text-slate-200 dark:text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No FAQs found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Try searching with a different keyword or add a new FAQ.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
