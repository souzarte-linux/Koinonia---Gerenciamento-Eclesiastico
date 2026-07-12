import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Users, Info, Clock, MonitorPlay, Smartphone, FileText, ChevronLeft, ChevronRight, X, Phone, Instagram, Facebook, Video } from 'lucide-react';

// Mocks
const MOCK_MINISTERIOS = [
  { 
    id: 'min1', 
    nome: 'Ministério Jovem (JA)', 
    diretor: { nome: 'Ana', sobrenome: 'Silva', whatsapp: '+55 11 99999-9999', endereco: 'Rua A, 123' },
    viceDiretor: { nome: 'Carlos', sobrenome: 'Souza', whatsapp: '+55 11 88888-8888', endereco: 'Rua B, 456' }
  },
  { 
    id: 'min2', 
    nome: 'Ministério da Mulher', 
    diretor: { nome: 'Maria', sobrenome: 'Oliveira', whatsapp: '+55 11 77777-7777', endereco: 'Rua C, 789' },
    viceDiretor: { nome: 'Joana', sobrenome: 'Santos', whatsapp: '+55 11 66666-6666', endereco: 'Rua D, 101' }
  }
];

const MOCK_EVENTS = [
  { id: 'ev1', date: '2026-07-11', type: 'ordinario', nome: 'Culto JA', inicio: '16:30', fim: '18:00', ministerioId: 'min1' },
  { id: 'ev2', date: '2026-07-15', type: 'especial', nome: 'Semana de Oração', inicio: '19:30', fim: '20:30', tema: 'Fé Inabalável', orador: { nome: 'Pr. Marcos Silva', whatsapp: '11912345678', instagram: '@prmarcos', facebook: 'Marcos Silva', tiktok: '@prmarcos' }, ministerioId: 'min2' }
];

export default function CultosAgenda() {
  const [activeTab, setActiveTab] = useState<'ui' | 'android' | 'docs'>('ui');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Agenda e Cadastro de Cultos</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Planejamento de calendário e registro de cultos ordinários e eventos de evangelismo.
        </p>
      </div>

      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        <TabButton id="ui" label="Protótipo Web" icon={MonitorPlay} active={activeTab === 'ui'} onClick={() => setActiveTab('ui')} />
        <TabButton id="android" label="Código Android" icon={Smartphone} active={activeTab === 'android'} onClick={() => setActiveTab('android')} />
        <TabButton id="docs" label="Documentação" icon={FileText} active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
      </div>

      <div className="mt-4">
        {activeTab === 'ui' && <CultosAgendaUI />}
        {activeTab === 'android' && <AndroidCode />}
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

function CultosAgendaUI() {
  const [view, setView] = useState<'calendar' | 'create'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedMinisterio, setSelectedMinisterio] = useState<any>(null);

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[700px]">
      <div className="flex border-b border-slate-800 bg-slate-800/50 p-2">
        <div className="flex gap-2">
          <button 
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${view === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            Calendário
          </button>
          <button 
            onClick={() => setView('create')}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${view === 'create' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Plus className="w-4 h-4" /> Novo Culto
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        {view === 'calendar' ? (
          <CalendarView onEventClick={setSelectedEvent} />
        ) : (
          <CreateEventView />
        )}

        {/* Modals */}
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onMinisterioClick={(minId: string) => setSelectedMinisterio(MOCK_MINISTERIOS.find(m => m.id === minId))} />
        )}
        
        {selectedMinisterio && (
          <MinisterioModal ministerio={selectedMinisterio} onClose={() => setSelectedMinisterio(null)} />
        )}
      </div>
    </div>
  );
}

