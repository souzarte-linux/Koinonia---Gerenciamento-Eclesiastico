import React from 'react';
import { LayoutTemplate, Blocks, Code2, Route } from 'lucide-react';

export default function WebStructure() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Estrutura de Pastas (Web App)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          A aplicação web é construída com <strong className="text-slate-200">React + TypeScript</strong>, utilizando 
          <strong className="text-slate-200"> Tailwind CSS</strong> e <strong className="text-slate-200">Shadcn/UI</strong> para os componentes. 
          A arquitetura é modular, focada em reusabilidade e clareza.
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
        <div className="bg-slate-900/50 border-b border-slate-700 px-4 py-3 flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-medium text-slate-300">src/</span>
        </div>
        
        <div className="p-4 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">├── assets/</span>
              <span className="text-slate-500 mt-0.5">- Imagens, fontes, ícones estáticos</span>
            </li>
            
            <li className="flex items-start gap-2 mt-2">
              <span className="text-cyan-400 font-bold">├── components/</span>
              <span className="text-slate-500 mt-0.5">- Componentes Reutilizáveis</span>
            </li>
            <ul className="pl-6 space-y-2 border-l border-slate-700 ml-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">├── ui/</span>
                <span className="text-slate-500 mt-0.5">- Componentes primitivos (Shadcn/UI - Botões, Inputs)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">├── layout/</span>
                <span className="text-slate-500 mt-0.5">- Componentes de estrutura (Sidebar, Header)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">└── shared/</span>
                <span className="text-slate-500 mt-0.5">- Componentes de negócios genéricos</span>
              </li>
            </ul>

            <li className="flex items-start gap-2 mt-2">
              <span className="text-cyan-400 font-bold">├── hooks/</span>
              <span className="text-slate-500 mt-0.5">- Custom Hooks (ex: useAuth, useMembers)</span>
            </li>
            
            <li className="flex items-start gap-2 mt-2">
              <span className="text-cyan-400 font-bold">├── services/</span>
              <span className="text-slate-500 mt-0.5">- Camada de Integração de API</span>
            </li>
            <ul className="pl-6 space-y-2 border-l border-slate-700 ml-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">├── supabase/</span>
                <span className="text-slate-500 mt-0.5">- Configuração do cliente Supabase e Queries</span>
              </li>
            </ul>

            <li className="flex items-start gap-2 mt-2">
              <span className="text-cyan-400 font-bold">├── store/</span>
              <span className="text-slate-500 mt-0.5">- Gerenciamento de Estado Global (Zustand/Redux)</span>
            </li>

            <li className="flex items-start gap-2 mt-2">
              <span className="text-cyan-400 font-bold">├── routes/</span>
              <span className="text-slate-500 mt-0.5">- Configuração de Rotas (React Router)</span>
            </li>
            <ul className="pl-6 space-y-2 border-l border-slate-700 ml-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">└── ProtectedRoute.tsx</span>
                <span className="text-slate-500 mt-0.5">- Wrapper para rotas autenticadas</span>
              </li>
            </ul>

            <li className="flex items-start gap-2 mt-2">
              <span className="text-cyan-400 font-bold">├── pages/</span>
              <span className="text-slate-500 mt-0.5">- Páginas por funcionalidade</span>
            </li>
            <ul className="pl-6 space-y-2 border-l border-slate-700 ml-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">├── Dashboard/</span>
                <span className="text-slate-500 mt-0.5">- Visão geral do sistema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">└── Members/</span>
                <span className="text-slate-500 mt-0.5">- Gestão de membros da igreja</span>
              </li>
            </ul>

            <li className="flex items-start gap-2 mt-2">
              <span className="text-cyan-400 font-bold">├── types/</span>
              <span className="text-slate-500 mt-0.5">- Definições de Tipos e Interfaces globais</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Blocks className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Componentização (Shadcn)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Os componentes base ficam na pasta <code className="text-slate-300 font-mono bg-slate-900 px-1 py-0.5 rounded">ui/</code>, gerados pelo Shadcn. Eles são puros e não possuem estado global, recebendo dependências apenas via <code className="text-slate-300 font-mono bg-slate-900 px-1 py-0.5 rounded">props</code>.
          </p>
        </div>

        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Route className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Proteção de Rotas</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            O acesso a páginas internas é garantido pelo componente <code className="text-slate-300 font-mono bg-slate-900 px-1 py-0.5 rounded">ProtectedRoute</code>, que valida a sessão do <strong className="text-slate-200">Supabase Auth</strong> antes de renderizar a página solicitada.
          </p>
        </div>
      </div>
    </div>
  );
}
