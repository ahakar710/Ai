import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LogoForm } from './components/LogoForm';
import { LogoViewer } from './components/LogoViewer';
import { VeoAnimatorModal } from './components/VeoAnimatorModal';
import { UploadAnimatorView } from './components/UploadAnimatorView';
import { ShowcaseGallery } from './components/ShowcaseGallery';
import { ConceptModal } from './components/ConceptModal';
import {
  LogoFormState,
  GeneratedLogo,
  ConceptSuggestion,
  AspectRatio,
  ImageSize,
} from './types';
import { SAMPLE_COMPANIES } from './constants';
import { Sparkles, AlertCircle, Film, ArrowRight, ShieldCheck, Video } from 'lucide-react';

const STORAGE_KEY = 'logocraft_saved_logos';

export default function App() {
  const [activeTab, setActiveTab] = useState<'designer' | 'upload' | 'showcase'>('designer');

  // Form State
  const [form, setForm] = useState<LogoFormState>({
    companyName: 'Apex Quantum',
    tagline: 'Supercomputing Beyond Limits',
    industry: 'Technology & AI',
    description:
      'Pioneering quantum computing architecture and neural algorithms for aerospace. We need a modern, ultra-precise logo featuring interconnected dimensional qubit nodes with sharp geometric lines.',
    style: 'tech-futuristic',
    colorPalette: 'electric-cyber',
    customColors: '',
    imageSize: '2K',
    symbolType: 'icon-and-text',
    additionalPrompt: 'Precise geometric qubit geometry, sleek cyan and violet illumination, pure background',
  });

  // Logos state
  const [currentLogo, setCurrentLogo] = useState<GeneratedLogo | null>(null);
  const [savedLogos, setSavedLogos] = useState<GeneratedLogo[]>([]);

  // Generation status
  const [isGeneratingLogo, setIsGeneratingLogo] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Concepts modal
  const [isConceptModalOpen, setIsConceptModalOpen] = useState<boolean>(false);
  const [concepts, setConcepts] = useState<ConceptSuggestion[]>([]);
  const [isBrainstorming, setIsBrainstorming] = useState<boolean>(false);

  // Veo Animator modal
  const [isVeoModalOpen, setIsVeoModalOpen] = useState<boolean>(false);
  const [veoTargetLogo, setVeoTargetLogo] = useState<GeneratedLogo | null>(null);

  // Load saved logos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedLogos(parsed);
          setCurrentLogo(parsed[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load saved logos:', e);
    }
  }, []);

  // Save logos to localStorage
  const persistLogos = (logos: GeneratedLogo[]) => {
    setSavedLogos(logos);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logos));
    } catch (e) {
      console.warn('LocalStorage limit or error:', e);
    }
  };

  // Form update handler
  const handleFormChange = (updates: Partial<LogoFormState>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  // Handle preset sample selection
  const handleSelectSample = (sample: (typeof SAMPLE_COMPANIES)[0]) => {
    setForm({
      companyName: sample.companyName,
      tagline: sample.tagline,
      industry: sample.industry,
      description: sample.description,
      style: sample.style,
      colorPalette: sample.colorPalette,
      customColors: '',
      imageSize: sample.imageSize,
      symbolType: sample.symbolType,
      additionalPrompt: sample.additionalPrompt,
    });
  };

  // Submit Logo Generation (gemini-3-pro-image-preview with 1K, 2K, 4K affordance)
  const handleGenerateLogo = async () => {
    setIsGeneratingLogo(true);
    setLogoError(null);

    try {
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || !data.image) {
        throw new Error(data.error || 'Failed to generate logo image.');
      }

      const newLogo: GeneratedLogo = {
        id: `logo_${Date.now()}`,
        companyName: form.companyName,
        tagline: form.tagline,
        industry: form.industry,
        style: form.style,
        imageUrl: data.image,
        promptUsed: data.promptUsed,
        size: data.size || form.imageSize,
        createdAt: Date.now(),
        videos: [],
      };

      setCurrentLogo(newLogo);
      persistLogos([newLogo, ...savedLogos]);
    } catch (err: any) {
      console.error('Logo generation error:', err);
      setLogoError(err?.message || 'Failed to generate logo. Please try again.');
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  // Trigger Gemini 3.8 Flash concept suggestion
  const handleBrainstormConcepts = async () => {
    if (!form.companyName.trim()) return;
    setIsBrainstorming(true);
    setIsConceptModalOpen(true);
    setConcepts([]);

    try {
      const res = await fetch('/api/suggest-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.companyName,
          industry: form.industry,
          description: form.description,
        }),
      });

      const data = await res.json();
      if (data.concepts && Array.isArray(data.concepts)) {
        setConcepts(data.concepts);
      }
    } catch (err) {
      console.error('Brainstorm error:', err);
    } finally {
      setIsBrainstorming(false);
    }
  };

  // Apply chosen concept into form
  const handleApplyConcept = (concept: ConceptSuggestion) => {
    setForm((prev) => ({
      ...prev,
      tagline: concept.tagline || prev.tagline,
      style: concept.recommendedStyle || prev.style,
      additionalPrompt: `${concept.promptAddition} Visual metaphor: ${concept.symbolMetaphor}.`,
    }));
  };

  // Callback when a Veo video is generated from modal
  const handleVideoCreated = (
    logoId: string,
    videoUrl: string,
    operationName: string,
    prompt: string,
    aspectRatio: AspectRatio
  ) => {
    const updated = savedLogos.map((l) => {
      if (l.id === logoId) {
        const newVideo = {
          id: `vid_${Date.now()}`,
          videoUrl,
          operationName,
          prompt,
          aspectRatio,
          createdAt: Date.now(),
        };
        const updatedLogo = {
          ...l,
          videos: [newVideo, ...(l.videos || [])],
        };
        if (currentLogo?.id === logoId) {
          setCurrentLogo(updatedLogo);
        }
        return updatedLogo;
      }
      return l;
    });

    persistLogos(updated);
  };

  // Callback when video created from Upload tab
  const handleUploadVideoCreated = (videoData: {
    videoUrl: string;
    operationName: string;
    prompt: string;
    aspectRatio: AspectRatio;
    companyName: string;
    imageUrl: string;
  }) => {
    const newLogoItem: GeneratedLogo = {
      id: `upload_${Date.now()}`,
      companyName: videoData.companyName,
      imageUrl: videoData.imageUrl,
      promptUsed: videoData.prompt,
      size: '2K',
      createdAt: Date.now(),
      videos: [
        {
          id: `vid_${Date.now()}`,
          videoUrl: videoData.videoUrl,
          operationName: videoData.operationName,
          prompt: videoData.prompt,
          aspectRatio: videoData.aspectRatio,
          createdAt: Date.now(),
        },
      ],
    };

    setCurrentLogo(newLogoItem);
    persistLogos([newLogoItem, ...savedLogos]);
    setActiveTab('showcase');
  };

  const handleDeleteLogo = (logoId: string) => {
    const remaining = savedLogos.filter((l) => l.id !== logoId);
    persistLogos(remaining);
    if (currentLogo?.id === logoId) {
      setCurrentLogo(remaining[0] || null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectSample={handleSelectSample}
        savedCount={savedLogos.length}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'designer' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Generation AI Brand Studio</span>
                <span className="text-zinc-500">&bull;</span>
                <span className="text-pink-300 font-mono">Veo 3.1 &amp; Gemini 3 Pro</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Design Your Brand Logo &amp;{' '}
                <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
                  Animate into Video
                </span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
                Generate high-resolution corporate logos in 1K, 2K, or 4K with{' '}
                <span className="text-zinc-200 font-medium">Gemini 3 Pro</span>, then transform them into broadcast-grade 16:9 or 9:16 videos with{' '}
                <span className="text-pink-300 font-medium">Veo 3.1 Fast</span>.
              </p>
            </div>

            {/* Error Display */}
            {logoError && (
              <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-200 text-sm flex items-start space-x-3 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold">Logo Generation Error</div>
                  <div className="text-xs text-red-300 mt-0.5">{logoError}</div>
                </div>
              </div>
            )}

            {/* Split Grid: Form Controls vs Live Logo Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form (5 cols on lg) */}
              <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800/90 rounded-3xl p-6 sm:p-7 shadow-xl">
                <LogoForm
                  form={form}
                  onChange={handleFormChange}
                  onSubmit={handleGenerateLogo}
                  onOpenConcepts={handleBrainstormConcepts}
                  isGenerating={isGeneratingLogo}
                  isBrainstorming={isBrainstorming}
                />
              </div>

              {/* Viewer (6 cols on lg) */}
              <div className="lg:col-span-6 sticky top-24">
                {currentLogo ? (
                  <LogoViewer
                    logo={currentLogo}
                    onOpenAnimator={() => {
                      setVeoTargetLogo(currentLogo);
                      setIsVeoModalOpen(true);
                    }}
                  />
                ) : (
                  /* Empty state placeholder */
                  <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[480px] space-y-5">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-950 to-purple-950 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl">
                      <Sparkles className="w-10 h-10 animate-pulse" />
                    </div>
                    <div className="space-y-1.5 max-w-sm">
                      <h3 className="text-lg font-bold text-white">Your Logo Canvas</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Fill in your company details and click &ldquo;Design Logo&rdquo; to generate with{' '}
                        <span className="text-indigo-400 font-mono">gemini-3-pro-image-preview</span> in 1K, 2K, or 4K.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleGenerateLogo}
                        className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Demo Logo (Apex Quantum)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <UploadAnimatorView onVideoCreated={handleUploadVideoCreated} />
        )}

        {activeTab === 'showcase' && (
          <ShowcaseGallery
            logos={savedLogos}
            onSelectLogo={(logo) => {
              setCurrentLogo(logo);
              setActiveTab('designer');
            }}
            onDeleteLogo={handleDeleteLogo}
            onOpenAnimatorForLogo={(logo) => {
              setVeoTargetLogo(logo);
              setIsVeoModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-400">LogoCraft AI Studio</span>
            <span>&bull;</span>
            <span>Powered by Google Gemini 3 Pro &amp; Veo 3.1</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-500">
            <span>Model: gemini-3-pro-image-preview (1K/2K/4K)</span>
            <span>&bull;</span>
            <span>Model: veo-3.1-fast-generate-preview (16:9 / 9:16)</span>
          </div>
        </div>
      </footer>

      {/* Concept Brainstorm Modal */}
      <ConceptModal
        isOpen={isConceptModalOpen}
        onClose={() => setIsConceptModalOpen(false)}
        concepts={concepts}
        isLoading={isBrainstorming}
        onApplyConcept={handleApplyConcept}
        companyName={form.companyName}
      />

      {/* Veo Video Animator Modal */}
      <VeoAnimatorModal
        isOpen={isVeoModalOpen}
        onClose={() => setIsVeoModalOpen(false)}
        logo={veoTargetLogo}
        onVideoCreated={handleVideoCreated}
      />
    </div>
  );
}
