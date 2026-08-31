import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { EmployeeTemplate, AIEmployee } from '../types';
import { EMPLOYEE_TEMPLATES } from '../data/mockAgents';

interface HireAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHireTemplate: (template: EmployeeTemplate) => void;
  onHireCustom: (prompt: string) => Promise<void>;
}

export const HireAgentModal: React.FC<HireAgentModalProps> = ({
  isOpen,
  onClose,
  onHireTemplate,
  onHireCustom,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      await onHireCustom(customPrompt.trim());
      setCustomPrompt('');
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Recruter un Employé IA Autonome</h2>
              <p className="text-xs text-slate-400">Déployez un agent dédié avec sa propre VM Linux, son navigateur et ses outils.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-950/60 px-6 py-3 border-b border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Modèles de Postes Prédéfinis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Créer en Langage Naturel</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EMPLOYEE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={tmpl.avatar}
                          alt={tmpl.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {tmpl.name}
                          </h3>
                          <span className="text-xs text-indigo-400 font-semibold">{tmpl.roleTitle}</span>
                        </div>
                      </div>
                      {tmpl.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {tmpl.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{tmpl.summary}</p>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Missions Types :</span>
                      <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                        {tmpl.defaultCapabilities.slice(0, 3).map((cap, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      Équiv. {tmpl.benchmarkSalary}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onHireTemplate(tmpl);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      Embaucher Immédiatement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Décrivez le profil idéal pour votre entreprise</span>
                </div>
                <p className="text-xs text-slate-400">
                  Notre moteur IA configurera automatiquement le persona, la machine virtuelle, les permissions d'outils et le prompt système de l'agent.
                </p>

                <textarea
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={`Ex: "Je veux un responsable juridique & conformité RGPD qui audite nos contrats de vente, analyse nos CGU et nous alerte sur Slack en cas de clause à risque."`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">Modèle : Gemini 3.7 Flash (Zero Cost)</span>
                  <button
                    type="submit"
                    disabled={isGenerating || !customPrompt.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Création de l'Employé IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Générer & Déployer l'Agent</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
