import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import { 
  BarChart3, FileText, MonitorPlay, Smartphone, Download, Filter, 
  TrendingDown, TrendingUp, MapPin, Users, Clock, AlertCircle,
  LineChart as LineChartIcon
} from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const PIE_COLORS = ['#ef4444', '#10b981'];

const CHEGADAS_DATA = [
  { time: '18:00', count: 15 },
  { time: '18:15', count: 45 },
  { time: '18:30', count: 120 }, // PICO
  { time: '18:45', count: 50 },
  { time: '19:00', count: 20 },
  { time: '19:15', count: 5 },
  { time: '19:30', count: 2 },
];

const ADERENCIA_DIA_DATA = [
  { dia: 'Dom', ordinario: 75, extraordinario: 95 },
  { dia: 'Qua', ordinario: 45, extraordinario: 65 },
  { dia: 'Sáb', ordinario: 85, extraordinario: 100 },
];

const PRE_FERIADO_DATA = [
  { name: 'Viajou/Ausente', value: 35 },
  { name: 'Permaneceu', value: 65 },
];

const EVANGELISMO_DATA = [
  { local: 'Praça Central', visitantes: 45, contatos: 20 },
  { local: 'Bairro Esperança', visitantes: 30, contatos: 15 },
  { local: 'Escola Estadual', visitantes: 60, contatos: 40 },
  { local: 'Série Templo', visitantes: 85, contatos: 50 },
];

const MEMBROS_FALTANTES = [
  { id: 1, nome: 'João Pedro Silva', faltas: 12, ultimaFalta: 'Qua, 08/07 - 19:30' },
  { id: 2, nome: 'Maria Clara Souza', faltas: 10, ultimaFalta: 'Qua, 08/07 - 19:30' },
  { id: 3, nome: 'Carlos Eduardo', faltas: 8, ultimaFalta: 'Dom, 05/07 - 18:30' },
  { id: 4, nome: 'Ana Beatriz', faltas: 7, ultimaFalta: 'Dom, 28/06 - 18:30' },
  { id: 5, nome: 'Lucas Ferreira', faltas: 6, ultimaFalta: 'Sáb, 11/07 - 08:45' },
];

export default function Relatorios() {
  const [activeTab, setActiveTab] = useState<'ui' | 'code' | 'docs'>('ui');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Relatórios e Insights</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Painel analítico com dados de presença, tendências, acompanhamento de faltosos e resultados de evangelismo.
        </p>
      </div>

      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        <TabButton id="ui" label="Dashboard (Web/Android)" icon={MonitorPlay} active={activeTab === 'ui'} onClick={() => setActiveTab('ui')} />
        <TabButton id="code" label="Analytics Service & SQL" icon={Smartphone} active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
        <TabButton id="docs" label="Documentação" icon={FileText} active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
      </div>

      <div className="mt-4">
        {activeTab === 'ui' && <DashboardUI />}
        {activeTab === 'code' && <CodeView />}
        {activeTab === 'docs' && <Documentation />}
      </div>
    </div>
  );
}

