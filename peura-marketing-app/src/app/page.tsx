'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, LayoutDashboard, Inbox, Settings, RefreshCw, Plus, Play, MoreHorizontal } from 'lucide-react';

export default function PeuraDashboard() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isScraping, setIsScraping] = useState(false);

  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchIdeas = async () => {
    const res = await fetch(`${API_URL}/api/scrape`);
    const data = await res.json();
    if (!data.error) setIdeas(data);
  };

  const handleScrape = async () => {
    setIsScraping(true);
    await fetch(`${API_URL}/api/scrape`, { method: 'POST' });
    await fetchIdeas();
    setIsScraping(false);
  };

  const handleUpdateIdea = async (id: string, updates: any) => {
    setIsUpdating(true);
    const res = await fetch(`${API_URL}/api/idea/${id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!data.error) {
        setIdeas(prev => prev.map(i => i._id === id ? data : i));
        setSelectedIdea(data);
    }
    setIsUpdating(false);
  };

  const handleGenerate = async (id: string) => {
    // Simulated Veo logic
    setIdeas(prev => prev.map(i => i._id === id ? { ...i, generationStatus: 'pending' } : i));
    setSelectedIdea((prev: any) => ({ ...prev, generationStatus: 'pending' }));
    
    setTimeout(() => {
        setIdeas(prev => prev.map(i => i._id === id ? { ...i, generationStatus: 'completed', videoUrl: 'https://sample-videos.com/video123.mp4' } : i));
        setSelectedIdea((prev: any) => ({ ...prev, generationStatus: 'completed', videoUrl: 'https://sample-videos.com/video123.mp4' }));
    }, 3000);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">PEURA AI</div>
        <nav>
          <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
            <Calendar size={20} /> Content Calendar
          </div>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Performance
          </div>
          <div className="nav-item">
            <Settings size={20} /> Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>{activeTab === 'calendar' ? 'Content Calendar' : 'Dashboard'}</h1>
            <p style={{ color: 'var(--secondary)' }}>May 2026 • Peura Opticals Growth Engine</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={handleScrape} disabled={isScraping}>
              <RefreshCw size={16} className={isScraping ? 'spin' : ''} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              {isScraping ? 'Automating Content...' : 'Generate New Plan'}
            </button>
          </div>
        </header>

        <div className="view-container">
            {activeTab === 'calendar' && <CalendarView ideas={ideas} onSelectIdea={setSelectedIdea} />}
            {activeTab === 'dashboard' && <DashboardView ideasCount={ideas.length} />}
        </div>

        {/* Premium Modal */}
        {selectedIdea && (
            <div className="modal-overlay" onClick={() => setSelectedIdea(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Content Planning</h2>
                            <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>Review and reschedule your daily content</p>
                        </div>
                        <button className="close-modal" onClick={() => setSelectedIdea(null)}>×</button>
                    </div>
                    
                    <div className="modal-body">
                        <div className="editor-section">
                            <div className="field-group">
                                <label>Scheduled Date</label>
                                <input 
                                    type="date" 
                                    value={selectedIdea.scheduledDate ? new Date(selectedIdea.scheduledDate).toISOString().split('T')[0] : ''} 
                                    onChange={(e) => handleUpdateIdea(selectedIdea._id, { scheduledDate: e.target.value })}
                                />
                            </div>
                            
                            <div className="field-group">
                                <label>Content Format</label>
                                <select 
                                    value={selectedIdea.contentType}
                                    onChange={(e) => handleUpdateIdea(selectedIdea._id, { contentType: e.target.value })}
                                >
                                    <option value="Video">Reel / Video</option>
                                    <option value="Carousel">Carousel Post</option>
                                    <option value="Post">Static Post</option>
                                    <option value="Story">IG Story</option>
                                </select>
                            </div>

                            <div className="script-display">
                                <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: '800', marginBottom: '15px' }}>Generated Peura Script</h3>
                                <div className="script-box">
                                    <p className="label">HOOK</p>
                                    <p className="script-text">{selectedIdea.script?.hook}</p>
                                    <p className="label">STORY</p>
                                    <p className="script-text">{selectedIdea.script?.mid}</p>
                                    <p className="label">CTA</p>
                                    <p className="script-text">{selectedIdea.script?.cta}</p>
                                </div>
                            </div>
                        </div>

                        <div className="preview-section">
                            <div className="video-preview-placeholder">
                                {selectedIdea.generationStatus === 'completed' ? (
                                    <div className="status-success">
                                        <Play size={48} color="#fff" />
                                        <h3 style={{ marginTop: '15px' }}>Video Ready</h3>
                                        <button className="btn-download">Download MP4</button>
                                    </div>
                                ) : (
                                    <div className="status-empty">
                                        <RefreshCw size={48} color="rgba(255,255,255,0.3)" className={selectedIdea.generationStatus === 'pending' ? 'spin' : ''} />
                                        <p style={{ marginTop: '15px', opacity: 0.7 }}>{selectedIdea.generationStatus === 'pending' ? 'Veo is generating video...' : 'Ready for AI production'}</p>
                                        <button 
                                            className="btn-veo" 
                                            disabled={selectedIdea.generationStatus === 'pending'}
                                            onClick={() => handleGenerate(selectedIdea._id)}
                                        >
                                            {selectedIdea.generationStatus === 'pending' ? 'Processing...' : 'Create with Google Veo'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
      
      <style jsx>{`
        .spin { animation: rotate 2s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); }
        .modal-content { width: 95%; max-width: 1100px; max-height: 85vh; background: #fff; border-radius: 30px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 40px 100px rgba(0,0,0,0.2); }
        .modal-header { padding: 30px 40px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #fff; }
        .close-modal { font-size: 32px; background: none; border: none; cursor: pointer; color: #94a3b8; transition: color 0.2s; }
        .close-modal:hover { color: #000; }
        
        .modal-body { display: grid; grid-template-columns: 1fr 450px; gap: 40px; padding: 40px; overflow-y: auto; background: #fafafa; }
        .field-group { margin-bottom: 25px; }
        .field-group label { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 8px; letter-spacing: 1px; }
        .field-group input, .field-group select { width: 100%; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--border); font-family: inherit; font-size: 15px; color: #1e293b; background: #fff; transition: border-color 0.2s; }
        .field-group input:focus { border-color: var(--accent); outline: none; }
        
        .script-box { background: #fff; padding: 30px; border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .script-text { font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 15px; }
        .script-box .label { font-size: 10px; font-weight: 900; color: var(--accent); margin-top: 15px; letter-spacing: 1px; }
        
        .video-preview-placeholder { height: 100%; min-height: 500px; background: #0f172a; border-radius: 24px; display: flex; align-items: center; justify-content: center; color: #fff; text-align: center; padding: 40px; }
        .btn-veo { background: var(--accent); color: #fff; border: none; padding: 16px 32px; border-radius: 14px; font-weight: 700; margin-top: 25px; cursor: pointer; transition: all 0.2s; }
        .btn-veo:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(184, 134, 11, 0.4); }
        .btn-download { background: #fff; color: #000; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; margin-top: 20px; cursor: pointer; }
      `}</style>
    </div>
  );
}

function CalendarView({ ideas, onSelectIdea }: { ideas: any[], onSelectIdea: (idea: any) => void }) {
  const daysInMonth = 31;
  const startDay = 5; // May 2026 starts on Friday (5)
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1 - startDay);
  
  return (
    <div className="calendar-grid">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} style={{ padding: '15px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}>
          {day}
        </div>
      ))}
      {calendarDays.map((dayNum, idx) => {
        const dateStr = dayNum > 0 && dayNum <= daysInMonth ? `2026-05-${dayNum.toString().padStart(2, '0')}` : null;
        const dayIdeas = ideas.filter(idea => idea.scheduledDate && idea.scheduledDate.startsWith(dateStr));
        
        return (
          <div key={idx} className="calendar-day" style={{ opacity: dayNum <= 0 || dayNum > daysInMonth ? 0.3 : 1 }}>
            <div className="day-header">
              <span>{dayNum > 0 && dayNum <= daysInMonth ? dayNum : ''}</span>
            </div>
            {dayIdeas.map((idea, i) => (
              <div 
                key={i} 
                className={`event-tag ${idea.contentType.toLowerCase()}`}
                onClick={() => onSelectIdea(idea)}
                style={{ cursor: 'pointer' }}
              >
                <Play size={10} />
                <span>{idea.contentType}: {idea.title.substring(0, 15)}...</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function DashboardView({ ideasCount }: { ideasCount: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      <div className="idea-card glass" style={{ textAlign: 'center' }}>
        <h4 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>Content Planned</h4>
        <div style={{ fontSize: '48px', fontWeight: '800' }}>{ideasCount}</div>
      </div>
      <div className="idea-card glass" style={{ textAlign: 'center' }}>
        <h4 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>Videos Ready</h4>
        <div style={{ fontSize: '48px', fontWeight: '800' }}>12</div>
      </div>
      <div className="idea-card glass" style={{ textAlign: 'center' }}>
        <h4 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>Production Goal</h4>
        <div style={{ fontSize: '48px', fontWeight: '800' }}>100%</div>
      </div>
    </div>
  );
}
