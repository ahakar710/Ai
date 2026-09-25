import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Film,
  Video,
  Sparkles,
  Download,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ratio,
  Sliders,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { GeneratedLogo, AspectRatio, MotionPreset } from '../types';
import { VEO_MOTION_PRESETS } from '../constants';

interface VeoAnimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  logo: GeneratedLogo | null;
  onVideoCreated: (logoId: string, videoUrl: string, operationName: string, prompt: string, ratio: AspectRatio) => void;
}

export const VeoAnimatorModal: React.FC<VeoAnimatorModalProps> = ({
  isOpen,
  onClose,
  logo,
  onVideoCreated,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedPreset, setSelectedPreset] = useState<string>('metallic-reveal');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [operationName, setOperationName] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollingRef = useRef<boolean>(false);

  // Initialize custom prompt when preset changes
  useEffect(() => {
    const found = VEO_MOTION_PRESETS.find((p) => p.id === selectedPreset);
    if (found) {
      setCustomPrompt(found.prompt);
    }
  }, [selectedPreset]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const currentImage = customImage || logo?.imageUrl;

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startVeoGeneration = async () => {
    if (!currentImage) {
      setError('Please provide an image to animate.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl('');
    setElapsedSeconds(0);
    setStatusMessage('Uploading reference logo & initializing Veo 3.1 Fast video model...');

    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      // Step 1: Start video generation via POST /api/generate-video
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentImage,
          prompt: customPrompt,
          aspectRatio,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || !startData.operationName) {
        throw new Error(startData.error || 'Failed to initialize video generation.');
      }

      const opName = startData.operationName;
      setOperationName(opName);
      setStatusMessage('Synthesizing 3D motion physics and lighting trajectories...');

      // Step 2: Poll status via POST /api/video-status
      pollingRef.current = true;
      let done = false;

      while (pollingRef.current && !done) {
        await new Promise((r) => setTimeout(r, 8000));
        if (!pollingRef.current) break;

        setStatusMessage(
          elapsedSeconds > 45
            ? 'Refining motion graphics and rendering 60fps frames...'
            : 'Synthesizing 3D motion physics and lighting trajectories...'
        );

        const pollRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName }),
        });

        const pollData = await pollRes.json();
        if (pollData.error) {
          throw new Error(typeof pollData.error === 'string' ? pollData.error : 'Video generation failed.');
        }

        if (pollData.done) {
          done = true;
          setStatusMessage('Finalizing MP4 video stream and loading high-def player...');

          // Step 3: Fetch video via POST /api/video-download
          const downloadRes = await fetch('/api/video-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: opName }),
          });

          if (!downloadRes.ok) {
            throw new Error('Failed to stream generated video.');
          }

          const blob = await downloadRes.blob();
          const objectUrl = URL.createObjectURL(blob);
          setVideoUrl(objectUrl);
          setIsGenerating(false);
          if (timerRef.current) clearInterval(timerRef.current);

          if (logo) {
            onVideoCreated(logo.id, objectUrl, opName, customPrompt, aspectRatio);
          }
          break;
        }
      }
    } catch (err: any) {
      console.error('Veo video generation error:', err);
      setError(err?.message || 'Video generation failed. Please try again.');
      setIsGenerating(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `${logo?.companyName ? logo.companyName.toLowerCase().replace(/\s+/g, '-') : 'logo'}-animated-${aspectRatio.replace(':', 'x')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Veo Video Logo Animator
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 font-mono font-medium">
                  veo-3.1-fast-generate-preview
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Generate dynamic broadcast-grade animated brand reveals from your logo
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              pollingRef.current = false;
              if (timerRef.current) clearInterval(timerRef.current);
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Settings and Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Aspect Ratio Affordance (16:9 Landscape vs 9:16 Portrait) - Explicitly Required */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
                  <Ratio className="w-3.5 h-3.5 text-pink-400" />
                  <span>Video Aspect Ratio</span>
                  <span className="text-[10px] text-pink-400 font-mono">(Required: 16:9 or 9:16)</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-pink-950/40 border-pink-500 ring-1 ring-pink-500/40 text-white shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-10 h-6 rounded border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                    16:9
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">16:9 Landscape</div>
                    <div className="text-[10px] text-zinc-500">
                      YouTube, Website Headers, Presentations, TV
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-pink-950/40 border-pink-500 ring-1 ring-pink-500/40 text-white shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-6 h-10 rounded border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                    9:16
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">9:16 Portrait</div>
                    <div className="text-[10px] text-zinc-500">
                      TikTok, Instagram Reels, YouTube Shorts
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Motion Style Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Cinematic Motion Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {VEO_MOTION_PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-pink-950/50 to-zinc-900 border-pink-500 text-white ring-1 ring-pink-500/40 shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{preset.name}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                        {preset.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Animation Prompt for Veo
                </label>
                <span className="text-[10px] text-zinc-500">Customizable direction</span>
              </div>
              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-xs text-white placeholder-zinc-500 transition-colors"
              />
            </div>

            {/* Option to Upload Alternative Photo / Logo */}
            <div className="pt-1 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Using image reference:</span>
                <label className="cursor-pointer text-pink-400 hover:text-pink-300 font-medium flex items-center space-x-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload different photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Start Button */}
            <div>
              <button
                type="button"
                onClick={startVeoGeneration}
                disabled={isGenerating || !currentImage}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering Veo Animation ({elapsedSeconds}s)...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Generate {aspectRatio} Video with Veo 3.1</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Visual Stage (Logo Reference vs Video Player) (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
              {/* If Video is Rendered */}
              {videoUrl ? (
                <div className="w-full flex flex-col items-center space-y-4">
                  <div
                    className={`relative rounded-xl overflow-hidden bg-black shadow-2xl border border-zinc-800 flex items-center justify-center ${
                      aspectRatio === '9:16' ? 'w-[220px] aspect-[9/16]' : 'w-full aspect-[16/9]'
                    }`}
                  >
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay Tag */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white font-mono flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                      <span>Veo 3.1 ({aspectRatio})</span>
                    </div>
                  </div>

                  {/* Video Actions */}
                  <div className="flex items-center space-x-2 w-full">
                    <button
                      onClick={downloadVideo}
                      className="flex-1 py-2 px-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download MP4</span>
                    </button>

                    <button
                      onClick={() => {
                        setVideoUrl('');
                      }}
                      className="py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center space-x-1 transition-colors"
                      title="Animate again with different settings"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-animate</span>
                    </button>
                  </div>
                </div>
              ) : isGenerating ? (
                /* Generating Progress State */
                <div className="py-12 px-4 text-center space-y-5 w-full">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin" />
                    <Film className="w-7 h-7 text-pink-400 absolute inset-0 m-auto animate-pulse" />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white">Veo Video Synthesis in Progress</h4>
                    <p className="text-xs text-pink-300 mt-1">{statusMessage}</p>
                  </div>

                  {/* Reassuring Progress & Timer */}
                  <div className="space-y-2 max-w-xs mx-auto">
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-1000 animate-pulse"
                        style={{ width: `${Math.min(95, Math.max(10, elapsedSeconds * 2))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Elapsed: {elapsedSeconds}s</span>
                      <span>Aspect: {aspectRatio}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 italic max-w-xs mx-auto">
                    Video generation typically takes 40-75 seconds to render full 60fps lighting and motion vectors.
                  </p>
                </div>
              ) : (
                /* Static Image Preview before Generation */
                <div className="text-center space-y-3">
                  <div
                    className={`relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 mx-auto shadow-lg flex items-center justify-center ${
                      aspectRatio === '9:16' ? 'w-[180px] aspect-[9/16]' : 'w-[260px] aspect-[16/9]'
                    }`}
                  >
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt="Reference logo"
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="text-zinc-600 text-xs">No image selected</div>
                    )}

                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-zinc-400 font-mono">
                      Ref Image
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-zinc-300">
                      Target Aspect: <span className="text-pink-400 font-bold">{aspectRatio}</span>
                    </span>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Ready to synthesize cinematic animation
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
