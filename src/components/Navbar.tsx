import React from 'react';
import {
  Users,
  LayoutDashboard,
  ShieldCheck,
  Cpu,
  Clock,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  Terminal,
  Globe,
  Bell,
  ArrowUpRight,
} from 'lucide-react';
import { AIEmployee, ApprovalRequest } from '../types';

interface NavbarProps {
  activeView: 'workstation' | 'roster' | 'tools' | 'approvals' | 'cron';
  setActiveView: (view: 'workstation' | 'roster' | 'tools' | 'approvals' | 'cron') => void;
  employees: AIEmployee[];
  selectedEmployeeId: string;
  onSelectEmployee: (id: string) => void;
  approvals: ApprovalRequest[];
  onOpenHireModal: () => void;
  onOpenCronModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  approvals,
  onOpenHireModal,
  onOpenCronModal,
}) => {
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const currentEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform identity */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveView('workstation')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                T
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white font-sans">
                    Team<span className="text-indigo-400">-Ai</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    AI Coworkers
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Plateforme d'Employés IA Autonomes
                </span>
              </div>
            </div>

            {/* Main Navigation Views */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
              <button
                type="button"
                id="nav-workstation"
                onClick={() => setActiveView('workstation')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'workstation'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Espace de Travail</span>
              </button>

              <button
                type="button"
                id="nav-roster"
                onClick={() => setActiveView('roster')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'roster'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Équipe ({employees.length})</span>
              </button>

              <button
                type="button"
                id="nav-tools"
                onClick={() => setActiveView('tools')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'tools'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>70+ Outils</span>
              </button>

              <button
                type="button"
                id="nav-approvals"
                onClick={() => setActiveView('approvals')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  activeView === 'approvals'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Approbations</span>
                {pendingApprovalsCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-black rounded-full bg-amber-500 text-slate-950 font-mono">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                id="nav-cron"
                onClick={() => setActiveView('cron')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'cron'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Tâches Récurrentes</span>
              </button>
            </nav>
          </div>

          {/* Right Section: Active Employee Selector & CTA */}
          <div className="flex items-center gap-3">
            {/* Quick Employee Switcher */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Employé actif :</span>
              <div className="relative">
                <select
                  id="employee-selector"
                  value={selectedEmployeeId}
                  onChange={(e) => onSelectEmployee(e.target.value)}
                  className="bg-transparent text-xs font-bold text-indigo-300 focus:outline-none cursor-pointer pr-5 py-0.5"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-slate-900 text-slate-100">
                      {emp.name} ({emp.roleTitle})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="VM en ligne" />
            </div>

            {/* Primary Hire CTA Button */}
            <button
              type="button"
              id="btn-hire-employee"
              onClick={onOpenHireModal}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-indigo-200" />
              <span>Recruter un Employé IA</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none gap-2">
          <button
            type="button"
            onClick={() => setActiveView('workstation')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeView === 'workstation' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Espace de Travail
          </button>
          <button
            type="button"
            onClick={() => setActiveView('roster')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeView === 'roster' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Équipe ({employees.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('tools')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeView === 'tools' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            70+ Outils
          </button>
          <button
            type="button"
            onClick={() => setActiveView('approvals')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeView === 'approvals' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Approbations ({pendingApprovalsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('cron')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeView === 'cron' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Tâches Récurrentes
          </button>
        </div>
      </div>
    </header>
  );
};
