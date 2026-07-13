import React from 'react'
import { X, Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react'
import { Culto } from '../types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CultoDetalheModalProps {
  isOpen: boolean
  culto: Culto | null
  totalPresencas: number
  totalEsperado: number
  onClose: () => void
}

export default function CultoDetalheModal({
  isOpen,
  culto,
  totalPresencas,
  totalEsperado,
  onClose
}: CultoDetalheModalProps) {
  if (!isOpen || !culto) return null

  const isOrdinario = culto.tipoCulto === 'ORDINARIO'
  const aderencia = totalEsperado > 0 ? Math.round((totalPresencas / totalEsperado) * 100) : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className={`p-6 text-white ${isOrdinario ? 'bg-[var(--color-adventista-dark)]' : 'bg-purple-700'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="px-2 py-1 bg-white/20 rounded text-xs font-semibold uppercase tracking-wider">
              {culto.tipoCulto}
            </span>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-2xl font-bold mt-2">
            {culto.nomeSerie || culto.tema || (isOrdinario ? 'Culto Ordinário' : 'Culto Extraordinário')}
          </h2>
          {culto.tema && culto.nomeSerie && (
            <p className="text-white/80 mt-1">{culto.tema}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span>{format(parseISO(culto.data), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="w-5 h-5 text-gray-400" />
            <span>{culto.horarioInicio} - {culto.horarioFim}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span>{culto.localId}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <BookOpen className="w-5 h-5 text-gray-400" />
            <span>Ministério: {culto.ministerioId}</span>
          </div>

          <hr className="my-4" />

          {/* Estatísticas */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Estatísticas de Presença
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Presentes / Total</p>
                <p className="text-xl font-bold text-gray-900">{totalPresencas} / {totalEsperado}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Aderência</p>
                <p className={`text-xl font-bold ${aderencia >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                  {aderencia}%
                </p>
              </div>
            </div>
            
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${aderencia >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(aderencia, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
