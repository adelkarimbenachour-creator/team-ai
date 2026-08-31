import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import { ScheduledJob, AIEmployee } from '../types';

interface ScheduledJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: ScheduledJob[];
  employees: AIEmployee[];
  onToggleJob: (id: string) => void;
  onAddJob: (job: Omit<ScheduledJob, 'id'>) => void;
  onDeleteJob: (id: string) => void;
}

export const ScheduledJobsModal: React.FC<ScheduledJobsModalProps> = ({
  isOpen,
  onClose,
  jobs,
  employees,
  onToggleJob,
  onAddJob,
  onDeleteJob,
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(employees[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [cronExpression, setCronExpression] = useState<string>('0 8 * * 1-5');
  const [description, setDescription] = useState<string>('');
  const [taskPrompt, setTaskPrompt] = useState<string>('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !taskPrompt.trim()) return;

    onAddJob({
      agentId: selectedAgentId,
      title: title.trim(),
      cronExpression: cronExpression.trim(),
      description: description.trim() || title.trim(),
      enabled: true,
      nextRun: new Date(Date.now() + 86400000).toISOString(),
      taskPrompt: taskPrompt.trim(),
    });

    setTitle('');
    setDescription('');
    setTaskPrompt('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Tâches Récurrentes (Cron & Heartbeats)</h2>
              <p className="text-xs text-slate-400">Automatisez les routines quotidiennes et hebdomadaires de vos agents.</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Create Button & Form */}
          {!isCreating ? (
            <div className="flex justify-between items-center bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Planifier une nouvelle routine</span>
                <span className="text-[11px] text-slate-400">Exécution en arrière-plan sans intervention humaine.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Cron Job</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">Configurer la Tâche Récurrente</span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Employé IA Assigné</label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.roleTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Expression Cron (ex: 0 8 * * 1-5)</label>
                  <input
                    type="text"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    placeholder="0 8 * * 1-5"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Titre de la Routine</label>
                <input
                  type="text"
                  placeholder="ex: Synthèse des tickets clients de la nuit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Prompt de Mission Autonome</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez précisément ce que l'agent doit faire à chaque déclenchement..."
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
                >
                  Enregistrer & Activer
                </button>
              </div>
            </form>
          )}

          {/* Existing Jobs List */}
          <div className="space-y-3">
            {jobs.map((job) => {
              const agent = employees.find((e) => e.id === job.agentId);
              return (
                <div
                  key={job.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {agent && (
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-xl object-cover border border-slate-800"
                        />
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white">{job.title}</h4>
                        <span className="text-xs text-indigo-400">{agent?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        {job.cronExpression}
                      </span>
                      <input
                        type="checkbox"
                        checked={job.enabled}
                        onChange={() => onToggleJob(job.id)}
                        className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-800 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => onDeleteJob(job.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">{job.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
