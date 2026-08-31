import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCode,
  Mail,
  GitPullRequest,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { ApprovalRequest, AIEmployee } from '../types';

interface ApprovalsInboxProps {
  approvals: ApprovalRequest[];
  employees: AIEmployee[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ApprovalsInbox: React.FC<ApprovalsInboxProps> = ({
  approvals,
  employees,
  onApprove,
  onReject,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(approvals[0]?.id || null);

  const filteredApprovals = approvals.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">Risque Élevé</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">Risque Modéré</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">Faible Risque</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-black text-white tracking-tight">
                Centre d'Approbation & Gouvernance
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Supervision humaine en temps réel (Human-in-the-loop). Validez les actions à fort impact préparées par vos employés IA avant leur exécution définitive.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
              {pendingCount} en attente de décision
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st === 'pending'
                ? `En Attente (${pendingCount})`
                : st === 'approved'
                ? 'Approuvées'
                : st === 'rejected'
                ? 'Rejetées'
                : 'Toutes les Décisions'}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800/80 space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Toutes les actions sont traitées</h3>
            <p className="text-xs text-slate-400">Aucune demande d'approbation en attente pour le moment.</p>
          </div>
        ) : (
          filteredApprovals.map((item) => {
            const agent = employees.find((e) => e.id === item.agentId);
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all"
              >
                <div className="p-6 space-y-4">
                  {/* Top line info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {agent && (
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{item.title}</h3>
                          {getRiskBadge(item.riskLevel)}
                        </div>
                        <p className="text-xs text-indigo-400 font-medium">
                          Initié par {agent?.name || 'Agent'} ({agent?.roleTitle})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center font-mono text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(item.requestedAt).toLocaleTimeString('fr-FR')}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                    {item.details}
                  </p>

                  {/* Expandable Payload Inspector */}
                  {item.payload && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Masquer les données d’exécution' : 'Inspecter la charge utile (Payload)'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                          {JSON.stringify(item.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {item.status === 'pending' && (
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => onReject(item.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Refuser la Requête</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onApprove(item.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approuver & Exécuter</span>
                      </button>
                    </div>
                  )}

                  {item.status === 'approved' && (
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Action approuvée et exécutée sur la VM avec succès</span>
                    </div>
                  )}

                  {item.status === 'rejected' && (
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs font-bold text-rose-400 font-mono">
                      <XCircle className="w-4 h-4" />
                      <span>Action rejetée par l’administrateur</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
