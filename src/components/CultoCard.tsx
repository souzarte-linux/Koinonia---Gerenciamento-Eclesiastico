import React from 'react'
import { Culto } from '../types'

interface CultoCardProps {
  key?: React.Key
  culto: Culto
  onClick: () => void
}

export default function CultoCard({ culto, onClick }: CultoCardProps) {
  const isOrdinario = culto.tipoCulto === 'ORDINARIO'

  return (
    <div
      onClick={onClick}
      className={`p-2 mb-1 rounded cursor-pointer text-xs transition border-l-4 ${
        isOrdinario
          ? 'bg-blue-50 border-blue-500 hover:bg-blue-100 text-blue-900'
          : 'bg-purple-50 border-purple-500 hover:bg-purple-100 text-purple-900'
      }`}
    >
      <div className="font-semibold">{culto.horarioInicio}</div>
      <div className="truncate">{culto.nomeSerie || culto.tema || (isOrdinario ? 'Culto Ordinário' : 'Culto Extraordinário')}</div>
    </div>
  )
}
