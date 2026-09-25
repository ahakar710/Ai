import React, { useState } from 'react';
import {
  Sparkles,
  Film,
  Download,
  Copy,
  Check,
  Maximize2,
  Layers,
  Smartphone,
  CreditCard,
  Monitor,
  Shirt,
  Video,
} from 'lucide-react';
import { GeneratedLogo } from '../types';

interface LogoViewerProps {
  logo: GeneratedLogo;
  onOpenAnimator: () => void;
}

export const LogoViewer: React.FC<LogoViewerProps> = ({ logo, onOpenAnimator }) => {
  const [bgMode, setBgMode] = useState<'dark' | 'light' | 'grid' | 'gradient'>('dark');
  const [activeTab, setActiveTab] = useState<'logo' | 'mockups' | 'videos'>('logo');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const downloadImage = () => {
    const a = document.createElement('a');
    a.href = logo.imageUrl;
    a.download = `${logo.companyName.toLowerCase().replace(/\s+/g, '-')}-logo-${logo.size}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPromptText = () => {
    navigator.clipboard.writeText(logo.promptUsed);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-300">
      {/* Top Header of Viewer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {logo.companyName}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {logo.size} Resolution
            </span>
          </div>
          {logo.tagline && (
            <p className="text-xs italic text-indigo-400 mt-0.5">&ldquo;{logo.tagline}&rdquo;</p>
          )}
        </div>

        {/* View Switcher: Art asset vs Real-world Mockups vs Videos */}
        <div className="flex items-center space-x-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'logo'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Logo Asset
          </button>
          <button
            onClick={() => setActiveTab('mockups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'mockups'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Brand Mockups
          </button>
          {logo.videos && logo.videos.length > 0 && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-pink-900/50 text-pink-200 border border-pink-700/50 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-pink-400" />
              <span>Animations ({logo.videos.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'logo' ? (
        <div className="space-y-6">
          {/* Main Visual Frame */}
          <div className="relative group">
            {/* Background Selector Pills */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setBgMode('dark')}
                title="Dark Stage"
                className={`w-5 h-5 rounded-md bg-zinc-950 border ${
                  bgMode === 'dark' ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-zinc-700'
                }`}
              />
              <button
                onClick={() => setBgMode('light')}
                title="White Background"
                className={`w-5 h-5 rounded-md bg-white border ${
                  bgMode === 'light' ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-zinc-300'
                }`}
              />
              <button
                onClick={() => setBgMode('grid')}
                title="Checkerboard Grid"
                className={`w-5 h-5 rounded-md bg-[linear-gradient(45deg,#27272a_25%,transparent_25%),linear-gradient(-45deg,#27272a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#27272a_75%),linear-gradient(-45deg,transparent_75%,#27272a_75%)] bg-[size:10px_10px] bg-zinc-900 border ${
                  bgMode === 'grid' ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-zinc-700'
                }`}
              />
              <button
                onClick={() => setBgMode('gradient')}
                title="Vibrant Gradient"
                className={`w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 border ${
                  bgMode === 'gradient' ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-zinc-700'
                }`}
              />
            </div>

            {/* Model & Size Tag */}
            <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>gemini-3-pro-image-preview</span>
              <span className="text-zinc-500">&bull;</span>
              <span className="text-indigo-400 font-bold">{logo.size}</span>
            </div>

            {/* Canvas Stage */}
            <div
              className={`w-full aspect-square max-h-[520px] rounded-2xl overflow-hidden flex items-center justify-center p-8 transition-colors ${
                bgMode === 'dark'
                  ? 'bg-zinc-950 border border-zinc-800'
                  : bgMode === 'light'
                  ? 'bg-white border border-zinc-200'
                  : bgMode === 'grid'
                  ? 'bg-[linear-gradient(45deg,#18181b_25%,transparent_25%),linear-gradient(-45deg,#18181b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#18181b_75%),linear-gradient(-45deg,transparent_75%,#18181b_75%)] bg-[size:24px_24px] bg-zinc-900 border border-zinc-800'
                  : 'bg-gradient-to-tr from-indigo-950 via-purple-950 to-pink-950 border border-purple-800/40'
              }`}
            >
              <img
                src={logo.imageUrl}
                alt={`${logo.companyName} Logo`}
                className="max-w-full max-h-full object-contain filter drop-shadow-2xl rounded-lg"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Primary Glow CTA: Animate with Veo */}
            <button
              onClick={onOpenAnimator}
              className="sm:col-span-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-pink-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99] group"
            >
              <Film className="w-4 h-4 text-pink-200 group-hover:scale-110 transition-transform" />
              <span>Animate into Video with Veo AI (16:9 / 9:16)</span>
            </button>

            {/* Download PNG */}
            <button
              onClick={downloadImage}
              className="py-3.5 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors border border-zinc-700"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Download {logo.size} PNG</span>
            </button>
          </div>

          {/* Prompt metadata details */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold text-zinc-300">Prompt Used for Gemini 3 Pro:</span>
              <button
                onClick={copyPromptText}
                className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-zinc-500 leading-relaxed font-mono text-[11px] line-clamp-3">
              {logo.promptUsed}
            </p>
          </div>
        </div>
      ) : activeTab === 'mockups' ? (
        /* Real World Mockup Showcase */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mockup 1: Mobile App Icon */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>iOS / Android App Icon</span>
            </div>
            <div className="w-28 h-28 rounded-3xl bg-zinc-900 border border-zinc-700 p-3 shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              <img
                src={logo.imageUrl}
                alt="App Icon Mockup"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs text-zinc-500">{logo.companyName} App</span>
          </div>

          {/* Mockup 2: Business Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Executive Business Card</span>
            </div>
            <div className="w-64 h-36 rounded-xl bg-zinc-900 border border-zinc-700 p-4 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center space-x-2">
                <img src={logo.imageUrl} alt="Card logo" className="w-8 h-8 object-contain" />
                <span className="text-xs font-bold text-white">{logo.companyName}</span>
              </div>
              <div className="text-[10px] text-zinc-400 space-y-0.5">
                <div className="font-semibold text-zinc-200">Sarah Jenkins &bull; Founder &amp; CEO</div>
                <div>contact@{logo.companyName.toLowerCase().replace(/\s+/g, '')}.com</div>
              </div>
            </div>
          </div>

          {/* Mockup 3: Dark Website Header */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <Monitor className="w-4 h-4 text-purple-400" />
              <span>Website Navigation Header</span>
            </div>
            <div className="w-full max-w-sm rounded-xl bg-zinc-900 border border-zinc-800 p-3 shadow-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src={logo.imageUrl} alt="Nav logo" className="w-6 h-6 object-contain" />
                <span className="text-xs font-bold text-white">{logo.companyName}</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] text-zinc-400">
                <span>Products</span>
                <span>Solutions</span>
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-medium">Get Started</span>
              </div>
            </div>
          </div>

          {/* Mockup 4: Merchandise / Apparel */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <Shirt className="w-4 h-4 text-pink-400" />
              <span>Corporate Merchandise</span>
            </div>
            <div className="w-44 h-44 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4 relative shadow-lg">
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src={logo.imageUrl}
                  alt="T-shirt chest print"
                  className="w-full h-full object-contain opacity-90"
                />
              </div>
              <span className="absolute bottom-2 text-[10px] text-zinc-500 font-mono">
                Embroidered Chest Print
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Video Animations Tab */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {logo.videos.map((vid, idx) => (
              <div
                key={vid.id || idx}
                className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 space-y-3"
              >
                <div
                  className={`relative rounded-xl overflow-hidden bg-black mx-auto ${
                    vid.aspectRatio === '9:16' ? 'w-[180px] aspect-[9/16]' : 'w-full aspect-[16/9]'
                  }`}
                >
                  <video
                    src={vid.videoUrl}
                    controls
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-pink-300 font-mono">
                    Veo 3.1 &bull; {vid.aspectRatio}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-zinc-400 font-medium">Veo Video {idx + 1}</span>
                  <a
                    href={vid.videoUrl}
                    download={`logo-animation-${vid.aspectRatio.replace(':', 'x')}.mp4`}
                    className="flex items-center space-x-1 text-pink-400 hover:text-pink-300 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save MP4</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenAnimator}
            className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <Film className="w-4 h-4" />
            <span>Generate Another Video with Veo</span>
          </button>
        </div>
      )}
    </div>
  );
};
