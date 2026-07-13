import React, { useState, useEffect } from 'react'
import { 
  addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, 
  isSameMonth, isSameDay, format 
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '../config/supabase'
import { useAppStore } from '../stores/useAppStore'
import { Culto } from '../types'
import CalendarioHeader from '../components/CalendarioHeader'
import CultoCard from '../components/CultoCard'
import CultoDetalheModal from '../components/CultoDetalheModal'
import CadastrarCultoForm from '../components/CadastrarCultoForm'

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [cultos, setCultos] = useState<Culto[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCulto, setSelectedCulto] = useState<Culto | null>(null)
  const [showCadastroModal, setShowCadastroModal] = useState(false)
  
  const { presencas, members } = useAppStore()

  useEffect(() => {
    carregarCultos()
  }, [currentDate])

  const carregarCultos = async () => {
    setLoading(true)
    try {
      const dataInicio = startOfWeek(startOfMonth(currentDate))
      const dataFim = endOfWeek(endOfMonth(currentDate))

      const { data, error } = await supabase
        .from('cultos')
        .select('*')
        .gte('data', format(dataInicio, 'yyyy-MM-dd'))
        .lte('data', format(dataFim, 'yyyy-MM-dd'))
        .eq('ativo', true)

      if (error) throw error
      
      const cultosMapeados: Culto[] = (data || []).map(c => ({
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
    } catch (error) {
      console.error('Erro ao buscar cultos:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const today = () => setCurrentDate(new Date())

  const dataInicio = startOfWeek(startOfMonth(currentDate))
  const dataFim = endOfWeek(endOfMonth(currentDate))
  const days = eachDayOfInterval({ start: dataInicio, end: dataFim })
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const handleCultoClick = (culto: Culto) => {
    setSelectedCulto(culto)
  }

  const handleCadastroSuccess = () => {
    setShowCadastroModal(false)
    carregarCultos()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <CalendarioHeader 
            currentDate={currentDate} 
            onNextMonth={nextMonth} 
            onPrevMonth={prevMonth} 
            onToday={today} 
          />
          <button 
            onClick={() => setShowCadastroModal(true)}
            className="px-4 py-2 bg-[var(--color-adventista-dark)] text-white rounded-lg hover:bg-opacity-90 transition font-medium self-start sm:self-auto shrink-0"
          >
            + Agendar Culto
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
          {/* Cabeçalho dias da semana */}
          {weekDays.map(day => (
            <div key={day} className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}

          {/* Dias do calendário */}
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const dayCultos = cultos.filter(c => c.data === format(day, 'yyyy-MM-dd')).sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio))

            return (
              <div 
                key={day.toISOString()} 
                className={`min-h-[120px] bg-white p-2 transition hover:bg-gray-50 ${!isCurrentMonth ? 'text-gray-400 bg-gray-50/50' : 'text-gray-900'} ${isToday ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`text-right text-sm mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-blue-600 text-white' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {dayCultos.map(culto => (
                    <CultoCard 
                      key={culto.id} 
                      culto={culto} 
                      onClick={() => handleCultoClick(culto)} 
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <CultoDetalheModal 
        isOpen={!!selectedCulto}
        culto={selectedCulto}
        onClose={() => setSelectedCulto(null)}
        totalEsperado={members.length}
        totalPresencas={presencas.filter(p => p.cultoId === selectedCulto?.id).length}
      />

      <CadastrarCultoForm 
        isOpen={showCadastroModal}
        onClose={() => setShowCadastroModal(false)}
        onSuccess={handleCadastroSuccess}
      />
    </div>
  )
}
