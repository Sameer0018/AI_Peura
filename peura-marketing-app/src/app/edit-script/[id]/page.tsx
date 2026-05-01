'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { ArrowLeft, Send, Plus, Sparkles, CheckCircle2, Smartphone, X, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeProvider';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string; // base64
}

export default function EditScriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Script editing state
  const [editedScript, setEditedScript] = useState({
    hook: '',
    storyline: '',
    caption: '',
    hashtags: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // View toggle
  const [showInstagramLook, setShowInstagramLook] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  useEffect(() => {
    fetch(`${API_URL}/api/idea/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setIdea(data);
          setEditedScript({
            hook: data.script?.hook || '',
            storyline: data.script?.storyline || data.script?.mid || '',
            caption: data.script?.caption || '',
            hashtags: data.script?.hashtags || ''
          });

          // Initial greeting from AI
          setMessages([{
            role: 'assistant',
            content: `Hi! I'm your Peura AI Creative Director. I see we're working on "${data.title}". You can ask me to rewrite the hook, expand the storyline, or upload an image and I'll write a caption for it!`
          }]);
        }
      });
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const newUserMsg: Message = { role: 'user', content: input, image: selectedImage || undefined };
    const currentMessages = [...messages, newUserMsg];
    setMessages(currentMessages);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
          imageBase64: newUserMsg.image
        })
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/idea/${id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: {
            ...idea.script,
            hook: editedScript.hook,
            storyline: editedScript.storyline,
            caption: editedScript.caption,
            hashtags: editedScript.hashtags
          }
        })
      });
      const data = await res.json();
      if (!data.error) {
        setIdea(data);
        alert('Script updated successfully!');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update script');
    } finally {
      setIsSaving(false);
    }
  };

  if (!idea) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-xl font-bold text-accent">
      Loading Studio...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans flex flex-col h-screen overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6 lg:px-10 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 gap-4">
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors">
            <ArrowLeft size={20} /> Back
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-black truncate">{idea.title}</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{idea.contentType} Studio</p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-end">
          <ThemeToggle />
          <button
            onClick={() => setShowInstagramLook(!showInstagramLook)}
            className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold transition-all text-sm ${showInstagramLook ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            <Smartphone size={18} />
            <span className="hidden sm:inline">{showInstagramLook ? 'Hide IG Look' : 'Instagram Look'}</span>
            <span className="sm:hidden">{showInstagramLook ? 'Hide' : 'IG Look'}</span>
          </button>
          <button
            onClick={handleFinalize}
            disabled={isSaving}
            className="bg-accent text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 text-sm"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Finalize</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col lg:flex-row">

        {/* Left Pane: Chatbot */}
        <div className="w-full lg:w-[400px] xl:w-[450px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[50vh] lg:h-full shrink-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Peura AI Assistant</h3>
              <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                  {msg.image && (
                    <img src={msg.image} alt="Uploaded" className="max-w-full rounded-lg mb-3 shadow-md" />
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-16 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-accent dark:hover:text-accent transition-colors shrink-0 flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask AI to rewrite or upload a photo..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="bg-slate-900 dark:bg-slate-700 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shrink-0 shadow-md"
              >
                <Send size={20} className={isLoading ? 'animate-pulse' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Content Editor & Instagram Look */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-10 relative">
          {showInstagramLook ? (
            // Instagram Preview
            <div className="max-w-sm mx-auto bg-white dark:bg-black rounded-[40px] border-[8px] border-slate-900 dark:border-slate-800 shadow-2xl overflow-hidden h-[800px] max-h-[85vh] flex flex-col relative animate-in zoom-in-95 duration-300">
              {/* IG Header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-black shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none dark:text-white">peuraopticals</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Sponsored</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-white"></div>
                  <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-white"></div>
                  <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-white"></div>
                </div>
              </div>

              {/* IG Media Area */}
              <div className="flex-1 bg-slate-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800&h=1200"
                  alt="Post"
                  className="w-full h-full object-cover"
                />
                {idea.contentType === 'Video' && (
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] font-bold">
                    REEL
                  </div>
                )}
              </div>

              {/* IG Actions & Caption */}
              <div className="p-4 bg-white dark:bg-black shrink-0">
                <div className="flex justify-between items-center mb-3 text-slate-800 dark:text-white">
                  <div className="flex gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                </div>
                <p className="text-sm text-slate-800 dark:text-white font-bold mb-2">1,240 likes</p>
                <div className="text-sm">
                  <span className="font-bold mr-2 dark:text-white">peuraopticals</span>
                  <span className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{editedScript.caption}</span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium break-words">{editedScript.hashtags}</p>
              </div>
            </div>
          ) : (
            // Manual Editor View
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20">
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs uppercase text-accent tracking-widest font-black">The Hook</h3>
                  <button onClick={() => setInput('Rewrite this hook to be more catchy: ' + editedScript.hook)} className="text-[10px] bg-amber-50 dark:bg-amber-900/20 text-accent px-3 py-1.5 rounded-lg font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                    Ask AI to rewrite
                  </button>
                </div>
                <textarea
                  value={editedScript.hook}
                  onChange={(e) => setEditedScript(prev => ({ ...prev, hook: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-base font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent min-h-[100px] resize-none"
                  placeholder="Hook goes here..."
                />
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs uppercase text-accent tracking-widest font-black">Storyline / Script</h3>
                </div>
                <textarea
                  value={editedScript.storyline}
                  onChange={(e) => setEditedScript(prev => ({ ...prev, storyline: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent min-h-[200px]"
                  placeholder="Script body goes here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xs uppercase text-accent tracking-widest font-black mb-4">Instagram Caption</h3>
                  <textarea
                    value={editedScript.caption}
                    onChange={(e) => setEditedScript(prev => ({ ...prev, caption: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent min-h-[150px]"
                    placeholder="Caption..."
                  />
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                  <h3 className="text-xs uppercase text-accent tracking-widest font-black mb-4">Hashtags</h3>
                  <textarea
                    value={editedScript.hashtags}
                    onChange={(e) => setEditedScript(prev => ({ ...prev, hashtags: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent flex-1 resize-none"
                    placeholder="#hashtags"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
