import React, { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAppStore } from '../stores/useAppStore'
import { Member, Culto } from '../types'
import FamiliaModal from '../components/FamiliaModal'
import VisitanteModal from '../components/VisitanteModal'
import { Search, Users, CheckCircle, AlertCircle } from 'lucide-react'

export default function PresencaPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [cultos, setCultos] = useState<Culto[]>([])
  const [selectedCulto, setSelectedCulto] = useState<Culto | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Modais
  const [showFamiliaModal, setShowFamiliaModal] = useState(false)
  const [showVisitanteModal, setShowVisitanteModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  
  const { presencas, addPresenca, isSyncing } = useAppStore()

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setLoading(true)

      // Buscar membros
      const { data: membrosData, error: membrosError } = await supabase
        .from('membros')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true })

      if (membrosError) throw membrosError
      setMembers(membrosData || [])

      // Buscar cultos de hoje
      const hoje = new Date().toISOString().split('T')[0]
      const { data: cultosData, error: cultosError } = await supabase
        .from('cultos')
        .select('*')
        .eq('data', hoje)
        .eq('ativo', true)
        .order('horario_inicio', { ascending: true })

      if (cultosError) throw cultosError
      setCultos(cultosData || [])
      
      if (cultosData && cultosData.length > 0) {
        setSelectedCulto(cultosData[0])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  async function marcarPresenca(memberId: string, acompanhanteId?: string, visitanteId?: string) {
    if (!selectedCulto) return

    try {
      const presencaId = crypto.randomUUID()
      const agora = new Date()
      
      // Verificar se está atrasado (tempo atual > horario_inicio do culto)
      const [horaInicio, minutoInicio] = selectedCulto.horarioInicio.split(':')
      const horaCulto = new Date(selectedCulto.data)
      horaCulto.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0)
      
      const atrasado = agora > horaCulto
      const tempoAtraso = atrasado ? Math.floor((agora.getTime() - horaCulto.getTime()) / 60000) : 0

      const { error } = await supabase
        .from('presencas')
        .insert({
          id: presencaId,
          membro_id: memberId,
          culto_id: selectedCulto.id,
          data_horario: agora.toISOString(),
          atrasado,
          tempo_atraso_minutos: tempoAtraso,
          acompanhante_id: acompanhanteId || null,
          visitante_id: visitanteId || null,
          needs_sync: true,
          created_at: agora.toISOString(),
          updated_at: agora.toISOString(),
        })

      if (error) throw error

      addPresenca({
        id: presencaId,
        memberId,
        cultoId: selectedCulto.id,
        dataHorario: agora.toISOString(),
        atrasado,
        tempoAtrasoMinutos: tempoAtraso,
        acompanhanteId,
        visitanteId,
        notas: undefined,
        createdAt: agora.toISOString(),
        updatedAt: agora.toISOString(),
        syncedAt: undefined,
        needsSync: true,
      })

      setMessage({ type: 'success', text: `✅ Presença marcada${atrasado ? ` (${tempoAtraso}min atrasado)` : ''}` })
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Erro ao marcar presença:', error)
      setMessage({ type: 'error', text: 'Erro ao marcar presença' })
    }
  }

  async function adicionarVisitante(nome: string, whatsapp?: string, redeSocial?: string) {
    if (!selectedCulto) return

    try {
      const visitanteId = crypto.randomUUID()
      const agora = new Date()

      const { error } = await supabase
        .from('visitantes')
        .insert({
          id: visitanteId,
          nome,
          whatsapp: whatsapp || null,
          rede_social: redeSocial || null,
          culto_id: selectedCulto.id,
          created_at: agora.toISOString(),
          updated_at: agora.toISOString(),
        })

      if (error) throw error

      setMessage({ type: 'success', text: `✅ Visitante ${nome} registrado` })
      setShowVisitanteModal(false)
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Erro ao registrar visitante:', error)
      setMessage({ type: 'error', text: 'Erro ao registrar visitante' })
    }
  }

  const membrosFiltered = members.filter(m =>
    `${m.nome} ${m.sobrenome}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const membrosComPresenca = presencas
    .filter(p => p.cultoId === selectedCulto?.id)
    .map(p => p.memberId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-adventista-dark)]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mensagens */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center gap-3`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-adventista-dark)] flex items-center gap-2">
            <Users className="h-8 w-8" />
            Presença
          </h1>
          {isSyncing && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400"></div>
              Sincronizando...
            </div>
          )}
        </div>

        {/* Seletor de Culto */}
        {cultos.length > 0 ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Culto
            </label>
            <select
              value={selectedCulto?.id || ''}
              onChange={(e) => {
                const culto = cultos.find(c => c.id === e.target.value)
                setSelectedCulto(culto || null)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
            >
              {cultos.map(culto => (
                <option key={culto.id} value={culto.id}>
                  {culto.horarioInicio} - {culto.tipoCulto === 'ORDINARIO' ? 'Ordinário' : 'Extraordinário'}
                  {culto.nomeSerie && ` (${culto.nomeSerie})`}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 mb-6">
            Nenhum culto agendado para hoje
          </div>
        )}

        {selectedCulto && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-600">Total de Membros</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Presentes</p>
              <p className="text-2xl font-bold text-green-600">{membrosComPresenca.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Taxa de Aderência</p>
              <p className="text-2xl font-bold text-[var(--color-adventista-dark)]">
                {members.length > 0 ? Math.round((membrosComPresenca.length / members.length) * 100) : 0}%
              </p>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowVisitanteModal(true)}
            className="px-4 py-2 bg-[var(--color-adventista-gold)] text-white rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            + Registrar Visitante
          </button>
          <button
            onClick={carregarDados}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Atualizar
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
          />
        </div>
      </div>

      {/* Lista de Membros */}
      {selectedCulto && (
        <div className="bg-white rounded-lg shadow divide-y">
          {membrosFiltered.length > 0 ? (
            membrosFiltered.map(member => {
              const temPresenca = membrosComPresenca.includes(member.id)
              return (
                <div
                  key={member.id}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 transition ${temPresenca ? 'bg-green-50' : ''}`}
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.nome} {member.sobrenome}
                    </p>
                    {member.email && <p className="text-sm text-gray-600">{member.email}</p>}
                  </div>
                  
                  {temPresenca ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Presente</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member)
                          setShowFamiliaModal(true)
                        }}
                        className="px-4 py-2 bg-[var(--color-adventista-dark)] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm"
                      >
                        Marcar
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              Nenhum membro encontrado
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      {selectedMember && (
        <FamiliaModal
          member={selectedMember}
          familyMembers={members.filter(m => m.familiaId === selectedMember.familiaId && m.id !== selectedMember.id)}
          onClose={() => {
            setShowFamiliaModal(false)
            setSelectedMember(null)
          }}
          onConfirm={(acompanhanteId) => {
            marcarPresenca(selectedMember.id, acompanhanteId)
            setShowFamiliaModal(false)
            setSelectedMember(null)
          }}
          isOpen={showFamiliaModal}
        />
      )}

      <VisitanteModal
        isOpen={showVisitanteModal}
        onClose={() => setShowVisitanteModal(false)}
        onConfirm={adicionarVisitante}
      />
    </div>
  )
}
