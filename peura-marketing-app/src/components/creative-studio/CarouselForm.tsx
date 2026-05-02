'use client';

import { useState } from 'react';
import { Copy, Sparkles, User, Glasses, Shirt, MapPin, Camera, Wand2 } from 'lucide-react';

interface CarouselFormProps {
  onCopy: (text: string) => void;
}

export default function CarouselForm({ onCopy }: CarouselFormProps) {
  const [formData, setFormData] = useState({
    shotType: 'Cinematic close-up portrait',
    age: '28',
    gender: 'woman',
    ethnicity: 'Indian',
    modelDescription: 'confident and elegant',
    hairStyle: 'long wavy black hair',
    skinTone: 'Warm olive',
    facialFeatures: 'sharp cheekbones and expressive eyes',
    frameStyle: 'cat-eye',
    frameColor: 'matte black',
    frameType: 'acetate',
    specialFeatures: 'blue light blocking',
    clothingItem: 'blazer',
    clothingNeckline: 'V-neck',
    clothingFit: 'tailored',
    clothingFabric: 'linen',
    clothingColor: 'emerald green',
    clothingAdditional: 'button details',
    pose: 'sitting at desk looking at camera',
    environment: 'minimalist modern office',
    environmentDetails: 'indoor plants and MacBook Pro',
    lightingSetup: 'Natural window light',
    lightingEffect: 'soft shadows creating depth',
    lensType: '85mm portrait',
    aperture: 'f/1.8',
    depthOfField: 'shallow depth with bokeh background',
    background: 'blurred contemporary architecture',
    expression: 'confident smile',
    cameraAngle: 'Eye-level',
    colorGrade: 'Warm golden tones',
    photographyStyle: 'Editorial fashion',
    productFocus: 'eyeglasses in perfect focus catching light',
    compositionRule: 'Rule of thirds',
    negativeSpace: 'right side clear for text overlay'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePrompt = () => {
    return `CAROUSEL SLIDE PROMPT TEMPLATE
═══════════════════════════════════════

[1] SHOT TYPE: ${formData.shotType}
[2] AGE: ${formData.age}
[3] GENDER: ${formData.gender}
[4] ETHNICITY/NATIONALITY: ${formData.ethnicity}
[5] MODEL DESCRIPTION: ${formData.modelDescription}
[6] HAIR STYLE & COLOR: ${formData.hairStyle}
[7] SKIN TONE: ${formData.skinTone}
[8] FACIAL FEATURES: ${formData.facialFeatures}

[9] PEURA EYEWEAR PRODUCT:
Frame Style: ${formData.frameStyle}
Frame Color: ${formData.frameColor}
Frame Type: ${formData.frameType}
Special Features: ${formData.specialFeatures}

[10] CLOTHING ITEM: ${formData.clothingItem}
[11] CLOTHING DETAILS:
Neckline: ${formData.clothingNeckline}
Fit: ${formData.clothingFit}
Fabric: ${formData.clothingFabric}
Color: ${formData.clothingColor}
Additional: ${formData.clothingAdditional}

[12] POSE/ACTION: ${formData.pose}
[13] ENVIRONMENT/LOCATION: ${formData.environment}
[14] ENVIRONMENT DETAILS: ${formData.environmentDetails}

[15] LIGHTING SETUP: ${formData.lightingSetup}
[16] LIGHTING EFFECT: ${formData.lightingEffect}
[17] LENS TYPE: ${formData.lensType}
[18] APERTURE: ${formData.aperture}
[19] DEPTH OF FIELD: ${formData.depthOfField}
[20] BACKGROUND: ${formData.background}

[21] SUBJECT EXPRESSION/EMOTION: ${formData.expression}
[22] CAMERA ANGLE: ${formData.cameraAngle}
[23] COLOR GRADE STYLE: ${formData.colorGrade}
[24] PHOTOGRAPHY STYLE: ${formData.photographyStyle}
[25] RESOLUTION/QUALITY: high resolution 4K quality, professional retouching, sharp focus

[26] PRODUCT FOCUS DETAILS: ${formData.productFocus}
[27] COMPOSITION RULE: ${formData.compositionRule}
[28] NEGATIVE SPACE FOR TEXT: ${formData.negativeSpace}

FIXED: Instagram carousel format 4:5 aspect ratio`;
  };

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-accent">
          <Icon size={20} />
        </div>
        <h3 className="font-black uppercase tracking-tight text-sm">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  const Input = ({ label, name, type = "text", options }: { label: string, name: string, type?: string, options?: string[] }) => (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      {options ? (
        <select 
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type}
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <Section title="Subject & Identity" icon={User}>
        <Input label="Shot Type" name="shotType" options={['Cinematic close-up portrait', 'Medium shot', 'Full body shot', 'Product close-up', 'Flat lay', 'Over-shoulder shot', 'Environmental portrait']} />
        <Input label="Age" name="age" />
        <Input label="Gender" name="gender" />
        <Input label="Ethnicity" name="ethnicity" />
        <Input label="Skin Tone" name="skinTone" options={['Fair', 'Light', 'Warm olive', 'Medium brown', 'Deep brown', 'Rich dark', 'Porcelain', 'Golden', 'Tan']} />
        <Input label="Hair Style & Color" name="hairStyle" />
        <div className="md:col-span-2">
            <Input label="Model Description" name="modelDescription" />
        </div>
        <div className="md:col-span-2">
            <Input label="Facial Features" name="facialFeatures" />
        </div>
      </Section>

      <Section title="Peura Product Details" icon={Glasses}>
        <Input label="Frame Style" name="frameStyle" />
        <Input label="Frame Color" name="frameColor" />
        <Input label="Frame Type" name="frameType" />
        <Input label="Special Features" name="specialFeatures" />
        <div className="md:col-span-2">
            <Input label="Product Focus Details" name="productFocus" />
        </div>
      </Section>

      <Section title="Wardrobe & Styling" icon={Shirt}>
        <Input label="Clothing Item" name="clothingItem" />
        <Input label="Neckline" name="clothingNeckline" />
        <Input label="Fit" name="clothingFit" />
        <Input label="Fabric" name="clothingFabric" />
        <Input label="Color" name="clothingColor" />
        <Input label="Additional Details" name="clothingAdditional" />
      </Section>

      <Section title="Environment & Composition" icon={MapPin}>
        <Input label="Pose / Action" name="pose" />
        <Input label="Location" name="environment" />
        <div className="md:col-span-2">
            <Input label="Environment Details" name="environmentDetails" />
        </div>
        <Input label="Background" name="background" />
        <Input label="Camera Angle" name="cameraAngle" options={['Eye-level', 'Slight low angle', 'Elevated angle', 'Bird\'s eye view', 'Profile', 'Three-quarter view']} />
        <Input label="Composition Rule" name="compositionRule" options={['Rule of thirds', 'Centered symmetry', 'Golden ratio', 'Leading lines', 'Negative space', 'Frame within frame']} />
        <Input label="Negative Space for Text" name="negativeSpace" />
      </Section>

      <Section title="Technical & Cinematic" icon={Camera}>
        <Input label="Lighting Setup" name="lightingSetup" options={['Natural window light', 'Golden hour sunlight', 'Studio lighting', 'Soft diffused light', 'Dramatic side lighting', 'Backlit', 'Evening ambient', 'Ring light']} />
        <Input label="Lighting Effect" name="lightingEffect" />
        <Input label="Lens Type" name="lensType" options={['24mm wide', '35mm', '50mm standard', '85mm portrait', '100mm macro']} />
        <Input label="Aperture" name="aperture" options={['f/1.4', 'f/1.8', 'f/2.0', 'f/2.8', 'f/4.0']} />
        <Input label="Depth of Field" name="depthOfField" />
        <Input label="Color Grade" name="colorGrade" options={['Warm golden tones', 'Cool blue undertones', 'Cinematic teal and orange', 'Desaturated pastels', 'High contrast blacks and whites', 'Lifted shadows', 'Natural vibrant']} />
        <Input label="Photography Style" name="photographyStyle" options={['Editorial fashion', 'Corporate professional', 'Luxury lifestyle', 'Street style', 'Product photography', 'Beauty portrait', 'Documentary candid']} />
        <Input label="Subject Expression" name="expression" />
      </Section>

      <div className="pt-4 pb-10 flex flex-col md:flex-row gap-4">
        <button 
          onClick={() => onCopy(generatePrompt())}
          className="flex-1 bg-slate-900 text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-slate-900/30 hover:-translate-y-1 hover:shadow-slate-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
        >
          <Wand2 size={24} />
          Copy Carousel Prompt
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
