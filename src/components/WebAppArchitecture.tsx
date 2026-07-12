import React, { useState } from 'react';
import { 
  Globe, Laptop, Code2, DatabaseZap, ShieldCheck, 
  MonitorPlay, FileText, Download, PieChart, Users, Settings, Lock, LayoutDashboard
} from 'lucide-react';

export default function WebAppArchitecture() {
  const [activeTab, setActiveTab] = useState<'ui' | 'code' | 'auth' | 'docs'>('ui');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Web App (React + TypeScript)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          A interface web administrativa para a liderança, sincronizada em tempo real com os dispositivos Android via Supabase.
        </p>
      </div>

      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        <TabButton id="ui" label="Dashboard Web" icon={MonitorPlay} active={activeTab === 'ui'} onClick={() => setActiveTab('ui')} />
        <TabButton id="code" label="React & Realtime" icon={Code2} active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
        <TabButton id="auth" label="Auth & Permissões" icon={ShieldCheck} active={activeTab === 'auth'} onClick={() => setActiveTab('auth')} />
        <TabButton id="docs" label="Documentação" icon={FileText} active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
      </div>

      <div className="mt-4">
        {activeTab === 'ui' && <WebUI />}
        {activeTab === 'code' && <ReactCode />}
        {activeTab === 'auth' && <AuthRBAC />}
        {activeTab === 'docs' && <Documentation />}
      </div>
    </div>
  );
}

function TabButton({ label, icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
        active 
          ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10' 
          : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function WebUI() {
  return (
    <div className="bg-[#0f172a] rounded-lg border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[700px]">
      <div className="flex-1 flex overflow-hidden">
         {/* Web App Sidebar Mock */}
         <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="p-6 border-b border-slate-800">
               <h1 className="text-xl font-bold text-slate-200 tracking-tight">Koinonia <span className="text-indigo-500">Web</span></h1>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Painel Administrativo</p>
            </div>
            <div className="p-4 space-y-1 flex-1">
               <div className="flex items-center gap-3 px-3 py-2 bg-indigo-500/10 text-indigo-400 rounded cursor-pointer border border-indigo-500/20">
                 <LayoutDashboard className="w-4 h-4" /> <span className="text-sm font-medium">Dashboard Geral</span>
               </div>
               <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded cursor-pointer transition-colors">
                 <Users className="w-4 h-4" /> <span className="text-sm font-medium">Membros & Famílias</span>
               </div>
               <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded cursor-pointer transition-colors">
                 <PieChart className="w-4 h-4" /> <span className="text-sm font-medium">Relatórios</span>
               </div>
               <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded cursor-pointer transition-colors">
                 <ShieldCheck className="w-4 h-4" /> <span className="text-sm font-medium">Acompanhamento Pastoral</span>
               </div>
            </div>
            <div className="p-4 border-t border-slate-800">
               <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded cursor-pointer transition-colors">
                 <Settings className="w-4 h-4" /> <span className="text-sm font-medium">Configurações</span>
               </div>
            </div>
         </div>

         {/* Web App Main Content Mock */}
         <div className="flex-1 bg-slate-900/50 flex flex-col relative overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur">
               <div>
                  <h2 className="text-lg font-bold text-slate-200">Visão Geral da Igreja</h2>
                  <p className="text-xs text-slate-400">Dados sincronizados em tempo real com a recepção.</p>
               </div>
               <div className="flex gap-3">
                 <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                   <Download className="w-4 h-4" /> Exportar (CSV/PDF)
                 </button>
               </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Membros Ativos</span>
                    <p className="text-3xl font-bold text-slate-200 mt-2">482</p>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">+12 este mês</p>
                 </div>
                 <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Aderência Média</span>
                    <p className="text-3xl font-bold text-slate-200 mt-2">78%</p>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">Acima da média anual</p>
                 </div>
                 <div className="bg-slate-800/40 p-5 rounded-xl border border-rose-500/20 bg-rose-500/5">
                    <span className="text-[10px] text-rose-400/80 uppercase tracking-widest font-bold">Faltas Críticas (&gt;3 seguidas)</span>
                    <p className="text-3xl font-bold text-rose-400 mt-2">15</p>
                    <p className="text-xs text-rose-400/80 mt-2 flex items-center gap-1">Requerem visita pastoral</p>
                 </div>
               </div>

               <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                     <h3 className="text-sm font-bold text-slate-200">Presenças Hoje (Tempo Real)</h3>
                     <span className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Sync
                     </span>
                  </div>
                  <table className="w-full text-left border-collapse text-sm">
                     <thead>
                       <tr className="border-b border-slate-700/50 text-[10px] uppercase tracking-widest text-slate-500 bg-slate-900/30">
                         <th className="p-3 font-medium">Membro</th>
                         <th className="p-3 font-medium">Horário</th>
                         <th className="p-3 font-medium">Status</th>
                         <th className="p-3 font-medium">Acompanhantes</th>
                       </tr>
                     </thead>
                     <tbody className="text-slate-300">
                       <tr className="border-b border-slate-700/30 hover:bg-slate-800/30">
                         <td className="p-3">Família Souza (Carlos)</td>
                         <td className="p-3 font-mono text-xs">19:28:45</td>
                         <td className="p-3"><span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">No Horário</span></td>
                         <td className="p-3">+3 Familiares</td>
                       </tr>
                       <tr className="border-b border-slate-700/30 hover:bg-slate-800/30">
                         <td className="p-3">Lucas Oliveira</td>
                         <td className="p-3 font-mono text-xs text-rose-400">19:45:10</td>
                         <td className="p-3"><span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase">Atrasado (15m)</span></td>
                         <td className="p-3">-</td>
                       </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function ReactCode() {
  const codeFiles = {
    hook: `// src/hooks/useRealtimePresencas.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store/useStore';

export function useRealtimePresencas(cultoId: string) {
  const queryClient = useQueryClient();
  const addNotification = useStore((state) => state.addNotification);

  useEffect(() => {
    // Inscreve no canal do Supabase Realtime para a tabela presencas
    const channel = supabase
      .channel(\`presencas_culto_\${cultoId}\`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Escuta novos check-ins do Android
          schema: 'public',
          table: 'presencas',
          filter: \`cultoId=eq.\${cultoId}\`
        },
        (payload) => {
          // Atualiza o cache do React Query instantaneamente
          queryClient.invalidateQueries({ queryKey: ['presencas', cultoId] });
          
          // Dispara notificação no Zustand
          addNotification({
            type: 'info',
            message: \`Novo check-in registrado via app da recepção.\`
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cultoId, queryClient, addNotification]);
}`,
    store: `// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  userRole: 'admin' | 'recepcionista' | 'pastor' | null;
  theme: 'dark' | 'light';
  notifications: any[];
  setRole: (role: any) => void;
  addNotification: (notif: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userRole: null,
      theme: 'dark',
      notifications: [],
      setRole: (role) => set({ userRole: role }),
      addNotification: (notif) => set((state) => ({ 
        notifications: [notif, ...state.notifications].slice(0, 5) 
      })),
    }),
    { name: 'koinonia-web-storage' }
  )
);`,
    export: `// src/utils/export.ts
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  saveAs(blob, \`\${fileName}_\${new Date().getTime()}.xlsx\`);
};`
  };

  const [activeFile, setActiveFile] = useState<keyof typeof codeFiles>('hook');

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="flex bg-slate-800/80 border-b border-slate-700 overflow-x-auto">
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'hook' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('hook')}>useRealtimePresencas.ts</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'store' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('store')}>Zustand Store</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'export' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('export')}>Export Utils</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-slate-300 leading-relaxed">
          {codeFiles[activeFile]}
        </pre>
      </div>
    </div>
  );
}

