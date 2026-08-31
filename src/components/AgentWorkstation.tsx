import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Terminal as TerminalIcon,
  Globe,
  Brain,
  MessageSquare,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Send,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers,
  Cpu,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import {
  AIEmployee,
  AgentTask,
  AgentMemory,
  ChatMessage,
  TaskArtifact,
  TaskStep,
} from '../types';
import { LiveBrowserView } from './LiveBrowserView';
import { AgentTerminalView } from './AgentTerminalView';
import { AgentMemoryView } from './AgentMemoryView';

interface AgentWorkstationProps {
  employee: AIEmployee;
  onUpdateEmployee: (emp: AIEmployee) => void;
  tasks: AgentTask[];
  onStartNewTask: (prompt: string) => Promise<void>;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  memories: AgentMemory[];
  onAddMemory: (key: string, value: string, category: any) => void;
  onDeleteMemory: (id: string) => void;
  onOpenCronModal: () => void;
}

export const AgentWorkstation: React.FC<AgentWorkstationProps> = ({
  employee,
  onUpdateEmployee,
  tasks,
  onStartNewTask,
  chatMessages,
  onSendMessage,
  memories,
  onAddMemory,
  onDeleteMemory,
  onOpenCronModal,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'browser' | 'terminal' | 'memory'>('chat');
  const [chatInput, setChatInput] = useState<string>('');
  const [isSubmittingChat, setIsSubmittingChat] = useState<boolean>(false);
  const [taskPromptInput, setTaskPromptInput] = useState<string>('');
  const [isLaunchingTask, setIsLaunchingTask] = useState<boolean>(false);
  const [selectedArtifact, setSelectedArtifact] = useState<TaskArtifact | null>(null);
  const [copiedArtifactId, setCopiedArtifactId] = useState<string | null>(null);

  // Active task for this employee
  const currentTask = tasks.find((t) => t.agentId === employee.id && t.status === 'running') ||
    tasks.find((t) => t.agentId === employee.id) ||
    tasks[0];

  const agentMessages = chatMessages.filter((m) => m.agentId === employee.id);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSubmittingChat) return;

    const messageText = chatInput.trim();
    setChatInput('');
    setIsSubmittingChat(true);
    try {
      await onSendMessage(messageText);
    } finally {
      setIsSubmittingChat(false);
    }
  };

  const handleLaunchQuickTask = async (prompt: string) => {
    setIsLaunchingTask(true);
    try {
      await onStartNewTask(prompt);
    } finally {
      setIsLaunchingTask(false);
      setTaskPromptInput('');
    }
  };

  const handleCopyArtifact = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifactId(id);
    setTimeout(() => setCopiedArtifactId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Tâche en cours d'exécution</span>
          </span>
        );
      case 'waiting_approval':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Approbation requise</span>
          </span>
        );
      case 'paused':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>VM en pause</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Prêt / En veille active</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Employee Master Cockpit Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Agent Identity & Specs */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={employee.avatar}
                alt={employee.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/10"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    employee.status === 'running'
                      ? 'bg-emerald-400 animate-pulse'
                      : employee.status === 'waiting_approval'
                      ? 'bg-amber-400'
                      : 'bg-indigo-400'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
                  {employee.name}
                </h1>
                {getStatusBadge(employee.status)}
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                  {employee.model}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-indigo-400">
                {employee.roleTitle}
              </p>

              <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl">
                {employee.bio}
              </p>
            </div>
          </div>

          {/* VM Health & Key Performance Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>VM Sandbox</span>
              </div>
              <p className="text-xs font-bold text-white font-mono">{employee.vm.ip}</p>
              <span className="text-[10px] text-slate-500 block truncate">{employee.vm.os.split(' ')[0]}</span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ressources</span>
              </div>
              <p className="text-xs font-bold text-emerald-400 font-mono">
                {employee.vm.cpuUsage}% CPU • {employee.vm.memoryUsageMb} MB
              </p>
              <span className="text-[10px] text-slate-500 block">Uptime: {employee.vm.uptimeHours}h</span>
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Économie Générée</span>
              </div>
              <p className="text-xs font-bold text-amber-300 font-mono">
                {(employee.hoursWorkedTotal * employee.hourlyBenchmarkRate).toLocaleString('fr-FR')} €
              </p>
              <span className="text-[10px] text-slate-500 block">{employee.tasksCompletedCount} missions closes</span>
            </div>
          </div>
        </div>

        {/* Workstation Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          <button
            type="button"
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion & Missions</span>
          </button>

          <button
            type="button"
            id="tab-browser"
            onClick={() => setActiveTab('browser')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'browser'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Navigateur Live VM</span>
          </button>

          <button
            type="button"
            id="tab-terminal"
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'terminal'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <TerminalIcon className="w-4 h-4" />
            <span>Terminal & Shell Linux</span>
          </button>

          <button
            type="button"
            id="tab-memory"
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'memory'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Mémoire Persistante ({memories.filter((m) => m.agentId === employee.id).length})</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area & Active Task Progress Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left / Center View: Primary Work Content */}
        <div className="xl:col-span-8 space-y-6">
          {activeTab === 'chat' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Proactive Task Dispatcher Bar */}
              <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/40 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      Déléguer une Mission Autonome
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Exécution en arrière-plan sur VM</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={taskPromptInput}
                    onChange={(e) => setTaskPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && taskPromptInput.trim()) {
                        handleLaunchQuickTask(taskPromptInput.trim());
                      }
                    }}
                    placeholder={`Ex: "Analyse nos logs de la journée et soumets une PR avec les correctifs"...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    disabled={isLaunchingTask || !taskPromptInput.trim()}
                    onClick={() => handleLaunchQuickTask(taskPromptInput.trim())}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shrink-0"
                  >
                    {isLaunchingTask ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>Lancer la Tâche</span>
                  </button>
                </div>

                {/* Suggested prompt chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">Suggestions :</span>
                  {employee.capabilities.slice(0, 3).map((cap, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTaskPromptInput(`Exécute : ${cap}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] text-indigo-300 whitespace-nowrap transition-colors"
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread with the AI Employee */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <span>Conversation & Instructions Directes</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Canal: Web Dashboard</span>
                </div>

                <div className="h-96 overflow-y-auto space-y-4 pr-2">
                  {agentMessages.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      <p>Aucun message récent. Discutez directement avec {employee.name} pour lui confier vos missions.</p>
                    </div>
                  ) : (
                    agentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender === 'agent' && (
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-xl object-cover shrink-0 border border-indigo-500/30"
                          />
                        )}

                        <div
                          className={`max-w-lg rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                              : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                          }`}
                        >
                          <p>{msg.text}</p>

                          {msg.toolCalls && msg.toolCalls.length > 0 && (
                            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 space-y-1">
                              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                                Outils Invoqués sur la VM :
                              </span>
                              {msg.toolCalls.map((tc, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>{tc.tool} &rarr; {tc.action}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <span className="text-[10px] text-slate-400 block text-right font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isSubmittingChat}
                    placeholder={`Message à ${employee.name}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingChat || !chatInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
                  >
                    {isSubmittingChat ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Envoyer</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'browser' && <LiveBrowserView employee={employee} />}
          {activeTab === 'terminal' && <AgentTerminalView employee={employee} />}
          {activeTab === 'memory' && (
            <AgentMemoryView
              employee={employee}
              memories={memories}
              onAddMemory={onAddMemory}
              onDeleteMemory={onDeleteMemory}
            />
          )}
        </div>

        {/* Right Side Column: Live Execution Stream & Artifacts Inspector */}
        <div className="xl:col-span-4 space-y-6">
          {/* Active Task Execution Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Tracé d'Exécution Autonome
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {currentTask ? `${currentTask.steps.length} étapes` : 'En attente'}
              </span>
            </div>

            {currentTask ? (
              <div className="space-y-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-white mb-1">{currentTask.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{currentTask.description}</p>
                </div>

                {/* Steps Trace Timeline */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {currentTask.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                          {step.status === 'completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                          )}
                          Étape {idx + 1} : {step.type}
                        </span>
                        {step.durationMs && (
                          <span className="text-[10px] text-slate-500 font-mono">{step.durationMs}ms</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono pl-5">{step.title}</p>
                    </div>
                  ))}
                </div>

                {/* Artifacts Generated */}
                {currentTask.artifacts && currentTask.artifacts.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
                      Livrables Disponibles ({currentTask.artifacts.length})
                    </span>
                    {currentTask.artifacts.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArtifact(art)}
                        className="bg-slate-950 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {art.title}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                Aucune tâche en cours. Lancez une mission ci-contre.
              </div>
            )}
          </div>

          {/* Connected Tools & Channels quick summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Outils & Canaux Connectés</span>
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {employee.toolsConnected.map((toolId) => (
                <span
                  key={toolId}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {toolId.replace('tool-', '')}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Canaux : Slack, Gmail, Telegram</span>
              <button
                type="button"
                onClick={onOpenCronModal}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                <span>Gérer Cron</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artifact Viewer Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">{selectedArtifact.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyArtifact(selectedArtifact.content, selectedArtifact.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1"
                >
                  {copiedArtifactId === selectedArtifact.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedArtifactId === selectedArtifact.id ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArtifact(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/50">
              {selectedArtifact.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
