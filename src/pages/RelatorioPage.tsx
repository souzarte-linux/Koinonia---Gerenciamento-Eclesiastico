import React, { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import DateRangeSelector from '../components/relatorios/DateRangeSelector'
import ResumoTab from '../components/relatorios/ResumoTab'
import FaltantesTab from '../components/relatorios/FaltantesTab'
import AderenciaTab from '../components/relatorios/AderenciaTab'
import ComparativoTab from '../components/relatorios/ComparativoTab'
import { BarChart3, AlertCircle } from 'lucide-react'

type TabType = 'RESUMO' | 'FALTANTES' | 'ADERENCIA' | 'COMPARATIVO'

export default function RelatorioPage() {
  const [activeTab, setActiveTab] = useState<TabType>('RESUMO')
  
  // Date range state
  const hoje = new Date()
  const trintaDiasAtras = new Date()
  trintaDiasAtras.setDate(hoje.getDate() - 30)
  
  const [startDate, setStartDate] = useState(trintaDiasAtras.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(hoje.toISOString().split('T')[0])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [dadosResumo, setDadosResumo] = useState<any>(null)
  const [dadosFaltantes, setDadosFaltantes] = useState<any[]>([])
  const [dadosAderencia, setDadosAderencia] = useState<any[]>([])
  const [dadosComparativo, setDadosComparativo] = useState<any>(null)

  useEffect(() => {
    carregarDados()
  }, [startDate, endDate])

  const carregarDados = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Como não temos RPCs (Remote Procedure Calls) ou views criadas especificamente no Supabase
      // Faremos as "queries" trazendo os dados do período e processando em memória (que funciona bem para o volume local)
      
      const { data: membros } = await supabase.from('membros').select('*').eq('ativo', true)
      const { data: cultos } = await supabase
        .from('cultos')
        .select('*')
        .gte('data', startDate)
        .lte('data', endDate)
        .eq('ativo', true)
        
      const { data: presencas } = await supabase
        .from('presencas')
        .select('*, culto:cultos(data, tipo_culto)')
        .gte('culto.data', startDate)
        .lte('culto.data', endDate)

      const { data: ausencias } = await supabase
        .from('ausencias')
        .select('*')
        .gte('data_falta', startDate)
        .lte('data_falta', endDate)

      if (!membros || !cultos || !presencas || !ausencias) {
        throw new Error('Falha ao carregar dados fundamentais.')
      }

      // Processamento 1: Resumo
      const totalCultos = cultos.length
      const totalMembros = membros.length
      
      const totalPresencas = presencas.filter(p => p.culto !== null).length
      const totalAusencias = ausencias.length
      
      const taxaAderenciaMedia = totalCultos > 0 && totalMembros > 0
        ? Math.round((totalPresencas / (totalCultos * totalMembros)) * 100)
        : 0

      const presencasPorMembro: Record<string, number> = {}
      membros.forEach(m => presencasPorMembro[m.id] = 0)
      presencas.filter(p => p.culto !== null).forEach(p => {
        if (presencasPorMembro[p.membro_id] !== undefined) {
          presencasPorMembro[p.membro_id]++
        }
      })

      const membrosFrequencia = membros.map(m => ({
        nome: `${m.nome} ${m.sobrenome}`,
        presencas: presencasPorMembro[m.id] || 0
      })).sort((a, b) => b.presencas - a.presencas)

      setDadosResumo({
        totalCultos,
        totalPresencas,
        totalAusencias,
        taxaAderenciaMedia,
        membrosMaisFrequentes: membrosFrequencia.slice(0, 5),
        membrosMenosFrequentes: [...membrosFrequencia].reverse().slice(0, 5)
      })

      // Processamento 2: Faltantes
      const faltasPorMembro: Record<string, { total: number, motivos: Record<string, number>, ultimaFalta: string | null }> = {}
      membros.forEach(m => {
        faltasPorMembro[m.id] = { total: 0, motivos: {}, ultimaFalta: null }
      })
      
      ausencias.forEach(a => {
        if (faltasPorMembro[a.membro_id]) {
          faltasPorMembro[a.membro_id].total++
          
          const motivo = a.motivo || 'OUTRO'
          faltasPorMembro[a.membro_id].motivos[motivo] = (faltasPorMembro[a.membro_id].motivos[motivo] || 0) + 1
          
          if (!faltasPorMembro[a.membro_id].ultimaFalta || new Date(a.data_falta) > new Date(faltasPorMembro[a.membro_id].ultimaFalta!)) {
            faltasPorMembro[a.membro_id].ultimaFalta = a.data_falta
          }
        }
      })

      const listFaltantes = membros.map(m => ({
        membroId: m.id,
        nome: `${m.nome} ${m.sobrenome}`,
        totalFaltas: faltasPorMembro[m.id].total,
        motivos: faltasPorMembro[m.id].motivos,
        ultimaFalta: faltasPorMembro[m.id].ultimaFalta
      })).filter(f => f.totalFaltas > 0)

      setDadosFaltantes(listFaltantes)

      // Processamento 3: Aderência (cultos)
      const presencasPorCulto: Record<string, { presentes: number, atrasados: number }> = {}
      cultos.forEach(c => presencasPorCulto[c.id] = { presentes: 0, atrasados: 0 })
      
      presencas.filter(p => p.culto !== null).forEach(p => {
        if (presencasPorCulto[p.culto_id]) {
          presencasPorCulto[p.culto_id].presentes++
          if (p.atrasado) presencasPorCulto[p.culto_id].atrasados++
        }
      })

      const listAderencia = cultos.map(c => {
        const stats = presencasPorCulto[c.id] || { presentes: 0, atrasados: 0 }
        const aderencia = totalMembros > 0 ? Math.round((stats.presentes / totalMembros) * 100) : 0
        return {
          cultoId: c.id,
          data: c.data,
          horario: c.horario_inicio,
          tipo: c.tipo_culto,
          percentual: aderencia,
          presentes: stats.presentes,
          esperado: totalMembros,
          atrasados: stats.atrasados
        }
      })

      setDadosAderencia(listAderencia)

      // Processamento 4: Comparativo
      const evolucaoAderencia: Record<string, { ordinario: number | null, extraordinario: number | null }> = {}
      
      // Agrupar por data
      listAderencia.forEach(a => {
        const d = new Date(a.data).toLocaleDateString('pt-BR')
        if (!evolucaoAderencia[d]) evolucaoAderencia[d] = { ordinario: null, extraordinario: null }
        
        if (a.tipo === 'ORDINARIO') {
          evolucaoAderencia[d].ordinario = a.percentual
        } else {
          evolucaoAderencia[d].extraordinario = a.percentual
        }
      })

      const arrEvolucao = Object.entries(evolucaoAderencia).map(([data, vals]) => ({
        data,
        ...vals
      }))

      let totalOrd = 0
      let totalExt = 0
      listAderencia.forEach(a => {
        if (a.tipo === 'ORDINARIO') totalOrd += a.presentes
        else totalExt += a.presentes
      })

      const contagemMotivos: Record<string, number> = {}
      ausencias.forEach(a => {
        const motivo = a.motivo || 'OUTRO'
        contagemMotivos[motivo] = (contagemMotivos[motivo] || 0) + 1
      })
      
      const arrMotivos = Object.entries(contagemMotivos).map(([nome, valor]) => ({
        nome,
        valor
      })).sort((a, b) => b.valor - a.valor)

      setDadosComparativo({
        dadosAderenciaTempo: arrEvolucao,
        dadosPresencasPorTipo: [
          { tipo: 'Ordinário', total: totalOrd },
          { tipo: 'Extraordinário', total: totalExt }
        ],
        dadosMotivosBreakdown: arrMotivos
      })

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erro ao carregar dados do relatório')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-adventista-dark)] flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Relatórios e Analytics
          </h2>
          <DateRangeSelector 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {/* Tabs Nav */}
        <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
          {(['RESUMO', 'FALTANTES', 'ADERENCIA', 'COMPARATIVO'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition border-b-2 ${
                activeTab === tab 
                  ? 'border-[var(--color-adventista-dark)] text-[var(--color-adventista-dark)]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-adventista-dark)]"></div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {activeTab === 'RESUMO' && dadosResumo && <ResumoTab dados={dadosResumo} />}
          {activeTab === 'FALTANTES' && <FaltantesTab dados={dadosFaltantes} />}
          {activeTab === 'ADERENCIA' && <AderenciaTab dados={dadosAderencia} />}
          {activeTab === 'COMPARATIVO' && dadosComparativo && (
            <ComparativoTab 
              dadosAderenciaTempo={dadosComparativo.dadosAderenciaTempo} 
              dadosPresencasPorTipo={dadosComparativo.dadosPresencasPorTipo}
              dadosMotivosBreakdown={dadosComparativo.dadosMotivosBreakdown}
            />
          )}
        </div>
      )}
    </div>
  )
}
