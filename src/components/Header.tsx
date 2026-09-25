import React from 'react';
import { Sparkles, Video, Image as ImageIcon, History, Wand2 } from 'lucide-react';
import { SAMPLE_COMPANIES } from '../constants';
import { LogoFormState } from '../types';

interface HeaderProps {
  activeTab: 'designer' | 'upload' | 'showcase';
  setActiveTab: (tab: 'designer' | 'upload' | 'showcase') => void;
  onSelectSample: (sample: typeof SAMPLE_COMPANIES[0]) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectSample,
  savedCount,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('designer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">LogoCraft</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 font-medium">
                  AI Studio
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Gemini 3 Pro Logos &bull; Veo 3.1 Video Animator
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('designer')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'designer'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <span>Design Logo</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Video className="w-4 h-4 text-pink-400" />
              <span>Upload &amp; Animate</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-semibold uppercase tracking-wider">
                Veo
              </span>
            </button>

            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'showcase'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span>Gallery</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Preset Inspiration Button */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Try Preset</span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Instant Company Presets
              </div>
              <div className="space-y-1 mt-1">
                {SAMPLE_COMPANIES.map((sample) => (
                  <button
                    key={sample.companyName}
                    onClick={() => {
                      onSelectSample(sample);
                      setActiveTab('designer');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors group/item"
                  >
                    <div className="text-xs font-medium text-zinc-200 group-hover/item:text-indigo-300 flex items-center justify-between">
                      <span>{sample.companyName}</span>
                      <span className="text-[10px] text-zinc-500">{sample.imageSize}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">{sample.industry} &bull; {sample.style}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
