export type AgentCategory =
  | 'engineering'
  | 'marketing'
  | 'sales'
  | 'operations'
  | 'finance'
  | 'support'
  | 'custom';

export type AgentStatus = 'idle' | 'running' | 'waiting_approval' | 'offline';

export type AIModelType =
  | 'gemini-3.7-flash'
  | 'gemini-3.1-pro'
  | 'claude-3.7-sonnet'
  | 'gpt-4.5'
  | 'deepseek-r1';

export interface VmSession {
  os: string;
  ip: string;
  cpuUsage: number; // percentage 0-100
  memoryUsageMb: number;
  uptimeHours: number;
  browserOpen: boolean;
  currentUrl?: string;
  pageTitle?: string;
  terminalCwd: string;
}

export interface AIEmployee {
  id: string;
  name: string;
  roleTitle: string;
  category: AgentCategory;
  avatar: string;
  status: AgentStatus;
  model: AIModelType;
  bio: string;
  systemPrompt: string;
  capabilities: string[];
  toolsConnected: string[]; // list of tool IDs
  hourlyBenchmarkRate: number; // e.g. 48 $/h
  hoursWorkedTotal: number;
  tasksCompletedCount: number;
  vm: VmSession;
  channelIntegrations: {
    web: boolean;
    slack: boolean;
    telegram: boolean;
    email: boolean;
  };
  activeTaskId?: string;
  createdAt: string;
}

export interface ToolIntegration {
  id: string;
  name: string;
  category: 'communication' | 'productivity' | 'development' | 'marketing' | 'sales' | 'finance' | 'system';
  icon: string;
  description: string;
  connected: boolean;
  requiresApproval: boolean;
  actions: string[];
  docUrl?: string;
}

export type StepType =
  | 'thought'
  | 'tool_call'
  | 'browser_action'
  | 'terminal_command'
  | 'output'
  | 'approval_required';

export interface TaskStep {
  id: string;
  type: StepType;
  title: string;
  toolName?: string;
  toolInput?: any;
  toolOutput?: any;
  timestamp: string;
  status: 'running' | 'completed' | 'failed';
  durationMs?: number;
}

export interface TaskArtifact {
  id: string;
  title: string;
  type: 'markdown' | 'code' | 'table' | 'json' | 'email' | 'url';
  content: string;
  language?: string;
  createdAt: string;
}

export interface AgentTask {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'waiting_approval';
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
  steps: TaskStep[];
  artifacts: TaskArtifact[];
  logs: string[];
  initiatedVia: 'web' | 'slack' | 'telegram' | 'cron' | 'api';
}

export interface AgentMemory {
  id: string;
  agentId: string;
  key: string;
  value: string;
  category: 'core_directive' | 'user_preference' | 'company_context' | 'learned_rule' | 'credential';
  updatedAt: string;
}

export interface ScheduledJob {
  id: string;
  agentId: string;
  title: string;
  cronExpression: string;
  description: string;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
  taskPrompt: string;
}

export interface ApprovalRequest {
  id: string;
  agentId: string;
  taskId: string;
  actionType: string;
  title: string;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  payload: any;
}

export interface ChatMessage {
  id: string;
  agentId: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  channel?: 'web' | 'slack' | 'telegram';
  taskId?: string;
  toolCalls?: { tool: string; action: string }[];
}

export interface EmployeeTemplate {
  id: string;
  name: string;
  roleTitle: string;
  category: AgentCategory;
  avatar: string;
  badge: string;
  summary: string;
  recommendedModel: AIModelType;
  defaultCapabilities: string[];
  suggestedTools: string[];
  suggestedPrompts: string[];
  systemPrompt: string;
  benchmarkSalary: string;
}
