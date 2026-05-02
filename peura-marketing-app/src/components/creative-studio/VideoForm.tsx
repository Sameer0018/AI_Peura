'use client';

import { useState } from 'react';
import { Plus, Trash2, Video, Camera, Type, Music, Zap, Sparkles, Wand2 } from 'lucide-react';

interface Scene {
  id: number;
  purpose: string;
  duration: string;
  visual: string;
  cameraMovement: string;
  lighting: string;
  text: string;
  audio: string;
  transition: string;
}

interface VideoFormProps {
  onCopy: (text: string) => void;
}

export default function VideoForm({ onCopy }: VideoFormProps) {
  const [globalSpecs, setGlobalSpecs] = useState({
    duration: '15s',
    format: '9:16 vertical',
    platform: 'Instagram Reel',
    mood: 'Luxury & Elegant',
    colorGrade: 'Warm cinematic golden tones'
  });

  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 1,
      purpose: 'Hook',
      duration: '3 seconds',
      visual: 'Close-up of model putting on Peura cat-eye frames',
      cameraMovement: 'Slow push-in',
      lighting: 'Natural window light from the side',
      text: 'Upgrade Your View',
      audio: 'Lo-fi chill beat',
      transition: 'Cut'
    }
  ]);

  const addScene = () => {
    const newScene: Scene = {
      id: scenes.length + 1,
      purpose: `Scene ${scenes.length + 1}`,
      duration: '3-5 seconds',
      visual: '',
      cameraMovement: 'Static',
      lighting: 'Consistent with previous',
      text: '',
      audio: '',
      transition: 'Dissolve'
    };
    setScenes([...scenes, newScene]);
  };

  const removeScene = (id: number) => {
    if (scenes.length === 1) return;
    setScenes(scenes.filter(s => s.id !== id));
  };

  const updateScene = (id: number, field: keyof Scene, value: string) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const generatePrompt = () => {
    let prompt = `SCENE STRUCTURE TEMPLATE
═══════════════════════════════════════

VIDEO SPECS:
Duration: ${globalSpecs.duration}
Format: ${globalSpecs.format}
Platform: ${globalSpecs.platform}
Overall Mood: ${globalSpecs.mood}
Color Grade: ${globalSpecs.colorGrade}

─────────────────────────────────────\n\n`;

    scenes.forEach((scene, index) => {
      prompt += `SCENE [${index + 1}]: ${scene.purpose}
Duration: ${scene.duration}

VISUAL:
${scene.visual}

CAMERA MOVEMENT:
${scene.cameraMovement}

LIGHTING:
${scene.lighting}

ON-SCREEN TEXT:
Text: "${scene.text}"

AUDIO:
${scene.audio}

TRANSITION TO NEXT SCENE:
${scene.transition}

─────────────────────────────────────\n\n`;
    });

    return prompt;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-10">
      {/* Global Specs Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500">
            <Video size={20} />
          </div>
          <h3 className="font-black uppercase tracking-tight text-sm">Video Specifications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</label>
            <select 
              value={globalSpecs.duration}
              onChange={e => setGlobalSpecs({...globalSpecs, duration: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent"
            >
              <option value="15s">15 Seconds</option>
              <option value="30s">30 Seconds</option>
              <option value="60s">60 Seconds</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Format</label>
            <select 
              value={globalSpecs.format}
              onChange={e => setGlobalSpecs({...globalSpecs, format: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent"
            >
              <option value="9:16 vertical">9:16 Vertical (Reel/TikTok)</option>
              <option value="16:9 horizontal">16:9 Horizontal (YouTube)</option>
              <option value="1:1 square">1:1 Square</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</label>
            <input 
              type="text"
              value={globalSpecs.platform}
              onChange={e => setGlobalSpecs({...globalSpecs, platform: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Overall Mood</label>
            <input 
              type="text"
              value={globalSpecs.mood}
              onChange={e => setGlobalSpecs({...globalSpecs, mood: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Color Grade</label>
            <input 
              type="text"
              value={globalSpecs.colorGrade}
              onChange={e => setGlobalSpecs({...globalSpecs, colorGrade: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Scenes Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                Sequencing <span className="text-slate-400 text-sm">({scenes.length} Scenes)</span>
            </h3>
            <button 
                onClick={addScene}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
                <Plus size={16} /> Add Scene
            </button>
        </div>

        {scenes.map((scene, index) => (
          <div key={scene.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative group overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Scene Badge */}
            <div className="absolute top-0 left-0 bg-slate-900 text-white px-6 py-2 rounded-br-2xl font-black text-xs uppercase tracking-widest z-10">
                Scene {index + 1}
            </div>

            <button 
                onClick={() => removeScene(scene.id)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
            >
                <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Scene Purpose</label>
                        <input 
                            value={scene.purpose}
                            onChange={e => updateScene(scene.id, 'purpose', e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 font-bold text-accent focus:outline-none"
                            placeholder="e.g. Hook, Product Reveal, CTA"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Visual Action</label>
                        <textarea 
                            value={scene.visual}
                            onChange={e => updateScene(scene.id, 'visual', e.target.value)}
                            rows={3}
                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none"
                            placeholder="Describe what's happening..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Camera size={12} /> Movement
                        </label>
                        <input 
                            value={scene.cameraMovement}
                            onChange={e => updateScene(scene.id, 'cameraMovement', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Type size={12} /> Text
                        </label>
                        <input 
                            value={scene.text}
                            onChange={e => updateScene(scene.id, 'text', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Music size={12} /> Audio/SFX
                        </label>
                        <input 
                            value={scene.audio}
                            onChange={e => updateScene(scene.id, 'audio', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Zap size={12} /> Transition
                        </label>
                        <input 
                            value={scene.transition}
                            onChange={e => updateScene(scene.id, 'transition', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium focus:outline-none"
                        />
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex flex-col md:flex-row gap-4">
        <button 
          onClick={() => onCopy(generatePrompt())}
          className="flex-1 bg-slate-900 text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-slate-900/30 hover:-translate-y-1 hover:shadow-slate-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
        >
          <Wand2 size={24} />
          Copy Video Script
        </button>
        <a 
          href={`https://wa.me/918770864756?text=${encodeURIComponent(generatePrompt())}`}
          target="_blank"
          className="flex-1 bg-green-600 text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-green-900/20 hover:-translate-y-1 hover:shadow-green-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
          Send to WhatsApp
        </a>
      </div>
    </div>
  );
}
