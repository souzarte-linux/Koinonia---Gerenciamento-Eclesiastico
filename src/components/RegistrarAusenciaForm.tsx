import React, { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../config/supabase'
import { Member, Culto, Ausencia } from '../types'
import { useAppStore } from '../stores/useAppStore'

interface RegistrarAusenciaFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  members: Member[]
  cultos: Culto[]
}

export default function RegistrarAusenciaForm({ isOpen, onClose, onSuccess, members, cultos }: RegistrarAusenciaFormProps) {
  const [loading, setLoading] = useState(false)
  const { addAusencia } = useAppStore()
  const [formData, setFormData] = useState({
    memberId: '',
    cultoId: '',
    motivo: 'OUTRO' as Ausencia['motivo'],
    descricaoMotivo: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const ausenciaId = crypto.randomUUID()
      const culto = cultos.find(c => c.id === formData.cultoId)
      const dataFalta = culto ? culto.data : new Date().toISOString().split('T')[0]
      const agora = new Date().toISOString()
      
      const novaAusencia = {
        id: ausenciaId,
        membro_id: formData.memberId,
        culto_id: formData.cultoId,
        data_falta: dataFalta,
        motivo: formData.motivo,
        descricao_motivo: formData.descricaoMotivo || null,
        status_acompanhamento: 'PENDENTE',
        needs_sync: true,
        created_at: agora,
        updated_at: agora
      }

      const { error } = await supabase.from('ausencias').insert(novaAusencia)
      if (error) throw error

      addAusencia({
        id: ausenciaId,
        memberId: formData.memberId,
        cultoId: formData.cultoId,
        dataFalta: dataFalta,
        motivo: formData.motivo,
        descricaoMotivo: formData.descricaoMotivo || undefined,
        statusAcompanhamento: 'PENDENTE',
        createdAt: agora,
        updatedAt: agora,
        needsSync: true
      })

      onSuccess()
    } catch (error) {
      console.error('Erro ao registrar ausência:', error)
      alert('Erro ao registrar ausência')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Registrar Ausência</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membro *</label>
            <select
              required
              value={formData.memberId}
              onChange={e => setFormData({ ...formData, memberId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
            >
              <option value="">Selecione um membro</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.nome} {m.sobrenome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Culto *</label>
            <select
              required
              value={formData.cultoId}
              onChange={e => setFormData({ ...formData, cultoId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
            >
              <option value="">Selecione um culto</option>
              {cultos.map(c => (
                <option key={c.id} value={c.id}>{c.data} - {c.horarioInicio}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
            <select
              required
              value={formData.motivo}
              onChange={e => setFormData({ ...formData, motivo: e.target.value as Ausencia['motivo'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
            >
              <option value="SAUDE_PROPRIA">Saúde Própria</option>
              <option value="SAUDE_FAMILIAR">Saúde Familiar</option>
              <option value="TRABALHO">Trabalho</option>
              <option value="ESTUDO">Estudo</option>
              <option value="ATIVIDADE_PESSOAL">Atividade Pessoal</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          {formData.motivo === 'OUTRO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Motivo *</label>
              <input
                type="text"
                required
                value={formData.descricaoMotivo}
                onChange={e => setFormData({ ...formData, descricaoMotivo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.memberId || !formData.cultoId}
              className="flex-1 px-4 py-2 bg-[var(--color-adventista-dark)] text-white rounded-lg hover:bg-opacity-90 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
