import React, { useState } from 'react';
import { 
  UserMinus, Search, Filter, MessageCircle, Phone, 
  MapPin, CheckCircle2, Clock, AlertCircle, FileText, 
  MonitorPlay, Smartphone, Download, X, Calendar 
} from 'lucide-react';

const MOCK_AUSENCIAS = [
  { 
    id: 'aus1', 
    membroId: 'm1',
    membroNome: 'João Pedro Silva', 
    cultoData: '08/07/2026', 
    cultoNome: 'Culto de Oração', 
    status: 'pendente', // pendente, realizado, visitado, respondeu
    motivo: null, 
    detalheMotivo: '',
    contato: null
  },
  { 
    id: 'aus2', 
    membroId: 'm2',
    membroNome: 'Maria Clara Souza', 
    cultoData: '08/07/2026', 
    cultoNome: 'Culto de Oração', 
    status: 'visitado', 
    motivo: 'SAUDE_PROPRIA', 
    detalheMotivo: 'Gripe forte', 
    contato: { responsavel: 'Pr. Marcos', meio: 'VISITA_DOMICILIAR', data: '2026-07-09T14:30', nota: 'Fomos visitá-la e oramos com ela.' }
  },
  { 
    id: 'aus3', 
    membroId: 'm3',
    membroNome: 'Carlos Eduardo', 
    cultoData: '05/07/2026', 
    cultoNome: 'Culto Evangelístico', 
    status: 'realizado', 
    motivo: 'TRABALHO', 
    detalheMotivo: 'Plantão no hospital', 
    contato: { responsavel: 'Ana (Secretária)', meio: 'WHATSAPP', data: '2026-07-06T10:00', nota: 'Mandou mensagem avisando do plantão.' }
  },
  { 
    id: 'aus4', 
    membroId: 'm4',
    membroNome: 'Ana Beatriz', 
    cultoData: '05/07/2026', 
    cultoNome: 'Culto Evangelístico', 
    status: 'respondeu', 
    motivo: 'OUTROS', 
    detalheMotivo: 'Viagem de família imprevista. Retornaremos na próxima semana.', 
    contato: { responsavel: 'Liderança JA', meio: 'REDE_SOCIAL', redeSocial: 'Instagram', data: '2026-07-07T09:15', nota: 'Respondeu ao story confirmando ausência.' }
  }
];

export default function Ausencias() {
  const [activeTab, setActiveTab] = useState<'ui' | 'code' | 'docs'>('ui');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Controle de Ausências</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Acompanhamento pastoral, registro de motivos de falta e rastreamento de contatos com membros ausentes.
        </p>
      </div>

      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        <TabButton id="ui" label="Protótipo Web" icon={MonitorPlay} active={activeTab === 'ui'} onClick={() => setActiveTab('ui')} />
        <TabButton id="code" label="Código Android" icon={Smartphone} active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
        <TabButton id="docs" label="Documentação" icon={FileText} active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
      </div>

      <div className="mt-4">
        {activeTab === 'ui' && <AusenciasUI />}
        {activeTab === 'code' && <AndroidCode />}
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

function AusenciasUI() {
  const [selectedAusencia, setSelectedAusencia] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = MOCK_AUSENCIAS.filter(a => a.membroNome.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded"><Clock className="w-3 h-3"/> Pendente</span>;
      case 'realizado': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded"><MessageCircle className="w-3 h-3"/> Contatado</span>;
      case 'visitado': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded"><MapPin className="w-3 h-3"/> Visitado</span>;
      case 'respondeu': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded"><CheckCircle2 className="w-3 h-3"/> Respondeu</span>;
      default: return null;
    }
  }

  return (
    <div className="bg-[#0f172a] rounded-lg border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[700px]">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex flex-wrap gap-4 justify-between items-center sticky top-0 z-10 backdrop-blur-md">
        <div className="flex gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar ausente por nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded text-xs flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>
        <div className="flex gap-2">
           <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
             <Download className="w-3 h-3" /> Relatório
           </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
         {filteredList.map(aus => (
           <div 
             key={aus.id} 
             onClick={() => setSelectedAusencia(aus)}
             className="bg-slate-800/30 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/60 rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all"
           >
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                  <UserMinus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{aus.membroNome}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> {aus.cultoData} — {aus.cultoNome}
                  </p>
                </div>
             </div>
             
             <div className="flex flex-col items-end gap-2">
                {getStatusBadge(aus.status)}
                {aus.motivo && <span className="text-[10px] text-slate-500 font-medium">{aus.motivo.replace('_', ' ')}</span>}
             </div>
           </div>
         ))}
      </div>

      {/* MODAL */}
      {selectedAusencia && (
        <AcompanhamentoModal ausencia={selectedAusencia} onClose={() => setSelectedAusencia(null)} />
      )}
    </div>
  )
}

