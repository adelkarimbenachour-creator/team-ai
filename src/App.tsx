import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AgentWorkstation } from './components/AgentWorkstation';
import { AgentRoster } from './components/AgentRoster';
import { ToolsManager } from './components/ToolsManager';
import { ApprovalsInbox } from './components/ApprovalsInbox';
import { ScheduledJobsModal } from './components/ScheduledJobsModal';
import { HireAgentModal } from './components/HireAgentModal';
import {
  INITIAL_EMPLOYEES,
  INITIAL_TASKS,
  INITIAL_MEMORIES,
  INITIAL_SCHEDULED_JOBS,
  INITIAL_APPROVALS,
  INITIAL_CHAT_MESSAGES,
  AVAILABLE_TOOLS,
} from './data/mockAgents';
import {
  AIEmployee,
  AgentTask,
  AgentMemory,
  ScheduledJob,
  ApprovalRequest,
  ChatMessage,
  ToolIntegration,
  EmployeeTemplate,
} from './types';

export default function App() {
  // Main Navigation View
  const [activeView, setActiveView] = useState<'workstation' | 'roster' | 'tools' | 'approvals' | 'cron'>('workstation');

  // Employees State
  const [employees, setEmployees] = useState<AIEmployee[]>(INITIAL_EMPLOYEES);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(INITIAL_EMPLOYEES[0].id);

  // Tasks State
  const [tasks, setTasks] = useState<AgentTask[]>(INITIAL_TASKS);

  // Memories State
  const [memories, setMemories] = useState<AgentMemory[]>(INITIAL_MEMORIES);

  // Scheduled Jobs State
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>(INITIAL_SCHEDULED_JOBS);

  // Approvals State
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);

  // Chat Messages State per Agent
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const list: ChatMessage[] = [];
    Object.values(INITIAL_CHAT_MESSAGES).forEach((msgs) => {
      list.push(...msgs);
    });
    return list;
  });

  // Tools State
  const [tools, setTools] = useState<ToolIntegration[]>(AVAILABLE_TOOLS);

  // Modals State
  const [isHireModalOpen, setIsHireModalOpen] = useState<boolean>(false);
  const [isCronModalOpen, setIsCronModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  // Run autonomous task via Backend API
  const handleStartNewTask = async (prompt: string) => {
    const taskId = `task-${currentEmployee.id}-${Date.now()}`;
    const newTask: AgentTask = {
      id: taskId,
      agentId: currentEmployee.id,
      title: prompt.length > 50 ? `${prompt.substring(0, 50)}...` : prompt,
      description: prompt,
      status: 'running',
      startTime: new Date().toISOString(),
      steps: [
        {
          id: `step-init`,
          type: 'thought',
          title: `Initialisation de l'environnement virtuel (${currentEmployee.vm.ip}) et analyse de la consigne`,
          timestamp: new Date().toISOString(),
          status: 'completed',
          durationMs: 320,
        },
      ],
      artifacts: [],
      logs: [
        `[Agent:${currentEmployee.name}] Task started: ${prompt}`,
        `[VM:${currentEmployee.vm.ip}] Context mounted in ${currentEmployee.vm.terminalCwd}`,
      ],
      initiatedVia: 'web',
    };

    // Update agent status to running
    setEmployees((prev) =>
      prev.map((e) => (e.id === currentEmployee.id ? { ...e, status: 'running', activeTaskId: taskId } : e))
    );
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Mission lancée pour ${currentEmployee.name}`);

    try {
      const res = await fetch('/api/agent/run-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: currentEmployee,
          taskPrompt: prompt,
          memories: memories.filter((m) => m.agentId === currentEmployee.id),
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();

      if (json.success && json.data) {
        const { steps, artifacts, summary, suggestedApprovals, newMemories, logs } = json.data;

        // Commit task completion
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: 'completed',
                  endTime: new Date().toISOString(),
                  steps: [...t.steps, ...steps],
                  artifacts: [...(t.artifacts || []), ...artifacts],
                  logs: [...t.logs, ...logs],
                }
              : t
          )
        );

        // Add to agent chat response
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-agent-task-${Date.now()}`,
            agentId: currentEmployee.id,
            sender: 'agent',
            text: summary,
            timestamp: new Date().toISOString(),
            channel: 'web',
            taskId,
          },
        ]);

        // Add any suggested approvals
        if (suggestedApprovals && suggestedApprovals.length > 0) {
          suggestedApprovals.forEach((appr: any, idx: number) => {
            setApprovals((prev) => [
              {
                id: `appr-${Date.now()}-${idx}`,
                agentId: currentEmployee.id,
                taskId,
                actionType: appr.actionType || 'tool:action',
                title: appr.title || 'Validation requise',
                details: appr.details || 'Action à fort impact préparée par l’agent.',
                riskLevel: appr.riskLevel || 'medium',
                status: 'pending',
                requestedAt: new Date().toISOString(),
                payload: appr.payload || {},
              },
              ...prev,
            ]);
          });
        }

        // Add any new learned memories
        if (newMemories && newMemories.length > 0) {
          newMemories.forEach((mem: any, idx: number) => {
            setMemories((prev) => [
              ...prev,
              {
                id: `mem-${Date.now()}-${idx}`,
                agentId: currentEmployee.id,
                key: mem.key,
                value: mem.value,
                category: mem.category || 'learned_rule',
                updatedAt: new Date().toISOString(),
              },
            ]);
          });
        }

        // Update employee hours worked
        setEmployees((prev) =>
          prev.map((e) =>
            e.id === currentEmployee.id
              ? {
                  ...e,
                  status: suggestedApprovals?.length ? 'waiting_approval' : 'idle',
                  hoursWorkedTotal: e.hoursWorkedTotal + 1,
                  tasksCompletedCount: e.tasksCompletedCount + 1,
                }
              : e
          )
        );

        showToast(`Tâche terminée avec succès par ${currentEmployee.name} !`);
      }
    } catch (err) {
      console.error('Failed to run task on server:', err);
      // Fallback
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'completed', endTime: new Date().toISOString() } : t))
      );
      setEmployees((prev) =>
        prev.map((e) => (e.id === currentEmployee.id ? { ...e, status: 'idle' } : e))
      );
    }
  };

  // Chat message to Agent
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      agentId: currentEmployee.id,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
      channel: 'web',
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const history = chatMessages
        .filter((m) => m.agentId === currentEmployee.id)
        .map((m) => ({ sender: m.sender, text: m.text }));

      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: currentEmployee,
          message: text,
          history,
          memories: memories.filter((m) => m.agentId === currentEmployee.id),
        }),
      });

      if (!res.ok) throw new Error('Failed to chat with agent');
      const json = await res.json();

      if (json.success && json.data) {
        const { text: agentReply, toolCalls, newMemory } = json.data;

        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-agent-${Date.now()}`,
            agentId: currentEmployee.id,
            sender: 'agent',
            text: agentReply,
            timestamp: new Date().toISOString(),
            channel: 'web',
            toolCalls,
          },
        ]);

        if (newMemory && newMemory.key) {
          setMemories((prev) => [
            ...prev,
            {
              id: `mem-${Date.now()}`,
              agentId: currentEmployee.id,
              key: newMemory.key,
              value: newMemory.value,
              category: newMemory.category || 'learned_rule',
              updatedAt: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch (err) {
      console.error('Chat failed, using local response:', err);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-agent-${Date.now()}`,
            agentId: currentEmployee.id,
            sender: 'agent',
            text: `Bien reçu ! J'analyse votre demande et j'exécute les opérations requises dans ma sandbox Linux dédiée.`,
            timestamp: new Date().toISOString(),
            channel: 'web',
          },
        ]);
      }, 500);
    }
  };

  // Add Memory
  const handleAddMemory = (key: string, value: string, category: any) => {
    const newMem: AgentMemory = {
      id: `mem-${Date.now()}`,
      agentId: currentEmployee.id,
      key,
      value,
      category,
      updatedAt: new Date().toISOString(),
    };
    setMemories((prev) => [newMem, ...prev]);
    showToast(`Nouvelle directive enregistrée pour ${currentEmployee.name}`);
  };

  // Delete Memory
  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    showToast('Consigne supprimée de la mémoire');
  };

  // Toggle Tool Connection
  const handleToggleTool = (toolId: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, connected: !t.connected } : t))
    );
    showToast('Statut de l’outil mis à jour');
  };

  // Toggle Tool Approval Requirement
  const handleToggleApproval = (toolId: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, requiresApproval: !t.requiresApproval } : t))
    );
    showToast('Règle de gouvernance mise à jour');
  };

  // Approve action
  const handleApproveAction = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
    );
    showToast('Action approuvée et exécutée sur la VM !');
  };

  // Reject action
  const handleRejectAction = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a))
    );
    showToast('Action refusée');
  };

  // Hire Template Employee
  const handleHireTemplate = (template: EmployeeTemplate) => {
    const newEmp: AIEmployee = {
      id: `emp-${template.id}-${Date.now()}`,
      name: template.name.split(' ')[0] + ' ' + (['Vance', 'Brody', 'Chen', 'Dupuis', 'Mercer', 'Novak'][Math.floor(Math.random() * 6)]),
      roleTitle: template.roleTitle,
      category: template.category,
      avatar: template.avatar,
      status: 'idle',
      model: template.recommendedModel,
      bio: template.summary,
      systemPrompt: template.systemPrompt,
      capabilities: template.defaultCapabilities,
      toolsConnected: template.suggestedTools,
      hourlyBenchmarkRate: 55,
      hoursWorkedTotal: 0,
      tasksCompletedCount: 0,
      vm: {
        os: 'Ubuntu 24.04 LTS (x86_64)',
        ip: `10.240.${Math.floor(Math.random() * 50) + 10}.${Math.floor(Math.random() * 200) + 20}`,
        cpuUsage: 4,
        memoryUsageMb: 850,
        uptimeHours: 0.1,
        browserOpen: true,
        currentUrl: 'https://team-ai.com/workspace',
        pageTitle: 'Team-Ai Virtual Workstation',
        terminalCwd: '/home/workspace',
      },
      channelIntegrations: {
        web: true,
        slack: true,
        telegram: false,
        email: true,
      },
      createdAt: new Date().toISOString(),
    };

    setEmployees((prev) => [...prev, newEmp]);
    setSelectedEmployeeId(newEmp.id);
    setActiveView('workstation');
    showToast(`Bienvenue à bord ! ${newEmp.name} est en poste.`);
  };

  // Hire Custom Employee via Gemini
  const handleHireCustom = async (promptDescription: string) => {
    try {
      const res = await fetch('/api/agent/hire-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptDescription }),
      });

      if (!res.ok) throw new Error('Hire custom API failed');
      const json = await res.json();

      if (json.success && json.employee) {
        const emp = json.employee as AIEmployee;
        setEmployees((prev) => [...prev, emp]);
        setSelectedEmployeeId(emp.id);
        setActiveView('workstation');
        showToast(`Employé IA créé et déployé avec succès : ${emp.name} !`);
      }
    } catch (err) {
      console.error('Custom hire failed, using fallback:', err);
      const fallbackEmp: AIEmployee = {
        id: `emp-custom-${Date.now()}`,
        name: 'Jordan Rivera',
        roleTitle: 'Spécialiste IA Personnalisé',
        category: 'custom',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        status: 'idle',
        model: 'gemini-3.7-flash',
        bio: promptDescription,
        systemPrompt: `You are an autonomous AI coworker created to handle: ${promptDescription}`,
        capabilities: ['Exécution autonome de tâches', 'Navigation web', 'Génération de livrables'],
        toolsConnected: ['tool-terminal', 'tool-browser', 'tool-slack', 'tool-notion'],
        hourlyBenchmarkRate: 50,
        hoursWorkedTotal: 0,
        tasksCompletedCount: 0,
        vm: {
          os: 'Ubuntu 24.04 LTS (x86_64)',
          ip: '10.240.45.88',
          cpuUsage: 3,
          memoryUsageMb: 800,
          uptimeHours: 0.1,
          browserOpen: true,
          currentUrl: 'https://team-ai.com/workspace',
          pageTitle: 'Team-Ai Virtual Workstation',
          terminalCwd: '/home/workspace',
        },
        channelIntegrations: {
          web: true,
          slack: true,
          telegram: false,
          email: true,
        },
        createdAt: new Date().toISOString(),
      };
      setEmployees((prev) => [...prev, fallbackEmp]);
      setSelectedEmployeeId(fallbackEmp.id);
      setActiveView('workstation');
      showToast(`Employé IA ${fallbackEmp.name} créé et déployé !`);
    }
  };

  // Cron Job Handlers
  const handleToggleCronJob = (id: string) => {
    setScheduledJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, enabled: !j.enabled } : j))
    );
    showToast('Tâche récurrente modifiée');
  };

  const handleAddCronJob = (job: Omit<ScheduledJob, 'id'>) => {
    const newJob: ScheduledJob = {
      ...job,
      id: `cron-${Date.now()}`,
    };
    setScheduledJobs((prev) => [...prev, newJob]);
    showToast('Nouvelle routine programmée avec succès');
  };

  const handleDeleteCronJob = (id: string) => {
    setScheduledJobs((prev) => prev.filter((j) => j.id !== id));
    showToast('Routine supprimée');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Main Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        employees={employees}
        selectedEmployeeId={selectedEmployeeId}
        onSelectEmployee={(id) => {
          setSelectedEmployeeId(id);
          setActiveView('workstation');
        }}
        approvals={approvals}
        onOpenHireModal={() => setIsHireModalOpen(true)}
        onOpenCronModal={() => setIsCronModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'workstation' && (
          <AgentWorkstation
            employee={currentEmployee}
            onUpdateEmployee={(updated) =>
              setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
            }
            tasks={tasks}
            onStartNewTask={handleStartNewTask}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
            onOpenCronModal={() => setIsCronModalOpen(true)}
          />
        )}

        {activeView === 'roster' && (
          <AgentRoster
            employees={employees}
            onSelectEmployee={(id) => {
              setSelectedEmployeeId(id);
              setActiveView('workstation');
            }}
            onOpenHireModal={() => setIsHireModalOpen(true)}
          />
        )}

        {activeView === 'tools' && (
          <ToolsManager
            tools={tools}
            onToggleTool={handleToggleTool}
            onToggleApproval={handleToggleApproval}
          />
        )}

        {activeView === 'approvals' && (
          <ApprovalsInbox
            approvals={approvals}
            employees={employees}
            onApprove={handleApproveAction}
            onReject={handleRejectAction}
          />
        )}

        {activeView === 'cron' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">Gestionnaire de Routines Cron</h1>
                <p className="text-xs text-slate-400 mt-1">Configurez les cycles de veille et de travail régulier pour vos agents.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCronModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
              >
                + Ajouter une Routine
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheduledJobs.map((job) => {
                const agent = employees.find((e) => e.id === job.agentId);
                return (
                  <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {agent && (
                          <img
                            src={agent.avatar}
                            alt={agent.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                          />
                        )}
                        <div>
                          <h3 className="text-sm font-bold text-white">{job.title}</h3>
                          <span className="text-xs text-indigo-400">{agent?.name}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950 text-slate-300">
                        {job.cronExpression}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{job.description}</p>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono">Dernière exécution : {job.lastRun ? new Date(job.lastRun).toLocaleDateString('fr-FR') : 'Jamais'}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleCronJob(job.id)}
                        className={`text-xs font-bold ${job.enabled ? 'text-emerald-400' : 'text-slate-500'}`}
                      >
                        {job.enabled ? 'Activé' : 'Désactivé'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <HireAgentModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onHireTemplate={handleHireTemplate}
        onHireCustom={handleHireCustom}
      />

      <ScheduledJobsModal
        isOpen={isCronModalOpen}
        onClose={() => setIsCronModalOpen(false)}
        jobs={scheduledJobs}
        employees={employees}
        onToggleJob={handleToggleCronJob}
        onAddJob={handleAddCronJob}
        onDeleteJob={handleDeleteCronJob}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold border border-indigo-400/30 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
