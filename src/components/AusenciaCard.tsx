import React from 'react'
import { Ausencia, Member, Culto } from '../types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PhoneCall, Calendar, AlertCircle } from 'lucide-react'

interface AusenciaCardProps {
  key?: React.Key
  ausencia: Ausencia
  member?: Member
  onClickAcompanhamento: () => void
}

export default function AusenciaCard({ ausencia, member, onClickAcompanhamento }: AusenciaCardProps) {
  const statusColors = {
    PENDENTE: 'bg-red-100 text-red-800 border-red-200',
    REALIZADO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    VISITADO: 'bg-blue-100 text-blue-800 border-blue-200',
    RESPONDEU: 'bg-green-100 text-green-800 border-green-200',
  }

  const statusLabel = {
    PENDENTE: 'Pendente',
    REALIZADO: 'Contato Realizado',
    VISITADO: 'Visitado',
    RESPONDEU: 'Respondeu',
  }

  const motivoLabel = {
    SAUDE_PROPRIA: 'Saúde',
    SAUDE_FAMILIAR: 'Saúde Familiar',
    TRABALHO: 'Trabalho',
    ESTUDO: 'Estudo',
    ATIVIDADE_PESSOAL: 'Atividade Pessoal',
    OUTRO: 'Outro',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-md transition">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-lg">
            {member ? `${member.nome} ${member.sobrenome}` : 'Membro não encontrado'}
          </h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[ausencia.statusAcompanhamento]}`}>
            {statusLabel[ausencia.statusAcompanhamento]}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            {format(parseISO(ausencia.dataFalta), "dd 'de' MMM, yyyy", { locale: ptBR })}
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            Motivo: {motivoLabel[ausencia.motivo]}
          </div>
        </div>
        {ausencia.descricaoMotivo && (
          <p className="text-sm text-gray-500 mt-2 italic">"{ausencia.descricaoMotivo}"</p>
        )}
      </div>

      <button
        onClick={onClickAcompanhamento}
        className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2 whitespace-nowrap"
      >
        <PhoneCall className="w-4 h-4" />
        Acompanhamento
      </button>
    </div>
  )
}
