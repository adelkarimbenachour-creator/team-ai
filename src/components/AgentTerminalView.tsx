import React, { useState } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Copy,
  Check,
  RotateCcw,
  Folder,
  FileCode,
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AIEmployee } from '../types';

interface AgentTerminalViewProps {
  employee: AIEmployee;
}

export const AgentTerminalView: React.FC<AgentTerminalViewProps> = ({ employee }) => {
  const [commandInput, setCommandInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<
    { command: string; output: string; time: string; exitCode: number }[]
  >([
    {
      command: 'uname -a',
      output: `Linux team-ai-vm-${employee.id} 6.8.0-31-generic #31-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 GNU/Linux`,
      time: '21:05:00',
      exitCode: 0,
    },
    {
      command: 'git status',
      output: `On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\tmodified:   src/server/streamHandler.ts\n\tmodified:   tests/unit/sse.test.ts`,
      time: '21:08:15',
      exitCode: 0,
    },
    {
      command: 'npm run test:unit',
      output: `> team-ai-agent@1.0.0 test:unit\n> vitest run\n\n ✓ tests/unit/sse.test.ts (12 tests) 240ms\n ✓ tests/unit/memory.test.ts (8 tests) 110ms\n ✓ tests/unit/tools.test.ts (28 tests) 310ms\n\n Test Files  3 passed (3)\n      Tests  48 passed (48)\n   Duration  1.12s`,
      time: '21:10:45',
      exitCode: 0,
    },
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'files' | 'processes'>('console');

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    let mockOutput = '';

    if (cmd.startsWith('ls')) {
      mockOutput = 'package.json  tsconfig.json  src/  tests/  README.md  .env  dist/  node_modules/';
    } else if (cmd.startsWith('htop') || cmd.startsWith('top')) {
      mockOutput = `Tasks: 42 total, 1 running, 41 sleeping\n%Cpu(s):  ${employee.vm.cpuUsage}% us,  1.2% sy,  0.0% ni, 95.8% id\nMiB Mem :  4096.0 total,  ${employee.vm.memoryUsageMb} used,  2676.0 free`;
    } else if (cmd.startsWith('git diff')) {
      mockOutput = `diff --git a/src/server/streamHandler.ts b/src/server/streamHandler.ts\n+ req.on('close', () => cleanupSession(id));\n- // TODO: fix leak on disconnect`;
    } else if (cmd.startsWith('docker ps')) {
      mockOutput = `CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS\n9f4a8b1c2e3d   team-ai/sandbox:v2    "/usr/local/bin/agent"   4 hours ago     Up 4 hours     0.0.0.0:3000->3000/tcp`;
    } else if (cmd.startsWith('python') || cmd.startsWith('node')) {
      mockOutput = `[Execution] Script completed with exit code 0. Generated 14 records in output.json`;
    } else {
      mockOutput = `team-ai-agent: executed command "${cmd}" successfully.\nStdout buffer committed to execution context.`;
    }

    setTerminalHistory((prev) => [
      ...prev,
      {
        command: cmd,
        output: mockOutput,
        time: new Date().toLocaleTimeString('fr-FR'),
        exitCode: 0,
      },
    ]);
    setCommandInput('');
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const quickCommands = [
    'git status',
    'npm run test:unit',
    'docker ps',
    'htop',
    'ls -la',
    'cat /etc/os-release',
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[680px]">
      {/* Terminal Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <TerminalIcon className="w-4 h-4 text-indigo-400" />
            <span className="font-bold">agent@{employee.name.toLowerCase().replace(' ', '-')}-vm</span>
            <span className="text-slate-500">:</span>
            <span className="text-indigo-300">{employee.vm.terminalCwd}</span>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveSubTab('console')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                activeSubTab === 'console' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Console Bash
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('files')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                activeSubTab === 'files' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fichiers VM
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('processes')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                activeSubTab === 'processes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Processus
            </button>
          </div>
        </div>
      </div>

      {/* Main Terminal Window */}
      {activeSubTab === 'console' && (
        <div className="flex-1 flex flex-col bg-slate-950 p-4 font-mono text-xs overflow-hidden">
          {/* Quick Command Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 border-b border-slate-800/80 scrollbar-none shrink-0">
            <span className="text-[11px] text-slate-500 font-sans">Commandes rapides :</span>
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => setCommandInput(cmd)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 text-[11px] whitespace-nowrap transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Scrollable Command Outputs */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-slate-300">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="group space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">$</span>
                    <span className="text-white font-bold">{item.command}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-slate-500">{item.time}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.output, idx)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <pre className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {item.output}
                </pre>
              </div>
            ))}
          </div>

          {/* Command Prompt Input */}
          <form onSubmit={handleRunCommand} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 shrink-0">
            <span className="text-emerald-400 font-bold text-sm">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Entrez une commande bash à exécuter sur la VM..."
              className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder-slate-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Exécuter</span>
            </button>
          </form>
        </div>
      )}

      {/* File Tree Explorer View */}
      {activeSubTab === 'files' && (
        <div className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-y-auto space-y-3">
          <div className="text-slate-400 mb-2 font-sans font-semibold">Arborescence Sandbox : {employee.vm.terminalCwd}</div>
          <div className="space-y-1 text-slate-300">
            <div className="flex items-center gap-2 p-1.5 hover:bg-slate-900 rounded cursor-pointer">
              <Folder className="w-4 h-4 text-indigo-400" />
              <span>src/</span>
            </div>
            <div className="ml-6 space-y-1 border-l border-slate-800 pl-3">
              <div className="flex items-center gap-2 p-1 hover:bg-slate-900 rounded cursor-pointer">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>streamHandler.ts <span className="text-slate-500 text-[10px]">(modifié récemment)</span></span>
              </div>
              <div className="flex items-center gap-2 p-1 hover:bg-slate-900 rounded cursor-pointer">
                <FileCode className="w-4 h-4 text-slate-400" />
                <span>agentRunner.ts</span>
              </div>
              <div className="flex items-center gap-2 p-1 hover:bg-slate-900 rounded cursor-pointer">
                <FileCode className="w-4 h-4 text-slate-400" />
                <span>types.ts</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1.5 hover:bg-slate-900 rounded cursor-pointer">
              <Folder className="w-4 h-4 text-indigo-400" />
              <span>tests/</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 hover:bg-slate-900 rounded cursor-pointer">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>package.json</span>
            </div>
          </div>
        </div>
      )}

      {/* Running Processes View */}
      {activeSubTab === 'processes' && (
        <div className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-y-auto">
          <table className="w-full text-left">
            <thead className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="pb-2">PID</th>
                <th className="pb-2">Utilisateur</th>
                <th className="pb-2">CPU %</th>
                <th className="pb-2">RAM (Mo)</th>
                <th className="pb-2">Commande</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              <tr>
                <td className="py-2 text-indigo-400">1042</td>
                <td className="py-2">agent</td>
                <td className="py-2 text-emerald-400">{employee.vm.cpuUsage}%</td>
                <td className="py-2">{employee.vm.memoryUsageMb} MB</td>
                <td className="py-2 text-slate-200">node /opt/team-ai/runtime.js</td>
              </tr>
              <tr>
                <td className="py-2 text-indigo-400">1089</td>
                <td className="py-2">agent</td>
                <td className="py-2 text-slate-400">0.8%</td>
                <td className="py-2">180 MB</td>
                <td className="py-2 text-slate-200">chromium-headless --remote-debugging</td>
              </tr>
              <tr>
                <td className="py-2 text-indigo-400">1140</td>
                <td className="py-2">root</td>
                <td className="py-2 text-slate-400">0.1%</td>
                <td className="py-2">45 MB</td>
                <td className="py-2 text-slate-200">dockerd --bridge=team-ai0</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
