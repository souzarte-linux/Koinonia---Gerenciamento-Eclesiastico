import React from 'react';
import { Smartphone, Globe, Database, Cpu, Code, Paintbrush, Layers, DatabaseZap, Box, ShieldAlert } from 'lucide-react';

export default function TechStack() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Stack Tecnológico</h2>
        <p className="text-slate-400 mb-4 text-sm">
          As tecnologias escolhidas para o Koinonia visam alta performance, facilidade de manutenção e um ecossistema moderno.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Android Stack */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
          <div className="bg-indigo-900/40 border-b border-indigo-500/20 p-3 flex items-center gap-3">
            <Smartphone className="text-indigo-400 w-4 h-4" />
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Android</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <Code className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">Kotlin</span>
                <span className="text-[10px] text-slate-400">Linguagem principal</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Paintbrush className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">Jetpack Compose</span>
                <span className="text-[10px] text-slate-400">UI Declarativa moderna</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Layers className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">MVVM & Clean Arch</span>
                <span className="text-[10px] text-slate-400">Padrões de Arquitetura</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DatabaseZap className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">Room Database</span>
                <span className="text-[10px] text-slate-400">Persistência Local ORM</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Cpu className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">Coroutines & Flow</span>
                <span className="text-[10px] text-slate-400">Programação Assíncrona</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Box className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">Hilt</span>
                <span className="text-[10px] text-slate-400">Injeção de Dependências</span>
              </div>
            </div>
          </div>
        </div>

        {/* Web Stack */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
          <div className="bg-cyan-900/40 border-b border-cyan-500/20 p-3 flex items-center gap-3">
            <Globe className="text-cyan-400 w-4 h-4" />
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Web App</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <Code className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">React 18</span>
                <span className="text-[10px] text-slate-400">Biblioteca de UI</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Code className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">TypeScript</span>
                <span className="text-[10px] text-slate-400">Tipagem estática</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Paintbrush className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">Tailwind CSS</span>
                <span className="text-[10px] text-slate-400">Estilização utilitária</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Layers className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">Shadcn/UI</span>
                <span className="text-[10px] text-slate-400">Componentes acessíveis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Stack */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
          <div className="bg-emerald-900/40 border-b border-emerald-500/20 p-3 flex items-center gap-3">
            <Database className="text-emerald-400 w-4 h-4" />
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Backend</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <DatabaseZap className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">Supabase</span>
                <span className="text-[10px] text-slate-400">BaaS Open Source</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">PostgreSQL</span>
                <span className="text-[10px] text-slate-400">Banco de Dados Relacional</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase block">RLS</span>
                <span className="text-[10px] text-slate-400">Row Level Security</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