function AcompanhamentoModal({ ausencia, onClose }: any) {
  const [motivo, setMotivo] = useState(ausencia.motivo || '');
  const [detalheMotivo, setDetalheMotivo] = useState(ausencia.detalheMotivo || '');
  
  const [status, setStatus] = useState(ausencia.status || 'pendente');
  const [responsavel, setResponsavel] = useState(ausencia.contato?.responsavel || '');
  const [meio, setMeio] = useState(ausencia.contato?.meio || '');
  const [dataContato, setDataContato] = useState(ausencia.contato?.data ? ausencia.contato.data.substring(0, 16) : '');
  const [nota, setNota] = useState(ausencia.contato?.nota || '');

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300 inline-block mb-2">
              Registro de Ausência
            </span>
            <h3 className="font-bold text-slate-200 text-lg leading-tight">{ausencia.membroNome}</h3>
            <p className="text-xs text-indigo-400 font-medium mt-1">Faltou em: {ausencia.cultoNome} ({ausencia.cultoData})</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 bg-slate-800/80 p-1.5 rounded"><X className="w-4 h-4"/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* SECTION: MOTIVO */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
              <AlertCircle className="w-4 h-4 text-indigo-400" /> Motivo da Falta
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['SAUDE_PROPRIA', 'SAUDE_FAMILIAR', 'TRABALHO', 'ESTUDO', 'ATIVIDADE_PESSOAL', 'OUTROS'].map(opt => (
                <label key={opt} className={`flex items-center gap-2 p-3 rounded border cursor-pointer transition-colors ${motivo === opt ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                  <input type="radio" name="motivo" className="hidden" checked={motivo === opt} onChange={() => setMotivo(opt)} />
                  <span className="text-xs font-bold tracking-wide">{opt.replace('_', ' ')}</span>
                </label>
              ))}
            </div>

            {motivo === 'OUTROS' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                 <textarea 
                   placeholder="Especifique o motivo detalhadamente (Máx 1000 caracteres)..." 
                   value={detalheMotivo}
                   onChange={e => setDetalheMotivo(e.target.value)}
                   className="w-full bg-slate-900/50 border border-slate-700 rounded p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none min-h-[100px]"
                   maxLength={1000}
                 />
                 <div className="text-right text-[10px] text-slate-500 mt-1">{detalheMotivo.length}/1000</div>
              </div>
            )}
          </div>

          {/* SECTION: ACOMPANHAMENTO */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" /> Acompanhamento Pastoral
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-1.5">Status do Contato</label>
                  <select 
                    value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="pendente">Pendente de Contato</option>
                    <option value="realizado">Contato Realizado (Aguardando Retorno)</option>
                    <option value="visitado">Visitado Pessoalmente</option>
                    <option value="respondeu">Membro Respondeu/Justificou</option>
                  </select>
               </div>
               <div>
                  <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-1.5">Responsável pelo Contato</label>
                  <input 
                    type="text" placeholder="Ex: Pr. Marcos" value={responsavel} onChange={e => setResponsavel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                  />
               </div>
            </div>

            {status !== 'pendente' && (
              <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-1.5">Data e Hora do Contato</label>
                    <input 
                      type="datetime-local" value={dataContato} onChange={e => setDataContato(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-1.5">Meio de Comunicação</label>
                    <select 
                      value={meio} onChange={e => setMeio(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="LIGACAO">Ligação Telefônica</option>
                      <option value="VISITA_DOMICILIAR">Visita Domiciliar</option>
                      <option value="REENCONTRO">Reencontro no Próximo Culto</option>
                      <option value="REDE_SOCIAL">Rede Social</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-1.5">Anotações do Contato</label>
                   <textarea 
                     placeholder="Detalhes sobre a conversa, pedidos de oração, etc." value={nota} onChange={e => setNota(e.target.value)}
                     className="w-full bg-slate-900/50 border border-slate-700 rounded p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none min-h-[80px]"
                   />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">Cancelar</button>
           <button 
             onClick={onClose}
             className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 transition-colors"
           >
             Salvar Registro
           </button>
        </div>
      </div>
    </div>
  )
}


function AndroidCode() {
  const code = `// Entities
@Entity(
    tableName = "ausencias",
    foreignKeys = [
        ForeignKey(entity = MembroEntity::class, parentColumns = ["id"], childColumns = ["membroId"]),
        ForeignKey(entity = CultoEntity::class, parentColumns = ["id"], childColumns = ["cultoId"])
    ],
    indices = [Index("membroId"), Index("cultoId")]
)
data class AusenciaEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val membroId: String,
    val cultoId: String,
    val motivo: MotivoAusencia?,
    val detalheMotivo: String?,
    val statusAcompanhamento: StatusAcompanhamento = StatusAcompanhamento.PENDENTE,
    val isSynced: Boolean = false
)

@Entity(
    tableName = "contatos_ausencia",
    foreignKeys = [ForeignKey(entity = AusenciaEntity::class, parentColumns = ["id"], childColumns = ["ausenciaId"])]
)
data class ContatoAusenciaEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val ausenciaId: String,
    val responsavelNome: String,
    val dataContato: String, // ISO8601
    val meioComunicacao: MeioComunicacao,
    val notas: String?,
    val isSynced: Boolean = false
)

enum class MotivoAusencia { SAUDE_PROPRIA, SAUDE_FAMILIAR, TRABALHO, ESTUDO, ATIVIDADE_PESSOAL, OUTROS }
enum class StatusAcompanhamento { PENDENTE, REALIZADO, VISITADO, RESPONDEU }
enum class MeioComunicacao { WHATSAPP, LIGACAO, VISITA_DOMICILIAR, REENCONTRO, REDE_SOCIAL }

// Repository
class AusenciaRepositoryImpl @Inject constructor(
    private val ausenciaDao: AusenciaDao,
    private val contatoDao: ContatoDao,
    private val syncManager: SyncManager
) : AusenciaRepository {

    override suspend fun registrarContato(
        ausenciaId: String,
        status: StatusAcompanhamento,
        contato: ContatoDto?
    ): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            ausenciaDao.updateStatus(ausenciaId, status)
            
            if (contato != null) {
                val entity = ContatoAusenciaEntity(
                    ausenciaId = ausenciaId,
                    responsavelNome = contato.responsavel,
                    dataContato = contato.dataContato,
                    meioComunicacao = contato.meio,
                    notas = contato.notas
                )
                contatoDao.insert(entity)
            }
            
            syncManager.enqueueSync(SyncType.AUSENCIAS)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">AusenciaRepository.kt</span>
        <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded">Kotlin</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-slate-300 leading-relaxed">
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
         <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Módulo de Acompanhamento Pastoral</h3>
         <p className="text-sm text-slate-300 leading-relaxed mb-4">
           Este módulo preenche a lacuna entre a <strong>ausência detectada</strong> (pela falta de check-in na tela de presença) e a <strong>ação pastoral</strong> (contato ativo da liderança).
         </p>
         <ul className="list-disc list-inside text-sm text-slate-300 space-y-3 leading-relaxed marker:text-indigo-500/50">
           <li><strong>Identificação Automática:</strong> A tabela de Ausências pode ser populada automaticamente via <i>Worker</i>, comparando os membros ativos que NÃO possuem registro de check-in após o término de um Culto.</li>
           <li><strong>Rastreabilidade:</strong> Mantém histórico de QUEM ligou, QUANDO e QUAL foi o retorno, evitando que o membro receba múltiplas cobranças de diferentes líderes por falta de comunicação interna.</li>
         </ul>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Regras de Negócio Implementadas</h3>
         <div className="space-y-4">
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
             <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Validação de Motivo "Outros"</h4>
             <p className="text-xs text-slate-400 leading-relaxed">Ao selecionar a opção "Outros", a interface obriga o usuário a preencher o campo de detalhamento (limite 1000 caracteres) para evitar falta de informação.</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
             <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Relacionamento 1:N</h4>
             <p className="text-xs text-slate-400 leading-relaxed">Uma Ausência pode ter múltiplos Contatos ao longo do tempo (ex: Uma ligação sem resposta hoje, e uma visita presencial amanhã). A entidade <code>ContatoAusenciaEntity</code> garante essa rastreabilidade histórica.</p>
           </div>
         </div>
      </div>
    </div>
  )
}
