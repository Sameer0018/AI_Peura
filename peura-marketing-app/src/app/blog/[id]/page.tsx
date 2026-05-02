'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Bookmark,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
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

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  useEffect(() => {
    fetch(`${API_URL}/api/blog/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setBlog(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );

  if (!blog) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950 p-10">
      <h1 className="text-2xl font-black mb-4">Article Not Found</h1>
      <button onClick={() => router.push('/blog')} className="text-accent font-bold">Back to Journal</button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-serif transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 overflow-y-auto mt-16 lg:mt-0">
        {/* Article Header / Hero */}
        <div className="relative h-[60vh] lg:h-[80vh] w-full overflow-hidden">
          <img 
            src={blog.imageUrl || 'https://images.unsplash.com/photo-1511499767350-a1590fdb7361?auto=format&fit=crop&q=80&w=1600'} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="max-w-4xl mx-auto px-6 pb-16 lg:pb-24 w-full">
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent font-sans">{blog.category}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans">{blog.readTime}</span>
              </div>
              <h1 className="text-4xl lg:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">{blog.title}</h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-xs font-sans font-bold">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-accent" />
                  {blog.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-accent" />
                  {new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="h-4 w-px bg-white/20 hidden md:block"></div>
                <div className="flex items-center gap-4">
                  <button className="hover:text-accent transition-colors"><Share2 size={16} /></button>
                  <button className="hover:text-accent transition-colors"><Bookmark size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Main Body */}
            <article className="flex-1 prose prose-slate dark:prose-invert max-w-none prose-lg lg:prose-xl">
              <p className="text-2xl lg:text-3xl text-slate-500 italic mb-16 leading-relaxed border-l-4 border-accent pl-8 text-center">
                {blog.excerpt}
              </p>
              
              <div 
                className="article-content whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <div className="mt-12 flex flex-wrap gap-2">
                {blog.tags && blog.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">#{tag}</span>
                ))}
              </div>

              <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-black text-lg">PE</div>
                    <div>
                      <p className="text-sm font-black dark:text-white uppercase tracking-wider">{blog.author}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Peura Optical's Editorial Team</p>
                    </div>
                 </div>
                 <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                    Follow Author <ChevronRight size={14} />
                 </button>
              </div>
            </article>

            {/* Sticky Sidebar */}
            <aside className="w-full lg:w-72 space-y-12 shrink-0 font-sans">
              <div className="sticky top-32 space-y-12">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Discussion</h4>
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
                       <span className="text-sm font-bold">Join the conversation</span>
                       <MessageCircle size={18} className="text-slate-400 group-hover:text-accent transition-colors" />
                    </button>
                 </div>

                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Related Reading</h4>
                    <div className="space-y-8">
                       {[1, 2].map(i => (
                         <div key={i} className="group cursor-pointer">
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-2 block">Lifestyle</span>
                            <h5 className="text-sm font-black leading-snug group-hover:text-accent transition-colors line-clamp-2">The Enduring Appeal of Acetate in Luxury Eyewear</h5>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-accent rounded-3xl p-8 text-white">
                    <h4 className="text-lg font-black mb-4">Elevate Your View</h4>
                    <p className="text-xs text-white/80 leading-relaxed font-bold mb-6">Discover the precision-crafted collection that defines the Peura aesthetic.</p>
                    <Link href="/" className="inline-block bg-white text-accent px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/10">
                      Shop Collection
                    </Link>
                 </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Further Reading / Footer Grid */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-24 border-t border-slate-100 dark:border-slate-800">
           <div className="max-w-6xl mx-auto px-6">
              <div className="flex justify-between items-center mb-12">
                 <h2 className="text-3xl font-black">Further Reading</h2>
                 <Link href="/blog" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-accent transition-colors">View All Articles</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { title: 'The Enduring Appeal of Acetate', cat: 'Material Focus', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600' },
                   { title: 'Maintaining Optical Clarity', cat: 'Frame Care', img: 'https://images.unsplash.com/photo-1511499767350-a1590fdb7361?auto=format&fit=crop&q=80&w=600' },
                   { title: 'Inside the Visionaire Atelier', cat: 'Craftsmanship', img: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600' },
                 ].map((post, i) => (
                    <article key={i} className="group">
                       <div className="aspect-[4/3] rounded-sm overflow-hidden mb-6 bg-slate-200">
                          <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-2 block font-sans">{post.cat}</span>
                       <h4 className="text-lg font-black leading-tight group-hover:text-accent transition-colors">{post.title}</h4>
                    </article>
                 ))}
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
