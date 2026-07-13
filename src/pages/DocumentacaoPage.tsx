import React, { useState } from 'react';
import AndroidStructure from '../components/AndroidStructure';
import WebAppArchitecture from '../components/WebAppArchitecture';
import DatabaseSchema from '../components/DatabaseSchema';
import DataArchitecture from '../components/DataArchitecture';
import SyncArchitecture from '../components/SyncArchitecture';
import TechStack from '../components/TechStack';
import AndroidAbsence from '../components/AndroidAbsence';
import AndroidCalendar from '../components/AndroidCalendar';
import AndroidFoundation from '../components/AndroidFoundation';
import AndroidPresence from '../components/AndroidPresence';
import AndroidReports from '../components/AndroidReports';
import AndroidSync from '../components/AndroidSync';
import WebStructure from '../components/WebStructure';

import { 
  Layers, 
  Smartphone, 
  Database, 
  MonitorPlay,
  RefreshCw,
  Box,
  Calendar,
  CheckCircle,
  XCircle,
  BarChart3,
  Code
} from 'lucide-react';

export default function DocumentacaoPage() {
  const [activeTab, setActiveTab] = useState('tech-stack');

  const navItems = [
    { id: 'tech-stack', label: 'Tech Stack', icon: Box },
    { id: 'database', label: 'Modelagem de Dados', icon: Database },
    { id: 'data-arch', label: 'Arquitetura de Dados', icon: Layers },
    { id: 'sync', label: 'Arquitetura de Sync', icon: RefreshCw },
    { id: 'web-arch', label: 'Arquitetura Web', icon: MonitorPlay },
    { id: 'web-structure', label: 'Estrutura Web', icon: Code },
    { id: 'android-structure', label: 'Estrutura Android', icon: Smartphone },
    { id: 'android-foundation', label: 'Android: Core', icon: Smartphone },
    { id: 'android-calendar', label: 'Android: Calendário', icon: Calendar },
    { id: 'android-presence', label: 'Android: Presença', icon: CheckCircle },
    { id: 'android-absence', label: 'Android: Ausência', icon: XCircle },
    { id: 'android-reports', label: 'Android: Relatórios', icon: BarChart3 },
    { id: 'android-sync', label: 'Android: Sincronização', icon: RefreshCw },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-slate-900 min-h-screen p-6 text-slate-200">
      {/* Menu Lateral */}
      <div className="w-full md:w-64 flex flex-col gap-2 bg-slate-800 rounded-xl p-4 border border-slate-700 h-fit">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Documentação</h2>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              activeTab === item.id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border border-transparent'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 bg-slate-800/50 rounded-xl p-6 border border-slate-700 overflow-x-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'tech-stack' && <TechStack />}
          {activeTab === 'database' && <DatabaseSchema />}
          {activeTab === 'data-arch' && <DataArchitecture />}
          {activeTab === 'sync' && <SyncArchitecture />}
          {activeTab === 'web-arch' && <WebAppArchitecture />}
          {activeTab === 'web-structure' && <WebStructure />}
          {activeTab === 'android-structure' && <AndroidStructure />}
          {activeTab === 'android-foundation' && <AndroidFoundation />}
          {activeTab === 'android-calendar' && <AndroidCalendar />}
          {activeTab === 'android-presence' && <AndroidPresence />}
          {activeTab === 'android-absence' && <AndroidAbsence />}
          {activeTab === 'android-reports' && <AndroidReports />}
          {activeTab === 'android-sync' && <AndroidSync />}
        </div>
      </div>
    </div>
  );
}
