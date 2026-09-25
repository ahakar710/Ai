import React from 'react';
import {
  Sparkles,
  Wand2,
  Sliders,
  Palette,
  Layers,
  HelpCircle,
  Cpu,
  Monitor,
  Maximize2,
} from 'lucide-react';
import { LogoFormState, ImageSize } from '../types';
import { INDUSTRIES, LOGO_STYLES, COLOR_PALETTES, SYMBOL_TYPES } from '../constants';

interface LogoFormProps {
  form: LogoFormState;
  onChange: (updates: Partial<LogoFormState>) => void;
  onSubmit: () => void;
  onOpenConcepts: () => void;
  isGenerating: boolean;
  isBrainstorming: boolean;
}

export const LogoForm: React.FC<LogoFormProps> = ({
  form,
  onChange,
  onSubmit,
  onOpenConcepts,
  isGenerating,
  isBrainstorming,
}) => {
  const quickIdeas = [
    'Interlocking geometric cubes with glowing core',
    'Minimalist soaring falcon in golden ratio',
    'Prismatic quartz crystal refracting light',
    'Fluid wave gradient forming lettermark',
    'Cybernetic neural tree with binary roots',
    'Heritage lion crest with beveled shield',
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      {/* Top Banner / Model Badge */}
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-zinc-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white">Gemini 3 Pro Image Generator</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                gemini-3-pro-image-preview
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Generating ultra-sharp, publication-ready vector branding
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenConcepts}
          disabled={!form.companyName.trim() || isBrainstorming}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{isBrainstorming ? 'Thinking...' : 'AI Brainstorm Concepts'}</span>
        </button>
      </div>

      {/* Row 1: Company Name & Tagline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
            Company Name <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="e.g. Apex Quantum, Solaria, Lumina"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-zinc-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
            Tagline / Slogan <span className="text-zinc-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="e.g. Beyond the Horizon"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-zinc-500 transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Industry & Resolution (1K, 2K, 4K) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
            Industry / Domain
          </label>
          <select
            value={form.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white transition-colors"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE SIZE / RESOLUTION SELECTOR: 1K, 2K, 4K (REQUIRED AFFORDANCE) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
              <span>Image Resolution</span>
              <span className="text-[10px] text-indigo-400 font-mono">(gemini-3-pro-image-preview)</span>
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['1K', '2K', '4K'] as ImageSize[]).map((sz) => {
              const pixelMap: Record<ImageSize, string> = {
                '1K': '1024 x 1024',
                '2K': '2048 x 2048',
                '4K': '4096 x 4096',
              };
              const isSelected = form.imageSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onChange({ imageSize: sz })}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <Maximize2 className={`w-3 h-3 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <span className="text-xs font-bold">{sz}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{pixelMap[sz]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Description & Visual Metaphor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Company Description &amp; Visual Concept <span className="text-pink-500">*</span>
          </label>
          <span className="text-[11px] text-zinc-500">What does your company do and symbolize?</span>
        </div>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="e.g. Next-generation aerospace drone logistics. We focus on supersonic speed, safety, and green propulsion. We want a dynamic falcon or aerodynamic arrow motif with clean symmetry."
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-zinc-500 transition-colors"
        />

        {/* Quick prompt chips */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-500 mr-1">Quick Metaphors:</span>
          {quickIdeas.slice(0, 4).map((idea, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const newDesc = form.description ? `${form.description}. ${idea}` : idea;
                onChange({ description: newDesc });
              }}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              + {idea.split(' ')[0]} {idea.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Logo Structure Type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
          Logo Structure &amp; Format
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SYMBOL_TYPES.map((st) => {
            const isSelected = form.symbolType === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onChange({ symbolType: st.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-indigo-500 ring-1 ring-indigo-500/50 text-white'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-semibold truncate">{st.label}</div>
                <div className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5 leading-tight">
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 5: Visual Style Presets */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
          Artistic Style Aesthetic
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {LOGO_STYLES.map((style) => {
            const isSelected = form.style === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ style: style.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950/70 to-zinc-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-white' : 'text-zinc-300'
                    }`}
                  >
                    {style.label}
                  </span>
                </div>
                <span className="text-[10px] inline-block px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono mt-1">
                  {style.badge}
                </span>
                <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{style.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 6: Color Palette */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            <span>Color Mood &amp; Palette</span>
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {COLOR_PALETTES.map((cp) => {
            const isSelected = form.colorPalette === cp.id;
            return (
              <button
                key={cp.id}
                type="button"
                onClick={() => onChange({ colorPalette: cp.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-indigo-500 ring-1 ring-indigo-500/50 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center space-x-1 mb-1.5">
                  {cp.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="text-xs font-medium text-zinc-200 truncate">{cp.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{cp.desc}</div>
              </button>
            );
          })}
        </div>

        {form.colorPalette === 'custom' && (
          <div className="mt-2.5">
            <input
              type="text"
              value={form.customColors}
              onChange={(e) => onChange({ customColors: e.target.value })}
              placeholder="e.g. Deep Sapphire #0F2027, Bright Gold #FFD700, Pure White"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-500 text-xs text-white placeholder-zinc-500"
            />
          </div>
        )}
      </div>

      {/* Row 7: Additional Direction */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
          Specific Art Direction <span className="text-zinc-500 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={form.additionalPrompt}
          onChange={(e) => onChange({ additionalPrompt: e.target.value })}
          placeholder="e.g. Crisp white background, golden ratio spiral, subtle 3D metallic embossing"
          className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-500 text-xs text-white placeholder-zinc-500"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isGenerating || !form.companyName.trim() || !form.description.trim()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2.5 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating {form.imageSize} Logo with Gemini 3 Pro...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Design {form.imageSize} Logo for {form.companyName || 'Company'}</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-zinc-500 mt-2">
          Uses <span className="font-semibold text-zinc-400">gemini-3-pro-image-preview</span> with resolution affordance ({form.imageSize}). After generation, you can animate it in 1 click using Veo.
        </p>
      </div>
    </form>
  );
};
