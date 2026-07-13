import React from 'react'
import { Calendar, Users, UserMinus, Percent } from 'lucide-react'
import StatCard from './StatCard'

interface ResumoTabProps {
  dados: {
    totalCultos: number
    totalPresencas: number
    totalAusencias: number
    taxaAderenciaMedia: number
    membrosMaisFrequentes: { nome: string; presencas: number }[]
    membrosMenosFrequentes: { nome: string; presencas: number }[]
  }
}

export default function ResumoTab({ dados }: ResumoTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Cultos"
          value={dados.totalCultos}
          icon={Calendar}
          description="no período selecionado"
        />
        <StatCard
          title="Total Presenças"
          value={dados.totalPresencas}
          icon={Users}
          description="soma de todas as presenças"
        />
        <StatCard
          title="Total Ausências"
          value={dados.totalAusencias}
          icon={UserMinus}
          description="registradas no período"
        />
        <StatCard
          title="Aderência Média"
          value={`${dados.taxaAderenciaMedia}%`}
          icon={Percent}
          description="média de presença por culto"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Mais Frequentes</h3>
          {dados.membrosMaisFrequentes.length > 0 ? (
            <div className="space-y-3">
              {dados.membrosMaisFrequentes.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{m.nome}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                    {m.presencas}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Dados insuficientes</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Menos Frequentes (Alerta)</h3>
          {dados.membrosMenosFrequentes.length > 0 ? (
            <div className="space-y-3">
              {dados.membrosMenosFrequentes.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-gray-700">{m.nome}</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                    {m.presencas}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Dados insuficientes</p>
          )}
        </div>
      </div>
    </div>
  )
}
