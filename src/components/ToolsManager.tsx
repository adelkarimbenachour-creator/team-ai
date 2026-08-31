import React, { useState } from 'react';
import {
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Shield,
  ExternalLink,
  Plus,
  Lock,
  Zap,
  Globe,
  Database,
  Terminal,
  Mail,
  MessageSquare,
  DollarSign,
  Briefcase,
  Users,
} from 'lucide-react';
import { ToolIntegration } from '../types';

interface ToolsManagerProps {
  tools: ToolIntegration[];
  onToggleTool: (toolId: string) => void;
  onToggleApproval: (toolId: string) => void;
}

export const ToolsManager: React.FC<ToolsManagerProps> = ({
  tools,
  onToggleTool,
  onToggleApproval,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Tous les Outils (70+)' },
    { id: 'communication', label: 'Communication (Slack, Gmail...)' },
    { id: 'productivity', label: 'Productivité (Notion, Linear...)' },
    { id: 'system', label: 'Système & VM (Terminal, Navigateur...)' },
    { id: 'development', label: 'Développement (GitHub, SQL, Docker...)' },
    { id: 'sales', label: 'Ventes & CRM (Apollo, HubSpot...)' },
    { id: 'marketing', label: 'Marketing (Twitter, LinkedIn...)' },
    { id: 'finance', label: 'Finance (Stripe, QuickBooks...)' },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.actions.some((act) => act.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const connectedCount = tools.filter((t) => t.connected).length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h1 className="text-2xl font-black text-white tracking-tight">
                Suite d'Intégrations & Outils Métier
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Connectez les APIs de votre entreprise et donnez à vos employés IA les moyens d'agir en autonomie ou sous supervision humaine (Human-in-the-Loop).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 shrink-0">
            <span className="text-xs font-mono text-slate-400">Statut Réseau :</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {connectedCount}/{tools.length} Actifs
            </span>
          </div>
        </div>

        {/* Global Sandbox Guardrails Info */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Garde-fous de Sécurité :</strong> Chaque agent s'exécute dans une VM isolée. Vous pouvez exiger une validation humaine pour les actions sensibles.
            </span>
          </div>
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/20 whitespace-nowrap">
            Zero Data Leakage Policy
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher une API ou action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{tool.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                      {tool.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleTool(tool.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    tool.connected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {tool.connected ? 'Connecté' : 'Activer'}
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{tool.description}</p>

              {/* Supported Actions */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Actions Autorisées :</span>
                <div className="flex flex-wrap gap-1">
                  {tool.actions.map((act) => (
                    <span
                      key={act}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Approval Governance Toggle */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Approbation humaine requise</span>
              </span>
              <input
                type="checkbox"
                checked={tool.requiresApproval}
                onChange={() => onToggleApproval(tool.id)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
