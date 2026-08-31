import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  Sparkles,
  Cpu,
  Clock,
  Euro,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Filter,
  Shield,
  Layers,
  Terminal,
} from 'lucide-react';
import { AIEmployee } from '../types';

interface AgentRosterProps {
  employees: AIEmployee[];
  onSelectEmployee: (id: string) => void;
  onOpenHireModal: () => void;
}

export const AgentRoster: React.FC<AgentRosterProps> = ({
  employees,
  onSelectEmployee,
  onOpenHireModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalHours = employees.reduce((acc, curr) => acc + curr.hoursWorkedTotal, 0);
  const totalValueSaved = employees.reduce(
    (acc, curr) => acc + curr.hoursWorkedTotal * curr.hourlyBenchmarkRate,
    0
  );
  const totalTasks = employees.reduce((acc, curr) => acc + curr.tasksCompletedCount, 0);

  const filteredEmployees = employees.filter((emp) => {
    const matchesCategory = selectedCategory === 'all' || emp.category === selectedCategory;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'Toute l’Équipe' },
    { id: 'engineering', label: 'Ingénierie & DevOps' },
    { id: 'operations', label: 'Opérations & EA' },
    { id: 'marketing', label: 'Marketing & Croissance' },
    { id: 'sales', label: 'Ventes & Prospection' },
    { id: 'finance', label: 'Finance & RevOps' },
    { id: 'support', label: 'Support & Succès Client' },
  ];

  return (
    <div className="space-y-8">
      {/* Platform ROI & Collective Workforce Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Organigramme Autonome
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
              Équipe d'Employés IA en Poste
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Vos collaborateurs IA opèrent 24h/24 dans des bacs à sable Linux dédiés. Ils disposent d'un navigateur live, de mémoire persistante et de plus de 70 intégrations métier.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenHireModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-indigo-200" />
            <span>Recruter un Nouvel Employé</span>
          </button>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Employés IA Actifs
            </span>
            <p className="text-xl font-black text-white font-mono">{employees.length}</p>
            <span className="text-[10px] text-emerald-400 font-semibold">100% opérationnels</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Heures Travaillées
            </span>
            <p className="text-xl font-black text-indigo-300 font-mono">{totalHours.toLocaleString('fr-FR')} h</p>
            <span className="text-[10px] text-slate-500 font-medium">Temps cumulé VM</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Missions Clôturées
            </span>
            <p className="text-xl font-black text-emerald-400 font-mono">{totalTasks}</p>
            <span className="text-[10px] text-slate-500 font-medium">Tâches exécutées</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Économie Équivalent RH
            </span>
            <p className="text-xl font-black text-amber-300 font-mono">
              ~{totalValueSaved.toLocaleString('fr-FR')} €
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Benchmark salarial</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
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

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher un employé ou rôle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => onSelectEmployee(emp.id)}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition-all flex flex-col justify-between group space-y-5"
          >
            {/* Top Employee Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-800 group-hover:border-indigo-500/50 transition-colors"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        emp.status === 'running'
                          ? 'bg-emerald-400 animate-pulse'
                          : emp.status === 'waiting_approval'
                          ? 'bg-amber-400'
                          : 'bg-indigo-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-400">{emp.roleTitle}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{emp.vm.os.split(' ')[0]} VM</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                  {emp.model}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {emp.bio}
              </p>

              {/* Key Capabilities Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Compétences Clés :
                </span>
                <div className="flex flex-wrap gap-1">
                  {emp.capabilities.slice(0, 3).map((cap, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 truncate max-w-full"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer & Stats */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{emp.hoursWorkedTotal}h enregistrées</span>
                <span className="text-amber-300 font-bold">
                  {(emp.hoursWorkedTotal * emp.hourlyBenchmarkRate).toLocaleString('fr-FR')} € éco.
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {emp.toolsConnected.slice(0, 4).map((toolId) => (
                    <span
                      key={toolId}
                      className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-mono"
                      title={toolId}
                    >
                      {toolId.replace('tool-', '').slice(0, 2).toUpperCase()}
                    </span>
                  ))}
                  {emp.toolsConnected.length > 4 && (
                    <span className="text-[10px] text-slate-500 font-mono pl-1">
                      +{emp.toolsConnected.length - 4}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  <span>Ouvrir l'Espace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