function TabButton({ label, icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
        active 
          ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10' 
          : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function DashboardUI() {
  return (
    <div className="bg-[#0f172a] rounded-lg border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[800px] overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
        <div className="flex gap-2">
           <select className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
             <option>Últimos 30 dias</option>
             <option>Último Trimestre</option>
             <option>Ano Atual (2026)</option>
           </select>
           <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-xs flex items-center gap-2 transition-colors">
             <Filter className="w-3 h-3" /> Filtros
           </button>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
          <Download className="w-3 h-3" /> Exportar PDF
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* ROW 1: Ranking de Faltas e Aderência Pré-Feriado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/20 border border-slate-700/50 rounded-lg p-5">
             <div className="flex justify-between items-center mb-5">
               <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                 <AlertCircle className="w-4 h-4" /> Alerta de Faltas (Top 5)
               </h3>
             </div>
             <div className="space-y-3">
               {MEMBROS_FALTANTES.map((m, i) => (
                 <div key={m.id} className="flex justify-between items-center p-2.5 bg-slate-900/50 rounded border border-slate-800 hover:bg-slate-800/80 transition-colors">
                   <div className="flex items-center gap-3">
                     <span className="text-xs font-bold text-slate-500 bg-slate-800 w-6 h-6 rounded flex items-center justify-center">{i + 1}</span>
                     <div>
                       <p className="text-sm font-bold text-slate-200">{m.nome}</p>
                       <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> Última: {m.ultimaFalta}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="text-rose-400 font-bold text-sm bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">{m.faltas} faltas</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-slate-800/20 border border-slate-700/50 rounded-lg p-5">
             <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 mb-2">
               <TrendingDown className="w-4 h-4" /> Análise Pré-Feriados
             </h3>
             <p className="text-xs text-slate-400 mb-6">Comportamento da congregação em cultos que antecedem feriados prolongados.</p>
             <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PRE_FERIADO_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {PRE_FERIADO_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}/>
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* ROW 2: Horários de Chegada */}
        <div className="bg-slate-800/20 border border-slate-700/50 rounded-lg p-5">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                 <LineChartIcon className="w-4 h-4" /> Curva de Horários de Chegada
               </h3>
               <p className="text-xs text-slate-400 mt-1">Identificação de pico de aderência (Cultos de Domingo 18:30)</p>
             </div>
             <div className="bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded text-xs text-rose-400 font-bold flex items-center gap-2">
               Pico de Atrasos: 18:45
             </div>
           </div>
           
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHEGADAS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickMargin={10} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                     labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}
                     itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                  />
                  <ReferenceLine x="18:30" stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Início', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="count" name="Membros/Visitantes" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* ROW 3: Aderência por Dia & Evangelismo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/20 border border-slate-700/50 rounded-lg p-5">
             <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-1">
               <BarChart3 className="w-4 h-4" /> Aderência por Dia (%)
             </h3>
             <p className="text-xs text-slate-400 mb-6">Comparativo: Ordinário vs Extraordinário</p>
             
             <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ADERENCIA_DIA_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="dia" stroke="#64748b" fontSize={11} tickMargin={8} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip 
                      cursor={{ fill: '#334155', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="ordinario" name="Ordinário" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="extraordinario" name="Extraordinário" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-slate-800/20 border border-slate-700/50 rounded-lg p-5">
             <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-1">
               <MapPin className="w-4 h-4" /> Resultados de Evangelismo
             </h3>
             <p className="text-xs text-slate-400 mb-6">Visitantes e Contatos por Local de Ação</p>
             
             <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={EVANGELISMO_DATA} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="local" type="category" stroke="#64748b" fontSize={10} width={80} />
                    <Tooltip 
                      cursor={{ fill: '#334155', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="visitantes" name="Visitantes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="contatos" name="Estudos/Contatos" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CodeView() {
  const code = `// app/src/main/java/com/koinonia/domain/service/AnalyticsService.kt
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class AnalyticsService @Inject constructor(
    private val presencaDao: PresencaDao,
    private val cultoDao: CultoDao
) {

    // 1. Membros Mais Faltantes
    // Usa uma query SQL otimizada com LEFT JOIN para encontrar cultos onde o membro NÃO tem presença
    fun getRankingFaltas(mes: Int, ano: Int): Flow<List<FaltosoDTO>> {
        val query = """
            SELECT m.id, m.nome, m.sobrenome, COUNT(c.id) as total_faltas, MAX(c.data) as ultima_falta
            FROM membros m
            CROSS JOIN cultos c
            LEFT JOIN presencas p ON p.memberId = m.id AND p.cultoId = c.id
            WHERE p.id IS NULL 
              AND strftime('%m', c.data) = :mes 
              AND strftime('%Y', c.data) = :ano
              AND c.data <= date('now')
            GROUP BY m.id
            ORDER BY total_faltas DESC
            LIMIT 10
        """
        return presencaDao.executeRawQuery(query)
    }

    // 2. Curva de Chegadas (Agrupado por intervalo de 15/30 min)
    fun getCurvaHorariosChegada(cultoId: String): Flow<List<HorarioChegadaDTO>> {
        val query = """
            SELECT 
                -- Arredondamento para blocos de 15 minutos via SQLite
                strftime('%H:', horarioChegada) || 
                printf('%02d', (cast(strftime('%M', horarioChegada) as integer) / 15) * 15) as time_block,
                COUNT(id) as quantidade
            FROM presencas
            WHERE cultoId = :cultoId
            GROUP BY time_block
            ORDER BY time_block ASC
        """
        return presencaDao.executeRawQuery(query)
    }

    // 3. Aderência Pré-Feriado
    fun getAnalisePreFeriado(feriadosDatas: List<String>): Flow<AderenciaFeriadoDTO> {
        // Logica para cruzar datas de cultos que caem 1 a 2 dias antes das datas informadas
        // e calcular a % de presenças vs total de membros ativos.
        return analyticsDao.calculatePreHolidayAdherence(feriadosDatas)
    }
}`;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">AnalyticsService.kt</span>
        <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded">Kotlin / SQLite</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-emerald-400/90 leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  )
}

function Documentation() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Arquitetura de Relatórios</h3>
         <ul className="list-disc list-inside text-sm text-slate-300 space-y-3 leading-relaxed marker:text-indigo-500/50">
           <li><strong>Processamento Local:</strong> Como o app é <em>Offline-First</em>, a maioria das agregações de relatórios (especialmente de curto prazo) é feita localmente via <strong>SQLite (Room)</strong>.</li>
           <li><strong>Queries Otimizadas:</strong> O código Kotlin demonstra o uso de agregações complexas via SQL, como o <code>CROSS JOIN</code> seguido de <code>LEFT JOIN</code> para encontrar a <em>ausência</em> de registros (faltas).</li>
           <li><strong>Blocos de Tempo:</strong> O gráfico de curva de chegadas agrupa os registros de HH:MM:SS para blocos de 15 minutos usando funções nativas de string/math do SQLite.</li>
         </ul>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Insights Gerados</h3>
         <div className="space-y-4">
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
             <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">1. Ranking de Faltas</h4>
             <p className="text-xs text-slate-400 leading-relaxed">Permite que a secretaria e liderança pastoral ajam proativamente, visitando ou enviando mensagens para membros com tendência de queda de assiduidade, baseando-se na data exata da última presença.</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
             <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">2. Curva de Horários</h4>
             <p className="text-xs text-slate-400 leading-relaxed">Mostra visualmente o "pico" de chegadas. Se o culto começa 18:30 mas o pico é 18:45, a liderança tem dados reais para iniciar campanhas de pontualidade ou ajustar o horário de início.</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
             <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">3. Mapeamento de Evangelismo</h4>
             <p className="text-xs text-slate-400 leading-relaxed">Cruza a tabela de locais externos com o volume de visitantes, indicando quais bairros ou praças têm maior ROI (Retorno sobre Investimento de esforço) para ações da Igreja Local.</p>
           </div>
         </div>
      </div>
    </div>
  )
}
