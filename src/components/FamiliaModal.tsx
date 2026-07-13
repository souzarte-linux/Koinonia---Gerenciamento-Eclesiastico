import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Member } from '../types'

interface FamiliaModalProps {
  isOpen: boolean
  member: Member
  familyMembers: Member[]
  onClose: () => void
  onConfirm: (acompanhanteId?: string) => void
}

export default function FamiliaModal({
  isOpen,
  member,
  familyMembers,
  onClose,
  onConfirm,
}: FamiliaModalProps) {
  const [selectedAcompanhante, setSelectedAcompanhante] = useState<string | undefined>(undefined)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Com quem está?</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            {member.nome} está vindo com alguém da família?
          </p>

          {familyMembers.length > 0 ? (
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="acompanhante"
                  checked={selectedAcompanhante === undefined}
                  onChange={() => setSelectedAcompanhante(undefined)}
                  className="w-4 h-4 text-adventista-dark"
                />
                <span className="text-sm text-gray-700">Sozinho</span>
              </label>

              {familyMembers.map(familyMember => (
                <label
                  key={familyMember.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="acompanhante"
                    checked={selectedAcompanhante === familyMember.id}
                    onChange={() => setSelectedAcompanhante(familyMember.id)}
                    className="w-4 h-4 text-adventista-dark"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {familyMember.nome} {familyMember.sobrenome}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">
              Nenhum outro membro da família cadastrado
            </p>
          )}
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
            onClick={() => onConfirm(selectedAcompanhante)}
            className="flex-1 px-4 py-2 bg-[var(--color-adventista-dark)] text-white rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