function AuthRBAC() {
  const code = `// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Usa Supabase Auth
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const role = useStore(state => state.userRole);

  if (loading) return <div>Carregando...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    // Redireciona usuários sem permissão (ex: recepcionista tentando ver relatórios financeiros)
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

// Em src/App.tsx (React Router Setup)
// <Route element={<ProtectedRoute allowedRoles={['admin', 'pastor']} />}>
//    <Route path="/relatorios" element={<RelatoriosPage />} />
//    <Route path="/configuracoes" element={<ConfigPage />} />
// </Route>`;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
       <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Autenticação e RBAC (Role-Based Access Control)</span>
        <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded">React Router / Supabase</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-emerald-400/90 leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  )
}

function Documentation() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Sinergia Web x Android</h3>
         <p className="text-sm text-slate-300 leading-relaxed mb-4">
           Enquanto o App Android é focado na <strong>coleta de dados offline</strong> na porta da igreja (check-in, visitantes), o Web App é focado na <strong>gestão e análise</strong> desses dados pela secretaria e equipe pastoral.
         </p>
         <ul className="list-disc list-inside text-sm text-slate-300 space-y-3 leading-relaxed marker:text-indigo-500/50">
           <li><strong>Real-time Supabase:</strong> Os secretários no painel Web veem as presenças subindo em tempo real conforme os diáconos/recepcionistas fazem o check-in na porta usando o App Android.</li>
           <li><strong>Exportação:</strong> Apenas no Web App implementamos libs densas como <code>xlsx</code> ou <code>pdfmake</code> para não inchar o bundle do APK Android.</li>
           <li><strong>Gestão de Permissões:</strong> O painel web permite configurar quem tem acesso ao quê, atualizando as <i>custom claims</i> ou a tabela de <i>roles</i> no Supabase.</li>
         </ul>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Stack Tecnológico Web</h3>
         <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded text-center">
             <Code2 className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
             <p className="text-xs font-bold text-slate-200">React 18 + TS</p>
             <p className="text-[10px] text-slate-500 mt-1">SPA performante com tipagem forte</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded text-center">
             <LayoutDashboard className="w-6 h-6 text-teal-400 mx-auto mb-2" />
             <p className="text-xs font-bold text-slate-200">Tailwind + Shadcn</p>
             <p className="text-[10px] text-slate-500 mt-1">UI Moderna e Acessível (Radix)</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded text-center">
             <DatabaseZap className="w-6 h-6 text-rose-400 mx-auto mb-2" />
             <p className="text-xs font-bold text-slate-200">React Query</p>
             <p className="text-[10px] text-slate-500 mt-1">Server state & caching</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded text-center">
             <Globe className="w-6 h-6 text-amber-400 mx-auto mb-2" />
             <p className="text-xs font-bold text-slate-200">Zustand</p>
             <p className="text-[10px] text-slate-500 mt-1">Client state leve e global</p>
           </div>
         </div>
      </div>
    </div>
  )
}
