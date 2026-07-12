import React from 'react';
import { DatabaseZap, RefreshCw, Smartphone, Cloud, ArrowRightLeft, ShieldAlert } from 'lucide-react';

export default function DataArchitecture() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Arquitetura de Dados (Offline First)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          A aplicação Android do Koinonia utiliza a estratégia <strong className="text-slate-200">Offline First</strong>. 
          Isso garante que os líderes e membros da igreja possam acessar e registrar dados mesmo em locais com pouca ou nenhuma conectividade com a internet.
        </p>
      </div>

      <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-6">Offline-First Data Pipeline</h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <div className="flex flex-col items-center p-4 bg-indigo-500/10 rounded border border-indigo-500/30 w-full md:w-auto">
            <span className="font-bold text-indigo-400 text-xs uppercase">UI / Compose</span>
            <span className="text-[10px] text-indigo-300/70 mt-1">Observa os dados</span>
          </div>
          
          <ArrowRightLeft className="text-slate-600 rotate-90 md:rotate-0 w-5 h-5" />
          
          <div className="flex flex-col items-center p-4 bg-indigo-400/10 rounded border border-indigo-400/30 w-full md:w-auto">
            <span className="font-bold text-indigo-300 text-xs uppercase">ViewModel</span>
            <span className="text-[10px] text-indigo-300/70 mt-1 font-mono">StateFlow</span>
          </div>

          <ArrowRightLeft className="text-slate-600 rotate-90 md:rotate-0 w-5 h-5" />

          <div className="flex flex-col items-center p-4 bg-slate-900 rounded border-2 border-slate-600 shadow-xl w-full md:w-auto">
            <span className="font-bold text-slate-200 text-xs uppercase tracking-widest">Repository</span>
            <span className="text-[10px] text-slate-400 mt-1 uppercase">Pattern</span>
          </div>

          <ArrowRightLeft className="text-slate-600 rotate-90 md:rotate-0 w-5 h-5" />

          <div className="flex flex-col gap-3 w-full md:w-auto">
             <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded border border-emerald-500/30">
                <DatabaseZap className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-emerald-400 text-xs uppercase">Room DB (Local)</span>
                  <span className="text-[10px] text-emerald-500/80 font-mono mt-0.5">Flow&lt;Data&gt;</span>
                </div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded border border-amber-500/30">
                <Cloud className="w-4 h-4 text-amber-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-amber-400 text-xs uppercase">Supabase (Remoto)</span>
                  <span className="text-[10px] text-amber-500/80 mt-0.5 uppercase">REST / RPC</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <DatabaseZap className="w-3 h-3" />
            </div>
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Source of Truth</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            O banco de dados local (Room) é a <strong className="text-slate-200">única fonte da verdade</strong> para a UI. A aplicação sempre lê do Room retornando um <code className="font-mono text-indigo-300">Flow</code>.
          </p>
        </div>

        <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <RefreshCw className="w-3 h-3" />
            </div>
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Sincronização</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Utiliza o <strong className="text-slate-200">WorkManager</strong> do Android para agendar jobs de sincronização. As alterações locais são enviadas ao Supabase quando há conexão.
          </p>
        </div>

        <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-3 h-3" />
            </div>
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Conflitos</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Adota a estratégia de <strong className="text-slate-200">Last-Write-Wins</strong> baseada em <code className="font-mono text-rose-300">updated_at</code>. O servidor (Supabase) tem a palavra final para evitar inconsistências globais.
          </p>
        </div>
      </div>
    </div>
  );
}
