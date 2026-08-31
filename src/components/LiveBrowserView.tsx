import React, { useState } from 'react';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  ExternalLink,
  Search,
  Eye,
  Camera,
  Maximize2,
  MousePointer,
  CheckCircle2,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  Code2,
} from 'lucide-react';
import { AIEmployee } from '../types';

interface LiveBrowserViewProps {
  employee: AIEmployee;
}

export const LiveBrowserView: React.FC<LiveBrowserViewProps> = ({ employee }) => {
  const [currentUrl, setCurrentUrl] = useState<string>(
    employee.vm.currentUrl || 'https://github.com/team-ai-org/core-platform/pull/284'
  );
  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [activeBrowserTab, setActiveBrowserTab] = useState<'viewport' | 'dom' | 'network' | 'screenshots'>('viewport');
  const [inspectElement, setInspectElement] = useState<string | null>(null);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setCurrentUrl(inputUrl);
    setTimeout(() => {
      setIsNavigating(false);
    }, 600);
  };

  const isGithub = currentUrl.includes('github.com');
  const isApollo = currentUrl.includes('apollo.io');
  const isStripe = currentUrl.includes('stripe.com');
  const isCalendar = currentUrl.includes('calendar.google.com');
  const isX = currentUrl.includes('x.com') || currentUrl.includes('twitter.com');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[680px]">
      {/* Top Browser Chrome Bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4">
        {/* Navigation & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
              title="Précédent"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
              title="Suivant"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsNavigating(true);
                setTimeout(() => setIsNavigating(false), 500);
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
              title="Actualiser"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isNavigating ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Omnibox / URL Input */}
        <form onSubmit={handleNavigate} className="flex-1 max-w-xl">
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <Lock className="w-3 h-3 text-emerald-400 mr-2 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 font-mono focus:outline-none"
              placeholder="https://..."
            />
            {isNavigating && (
              <span className="text-[10px] text-indigo-400 font-mono animate-pulse">Chargement...</span>
            )}
          </div>
        </form>

        {/* Viewport Specs & Inspector Mode */}
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <Globe className="w-3 h-3 text-indigo-400" />
            <span>Chromium Headless 1920x1080</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveBrowserTab('viewport')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                activeBrowserTab === 'viewport' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rendu
            </button>
            <button
              type="button"
              onClick={() => setActiveBrowserTab('dom')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                activeBrowserTab === 'dom' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DOM
            </button>
            <button
              type="button"
              onClick={() => setActiveBrowserTab('network')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                activeBrowserTab === 'network' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Réseau
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header: Active Agent Action Bar */}
      <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <MousePointer className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
          <span className="font-medium text-slate-300">Action en cours :</span>
          <span className="text-indigo-300 font-mono bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
            {employee.status === 'running'
              ? 'Interacting with DOM elements & extracting structured tables'
              : 'Standby / Session ready for next task'}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>Cookies : <strong className="text-slate-200">14 actifs</strong></span>
          <span>•</span>
          <span>DOM Nodes : <strong className="text-slate-200">1,248</strong></span>
        </div>
      </div>

      {/* Main Browser Viewport */}
      <div className="flex-1 bg-slate-950 p-4 overflow-y-auto relative">
        {activeBrowserTab === 'viewport' && (
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-2xl relative">
            {/* Simulated Live Web Page Content */}
            {isGithub && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                      GH
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        team-ai-org / core-platform
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                          #284 Open
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">feat: Optimize Real-Time SSE Agent Streaming Pipeline</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      48 checks passed
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Fichiers modifiés</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">+142 / -28</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Reviewers</span>
                    <span className="text-sm font-bold text-slate-200">Alex Vance (Author)</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Staging Deploy</span>
                    <span className="text-sm font-bold text-indigo-300 font-mono">Ready (vm-preview-284)</span>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">Diff Preview : src/server/streamHandler.ts</h4>
                  <pre className="text-xs font-mono text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 overflow-x-auto leading-relaxed">
                    <span className="text-emerald-400">+ req.on('close', () =&gt; &#123;</span><br />
                    <span className="text-emerald-400">+   agentRunner.detachListener(streamSessionId);</span><br />
                    <span className="text-emerald-400">+   logger.info(`[SSE] Cleaned up stream for client $&#123;streamSessionId&#125;`);</span><br />
                    <span className="text-emerald-400">+ &#125;);</span>
                  </pre>
                </div>
              </div>
            )}

            {isApollo && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Apollo.io B2B Intelligence Database</h3>
                    <p className="text-xs text-slate-400">Recherche ciblée : CTO / VP Engineering (FinTech Series A, France)</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    8 contacts vérifiés
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-2">Nom</th>
                        <th className="p-2">Entreprise</th>
                        <th className="p-2">Poste</th>
                        <th className="p-2">E-mail vérifié</th>
                        <th className="p-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      <tr>
                        <td className="p-2 text-white font-bold">David Marciano</td>
                        <td className="p-2 text-indigo-300">Qonto</td>
                        <td className="p-2 text-slate-300">VP Engineering</td>
                        <td className="p-2 text-emerald-400">d.marciano@qonto.com</td>
                        <td className="p-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Prêt</span></td>
                      </tr>
                      <tr>
                        <td className="p-2 text-white font-bold">Claire Berthier</td>
                        <td className="p-2 text-indigo-300">Spendesk</td>
                        <td className="p-2 text-slate-300">Head of Platform</td>
                        <td className="p-2 text-emerald-400">c.berthier@spendesk.com</td>
                        <td className="p-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Prêt</span></td>
                      </tr>
                      <tr>
                        <td className="p-2 text-white font-bold">Thomas Leroy</td>
                        <td className="p-2 text-indigo-300">Luko</td>
                        <td className="p-2 text-slate-300">CTO</td>
                        <td className="p-2 text-emerald-400">t.leroy@luko.eu</td>
                        <td className="p-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Prêt</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {isCalendar && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Google Calendar - Planning Hebdomadaire</h3>
                    <p className="text-xs text-slate-400">Créneaux sans conflit détectés pour la semaine 36</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-indigo-600 text-white font-bold">
                    Mardi 14h30 - 15h15 (Libre)
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day, idx) => (
                    <div key={day} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-bold text-slate-300 block mb-1">{day}</span>
                      <div className="space-y-1.5 text-[10px]">
                        <div className="bg-slate-800/80 p-1 rounded text-slate-400">10:00 Standup</div>
                        {idx === 1 && (
                          <div className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 p-1 rounded font-bold">
                            14:30 Sequoia Call
                          </div>
                        )}
                        {idx === 4 && (
                          <div className="bg-emerald-500/20 text-emerald-300 p-1 rounded font-bold">
                            14:00 Deep Work
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isGithub && !isApollo && !isCalendar && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">{employee.vm.pageTitle || 'Page Web Active'}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    200 OK
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
                  <p className="text-indigo-400 font-bold mb-2"># Session Virtuelle Active pour {employee.name}</p>
                  <p>L'agent dispose d'une session de navigation autonome complète. Il peut naviguer sur n'importe quel site SaaS, exécuter du scraping structuré, remplir des formulaires et valider des interfaces avec confirmation visuelle.</p>
                </div>
              </div>
            )}

            {/* Virtual Mouse Pointer Overlay */}
            <div className="absolute top-16 right-16 flex items-center gap-1 pointer-events-none transition-all duration-700">
              <MousePointer className="w-5 h-5 text-indigo-400 fill-indigo-400/30 drop-shadow-md" />
              <span className="text-[10px] bg-slate-950/90 text-indigo-300 px-1.5 py-0.5 rounded font-mono border border-indigo-500/30">
                {employee.name}
              </span>
            </div>
          </div>
        )}

        {activeBrowserTab === 'dom' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-indigo-400 font-bold">// Arborescence DOM extraite par Chromium</div>
            <pre className="text-slate-400 leading-relaxed overflow-x-auto">
{`<html>
  <head><title>${employee.vm.pageTitle || 'Team-Ai Session'}</title></head>
  <body>
    <div id="root" class="app-container">
      <header role="banner">
        <nav aria-label="Main Navigation">
          <a href="/dashboard">Dashboard</a>
          <button data-testid="action-submit">Executer l'action</button>
        </nav>
      </header>
      <main class="content-view">
        <section data-target="data-table" data-rows="142">
          <!-- 1,248 DOM Nodes parsed -->
        </section>
      </main>
    </div>
  </body>
</html>`}
            </pre>
          </div>
        )}

        {activeBrowserTab === 'network' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
            <div className="text-indigo-400 font-bold">// Requêtes Réseau (XHR / Fetch / WebSockets)</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded">
                <span className="text-emerald-400">GET /api/v1/sessions/status</span>
                <span className="text-slate-400">200 OK • 18ms</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded">
                <span className="text-emerald-400">POST /api/v1/integrations/sync</span>
                <span className="text-slate-400">201 Created • 120ms</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded">
                <span className="text-indigo-400">WSS wss://gateway.team-ai.com/live</span>
                <span className="text-emerald-400 font-bold">101 Switching Protocols (Active)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
