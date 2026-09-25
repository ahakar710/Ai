import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Video,
  Film,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Ratio,
  Sliders,
  Image as ImageIcon,
  Play,
  Pause,
} from 'lucide-react';
import { AspectRatio } from '../types';
import { VEO_MOTION_PRESETS } from '../constants';

interface UploadAnimatorViewProps {
  onVideoCreated: (videoData: {
    videoUrl: string;
    operationName: string;
    prompt: string;
    aspectRatio: AspectRatio;
    companyName: string;
    imageUrl: string;
  }) => void;
}

export const UploadAnimatorView: React.FC<UploadAnimatorViewProps> = ({ onVideoCreated }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedPreset, setSelectedPreset] = useState<string>('metallic-reveal');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [operationName, setOperationName] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollingRef = useRef<boolean>(false);

  useEffect(() => {
    const found = VEO_MOTION_PRESETS.find((p) => p.id === selectedPreset);
    if (found) {
      setCustomPrompt(found.prompt);
    }
  }, [selectedPreset]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }
    setImageFileName(file.name);
    if (!companyName) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setCompanyName(nameWithoutExt);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage(e.target.result as string);
        setError(null);
        setVideoUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const startVeoAnimation = async () => {
    if (!uploadedImage) {
      setError('Please upload a photo first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl('');
    setElapsedSeconds(0);
    setStatusMessage('Uploading reference photo and initializing Veo 3.1 Fast...');

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      // Step 1: POST /api/generate-video
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          prompt: customPrompt,
          aspectRatio,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || !startData.operationName) {
        throw new Error(startData.error || 'Failed to start video generation.');
      }

      const opName = startData.operationName;
      setOperationName(opName);
      setStatusMessage('Simulating light dynamics and synthesizing cinematic motion physics...');

      // Step 2: Poll status
      pollingRef.current = true;
      let done = false;

      while (pollingRef.current && !done) {
        await new Promise((r) => setTimeout(r, 8000));
        if (!pollingRef.current) break;

        setStatusMessage(
          elapsedSeconds > 45
            ? 'Refining high-definition motion vectors and encoding frames...'
            : 'Simulating light dynamics and synthesizing cinematic motion physics...'
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
          setStatusMessage('Streaming completed MP4 animation...');

          // Step 3: Stream download
          const downloadRes = await fetch('/api/video-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: opName }),
          });

          if (!downloadRes.ok) {
            throw new Error('Failed to download video stream.');
          }

          const blob = await downloadRes.blob();
          const objectUrl = URL.createObjectURL(blob);
          setVideoUrl(objectUrl);
          setIsGenerating(false);
          if (timerRef.current) clearInterval(timerRef.current);

          onVideoCreated({
            videoUrl: objectUrl,
            operationName: opName,
            prompt: customPrompt,
            aspectRatio,
            companyName: companyName || 'Custom Photo',
            imageUrl: uploadedImage,
          });
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
    a.download = `${companyName.toLowerCase().replace(/\s+/g, '-') || 'photo'}-veo-animation-${aspectRatio.replace(':', 'x')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Intro Banner */}
      <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-r from-pink-950/30 via-purple-950/20 to-zinc-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Upload Photo &amp; Animate with Veo
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono">
                veo-3.1-fast-generate-preview
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Upload any existing company logo, photo, or brand artwork and generate a cinematic 16:9 or 9:16 animated video.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              1. Upload Photo or Logo File
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-pink-500 bg-pink-500/10'
                  : uploadedImage
                  ? 'border-zinc-700 bg-zinc-900/60'
                  : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
              onClick={() => {
                const input = document.getElementById('photo-upload-input');
                input?.click();
              }}
            >
              <input
                id="photo-upload-input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={uploadedImage}
                      alt="Uploaded preview"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white truncate max-w-xs">
                      {imageFileName || 'Uploaded Photo'}
                    </div>
                    <div className="text-xs text-pink-400 mt-0.5">Click to replace photo</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium text-zinc-200">
                    Drag and drop your logo photo here, or <span className="text-pink-400 underline">browse</span>
                  </div>
                  <p className="text-xs text-zinc-500">Supports PNG, JPG, WebP, SVG (up to 20MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Company / Brand Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Brand / Title Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Apex Corporation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm text-white placeholder-zinc-500"
            />
          </div>

          {/* Aspect Ratio Selector (Required: 16:9 or 9:16) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
                <Ratio className="w-3.5 h-3.5 text-pink-400" />
                <span>Aspect Ratio (veo-3.1-fast-generate-preview)</span>
              </label>
              <span className="text-[10px] text-pink-400 font-mono">16:9 or 9:16</span>
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
                    YouTube, Web Banner, Presentation
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
                    Reels, TikTok, Shorts, Mobile
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Motion Styles */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Animation Motion Preset
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

          {/* Custom Prompt */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Motion Graphics Prompt
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-xs text-white transition-colors"
            />
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={startVeoAnimation}
            disabled={isGenerating || !uploadedImage}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-pink-500/25 flex items-center justify-center space-x-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Video with Veo ({elapsedSeconds}s)...</span>
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                <span>Animate Photo into {aspectRatio} Video (Veo 3.1)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Preview / Video Playback (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden">
            {videoUrl ? (
              <div className="w-full flex flex-col items-center space-y-5">
                <div
                  className={`relative rounded-xl overflow-hidden bg-black shadow-2xl border border-zinc-800 flex items-center justify-center ${
                    aspectRatio === '9:16' ? 'w-[240px] aspect-[9/16]' : 'w-full aspect-[16/9]'
                  }`}
                >
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-mono flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                    <span>Veo 3.1 &bull; {aspectRatio}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full">
                  <button
                    onClick={downloadVideo}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-pink-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {aspectRatio} MP4</span>
                  </button>

                  <button
                    onClick={() => setVideoUrl('')}
                    className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="py-16 text-center space-y-6 w-full">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin" />
                  <Film className="w-7 h-7 text-pink-400 absolute inset-0 m-auto animate-pulse" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-white">Veo Video Generator Running</h4>
                  <p className="text-xs text-pink-300 max-w-xs mx-auto">{statusMessage}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2 max-w-xs mx-auto">
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-1000 animate-pulse"
                      style={{ width: `${Math.min(95, Math.max(10, elapsedSeconds * 2))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Rendering time: {elapsedSeconds}s</span>
                    <span>Target: {aspectRatio}</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-500 italic max-w-xs mx-auto">
                  Model: <span className="text-zinc-400 font-mono">veo-3.1-fast-generate-preview</span>. High-speed cinematic rendering.
                </p>
              </div>
            ) : uploadedImage ? (
              <div className="text-center space-y-4">
                <div
                  className={`relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 mx-auto shadow-lg flex items-center justify-center ${
                    aspectRatio === '9:16' ? 'w-[200px] aspect-[9/16]' : 'w-[280px] aspect-[16/9]'
                  }`}
                >
                  <img
                    src={uploadedImage}
                    alt="Uploaded photo"
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-zinc-400 font-mono">
                    Target: {aspectRatio}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    {companyName || 'Uploaded Reference'}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Click &ldquo;Animate Photo&rdquo; to produce a {aspectRatio} motion video
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 py-16 text-zinc-500">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div className="text-sm font-medium text-zinc-400">No photo uploaded yet</div>
                <p className="text-xs max-w-xs">
                  Upload an image on the left to preview it here and generate a {aspectRatio} video.
                </p>
              </div>
            )}

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
  );
};
