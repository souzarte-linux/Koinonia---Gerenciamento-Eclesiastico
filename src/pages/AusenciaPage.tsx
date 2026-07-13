import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import { supabase } from '../config/supabase'
import { Member, Culto, Ausencia } from '../types'
import AusenciaCard from '../components/AusenciaCard'
import RegistrarAusenciaForm from '../components/RegistrarAusenciaForm'
import AcompanhamentoForm from '../components/AcompanhamentoForm'
import AusenciaModal from '../components/AusenciaModal'

export default function AusenciaPage() {
  const { ausencias, setAusencias } = useAppStore()
  const [members, setMembers] = useState<Member[]>([])
  const [cultos, setCultos] = useState<Culto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('TODOS')
  
  const [showRegistrarModal, setShowRegistrarModal] = useState(false)
  const [showAcompanhamentoModal, setShowAcompanhamentoModal] = useState(false)
  const [selectedAusencia, setSelectedAusencia] = useState<Ausencia | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const { data: mData } = await supabase.from('membros').select('*').eq('ativo', true)
      if (mData) setMembers(mData)
      
      const { data: cData } = await supabase.from('cultos').select('*').eq('ativo', true).order('data', { ascending: false }).limit(20)
      if (cData) {
        const cultosMapeados: Culto[] = cData.map(c => ({
          id: c.id,
          data: c.data,
          horarioInicio: c.horario_inicio,
          horarioFim: c.horario_fim,
          tipoCulto: c.tipo_culto,
          nomeSerie: c.nome_serie,
          ministerioId: c.ministerio_id,
          localId: c.local_id,
          tema: c.tema,
          oradorId: c.orador_id,
          ativo: c.ativo,
          createdAt: c.created_at,
          updatedAt: c.updated_at
        }))
        setCultos(cultosMapeados)
      }

      // Load absent
      const { data: aData } = await supabase.from('ausencias').select('*').order('created_at', { ascending: false })
      if (aData) {
        setAusencias(aData.map(a => ({
          id: a.id,
          memberId: a.membro_id,
          cultoId: a.culto_id,
          dataFalta: a.data_falta,
          motivo: a.motivo,
          descricaoMotivo: a.descricao_motivo,
          responsavelContato: a.responsavel_contato,
          meioContato: a.meio_contato,
          tipoContatoPessoal: a.tipo_contato_pessoal,
          redeSocialContato: a.rede_social_contato,
          dataContato: a.data_contato,
          anotacoes: a.anotacoes,
          statusAcompanhamento: a.status_acompanhamento,
          createdAt: a.created_at,
          updatedAt: a.updated_at,
          needsSync: a.needs_sync
        })))
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleOpenAcompanhamento = (ausencia: Ausencia) => {
    setSelectedAusencia(ausencia)
    setShowAcompanhamentoModal(true)
  }

  const handleSuccessRegistrar = () => {
    setShowRegistrarModal(false)
  }

  const handleSuccessAcompanhamento = () => {
    setShowAcompanhamentoModal(false)
    setSelectedAusencia(null)
  }

  // Filter
  const filteredAusencias = ausencias.filter(ausencia => {
    const member = members.find(m => m.id === ausencia.memberId)
    const memberName = member ? `${member.nome} ${member.sobrenome}`.toLowerCase() : ''
    
    const matchesSearch = memberName.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'TODOS' || ausencia.statusAcompanhamento === statusFilter

    return matchesSearch && matchesStatus
  }).sort((a, b) => new Date(b.dataFalta).getTime() - new Date(a.dataFalta).getTime())

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-adventista-dark)]">Ausências & Acompanhamento</h2>
          <button
            onClick={() => setShowRegistrarModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-[var(--color-adventista-dark)] text-white rounded-lg hover:bg-opacity-90 transition font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Registrar Ausência
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white appearance-none"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="REALIZADO">Contato Realizado</option>
              <option value="VISITADO">Visitado</option>
              <option value="RESPONDEU">Respondeu</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAusencias.length > 0 ? (
          filteredAusencias.map(ausencia => (
            <AusenciaCard
              key={ausencia.id}
              ausencia={ausencia}
              member={members.find(m => m.id === ausencia.memberId)}
              onClickAcompanhamento={() => handleOpenAcompanhamento(ausencia)}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500 border border-gray-200">
            Nenhuma ausência encontrada com os filtros selecionados.
          </div>
        )}
      </div>

      <AusenciaModal>
        <RegistrarAusenciaForm
          isOpen={showRegistrarModal}
          onClose={() => setShowRegistrarModal(false)}
          onSuccess={handleSuccessRegistrar}
          members={members}
          cultos={cultos}
        />
        <AcompanhamentoForm
          isOpen={showAcompanhamentoModal}
          ausencia={selectedAusencia}
          onClose={() => {
            setShowAcompanhamentoModal(false)
            setSelectedAusencia(null)
          }}
          onSuccess={handleSuccessAcompanhamento}
        />
      </AusenciaModal>
    </div>
  )
}
