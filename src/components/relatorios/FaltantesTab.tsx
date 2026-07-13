import React, { useState } from 'react'

interface FaltanteData {
  membroId: string
  nome: string
  totalFaltas: number
  motivos: Record<string, number>
  ultimaFalta: string | null
}

interface FaltantesTabProps {
  dados: FaltanteData[]
}

export default function FaltantesTab({ dados }: FaltantesTabProps) {
  const [sortField, setSortField] = useState<'totalFaltas' | 'nome' | 'ultimaFalta'>('totalFaltas')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: 'totalFaltas' | 'nome' | 'ultimaFalta') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const sortedDados = [...dados].sort((a, b) => {
    let comparison = 0
    if (sortField === 'nome') {
      comparison = a.nome.localeCompare(b.nome)
    } else if (sortField === 'totalFaltas') {
      comparison = a.totalFaltas - b.totalFaltas
    } else if (sortField === 'ultimaFalta') {
      const dateA = a.ultimaFalta ? new Date(a.ultimaFalta).getTime() : 0
      const dateB = b.ultimaFalta ? new Date(b.ultimaFalta).getTime() : 0
      comparison = dateA - dateB
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Top 10 Membros Faltantes</h3>
        <p className="text-sm text-gray-500">Membros com maior número de ausências no período selecionado.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <tr>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nome')}
              >
                Nome {sortField === 'nome' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalFaltas')}
              >
                Total Faltas {sortField === 'totalFaltas' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-semibold">Motivos (Breakdown)</th>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('ultimaFalta')}
              >
                Última Falta {sortField === 'ultimaFalta' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedDados.slice(0, 10).map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{row.nome}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full font-bold">
                    {row.totalFaltas}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(row.motivos).map(([motivo, count]) => (
                      <span key={motivo} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {motivo}: {count}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-gray-500">
                  {row.ultimaFalta ? new Date(row.ultimaFalta).toLocaleDateString('pt-BR') : '-'}
                </td>
              </tr>
            ))}
            {sortedDados.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Nenhuma ausência registrada neste período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
