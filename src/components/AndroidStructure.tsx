import React from 'react';
import { FolderTree, FileJson, Layers, Database } from 'lucide-react';

export default function AndroidStructure() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Estrutura de Pastas (Android)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          A aplicação Android segue a <strong className="text-slate-200">Clean Architecture</strong> combinada com o padrão <strong className="text-slate-200">MVVM</strong> (Model-View-ViewModel). 
          Esta abordagem garante a separação de responsabilidades, testabilidade e escalabilidade do projeto.
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
        <div className="bg-slate-900/50 border-b border-slate-700 px-4 py-3 flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-indigo-400" />
          <span className="font-mono text-xs font-medium text-slate-300">app/src/main/java/com/koinonia/</span>
        </div>
        
        <div className="p-4 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">├── di/</span>
              <span className="text-slate-500 mt-0.5">- Módulos de injeção de dependência (Hilt)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">├── core/</span>
              <span className="text-slate-500 mt-0.5">- Classes base, utilitários, extensions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">├── data/</span>
              <span className="text-slate-500 mt-0.5">- Camada de Dados (Implementação)</span>
            </li>
            <ul className="pl-6 space-y-2 border-l border-slate-700 ml-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">├── local/</span>
                <span className="text-slate-500 mt-0.5">- Room DB, DAOs, Entidades locais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">├── remote/</span>
                <span className="text-slate-500 mt-0.5">- Cliente Supabase, Modelos DTOs de rede</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">└── repository/</span>
                <span className="text-slate-500 mt-0.5">- Implementação das interfaces de Repositório</span>
              </li>
            </ul>
            <li className="flex items-start gap-2 mt-2">
              <span className="text-indigo-400 font-bold">├── domain/</span>
              <span className="text-slate-500 mt-0.5">- Camada de Domínio (Regras de Negócio)</span>
            </li>
            <ul className="pl-6 space-y-2 border-l border-slate-700 ml-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">├── model/</span>
                <span className="text-slate-500 mt-0.5">- Entidades de Domínio puras (Kotlin classes)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">├── repository/</span>
                <span className="text-slate-500 mt-0.5">- Interfaces de Repositório (Abstração)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">└── usecase/</span>
                <span className="text-slate-500 mt-0.5">- Casos de uso específicos (Services/Interactors)</span>
              </li>
            </ul>
            <li className="flex items-start gap-2 mt-2">
              <span className="text-indigo-400 font-bold">└── presentation/</span>
              <span className="text-slate-500 mt-0.5">- Camada de UI (Jetpack Compose)</span>
            </li>
            <ul className="pl-6 space-y-2 border-l border-slate-700 ml-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">├── theme/</span>
                <span className="text-slate-500 mt-0.5">- Cores, Tipografia, Shapes (Compose Theme)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">└── feature_members/</span>
                <span className="text-slate-500 mt-0.5">- Organização por funcionalidade (Feature)</span>
              </li>
              <ul className="pl-6 space-y-1 border-l border-slate-700 ml-2 mt-1">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">├── components/</span>
                  <span className="text-slate-600 mt-0.5">- UI components específicos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">├── MembersViewModel.kt</span>
                  <span className="text-slate-600 mt-0.5">- Gerenciador de estado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">└── MembersScreen.kt</span>
                  <span className="text-slate-600 mt-0.5">- View principal (Compose)</span>
                </li>
              </ul>
            </ul>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Camada de Apresentação</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Utiliza <strong className="text-slate-200">Jetpack Compose</strong> de forma reativa. 
            A interface reage apenas aos estados emitidos pelo <strong className="text-slate-200">ViewModel</strong>. 
            Nenhuma lógica de negócios reside na UI.
          </p>
        </div>

        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Repository Pattern</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Centraliza o acesso a dados. O Repositório decide se busca dados locais (Room) ou remotos (Supabase).
            A UI desconhece completamente a origem dos dados, consumindo apenas <code className="text-slate-300 font-mono bg-slate-900 px-1 py-0.5 rounded">Flow&lt;Data&gt;</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
