import React, { useState } from 'react';
import { 
  CloudOff, CloudSnow, CloudCog, CloudLightning, ShieldCheck, 
  MonitorPlay, Smartphone, FileText, Activity, ServerCog, Wifi, WifiOff, AlertTriangle, Database
} from 'lucide-react';

export default function SyncArchitecture() {
  const [activeTab, setActiveTab] = useState<'ui' | 'code' | 'rls' | 'docs'>('ui');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Sincronização Offline-First</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Estratégia de resiliência de rede usando Room e WorkManager para garantir funcionamento sem internet e sync background com Supabase.
        </p>
      </div>

      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        <TabButton id="ui" label="Status UI" icon={MonitorPlay} active={activeTab === 'ui'} onClick={() => setActiveTab('ui')} />
        <TabButton id="code" label="Código Android (WorkManager)" icon={Smartphone} active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
        <TabButton id="rls" label="Supabase RLS & SQL" icon={ShieldCheck} active={activeTab === 'rls'} onClick={() => setActiveTab('rls')} />
        <TabButton id="docs" label="Documentação" icon={FileText} active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
      </div>

      <div className="mt-4">
        {activeTab === 'ui' && <SyncUI />}
        {activeTab === 'code' && <AndroidCode />}
        {activeTab === 'rls' && <SupabaseRLS />}
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

function SyncUI() {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');

  return (
    <div className="bg-[#0f172a] rounded-lg border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[700px]">
      <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
         <div>
            <h3 className="font-bold text-slate-200">Demonstração de Status</h3>
            <p className="text-xs text-slate-400">Altere o estado de rede para ver a UI reagir</p>
         </div>
         <div className="flex gap-2 bg-slate-900 p-1.5 rounded border border-slate-700">
            <button onClick={() => setSyncStatus('synced')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded ${syncStatus === 'synced' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:bg-slate-800'}`}>Sincronizado</button>
            <button onClick={() => setSyncStatus('syncing')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded ${syncStatus === 'syncing' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:bg-slate-800'}`}>Sincronizando</button>
            <button onClick={() => setSyncStatus('offline')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded ${syncStatus === 'offline' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:bg-slate-800'}`}>Offline</button>
            <button onClick={() => setSyncStatus('error')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded ${syncStatus === 'error' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:bg-slate-800'}`}>Erro</button>
         </div>
      </div>

      <div className="flex-1 p-8 flex items-center justify-center bg-slate-900/50 relative overflow-hidden">
        {/* Mock Top Bar of App */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900 border border-slate-700 rounded-full shadow-2xl flex items-center justify-between p-2 pl-4 pr-2">
           <span className="font-bold text-slate-200 tracking-wide">Koinonia</span>
           
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
             syncStatus === 'synced' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
             syncStatus === 'syncing' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
             syncStatus === 'offline' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
             'bg-rose-500/10 border-rose-500/20 text-rose-400'
           }`}>
              {syncStatus === 'synced' && <><CloudSnow className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-widest">Sincronizado</span></>}
              {syncStatus === 'syncing' && <><CloudCog className="w-4 h-4 animate-spin-slow" /><span className="text-[10px] font-bold uppercase tracking-widest">Sincronizando...</span></>}
              {syncStatus === 'offline' && <><CloudOff className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-widest">Offline (8 Pendentes)</span></>}
              {syncStatus === 'error' && <><AlertTriangle className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-widest">Falha no Sync</span></>}
           </div>
        </div>

        {/* Visualizer */}
        <div className="flex flex-col items-center max-w-lg text-center space-y-8">
           <div className="flex items-center gap-8 text-slate-500">
             <div className={`p-6 rounded-full border-2 transition-colors ${syncStatus !== 'offline' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-slate-700 bg-slate-800'}`}>
                <Smartphone className="w-12 h-12" />
             </div>
             <div className="flex flex-col items-center gap-2">
                {syncStatus === 'synced' && <CloudSnow className="w-8 h-8 text-emerald-400 animate-pulse" />}
                {syncStatus === 'syncing' && <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" /><div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-100" /><div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-200" /></div>}
                {syncStatus === 'offline' && <WifiOff className="w-8 h-8 text-amber-500" />}
                {syncStatus === 'error' && <AlertTriangle className="w-8 h-8 text-rose-500" />}
             </div>
             <div className={`p-6 rounded-full border-2 transition-colors ${syncStatus === 'synced' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : syncStatus === 'syncing' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>
                <Database className="w-12 h-12" />
             </div>
           </div>

           <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 text-left w-full space-y-4">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" /> Fila de Sincronização Local (Room)
              </h4>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs bg-slate-900 p-2 rounded border border-slate-700/50">
                   <span className="text-slate-300">Presença: João Silva (08/07)</span>
                   <span className={`font-mono font-bold ${syncStatus === 'synced' ? 'text-emerald-400' : 'text-amber-400'}`}>{syncStatus === 'synced' ? 'SYNCED' : 'PENDING'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs bg-slate-900 p-2 rounded border border-slate-700/50">
                   <span className="text-slate-300">Ausência Contato: Maria Souza</span>
                   <span className={`font-mono font-bold ${syncStatus === 'synced' ? 'text-emerald-400' : 'text-amber-400'}`}>{syncStatus === 'synced' ? 'SYNCED' : 'PENDING'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs bg-slate-900 p-2 rounded border border-slate-700/50">
                   <span className="text-slate-300">Novo Culto: Semana Jovem</span>
                   <span className={`font-mono font-bold ${syncStatus === 'synced' ? 'text-emerald-400' : 'text-amber-400'}`}>{syncStatus === 'synced' ? 'SYNCED' : 'PENDING'}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function AndroidCode() {
  const codeFiles = {
    worker: `// app/src/main/java/com/koinonia/worker/SyncWorker.kt
import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.*
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.util.concurrent.TimeUnit

@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val syncManager: SyncManager
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            val syncResult = syncManager.syncPendingData()
            if (syncResult.isSuccess) {
                Result.success()
            } else {
                Result.retry() // Vai usar a política de backoff configurada
            }
        } catch (e: Exception) {
            Result.retry()
        }
    }

    companion object {
        private const val WORK_NAME = "SyncPendingDataWorker"

        fun enqueue(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val workRequest = OneTimeWorkRequestBuilder<SyncWorker>()
                .setConstraints(constraints)
                .setBackoffCriteria(
                    BackoffPolicy.EXPONENTIAL, 
                    WorkRequest.MIN_BACKOFF_MILLIS, 
                    TimeUnit.MILLISECONDS
                )
                .build()

            WorkManager.getInstance(context)
                .enqueueUniqueWork(WORK_NAME, ExistingWorkPolicy.APPEND_OR_REPLACE, workRequest)
        }
        
        fun enqueuePeriodic(context: Context) {
             val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

             val periodicRequest = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .build()

             WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork("PeriodicSync", ExistingPeriodicWorkPolicy.KEEP, periodicRequest)
        }
    }
}`,
    manager: `// app/src/main/java/com/koinonia/domain/sync/SyncManager.kt
import javax.inject.Inject
import kotlinx.coroutines.flow.first

class SyncManager @Inject constructor(
    private val presencaDao: PresencaDao,
    private val supabaseApi: SupabaseApi,
    private val cryptoManager: CryptoManager
) {
    suspend fun syncPendingData(): Result<Unit> {
        // 1. Busca todos os registros locais não sincronizados
        val pendingPresencas = presencaDao.getPendingSync().first()
        
        if (pendingPresencas.isEmpty()) return Result.success(Unit)

        // 2. Prepara payload
        val payload = pendingPresencas.map { 
            it.toDto().copy(
                // Encripta notas sensíveis de acompanhamento pastoral antes de enviar ao cloud
                notasPastorais = it.notasPastorais?.let { notas -> cryptoManager.encrypt(notas) }
            )
        }

        // 3. Tenta enviar para Supabase via Bulk Upsert (Resolve conflito: last write wins no DB)
        val response = supabaseApi.bulkUpsertPresencas(payload)

        // 4. Se sucesso, marca localmente como sincronizado
        if (response.isSuccessful) {
            presencaDao.markAsSynced(pendingPresencas.map { it.id })
            return Result.success(Unit)
        } else {
            return Result.failure(Exception("HTTP \${response.code()}"))
        }
    }
}`
  };

  const [activeFile, setActiveFile] = useState<keyof typeof codeFiles>('worker');

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="flex bg-slate-800/80 border-b border-slate-700 overflow-x-auto">
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'worker' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('worker')}>SyncWorker.kt</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'manager' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('manager')}>SyncManager.kt</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-slate-300 leading-relaxed">
          {codeFiles[activeFile]}
        </pre>
      </div>
    </div>
  );
}

function SupabaseRLS() {
  const code = `-- Supabase Row Level Security (RLS) Policies

-- 1. Tabela: presencas
ALTER TABLE presencas ENABLE ROW LEVEL SECURITY;

-- Política: Usuário só pode ler/inserir presenças da sua própria igreja/tenant
CREATE POLICY "Secretarios podem gerenciar presencas da sua igreja"
ON presencas
FOR ALL
USING (
  igreja_id = auth.jwt() ->> 'igreja_id'
  AND (auth.jwt() ->> 'role' IN ('secretario', 'pastor', 'admin'))
);

-- 2. Tabela: contatos_ausencia (Dados Sensiveis)
ALTER TABLE contatos_ausencia ENABLE ROW LEVEL SECURITY;

-- Política Restrita: Apenas Pastor e Diretor do ministério do ausente podem ler detalhes
CREATE POLICY "Privacidade de contatos pastorais"
ON contatos_ausencia
FOR SELECT
USING (
  auth.uid() = responsavel_id 
  OR auth.jwt() ->> 'role' = 'pastor'
);

-- 3. Função Triggers para Resolução de Conflitos (Last-Write-Wins)
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER presencas_updated_at
BEFORE UPDATE ON presencas
FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();`;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Supabase RLS Policies</span>
        <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded">PostgreSQL</span>
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
         <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Garantia de Entrega (Offline-First)</h3>
         <p className="text-sm text-slate-300 leading-relaxed mb-4">
           Em cenários onde a igreja local não possui WiFi ou o sinal de rede é ruim, os secretários podem realizar todas as tarefas (Check-in, Cadastro de Visitantes, Registros de Ausência) perfeitamente.
         </p>
         <ul className="list-disc list-inside text-sm text-slate-300 space-y-3 leading-relaxed marker:text-indigo-500/50">
           <li><strong>Room Database (Single Source of Truth):</strong> Todas as leituras e escritas da UI apontam EXCLUSIVAMENTE para o banco SQLite local do Android. A UI nunca espera a internet para responder.</li>
           <li><strong>WorkManager:</strong> O <code>SyncWorker</code> observa a conectividade de rede. Assim que o aparelho entra em rede, ele drena a fila de requisições pendentes (flag <code>isSynced = false</code>) no background, sem interromper o usuário.</li>
           <li><strong>Retry & Backoff:</strong> Se o Supabase estiver fora do ar ou o pacote falhar, o WorkManager reagenda a tentativa para daqui a 10s, 20s, 40s (Exponencial), preservando a bateria do dispositivo.</li>
         </ul>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-4">Segurança e Resolução de Conflitos</h3>
         <div className="space-y-4">
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
             <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Conflitos de Sincronização</h4>
             <p className="text-xs text-slate-400 leading-relaxed">Prioridade "Local Wins" antes do sync, e "Last Write Wins" no servidor. Cada linha possui timestamp modificado. Um Bulk Upsert (ON CONFLICT) garante que registros atrasados sobrescrevam apenas se o timestamp for maior.</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
             <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Privacidade (RLS)</h4>
             <p className="text-xs text-slate-400 leading-relaxed">Anotações pastorais (ex: problemas familiares, confissões) são criptografadas localmente via <code>EncryptedSharedPreferences/Keystore</code> antes de serem sincronizadas para o Supabase, garantindo que nem mesmo DBAs possam ler seu conteúdo em plain text, e o RLS impede que líderes de outros ministérios acessem as linhas.</p>
           </div>
         </div>
      </div>
    </div>
  )
}
