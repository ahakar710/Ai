import React, { useState } from 'react';
import {
  Sparkles,
  Film,
  Download,
  Video,
  Image as ImageIcon,
  Clock,
  Layers,
  ArrowUpRight,
  Trash2,
} from 'lucide-react';
import { GeneratedLogo, GeneratedVideo } from '../types';

interface ShowcaseGalleryProps {
  logos: GeneratedLogo[];
  onSelectLogo: (logo: GeneratedLogo) => void;
  onDeleteLogo: (logoId: string) => void;
  onOpenAnimatorForLogo: (logo: GeneratedLogo) => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({
  logos,
  onSelectLogo,
  onDeleteLogo,
  onOpenAnimatorForLogo,
}) => {
  const [filter, setFilter] = useState<'all' | 'logos' | 'videos'>('all');

  const totalVideos = logos.reduce((acc, l) => acc + (l.videos?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Brand Creation Showcase</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Collection of your Gemini 3 Pro high-res logos and Veo 3.1 animated videos
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Items ({logos.length + totalVideos})
          </button>
          <button
            onClick={() => setFilter('logos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'logos' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Logos ({logos.length})
          </button>
          <button
            onClick={() => setFilter('videos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'videos' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Veo Videos ({totalVideos})
          </button>
        </div>
      </div>

      {logos.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-zinc-900/40 rounded-3xl border border-zinc-800/80">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <Layers className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-zinc-300">No creations saved yet</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Design a logo using the &ldquo;Design Logo&rdquo; tab or upload a photo to animate using Veo.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {logos.map((logo) => {
            if (filter === 'videos' && (!logo.videos || logo.videos.length === 0)) {
              return null;
            }

            return (
              <div
                key={logo.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all hover:shadow-xl group flex flex-col justify-between"
              >
                {/* Visual Preview */}
                <div>
                  <div
                    onClick={() => onSelectLogo(logo)}
                    className="relative aspect-square bg-zinc-950 p-6 flex items-center justify-center cursor-pointer border-b border-zinc-800/80 overflow-hidden"
                  >
                    <img
                      src={logo.imageUrl}
                      alt={logo.companyName}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Resolution Tag */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 font-mono border border-white/10">
                      {logo.size}
                    </div>

                    {/* Videos count badge if animated */}
                    {logo.videos && logo.videos.length > 0 && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-pink-500/20 backdrop-blur-md text-[10px] text-pink-300 font-medium border border-pink-500/30 flex items-center space-x-1">
                        <Film className="w-3 h-3" />
                        <span>{logo.videos.length} Veo Video{logo.videos.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3
                        onClick={() => onSelectLogo(logo)}
                        className="font-bold text-white text-base hover:text-indigo-400 cursor-pointer transition-colors"
                      >
                        {logo.companyName}
                      </h3>
                      <button
                        onClick={() => onDeleteLogo(logo.id)}
                        className="text-zinc-600 hover:text-red-400 p-1 rounded transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {logo.tagline && (
                      <p className="text-xs italic text-indigo-400">&ldquo;{logo.tagline}&rdquo;</p>
                    )}

                    <div className="text-[11px] text-zinc-500 flex items-center space-x-2">
                      <span>{logo.industry || 'Branding'}</span>
                      <span>&bull;</span>
                      <span>{logo.style || 'Modern'}</span>
                    </div>

                    {/* Embedded Animated Videos if any */}
                    {logo.videos && logo.videos.length > 0 && filter !== 'logos' && (
                      <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center space-x-1">
                          <Video className="w-3 h-3 text-pink-400" />
                          <span>Veo Animations:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {logo.videos.map((vid, vIdx) => (
                            <div
                              key={vid.id || vIdx}
                              className="relative rounded-lg overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center group/vid"
                            >
                              <video
                                src={vid.videoUrl}
                                muted
                                loop
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center">
                                <a
                                  href={vid.videoUrl}
                                  download={`video-${vid.aspectRatio.replace(':', 'x')}.mp4`}
                                  className="p-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 shadow-md"
                                  title="Download video"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </div>
                              <span className="absolute bottom-1 right-1 text-[9px] px-1 rounded bg-black/70 text-zinc-300 font-mono">
                                {vid.aspectRatio}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 flex items-center space-x-2">
                  <button
                    onClick={() => onOpenAnimatorForLogo(logo)}
                    className="flex-1 py-2 px-3 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-700/50 text-pink-300 hover:text-pink-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Animate Video</span>
                  </button>

                  <a
                    href={logo.imageUrl}
                    download={`${logo.companyName.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center transition-colors"
                    title="Download PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
