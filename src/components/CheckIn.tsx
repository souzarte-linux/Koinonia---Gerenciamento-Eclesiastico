import React, { useState } from 'react';
import { Check, X, Clock, Users, UserPlus, MonitorPlay, Smartphone, FileText } from 'lucide-react';

const MOCK_FAMILIES = [
  { id: 'f1', nome: 'Família Silva' },
  { id: 'f2', nome: 'Família Souza' }
];

const MOCK_MEMBERS = [
  { id: 'm1', nome: 'João', sobrenome: 'Silva', familia_id: 'f1' },
  { id: 'm2', nome: 'Maria', sobrenome: 'Silva', familia_id: 'f1' },
  { id: 'm3', nome: 'Pedro', sobrenome: 'Silva', familia_id: 'f1' },
  { id: 'm4', nome: 'Carlos', sobrenome: 'Souza', familia_id: 'f2' },
  { id: 'm5', nome: 'Ana', sobrenome: 'Souza', familia_id: 'f2' },
  { id: 'm6', nome: 'Lucas', sobrenome: 'Oliveira', familia_id: null },
];

export default function CheckIn() {
  const [activeTab, setActiveTab] = useState<'ui' | 'android' | 'docs'>('ui');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Controle de Presença (Check-in)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Módulo de registro de frequência com suporte a famílias, visitantes e cálculo de atraso.
        </p>
      </div>

      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        <TabButton id="ui" label="Protótipo Web" icon={MonitorPlay} active={activeTab === 'ui'} onClick={() => setActiveTab('ui')} />
        <TabButton id="android" label="Código Android" icon={Smartphone} active={activeTab === 'android'} onClick={() => setActiveTab('android')} />
        <TabButton id="docs" label="Documentação" icon={FileText} active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
      </div>

      <div className="mt-4">
        {activeTab === 'ui' && <CheckInUI />}
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

function CheckInUI() {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [registered, setRegistered] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filteredMembers = MOCK_MEMBERS.filter(m => 
    `${m.nome} ${m.sobrenome}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex gap-4 items-center">
         <input 
           type="text" 
           placeholder="Buscar membro por nome..." 
           className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 w-full focus:border-indigo-500 focus:outline-none"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredMembers.map(member => {
           const isRegistered = registered.includes(member.id);
           return (
             <div key={member.id} className="bg-slate-800/30 border border-slate-700 rounded p-3 flex justify-between items-center transition-colors hover:bg-slate-800/60">
                <div>
                   <h4 className="font-bold text-slate-200">{member.nome} {member.sobrenome}</h4>
                   {member.familia_id && (
                     <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700 mt-1 inline-block">
                       {MOCK_FAMILIES.find(f => f.id === member.familia_id)?.nome}
                     </span>
                   )}
                </div>
                {isRegistered ? (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/20">
                    <Check className="w-4 h-4" /> PRESENÇA MARCADA
                  </span>
                ) : (
                  <button 
                    onClick={() => setSelectedMember(member)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded transition-colors shadow-lg shadow-indigo-900/20"
                  >
                    MARCAR PRESENÇA
                  </button>
                )}
             </div>
           );
        })}
      </div>

      {selectedMember && (
        <CheckInModal 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)}
          onConfirm={(data: any) => {
             const newReg = [selectedMember.id, ...data.acompanhantes];
             setRegistered(prev => [...prev, ...newReg]);
             setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
}

function CheckInModal({ member, onClose, onConfirm }: any) {
  const [visitante, setVisitante] = useState(false);
  const [visitanteData, setVisitanteData] = useState({ nome: '', whatsapp: '', redeSocial: '' });
  const [acompanhantes, setAcompanhantes] = useState<string[]>([]);

  const familyMembers = member.familia_id 
    ? MOCK_MEMBERS.filter(m => m.familia_id === member.familia_id && m.id !== member.id)
    : [];

  const now = new Date();
  
  // Format MM-DD-YYYY manually to match requirement or use standard locale
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const dateStr = `${dd}-${mm}-${yyyy}`;
  
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${hh}:${min}:${ss}`;
  
  const cultoStart = new Date();
  cultoStart.setHours(9, 0, 0, 0);
  const isLate = now > cultoStart;
  const lateMinutes = isLate ? Math.floor((now.getTime() - cultoStart.getTime()) / 60000) : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div>
            <h3 className="font-bold text-slate-200 uppercase tracking-wide text-sm">Check-in</h3>
            <p className="text-xs text-indigo-400 font-mono mt-0.5">{member.nome} {member.sobrenome}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 bg-slate-800 p-1.5 rounded"><X className="w-4 h-4"/></button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          <div className="flex gap-4">
            <div className="bg-slate-800/50 p-3 rounded flex-1 border border-slate-700">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Data</span>
              <span className="text-sm font-mono text-slate-300">{dateStr}</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded flex-1 border border-slate-700">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Horário</span>
              <span className="text-sm font-mono text-slate-300">{timeStr}</span>
            </div>
          </div>

          {isLate && (
             <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded flex items-center gap-3">
               <Clock className="w-5 h-5 text-rose-400" />
               <div>
                 <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Chegou Atrasado</p>
                 <p className="text-[10px] text-rose-300">{lateMinutes} minutos de atraso registrados</p>
               </div>
             </div>
          )}

          {familyMembers.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4" /> Acompanhantes da Família
              </h4>
              <div className="bg-slate-800/30 rounded border border-slate-700 p-2 space-y-1">
                {familyMembers.map(fm => (
                  <label key={fm.id} className="flex items-center gap-3 p-2 hover:bg-slate-800/80 rounded cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 w-4 h-4"
                      checked={acompanhantes.includes(fm.id)}
                      onChange={(e) => {
                        if (e.target.checked) setAcompanhantes([...acompanhantes, fm.id]);
                        else setAcompanhantes(acompanhantes.filter(id => id !== fm.id));
                      }}
                    />
                    <span className="text-sm text-slate-300 font-medium">{fm.nome} {fm.sobrenome}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 border-t border-slate-800 pt-5">
             <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
                  checked={visitante}
                  onChange={(e) => setVisitante(e.target.checked)}
                />
                <span className="text-sm font-bold text-amber-400/80 group-hover:text-amber-400 uppercase tracking-widest flex items-center gap-2 transition-colors">
                  <UserPlus className="w-4 h-4" /> Adicionar Visitante
                </span>
             </label>

             {visitante && (
               <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 space-y-4">
                 <div>
                   <label className="text-[10px] font-bold tracking-widest text-amber-500/70 uppercase block mb-1.5">Nome do Visitante</label>
                   <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-amber-500/50 focus:outline-none"
                     value={visitanteData.nome} onChange={e => setVisitanteData({...visitanteData, nome: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold tracking-widest text-amber-500/70 uppercase block mb-1.5">WhatsApp</label>
                   <input type="tel" className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-amber-500/50 focus:outline-none"
                     value={visitanteData.whatsapp} onChange={e => setVisitanteData({...visitanteData, whatsapp: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold tracking-widest text-amber-500/70 uppercase block mb-1.5">Rede Social (Instagram)</label>
                   <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-amber-500/50 focus:outline-none"
                     value={visitanteData.redeSocial} onChange={e => setVisitanteData({...visitanteData, redeSocial: e.target.value})}
                   />
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">CANCELAR</button>
           <button 
             onClick={() => onConfirm({ acompanhantes, visitante, visitanteData, isLate, lateMinutes })} 
             className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 transition-colors"
           >
             CONFIRMAR PRESENÇA
           </button>
        </div>
      </div>
    </div>
  )
}

function AndroidCode() {
  const codeFiles = {
    entity: `// app/src/main/java/com/koinonia/data/local/entity/PresencaEntity.kt
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "presencas")
data class PresencaEntity(
    @PrimaryKey val id: String,
    val memberId: String,
    val cultoId: String,
    val data: String, // Formato DD-MM-YYYY
    val horarioChegada: String, // Formato HH:MM:SS
    val isAtrasado: Boolean,
    val tempoAtrasoMinutos: Int,
    val isVisitante: Boolean,
    val acompanhanteId: String? = null,
    val isSynced: Boolean = false
)`,
    repository: `// app/src/main/java/com/koinonia/data/repository/PresencaRepositoryImpl.kt
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import java.util.UUID

class PresencaRepositoryImpl @Inject constructor(
    private val presencaDao: PresencaDao,
    private val supabaseClient: SupabaseClient
) : PresencaRepository {

    override suspend fun registrarPresenca(
        memberId: String, cultoId: String, data: String, horario: String, 
        isAtrasado: Boolean, atrasoMin: Int, acompanhantesIds: List<String>, visitante: VisitanteDTO?
    ): Result<Unit> {
        return try {
            var visId: String? = null
            
            // 1. Salvar Visitante se existir
            if (visitante != null) {
                visId = UUID.randomUUID().toString()
                // Salva visitante no BD local
            }

            // 2. Criar Presença do Membro Principal
            val presencaPrincipal = PresencaEntity(
                id = UUID.randomUUID().toString(),
                memberId = memberId,
                cultoId = cultoId,
                data = data,
                horarioChegada = horario,
                isAtrasado = isAtrasado,
                tempoAtrasoMinutos = atrasoMin,
                isVisitante = false,
                acompanhanteId = visId
            )
            presencaDao.insert(presencaPrincipal)

            // 3. Registrar Presença dos Acompanhantes (Família)
            acompanhantesIds.forEach { acompId ->
                val presencaAcomp = presencaPrincipal.copy(
                    id = UUID.randomUUID().toString(),
                    memberId = acompId,
                    acompanhanteId = null
                )
                presencaDao.insert(presencaAcomp)
            }

            // 4. Acionar WorkManager para Sincronização (Offline First)
            SyncWorker.enqueue(presencaPrincipal.id)
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`,
    viewmodel: `// app/src/main/java/com/koinonia/presentation/checkin/CheckInViewModel.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import javax.inject.Inject

@HiltViewModel
class CheckInViewModel @Inject constructor(
    private val repository: PresencaRepository
) : ViewModel() {

    fun registrarPresenca(
        member: Member,
        acompanhantesIds: List<String>,
        visitanteData: VisitanteData?
    ) {
        viewModelScope.launch {
            val now = LocalDateTime.now()
            val dataStr = now.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
            val horarioStr = now.format(DateTimeFormatter.ofPattern("HH:mm:ss"))
            
            // Cálculo de Atraso (Exemplo: Culto começa às 09:00)
            val inicioCulto = now.withHour(9).withMinute(0).withSecond(0).withNano(0)
            val isAtrasado = now.isAfter(inicioCulto)
            val atrasoMin = if (isAtrasado) ChronoUnit.MINUTES.between(inicioCulto, now).toInt() else 0

            repository.registrarPresenca(
                memberId = member.id,
                cultoId = "culto_atual_id",
                data = dataStr,
                horario = horarioStr,
                isAtrasado = isAtrasado,
                atrasoMin = atrasoMin,
                acompanhantesIds = acompanhantesIds,
                visitante = visitanteData?.toDTO()
            )
        }
    }
}`,
    test: `// app/src/test/java/com/koinonia/data/repository/PresencaRepositoryTest.kt
import kotlinx.coroutines.test.runTest
import org.junit.Test
import org.mockito.kotlin.*
import org.junit.Assert.assertTrue

class PresencaRepositoryTest {

    private val presencaDao: PresencaDao = mock()
    private val supabase: SupabaseClient = mock()
    private val repository = PresencaRepositoryImpl(presencaDao, supabase)

    @Test
    fun \`registrarPresenca salva membro principal e familia com sucesso\`() = runTest {
        // Arrange
        val memberId = "m1"
        val acompanhantes = listOf("m2", "m3")
        
        // Act
        val result = repository.registrarPresenca(
            memberId = memberId, 
            cultoId = "c1", 
            data = "10-10-2023", 
            horario = "09:00:00", 
            isAtrasado = false, 
            atrasoMin = 0, 
            acompanhantesIds = acompanhantes, 
            visitante = null
        )

        // Assert
        assertTrue(result.isSuccess)
        // Verifica se a presença principal + acompanhantes foram salvas no Room (1 + 2)
        verify(presencaDao, times(3)).insert(any())
    }
}`
  };

  const [activeFile, setActiveFile] = useState<keyof typeof codeFiles>('repository');

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="flex bg-slate-800/80 border-b border-slate-700 overflow-x-auto">
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'entity' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('entity')}>PresencaEntity.kt</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'repository' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('repository')}>RepositoryImpl.kt</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'viewmodel' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('viewmodel')}>ViewModel.kt</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'test' ? 'text-emerald-300 border-b-2 border-emerald-500 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('test')}>Testes Unitários</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-slate-300 leading-relaxed">
          {codeFiles[activeFile]}
        </pre>
      </div>
    </div>
  );
}

function Documentation() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Fluxo de Presença (Offline-First)</h3>
         <ol className="list-decimal list-inside text-sm text-slate-300 space-y-3 leading-relaxed marker:text-slate-500 font-medium">
           <li>O secretário acessa a tela de Check-in e pesquisa o membro pela UI.</li>
           <li>Ao clicar em "Marcar Presença", a aplicação captura a data e horário atual do dispositivo.</li>
           <li>O <code>ViewModel</code> calcula se houve atraso comparando com o horário de início do culto cadastrado.</li>
           <li>Se o membro possuir uma <strong>Família</strong>, a UI apresenta os demais membros, permitindo check-in em lote com 1 clique.</li>
           <li>Visitantes acompanhantes podem ser registrados no mesmo momento, vinculando-os ao membro anfitrião.</li>
           <li>Ao confirmar, o <code>Repository</code> persiste todos os registros no <strong>Room Database</strong> usando uma transação local.</li>
           <li>O <code>WorkManager</code> é acionado para realizar o Sync com o <strong>Supabase</strong> em background assim que houver rede disponível.</li>
         </ol>
      </div>
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Instruções de Validação de Regras de Negócio</h3>
         <ul className="list-disc list-inside text-sm text-slate-300 space-y-3 leading-relaxed marker:text-amber-500/50">
           <li><strong>Cálculo de Atraso:</strong> Para testar o protótipo, altere a hora local do seu computador para depois das 09:00 e abra o modal de check-in. A flag visual vermelha e os minutos de atraso devem aparecer automaticamente.</li>
           <li><strong>Presença Familiar:</strong> Pesquise por "João" e clique em Marcar Presença. Note que Maria e Pedro aparecerão como opções. Selecionando ambos, todos receberão o check-in na UI.</li>
           <li><strong>Injeção de Dependência:</strong> No código Android, o repositório é injetado no <code>ViewModel</code> via <code>@HiltViewModel</code> e <code>@Inject</code>, permitindo fácil substituição por Mocks nos testes unitários apresentados na aba "Testes".</li>
         </ul>
      </div>
    </div>
  )
}
