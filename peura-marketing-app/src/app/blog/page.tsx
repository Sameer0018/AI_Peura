'use client';

import { useState, useEffect } from 'react';
import { Sidebar as SidebarIcon, Search, Mail, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}

export default function BlogListPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Articles');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blog`);
      const data = await res.json();
      setBlogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All Articles', 'Style Guide', 'Comparison', 'Buying Guide'];
  
  const filteredBlogs = activeCategory === 'All Articles' 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  const featuredBlog = filteredBlogs[0];
  const otherBlogs = filteredBlogs.slice(1);

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-serif transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 overflow-y-auto mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <header className="text-center mb-16 lg:mb-24">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight">The Peura Journal</h1>
            <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-lg lg:text-xl font-sans leading-relaxed">
              Explore our curated insights on elevated eyewear style, uncompromising eye health, and the intersection of luxury craftsmanship and optometric precision.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-16 lg:gap-24">
            {/* Left Sidebar: Categories & Newsletter */}
            <aside className="space-y-12 font-sans">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Categories</h3>
                <nav className="flex flex-col gap-4">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left text-sm font-bold transition-colors ${activeCategory === cat ? 'text-accent' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-lg font-black mb-3">The Dispatch</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">Curated eyewear insights delivered to your inbox.</p>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 text-sm focus:outline-none focus:border-accent transition-colors pr-8"
                  />
                  <ArrowRight size={16} className="absolute right-0 top-2 text-slate-400" />
                </div>
              </div>
            </aside>

            {/* Blog Grid */}
            <div className="space-y-24">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-sans italic">No articles published yet. Start creating!</p>
                  <Link href="/blog/create" className="text-accent font-bold mt-4 inline-block hover:underline">Create first post →</Link>
                </div>
              ) : (
                <>
                  {/* Featured Post */}
                  {featuredBlog && (
                    <article className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center group">
                      <div className="overflow-hidden rounded-sm bg-slate-100 aspect-[4/3]">
                        <img 
                          src={featuredBlog.imageUrl || 'https://images.unsplash.com/photo-1511499767350-a1590fdb7361?auto=format&fit=crop&q=80&w=1200'} 
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <div className="flex gap-4 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent font-sans">{featuredBlog.category}</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans">{featuredBlog.readTime || '5 min read'}</span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black mb-6 leading-[1.1] group-hover:text-accent transition-colors">
                          {featuredBlog.title}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed font-sans">
                          {featuredBlog.excerpt}
                        </p>
                        <Link href={`/blog/${featuredBlog._id}`} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-accent transition-colors font-sans">
                          Read More <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  )}

                  {/* Other Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 lg:gap-x-20">
                    {otherBlogs.map((blog) => (
                      <article key={blog._id} className="group flex flex-col h-full">
                        <div className="overflow-hidden rounded-sm bg-slate-100 aspect-[16/10] mb-8">
                          <img 
                            src={blog.imageUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'} 
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="flex gap-4 mb-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent font-sans">{blog.category}</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans">{blog.readTime || '5 min read'}</span>
                          </div>
                          <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-accent transition-colors flex-1">
                            {blog.title}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed font-sans line-clamp-3">
                            {blog.excerpt}
                          </p>
                          <Link href={`/blog/${blog._id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-accent transition-colors font-sans">
                            Read More <ArrowRight size={12} />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  <footer className="pt-12 border-t border-slate-100 dark:border-slate-800 flex justify-center items-center gap-4 font-sans">
                    <button className="p-2 text-slate-400 hover:text-accent transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">1</button>
                      <button className="w-10 h-10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500">2</button>
                      <button className="w-10 h-10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500">3</button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-accent transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </footer>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
