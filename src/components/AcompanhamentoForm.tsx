import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../config/supabase'
import { Ausencia } from '../types'
import { useAppStore } from '../stores/useAppStore'

interface AcompanhamentoFormProps {
  isOpen: boolean
  ausencia: Ausencia | null
  onClose: () => void
  onSuccess: () => void
}

export default function AcompanhamentoForm({ isOpen, ausencia, onClose, onSuccess }: AcompanhamentoFormProps) {
  const [loading, setLoading] = useState(false)
  const { ausencias, setAusencias } = useAppStore()
  
  const [formData, setFormData] = useState({
    responsavelContato: '',
    meioContato: 'PESSOALMENTE' as Ausencia['meioContato'],
    tipoContatoPessoal: 'VISITA_DOMICILIAR' as Ausencia['tipoContatoPessoal'],
    redeSocialContato: 'INSTAGRAM' as Ausencia['redeSocialContato'],
    dataContato: new Date().toISOString().split('T')[0],
    statusAcompanhamento: 'PENDENTE' as Ausencia['statusAcompanhamento'],
    anotacoes: ''
  })

  useEffect(() => {
    if (ausencia) {
      setFormData({
        responsavelContato: ausencia.responsavelContato || '',
        meioContato: ausencia.meioContato || 'PESSOALMENTE',
        tipoContatoPessoal: ausencia.tipoContatoPessoal || 'VISITA_DOMICILIAR',
        redeSocialContato: ausencia.redeSocialContato || 'INSTAGRAM',
        dataContato: ausencia.dataContato || new Date().toISOString().split('T')[0],
        statusAcompanhamento: ausencia.statusAcompanhamento || 'PENDENTE',
        anotacoes: ausencia.anotacoes || ''
      })
    }
  }, [ausencia])

  if (!isOpen || !ausencia) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const updateData = {
        responsavel_contato: formData.responsavelContato,
        meio_contato: formData.meioContato,
        tipo_contato_pessoal: formData.meioContato === 'PESSOALMENTE' ? formData.tipoContatoPessoal : null,
        rede_social_contato: formData.meioContato === 'REDE_SOCIAL' ? formData.redeSocialContato : null,
        data_contato: formData.dataContato,
        status_acompanhamento: formData.statusAcompanhamento,
        anotacoes: formData.anotacoes || null,
        updated_at: new Date().toISOString(),
        needs_sync: true
      }

      const { error } = await supabase
        .from('ausencias')
        .update(updateData)
        .eq('id', ausencia.id)

      if (error) throw error

      // Update local store
      setAusencias(ausencias.map(a => a.id === ausencia.id ? {
        ...a,
        responsavelContato: formData.responsavelContato,
        meioContato: formData.meioContato,
        tipoContatoPessoal: formData.meioContato === 'PESSOALMENTE' ? formData.tipoContatoPessoal : undefined,
        redeSocialContato: formData.meioContato === 'REDE_SOCIAL' ? formData.redeSocialContato : undefined,
        dataContato: formData.dataContato,
        statusAcompanhamento: formData.statusAcompanhamento,
        anotacoes: formData.anotacoes || undefined,
        updatedAt: new Date().toISOString(),
        needsSync: true
      } : a))

      onSuccess()
    } catch (error) {
      console.error('Erro ao registrar acompanhamento:', error)
      alert('Erro ao registrar acompanhamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Acompanhamento</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              required
              value={formData.statusAcompanhamento}
              onChange={e => setFormData({ ...formData, statusAcompanhamento: e.target.value as Ausencia['statusAcompanhamento'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="REALIZADO">Contato Realizado</option>
              <option value="VISITADO">Visitado</option>
              <option value="RESPONDEU">Respondeu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável *</label>
            <input
              type="text"
              required
              value={formData.responsavelContato}
              onChange={e => setFormData({ ...formData, responsavelContato: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meio de Contato *</label>
            <select
              required
              value={formData.meioContato}
              onChange={e => setFormData({ ...formData, meioContato: e.target.value as Ausencia['meioContato'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
            >
              <option value="PESSOALMENTE">Pessoalmente</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="REDE_SOCIAL">Rede Social</option>
            </select>
          </div>

          {formData.meioContato === 'PESSOALMENTE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo (Pessoal) *</label>
              <select
                required
                value={formData.tipoContatoPessoal}
                onChange={e => setFormData({ ...formData, tipoContatoPessoal: e.target.value as Ausencia['tipoContatoPessoal'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
              >
                <option value="VISITA_DOMICILIAR">Visita Domiciliar</option>
                <option value="REENCONTRO_PROXIMO_CULTO">Reencontro no próximo culto</option>
              </select>
            </div>
          )}

          {formData.meioContato === 'REDE_SOCIAL' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rede Social *</label>
              <select
                required
                value={formData.redeSocialContato}
                onChange={e => setFormData({ ...formData, redeSocialContato: e.target.value as Ausencia['redeSocialContato'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
              >
                <option value="INSTAGRAM">Instagram</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="TIKTOK">TikTok</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data do Contato *</label>
            <input
              type="date"
              required
              value={formData.dataContato}
              onChange={e => setFormData({ ...formData, dataContato: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anotações</label>
            <textarea
              value={formData.anotacoes}
              onChange={e => setFormData({ ...formData, anotacoes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            ></textarea>
          </div>

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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[var(--color-adventista-dark)] text-white rounded-lg hover:bg-opacity-90 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
