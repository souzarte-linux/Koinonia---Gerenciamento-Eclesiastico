import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useSync } from './hooks/useSync'
import { useAppStore } from './stores/useAppStore'
import PresencaPage from './pages/PresencaPage'
import CalendarioPage from './pages/CalendarioPage'
import AusenciaPage from './pages/AusenciaPage'
import RelatorioPage from './pages/RelatorioPage'
import DocumentacaoPage from './pages/DocumentacaoPage'

export default function App() {
  useSync()
  const { isSyncing, lastSync } = useAppStore()

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-[var(--color-adventista-dark)] text-white shadow-lg shrink-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Igreja Presença</h1>
            
            {/* Status Sincronização */}
            <div className="flex items-center gap-4">
              {isSyncing && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                  <span className="text-sm">Sincronizando...</span>
                </div>
              )}
              {lastSync && (
                <span className="text-xs text-gray-200">
                  Última sync: {new Date(lastSync).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Navegação */}
          <nav className="border-t border-white/20">
            <div className="max-w-7xl mx-auto px-4 flex gap-8 overflow-x-auto hide-scrollbar">
              <NavLink to="/presenca">Presença</NavLink>
              <NavLink to="/calendario">Calendário</NavLink>
              <NavLink to="/ausencia">Ausências</NavLink>
              <NavLink to="/relatorio">Relatórios</NavLink>
              <NavLink to="/docs">Documentação Arquitetural</NavLink>
            </div>
          </nav>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/presenca" element={<div className="max-w-7xl mx-auto px-4 py-8"><PresencaPage /></div>} />
            <Route path="/calendario" element={<div className="max-w-7xl mx-auto px-4 py-8"><CalendarioPage /></div>} />
            <Route path="/ausencia" element={<div className="max-w-7xl mx-auto px-4 py-8"><AusenciaPage /></div>} />
            <Route path="/relatorio" element={<div className="max-w-7xl mx-auto px-4 py-8"><RelatorioPage /></div>} />
            <Route path="/docs" element={<DocumentacaoPage />} />
            <Route path="/" element={<div className="max-w-7xl mx-auto px-4 py-8"><PresencaPage /></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="py-4 px-2 text-white whitespace-nowrap hover:text-[var(--color-adventista-gold)] transition border-b-2 border-transparent hover:border-[var(--color-adventista-gold)]"
    >
      {children}
    </Link>
  )
}
