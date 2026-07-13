import React, { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../config/supabase'

interface CadastrarCultoFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CadastrarCultoForm({ isOpen, onClose, onSuccess }: CadastrarCultoFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    horarioInicio: '09:00',
    horarioFim: '11:00',
    tipoCulto: 'ORDINARIO',
    nomeSerie: '',
    tema: '',
    ministerioId: 'MIN-01',
    localId: 'LOC-01',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cultoId = crypto.randomUUID()
      const agora = new Date().toISOString()
      
      const { error } = await supabase
        .from('cultos')
        .insert({
          id: cultoId,
          data: formData.data,
          horario_inicio: formData.horarioInicio,
          horario_fim: formData.horarioFim,
          tipo_culto: formData.tipoCulto,
          nome_serie: formData.nomeSerie || null,
          tema: formData.tema || null,
          ministerio_id: formData.ministerioId,
          local_id: formData.localId,
          ativo: true,
          created_at: agora,
          updated_at: agora
        })
      
      if (error) throw error
      
      onSuccess()
    } catch (error) {
      console.error('Erro ao cadastrar culto:', error)
      alert('Erro ao cadastrar culto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Agendar Culto</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input
                type="date"
                required
                value={formData.data}
                onChange={e => setFormData({ ...formData, data: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select
                required
                value={formData.tipoCulto}
                onChange={e => setFormData({ ...formData, tipoCulto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
              >
                <option value="ORDINARIO">Ordinário</option>
                <option value="EXTRAORDINARIO">Extraordinário</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário Início *</label>
              <input
                type="time"
                required
                value={formData.horarioInicio}
                onChange={e => setFormData({ ...formData, horarioInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário Fim *</label>
              <input
                type="time"
                required
                value={formData.horarioFim}
                onChange={e => setFormData({ ...formData, horarioFim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Série / Evento</label>
            <input
              type="text"
              value={formData.nomeSerie}
              onChange={e => setFormData({ ...formData, nomeSerie: e.target.value })}
              placeholder="Ex: Semana de Oração"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
            <input
              type="text"
              value={formData.tema}
              onChange={e => setFormData({ ...formData, tema: e.target.value })}
              placeholder="Tema do culto"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ministério *</label>
              <select
                required
                value={formData.ministerioId}
                onChange={e => setFormData({ ...formData, ministerioId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
              >
                <option value="MIN-01">Ministério Jovem</option>
                <option value="MIN-02">Ministério Pessoal</option>
                <option value="MIN-03">Escola Sabatina</option>
                <option value="MIN-04">Anciões</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local *</label>
              <select
                required
                value={formData.localId}
                onChange={e => setFormData({ ...formData, localId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)] bg-white"
              >
                <option value="LOC-01">Nave Principal</option>
                <option value="LOC-02">Salão Jovem</option>
                <option value="LOC-03">Auditório</option>
              </select>
            </div>
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
              {loading ? 'Salvando...' : 'Salvar Culto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
