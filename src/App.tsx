import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useSync } from './hooks/useSync'
import { useAppStore } from './stores/useAppStore'
import PresencaPage from './pages/PresencaPage'
import CalendarioPage from './pages/CalendarioPage'
import AusenciaPage from './pages/AusenciaPage'
import RelatorioPage from './pages/RelatorioPage'

export default function App() {
  useSync()
  const { isSyncing, lastSync } = useAppStore()

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-[var(--color-adventista-dark)] text-white shadow-lg">
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
            <div className="max-w-7xl mx-auto px-4 flex gap-8">
              <NavLink to="/presenca">Presença</NavLink>
              <NavLink to="/calendario">Calendário</NavLink>
              <NavLink to="/ausencia">Ausências</NavLink>
              <NavLink to="/relatorio">Relatórios</NavLink>
            </div>
          </nav>
        </header>

        {/* Conteúdo */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/presenca" element={<PresencaPage />} />
            <Route path="/calendario" element={<CalendarioPage />} />
            <Route path="/ausencia" element={<AusenciaPage />} />
            <Route path="/relatorio" element={<RelatorioPage />} />
            <Route path="/" element={<PresencaPage />} />
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
      className="py-4 px-2 text-white hover:text-[var(--color-adventista-gold)] transition border-b-2 border-transparent hover:border-[var(--color-adventista-gold)]"
    >
      {children}
    </Link>
  )
}
