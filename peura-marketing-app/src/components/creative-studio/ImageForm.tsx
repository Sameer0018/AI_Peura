'use client';

import { useState } from 'react';
import { Camera, User, Glasses, Sparkles, Wand2 } from 'lucide-react';

interface ImageFormProps {
  onCopy: (text: string) => void;
}

export default function ImageForm({ onCopy }: ImageFormProps) {
  const [formData, setFormData] = useState({
    shotType: 'Cinematic close-up portrait',
    modelDesc: 'elegant and professional Indian woman',
    productDesc: 'Peura matte black rectangular frames with blue light blocking lenses',
    environment: 'luxury boutique hotel lobby with marble accents',
    lighting: 'soft diffused studio lighting with a subtle rim light',
    style: 'Luxury lifestyle editorial photography',
    emotion: 'confident and focused gaze',
    angle: 'Three-quarter view',
    technical: '85mm lens, f/1.8 aperture, shallow depth of field, 4K resolution'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePrompt = () => {
    return `SINGLE IMAGE PROMPT
═══════════════════════════════════════

VISUAL DESCRIPTION:
${formData.shotType} of a ${formData.modelDesc}, featuring ${formData.productDesc}. 
The subject is exhibiting a ${formData.emotion}, shot from a ${formData.angle}.

ENVIRONMENT:
Located in a ${formData.environment}, enhanced by ${formData.lighting}.

TECHNICAL SPECS:
Style: ${formData.style}
Camera Settings: ${formData.technical}

FIXED: Professional high-resolution 4K quality, sharp focus on frames, editorial grade.`;
  };

  const Input = ({ label, name, options }: { label: string, name: string, options?: string[] }) => (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      {options ? (
        <select 
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent"
        />
      )}
    </div>
  );

  const handleSave = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';
    try {
      const res = await fetch(`${API_URL}/api/visual-prompt/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Image Prompt: ${formData.modelDesc} at ${formData.environment}`,
          type: 'Image',
          prompt: generatePrompt(),
          settings: formData
        })
      });
      if (res.ok) {
        alert('Prompt saved to Content Library!');
      }
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-10">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500">
                <User size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm">Subject & Core</h3>
            </div>
            <Input label="Shot Type" name="shotType" options={['Cinematic close-up portrait', 'Medium shot', 'Full body shot', 'Product close-up', 'Environmental portrait']} />
            <Input label="Model Description" name="modelDesc" />
            <Input label="Emotion / Expression" name="emotion" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500">
                <Glasses size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm">Product & Scene</h3>
            </div>
            <Input label="Peura Product Details" name="productDesc" />
            <Input label="Environment/Location" name="environment" />
            <Input label="Camera Angle" name="angle" options={['Eye-level', 'Slight low angle', 'Profile', 'Three-quarter view']} />
          </div>
        </div>

        <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-500">
              <Camera size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-sm">Style & Technical</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Lighting Setup" name="lighting" />
            <Input label="Photography Style" name="style" />
            <div className="md:col-span-2">
                <Input label="Technical Details (Lens, Resolution, etc.)" name="technical" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button 
          onClick={() => onCopy(generatePrompt())}
          className="flex-1 bg-slate-900 text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-slate-900/30 hover:-translate-y-1 hover:shadow-slate-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
        >
          <Wand2 size={24} />
          Copy
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 bg-accent text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-accent/20 hover:-translate-y-1 hover:shadow-accent/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
        >
          <Sparkles size={24} />
          Save to Library
        </button>
        <a 
          href={`https://wa.me/918770864756?text=${encodeURIComponent(generatePrompt())}`}
          target="_blank"
          className="flex-1 bg-green-600 text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-green-900/20 hover:-translate-y-1 hover:shadow-green-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
