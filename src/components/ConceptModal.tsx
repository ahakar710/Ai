import React from 'react';
import { Sparkles, X, Check, Film, Lightbulb, Palette, ArrowRight } from 'lucide-react';
import { ConceptSuggestion } from '../types';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: ConceptSuggestion[];
  isLoading: boolean;
  onApplyConcept: (concept: ConceptSuggestion) => void;
  companyName: string;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  isOpen,
  onClose,
  concepts,
  isLoading,
  onApplyConcept,
  companyName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                AI Brand Concept Director
              </h3>
              <p className="text-xs text-zinc-400">
                Tailored brand identities &amp; animation directions for &ldquo;{companyName}&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="text-sm font-medium text-zinc-300">
                Crafting distinct creative directions and symbol metaphors...
              </p>
              <p className="text-xs text-zinc-500">
                Powered by Gemini 3.8 Flash creative branding engine
              </p>
            </div>
          ) : concepts.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No concepts available yet. Click &ldquo;Suggest Concepts&rdquo; with your company name to generate ideas.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {concepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/5 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                        Concept {idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white text-base group-hover:text-purple-300 transition-colors">
                        {concept.title}
                      </h4>
                      {concept.tagline && (
                        <p className="text-xs italic text-indigo-400 mt-0.5">
                          &ldquo;{concept.tagline}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start space-x-2 text-zinc-300">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{concept.symbolMetaphor}</span>
                      </div>

                      <div className="flex items-start space-x-2 text-zinc-400">
                        <Palette className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{concept.colorTheme}</span>
                      </div>

                      <div className="flex items-start space-x-2 text-zinc-400">
                        <Film className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-pink-300/90">{concept.animationIdea}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onApplyConcept(concept);
                      onClose();
                    }}
                    className="mt-5 w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-purple-600 text-zinc-200 hover:text-white text-xs font-semibold transition-all group-hover:border-purple-500/40"
                  >
                    <span>Apply Concept</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
