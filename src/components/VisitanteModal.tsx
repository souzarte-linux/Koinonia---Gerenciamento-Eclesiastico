import React, { useState } from 'react'
import { X } from 'lucide-react'

interface VisitanteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (nome: string, whatsapp?: string, redeSocial?: string) => void
}

export default function VisitanteModal({
  isOpen,
  onClose,
  onConfirm,
}: VisitanteModalProps) {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [redeSocial, setRedeSocial] = useState('')

  const handleConfirm = () => {
    if (nome.trim()) {
      onConfirm(nome, whatsapp || undefined, redeSocial || undefined)
      setNome('')
      setWhatsapp('')
      setRedeSocial('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Registrar Visitante</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do visitante"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp (opcional)
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(XX) 9XXXX-XXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rede Social (opcional)
            </label>
            <input
              type="text"
              value={redeSocial}
              onChange={(e) => setRedeSocial(e.target.value)}
              placeholder="Instagram, Facebook, TikTok..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-adventista-dark)]"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!nome.trim()}
            className="flex-1 px-4 py-2 bg-[var(--color-adventista-dark)] text-white rounded-lg hover:bg-opacity-90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  )
}
