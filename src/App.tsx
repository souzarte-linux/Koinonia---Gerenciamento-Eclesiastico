import React, { useState } from 'react';
import AndroidStructure from './components/AndroidStructure';
import WebAppArchitecture from './components/WebAppArchitecture';
import DataArchitecture from './components/DataArchitecture';
import TechStack from './components/TechStack';
import DatabaseSchema from './components/DatabaseSchema';
import CheckIn from './components/CheckIn';
import CultosAgenda from './components/CultosAgenda';
import Relatorios from './components/Relatorios';
import Ausencias from './components/Ausencias';
import SyncArchitecture from './components/SyncArchitecture';
import AndroidFoundation from './components/AndroidFoundation';
import AndroidPresence from './components/AndroidPresence';
import AndroidCalendar from './components/AndroidCalendar';
import AndroidSync from './components/AndroidSync';
import AndroidAbsence from './components/AndroidAbsence';
import AndroidReports from './components/AndroidReports';
import InitialSetup from './components/InitialSetup';
import { BookOpen, FolderTree, LayoutTemplate, DatabaseZap, Code2, Menu, Church, Database, UserCheck, CalendarDays, BarChart3, Users, CloudCog, Globe, Rocket, Smartphone, ClipboardCheck, Calendar, RefreshCw, UserMinus, LineChart } from 'lucide-react';

const SECTIONS = [
  { id: 'android-foundation', label: 'Android Setup (Base)', icon: Smartphone, component: AndroidFoundation },
  { id: 'android-presence', label: 'Android Presença (App)', icon: ClipboardCheck, component: AndroidPresence },
  { id: 'android-calendar', label: 'Android Calendário (App)', icon: Calendar, component: AndroidCalendar },
  { id: 'android-sync', label: 'Android Sync (App)', icon: RefreshCw, component: AndroidSync },
  { id: 'android-absence', label: 'Android Ausências (App)', icon: UserMinus, component: AndroidAbsence },
  { id: 'android-reports', label: 'Android Relatórios (App)', icon: LineChart, component: AndroidReports },
  { id: 'android', label: 'Arquitetura Android', icon: FolderTree, component: AndroidStructure },
  { id: 'web', label: 'Web App (React/Admin)', icon: Globe, component: WebAppArchitecture },
  { id: 'data', label: 'Dados (Offline First)', icon: DatabaseZap, component: DataArchitecture },
  { id: 'sync', label: 'Sync & WorkManager', icon: CloudCog, component: SyncArchitecture },
  { id: 'tech', label: 'Tech Stack', icon: Code2, component: TechStack },
  { id: 'setup', label: 'Setup Inicial', icon: Rocket, component: InitialSetup },
  { id: 'schema', label: 'Database Schema', icon: Database, component: DatabaseSchema },
  { id: 'checkin', label: 'Check-in (Presença)', icon: UserCheck, component: CheckIn },
  { id: 'agenda', label: 'Agenda & Cultos', icon: CalendarDays, component: CultosAgenda },
  { id: 'relatorios', label: 'Relatórios (Analytics)', icon: BarChart3, component: Relatorios },
  { id: 'ausencias', label: 'Controle de Ausências', icon: Users, component: Ausencias },
];

export default function App() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ActiveComponent = SECTIONS.find(s => s.id === activeSection)?.component || SECTIONS[0].component;

  return (
    <div className="min-h-screen bg-[#0F172A] flex font-sans text-slate-200">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-800 shadow-sm
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight uppercase tracking-tight">Koinonia</h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase mt-1">Docs de Arquitetura</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">
              Conteúdo
            </div>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all
                  ${activeSection === section.id 
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}
                `}
              >
                <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
                {section.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3 px-3 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <BookOpen className="w-4 h-4" />
              <span>v1.0.4 | Core</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 border-b border-slate-800 h-14 flex items-center px-4 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-800/50 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="ml-2 font-bold text-slate-200 uppercase tracking-tight text-sm">Koinonia Docs</h1>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <ActiveComponent />
          </div>
        </div>
      </main>

    </div>
  );
}
