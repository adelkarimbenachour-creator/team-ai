import React, { useState } from 'react';
import {
  Brain,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  Tag,
  Shield,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { AIEmployee, AgentMemory } from '../types';

interface AgentMemoryViewProps {
  employee: AIEmployee;
  memories: AgentMemory[];
  onAddMemory: (key: string, value: string, category: any) => void;
  onDeleteMemory: (id: string) => void;
}

export const AgentMemoryView: React.FC<AgentMemoryViewProps> = ({
  employee,
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [newCategory, setNewCategory] = useState<any>('user_preference');

  const agentMemories = memories.filter((m) => m.agentId === employee.id);

  const filteredMemories = agentMemories.filter((m) => {
    const matchesSearch =
      m.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    onAddMemory(newKey.trim(), newValue.trim(), newCategory);
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'core_directive':
        return { label: 'Directive Majeure', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'user_preference':
        return { label: 'Préférence Utilisateur', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'company_context':
        return { label: 'Contexte Entreprise', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'learned_rule':
        return { label: 'Règle Apprise', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: 'Général', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Mémoire Persistante & SOPs : {employee.name}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Base sémantique vectorielle stockée sur la VM de l'agent. Conserve le contexte, les consignes strictes et vos préférences entre chaque session.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Consigne</span>
        </button>
      </div>

      {/* Add Memory Modal/Inline Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300">Nouvelle Règle Mémorisée</span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Annuler
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slate-400 block mb-1">Clé d'identification / Concept</label>
              <input
                type="text"
                placeholder="ex: code_review_conventions"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Catégorie</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="core_directive">Directive Majeure</option>
                <option value="user_preference">Préférence Utilisateur</option>
                <option value="company_context">Contexte Entreprise</option>
                <option value="learned_rule">Règle Apprise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Instruction détaillée / Valeur</label>
            <textarea
              rows={2}
              placeholder="Décrivez la consigne précise que l'agent doit toujours respecter lors de ses tâches..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
            >
              Enregistrer dans la VM
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher dans la mémoire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['all', 'core_directive', 'user_preference', 'company_context', 'learned_rule'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all'
                ? 'Tout'
                : cat === 'core_directive'
                ? 'Directives'
                : cat === 'user_preference'
                ? 'Préférences'
                : cat === 'company_context'
                ? 'Contexte'
                : 'Règles Apprises'}
            </button>
          ))}
        </div>
      </div>

      {/* Memories List */}
      <div className="space-y-3">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-400">Aucune consigne trouvée</p>
            <p className="text-[11px] text-slate-500 mt-1">Ajoutez des règles pour personnaliser le comportement autonome de cet agent.</p>
          </div>
        ) : (
          filteredMemories.map((mem) => {
            const badge = getCategoryBadge(mem.category);
            return (
              <div
                key={mem.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white">{mem.key}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(mem.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{mem.value}</p>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onDeleteMemory(mem.id)}
                    className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                    title="Supprimer cette mémoire"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
