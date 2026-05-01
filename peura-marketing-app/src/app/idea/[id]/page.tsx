'use client';

import React, { useState, useEffect, use } from 'react';
import { Play, Calendar, Video, ArrowLeft, Share2, Download } from 'lucide-react';

export default function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [idea, setIdea] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/idea/${id}`)
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

  if (!idea) return <div className="loading">Loading Peura Plan...</div>;

  return (
    <div className="detail-container">
      <header className="detail-header">
        <button onClick={() => window.close()} className="back-btn">
          <ArrowLeft size={18} /> Close Window
        </button>
        <div className="header-actions">
          <button className="action-btn"><Share2 size={18} /></button>
          <button className="action-btn"><Download size={18} /></button>
        </div>
      </header>

      <main className="detail-content">
        <div className="content-left">
          <div className="badge-row">
            <span className="type-badge">{idea.contentType}</span>
            <span className="date-badge">
              <Calendar size={14} /> 
              {new Date(idea.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          <h1 className="title">{idea.title}</h1>
          
          <div className="script-section">
            <div className="script-card">
              <h3>The Hook</h3>
              <p>{idea.script?.hook}</p>
            </div>
            <div className="script-card">
              <h3>The Content</h3>
              <p>{idea.script?.mid}</p>
            </div>
            <div className="script-card">
              <h3>Call to Action</h3>
              <p>{idea.script?.cta}</p>
            </div>
            <div className="script-card secondary">
              <h3>Caption & Hashtags</h3>
              <p>{idea.script?.caption}</p>
              <div className="hashtags">{idea.script?.hashtags}</div>
            </div>
          </div>
        </div>

        <div className="content-right">
          <div className="preview-container glass">
            {idea.generationStatus === 'completed' ? (
              <div className="video-placeholder">
                <Play size={48} color="var(--accent)" />
                <p>Video Generated Successfully</p>
                <button className="btn-secondary">Watch Preview</button>
              </div>
            ) : (
              <div className="generation-placeholder">
                <Video size={48} color="var(--border)" />
                <h2>AI Video Generation</h2>
                <p>Ready to transform this script into a premium video using Google Veo?</p>
                <button 
                  className="btn-primary" 
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

      <style jsx>{`
        .detail-container { min-height: 100vh; background: #f8f9fa; color: #1a1a1a; font-family: 'Outfit', sans-serif; }
        .detail-header { display: flex; justify-content: space-between; padding: 20px 40px; border-bottom: 1px solid #eee; background: #fff; }
        .back-btn { display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; font-weight: 600; color: #666; }
        .header-actions { display: flex; gap: 15px; }
        .action-btn { background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #334155; }
        
        .detail-content { display: grid; grid-template-columns: 1fr 450px; gap: 60px; padding: 60px 40px; max-width: 1400px; margin: 0 auto; }
        
        .badge-row { display: flex; gap: 15px; margin-bottom: 25px; }
        .type-badge { background: #fffbeb; color: #b8860b; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 800; border: 1px solid #fef3c7; text-transform: uppercase; }
        .date-badge { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 14px; font-weight: 500; }
        
        .title { font-size: 42px; font-weight: 900; line-height: 1.1; margin-bottom: 40px; color: #000; letter-spacing: -1px; }
        
        .script-section { display: flex; flex-direction: column; gap: 25px; }
        .script-card { background: #fff; padding: 30px; border-radius: 20px; border: 1px solid #eee; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .script-card.secondary { background: #fafafa; border-style: dashed; }
        .script-card h3 { font-size: 11px; text-transform: uppercase; color: #b8860b; letter-spacing: 1px; margin-bottom: 12px; font-weight: 800; }
        .script-card p { font-size: 17px; line-height: 1.6; color: #334155; }
        .hashtags { margin-top: 15px; font-size: 14px; color: #b8860b; font-weight: 600; }
        
        .preview-container { background: #fff; border-radius: 30px; height: 600px; display: flex; align-items: center; justify-content: center; border: 1px solid #eee; box-shadow: 0 10px 40px rgba(0,0,0,0.05); overflow: hidden; position: sticky; top: 40px; }
        .generation-placeholder, .video-placeholder { text-align: center; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .generation-placeholder h2 { font-size: 24px; font-weight: 800; }
        .generation-placeholder p { color: #64748b; max-width: 300px; line-height: 1.5; }
        
        .btn-primary { background: #b8860b; color: #fff; border: none; padding: 15px 40px; border-radius: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 5px 15px rgba(184, 134, 11, 0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(184, 134, 11, 0.4); }
        .btn-secondary { background: #000; color: #fff; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; }
        
        .loading { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 20px; font-weight: 700; color: #b8860b; }
      `}</style>
    </div>
  );
}