function CalendarView({ onEventClick }: { onEventClick: (e: any) => void }) {
  // Simple mock calendar grid for demonstration
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-200 uppercase tracking-tight">Julho 2026</h3>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"><ChevronLeft className="w-5 h-5" /></button>
          <button className="p-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-700 flex-1 border border-slate-700 rounded-lg overflow-hidden">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="bg-slate-800/80 p-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {day}
          </div>
        ))}
        
        {/* Empty cells for padding start */}
        <div className="bg-slate-900 p-2 min-h-[80px]"></div>
        <div className="bg-slate-900 p-2 min-h-[80px]"></div>
        <div className="bg-slate-900 p-2 min-h-[80px]"></div>
        
        {days.map(day => {
          const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
          const isSunday = (day + 3) % 7 === 0;
          const isWednesday = (day + 3) % 7 === 3;
          const isSaturday = (day + 3) % 7 === 6;
          
          const defaultEvents = [];
          if (isSunday) defaultEvents.push({ id: `def-dom-${day}`, type: 'ordinario', nome: 'Culto Evangelístico', inicio: '18:30', fim: '19:45', default: true });
          if (isWednesday) defaultEvents.push({ id: `def-qua-${day}`, type: 'ordinario', nome: 'Culto de Oração', inicio: '19:30', fim: '20:45', default: true });
          if (isSaturday) defaultEvents.push({ id: `def-sab-${day}`, type: 'ordinario', nome: 'Culto Divino', inicio: '08:45', fim: '11:45', default: true });
          
          const customEvents = MOCK_EVENTS.filter(e => e.date === dateStr);
          const allEvents = [...defaultEvents, ...customEvents];

          return (
            <div key={day} className="bg-slate-900 p-2 border-t border-l border-slate-800/50 min-h-[80px] hover:bg-slate-800/30 transition-colors">
              <span className={`text-xs font-bold ${day === 11 ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-400'}`}>
                {day}
              </span>
              <div className="mt-2 space-y-1">
                {allEvents.map((evt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => onEventClick(evt)}
                    className={`w-full text-left text-[9px] px-1.5 py-1 rounded truncate border ${
                      evt.type === 'especial' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                        : evt.default 
                          ? 'bg-slate-800 text-slate-400 border-slate-700/50' 
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                    }`}
                  >
                    {evt.inicio} - {evt.nome}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

function CreateEventView() {
  const [tipo, setTipo] = useState('ordinario');
  const [localTipo, setLocalTipo] = useState('igreja');
  const [minId, setMinId] = useState('');
  
  const selectedMin = MOCK_MINISTERIOS.find(m => m.id === minId);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700 space-y-6">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" /> Informações Básicas
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Data do Culto</label>
            <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Início</label>
              <input type="time" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Fim</label>
              <input type="time" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
          <div>
            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Tipo de Culto</label>
            <select 
              value={tipo} onChange={e => setTipo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ordinario">Ordinário (Padrão)</option>
              <option value="extraordinario">Extraordinário / Especial</option>
            </select>
          </div>
          {tipo === 'extraordinario' && (
            <div>
              <label className="text-[10px] font-bold tracking-widest text-amber-500/70 uppercase block mb-2">Nome da Série/Evento</label>
              <input type="text" placeholder="Ex: Semana Evangelística" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-amber-500/50 focus:outline-none" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700 space-y-6">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" /> Responsabilidade
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Ministério Responsável</label>
            <select 
              value={minId} onChange={e => setMinId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Selecione um ministério...</option>
              {MOCK_MINISTERIOS.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          {selectedMin && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded p-3">
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Diretor(a)</span>
              <p className="text-sm text-slate-300">{selectedMin.diretor.nome} {selectedMin.diretor.sobrenome}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700 space-y-6">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400" /> Local & Evangelismo
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Tipo de Local</label>
            <select 
              value={localTipo} onChange={e => setLocalTipo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="igreja">Igreja Local - Templo (Padrão)</option>
              <option value="urbano">Igreja Local - Urbano (Bairro)</option>
              <option value="externo">Igreja Local - Externo / Ar Livre</option>
            </select>
          </div>

          {localTipo === 'externo' && (
            <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 border border-slate-700 rounded">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Ambiente</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none">
                  <option>Parque</option>
                  <option>Estádio</option>
                  <option>Escola</option>
                  <option>Praça Pública</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Nome/Descrição do Local</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          )}

          {localTipo === 'urbano' && (
            <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 border border-slate-700 rounded">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Bairro</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Nome da Rua</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-700/50">
             <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-2">Estratégia de Evangelismo (Opcional)</label>
             <textarea className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none h-20" placeholder="Descreva os objetivos, estratégias adotadas e resultados esperados..."></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 rounded text-xs font-bold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-colors">
          Salvar Culto
        </button>
      </div>
    </div>
  )
}

function EventModal({ event, onClose, onMinisterioClick }: any) {
  const isEspecial = event.type === 'especial';
  const ministerio = MOCK_MINISTERIOS.find(m => m.id === event.ministerioId);

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className={`p-4 border-b flex justify-between items-start ${isEspecial ? 'border-amber-500/20 bg-amber-500/5' : 'border-slate-800 bg-slate-800/50'}`}>
          <div>
            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded inline-block mb-2 ${isEspecial ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
              {isEspecial ? 'Culto Especial' : 'Culto Ordinário'}
            </span>
            <h3 className="font-bold text-slate-200 text-lg leading-tight">{event.nome}</h3>
            {event.tema && <p className="text-sm text-amber-400 font-medium mt-1">Tema: "{event.tema}"</p>}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 bg-slate-800/80 p-1.5 rounded"><X className="w-4 h-4"/></button>
        </div>
        
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-4 bg-slate-800/30 p-3 rounded border border-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300 font-mono">{event.inicio} - {event.fim}</span>
            </div>
            {event.date && (
              <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{event.date}</span>
              </div>
            )}
          </div>

          {ministerio && (
             <div className="space-y-2">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Organização</h4>
               <button 
                 onClick={() => onMinisterioClick(ministerio.id)}
                 className="w-full text-left bg-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/10 transition-colors rounded p-3 flex justify-between items-center group"
               >
                 <div>
                   <p className="text-sm font-bold text-indigo-300">{ministerio.nome}</p>
                   <p className="text-xs text-indigo-400/70">Diretor(a): {ministerio.diretor.nome}</p>
                 </div>
                 <Info className="w-4 h-4 text-indigo-400 opacity-50 group-hover:opacity-100" />
               </button>
             </div>
          )}

          {isEspecial && event.orador && (
            <div className="space-y-3 border-t border-slate-800 pt-5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Orador/Pregador</h4>
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700 space-y-3">
                <p className="text-base font-bold text-slate-200">{event.orador.nome}</p>
                <div className="flex gap-3">
                  {event.orador.whatsapp && <div className="text-[10px] flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded"><Phone className="w-3 h-3"/> {event.orador.whatsapp}</div>}
                  {event.orador.instagram && <div className="text-[10px] flex items-center gap-1.5 text-pink-400 bg-pink-400/10 px-2 py-1 rounded"><Instagram className="w-3 h-3"/> {event.orador.instagram}</div>}
                  {event.orador.facebook && <div className="text-[10px] flex items-center gap-1.5 text-blue-400 bg-blue-400/10 px-2 py-1 rounded"><Facebook className="w-3 h-3"/> {event.orador.facebook}</div>}
                  {event.orador.tiktok && <div className="text-[10px] flex items-center gap-1.5 text-slate-300 bg-slate-700 px-2 py-1 rounded"><Video className="w-3 h-3"/> {event.orador.tiktok}</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MinisterioModal({ ministerio, onClose }: any) {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-indigo-500/20 bg-indigo-500/10 flex justify-between items-start">
          <div>
            <h3 className="font-bold text-indigo-300 text-lg leading-tight flex items-center gap-2">
               <Users className="w-5 h-5" /> {ministerio.nome}
            </h3>
          </div>
          <button onClick={onClose} className="text-indigo-400/70 hover:text-indigo-300 bg-indigo-900/50 p-1.5 rounded"><X className="w-4 h-4"/></button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Diretoria Atual</span>
             <div className="space-y-4">
               <div>
                 <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Diretor(a)</p>
                 <p className="text-sm text-slate-200 font-medium">{ministerio.diretor.nome} {ministerio.diretor.sobrenome}</p>
                 <div className="text-xs text-slate-400 mt-1 flex flex-col gap-1">
                   <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> {ministerio.diretor.whatsapp}</span>
                   <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {ministerio.diretor.endereco}</span>
                 </div>
               </div>
               
               <div className="pt-3 border-t border-slate-700/50">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Vice-Diretor(a)</p>
                 <p className="text-sm text-slate-300 font-medium">{ministerio.viceDiretor.nome} {ministerio.viceDiretor.sobrenome}</p>
                 <div className="text-xs text-slate-500 mt-1 flex flex-col gap-1">
                   <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> {ministerio.viceDiretor.whatsapp}</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AndroidCode() {
  const code = `// Entities e DTOs
@Entity(tableName = "cultos")
data class CultoEntity(
    @PrimaryKey val id: String,
    val data: String, // YYYY-MM-DD
    val horarioInicio: String, // HH:MM
    val horarioFim: String?,
    val tipo: CultoTipo, // ORDINARIO, EXTRAORDINARIO
    val ministerioId: String?,
    val localId: String
)

@Entity(tableName = "locais_culto")
data class LocalCultoEntity(
    @PrimaryKey val id: String,
    val tipoLocal: LocalTipo, // IGREJA, URBANO, EXTERNO
    val nome: String,
    val endereco: String?,
    val bairro: String?,
    val rua: String?
)

@Entity(tableName = "cultos_especiais")
data class CultoEspecialEntity(
    @PrimaryKey val id: String,
    val cultoId: String,
    val tema: String,
    val oradorId: String?,
    val estrategiaEvangelismo: String?
)

// Repository
class CultoRepositoryImpl @Inject constructor(
    private val dao: CultoDao,
    private val supabase: SupabaseClient
) : CultoRepository {

    override fun getCultosNoMes(mes: Int, ano: Int): Flow<List<CultoCompleto>> {
        // Retorna cultos padrão gerados dinamicamente + cultos extraordinários cadastrados
        return dao.getCultosComDetalhes(mes, ano)
    }

    override suspend fun criarCulto(dto: NovoCultoDto): Result<Unit> {
        return try {
            val local = LocalCultoEntity(...)
            dao.insert(local)

            val culto = CultoEntity(...)
            dao.insert(culto)

            if (dto.tipo == CultoTipo.EXTRAORDINARIO) {
                val especial = CultoEspecialEntity(...)
                dao.insert(especial)
            }
            
            // Trigger background sync
            SyncWorker.enqueue(culto.id)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">CultoRepository.kt</span>
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
         <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Geração de Cultos Ordinários</h3>
         <p className="text-sm text-slate-300 leading-relaxed mb-4">
           Para evitar a necessidade de cadastrar manualmente todos os cultos regulares, a aplicação (UI/ViewModel) injeta no calendário os cultos padrão: Domingo (18:30), Quarta (19:30) e Sábado (08:45).
         </p>
         <div className="bg-slate-900 rounded border border-slate-700 p-4 font-mono text-xs text-slate-400">
            Estes eventos recebem um ID virtual (ex: <code>def-dom-11</code>).<br/><br/>
            Se o usuário decidir marcar presença em um desses cultos virtuais, o Repository materializa esse culto no banco de dados local antes de registrar a presença.
         </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Tracking de Evangelismo</h3>
         <p className="text-sm text-slate-300 leading-relaxed mb-4">
           O formulário de Novo Culto permite registrar estratégias de evangelismo, diferenciando locais: Externo (Praças, Parques) e Urbano (Rua/Bairro). Isso popula a tabela <code>locais_culto</code>, criando um histórico geográfico das ações da igreja.
         </p>
      </div>
    </div>
  )
}
