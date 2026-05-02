'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  CheckCircle2, 
  Loader2, 
  Save,
  PenTool,
  Eye
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Style Guide',
    tags: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    author: 'Peura Editorial',
    publishDate: new Date().toISOString().split('T')[0],
    metaDescription: '',
    focusKeyword: '',
    readTime: '5 min read'
  });

  const categories = ['Style Guide', 'Comparison', 'Buying Guide', 'Lifestyle', 'Tech'];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  const updateTitle = (title: string) => {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title, slug });
  };

  const updateContent = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const readTime = `${Math.ceil(words / 200)} min read`;
    setFormData({ ...formData, content, readTime });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };
      const res = await fetch(`${API_URL}/api/blog/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.error) {
        alert('Blog post published successfully!');
        router.push('/blog');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to publish blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-5 lg:p-10 overflow-y-auto mt-16 lg:mt-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-black tracking-tight">Create <span className="text-accent">Journal Entry</span></h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium ml-12">Compose a new editorial piece with full SEO optimization.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 md:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              {showPreview ? <PenTool size={18} /> : <Eye size={18} />}
              {showPreview ? 'Back to Editor' : 'Live Preview'}
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 md:flex-none bg-accent text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Publish Post
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {showPreview ? (
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 lg:p-20 shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300 font-serif">
               <div className="max-w-2xl mx-auto">
                  <div className="flex justify-center gap-4 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent font-sans">{formData.category}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans">{formData.readTime}</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black text-center mb-10 leading-[1.1]">{formData.title || 'Your Article Title'}</h1>
                  <div className="flex items-center justify-center gap-4 mb-12 text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans">
                    <span>By {formData.author}</span>
                    <span>•</span>
                    <span>{new Date(formData.publishDate).toLocaleDateString()}</span>
                  </div>
                  {formData.imageUrl && (
                    <div className="mb-12 rounded-2xl overflow-hidden aspect-video shadow-2xl">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
                    <p className="text-xl text-slate-500 italic mb-10 font-sans leading-relaxed text-center">{formData.excerpt || 'Short summary of your article...'}</p>
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: formData.content || 'Article content goes here...' }} />
                  </div>
                  <div className="mt-12 flex flex-wrap gap-2 justify-center">
                    {formData.tags.split(',').map((tag, i) => tag && (
                      <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">#{tag.trim()}</span>
                    ))}
                  </div>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
              {/* Main Content Area */}
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Article Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => updateTitle(e.target.value)}
                      placeholder="Enter a compelling title..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 text-xl font-bold focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Excerpt (Short Description)</label>
                    <textarea 
                      value={formData.excerpt}
                      onChange={e => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Write a brief summary for the grid view..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 min-h-[100px] font-medium resize-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Article Body Content</label>
                      <div className="flex gap-2">
                        <button className="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg font-bold" onClick={() => updateContent(formData.content + "<b></b>")}>Bold</button>
                        <button className="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg font-bold" onClick={() => updateContent(formData.content + "<h1></h1>")}>H1</button>
                      </div>
                    </div>
                    <textarea 
                      value={formData.content}
                      onChange={e => updateContent(e.target.value)}
                      placeholder="Start writing your masterpiece... Use HTML tags for styling if needed."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-8 min-h-[500px] font-medium resize-none focus:ring-2 focus:ring-accent/20 transition-all leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar: Metadata & SEO */}
              <aside className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-6">Article Metadata</h3>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">URL Slug</label>
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold appearance-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Author</label>
                    <input 
                      type="text" 
                      value={formData.author}
                      onChange={e => setFormData({...formData, author: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Publish Date</label>
                    <input 
                      type="date" 
                      value={formData.publishDate}
                      onChange={e => setFormData({...formData, publishDate: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Featured Image URL</label>
                    <input 
                      type="text" 
                      value={formData.imageUrl}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="Unsplash URL..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-6 flex items-center gap-2">
                    <Sparkles size={14} />
                    SEO Optimization
                  </h3>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Focus Keyword</label>
                    <input 
                      type="text" 
                      value={formData.focusKeyword}
                      onChange={e => setFormData({...formData, focusKeyword: e.target.value})}
                      placeholder="e.g. Round Face Shape"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Meta Description</label>
                    <textarea 
                      value={formData.metaDescription}
                      onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                      placeholder="Search engine summary..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white min-h-[80px] resize-none placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Tags (Comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.tags}
                      onChange={e => setFormData({...formData, tags: e.target.value})}
                      placeholder="luxury, eyewear, style"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Estimated Read Time</p>
                    <p className="text-sm font-black text-accent">{formData.readTime}</p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
