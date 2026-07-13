import React, { useState } from 'react'

interface CultoAderencia {
  cultoId: string
  data: string
  horario: string
  tipo: string
  percentual: number
  presentes: number
  esperado: number
  atrasados: number
}

interface AderenciaTabProps {
  dados: CultoAderencia[]
}

export default function AderenciaTab({ dados }: AderenciaTabProps) {
  const [sortField, setSortField] = useState<'data' | 'percentual' | 'atrasados'>('percentual')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: 'data' | 'percentual' | 'atrasados') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedDados = [...dados].sort((a, b) => {
    let comparison = 0
    if (sortField === 'data') {
      comparison = new Date(a.data).getTime() - new Date(b.data).getTime()
    } else if (sortField === 'percentual') {
      comparison = a.percentual - b.percentual
    } else if (sortField === 'atrasados') {
      comparison = a.atrasados - b.atrasados
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Cultos com Menor Aderência</h3>
        <p className="text-sm text-gray-500">Acompanhe quais cultos tiveram menor participação.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <tr>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('data')}
              >
                Data / Horário {sortField === 'data' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-semibold">Tipo</th>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('percentual')}
              >
                Aderência {sortField === 'percentual' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 font-semibold">Presentes / Esperado</th>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('atrasados')}
              >
                Atrasos {sortField === 'atrasados' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedDados.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {new Date(row.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-gray-500 text-xs">{row.horario}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    row.tipo === 'ORDINARIO' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {row.tipo}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{row.percentual}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${row.percentual < 50 ? 'bg-red-500' : row.percentual < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${row.percentual}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  {row.presentes} / {row.esperado}
                </td>
                <td className="p-4">
                  {row.atrasados > 0 ? (
                    <span className="text-orange-600 font-medium">{row.atrasados} atrasados</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
            {sortedDados.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Nenhum dado encontrado para o período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
