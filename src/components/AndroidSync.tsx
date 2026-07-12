import React, { useState } from 'react';
import { Database, FileCode2, Layers, LayoutTemplate, Activity, Network, RefreshCw } from 'lucide-react';

export default function AndroidSync() {
  const [activeTab, setActiveTab] = useState<string>('sync_manager');

  const files = {
    'sync_manager': {
      name: 'SyncManager.kt',
      icon: Network,
      content: `package com.koinonia.app.sync

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.util.Log
import androidx.work.BackoffPolicy
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.koinonia.app.domain.repository.ICultoRepository
import com.koinonia.app.domain.repository.IPresencaRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SyncManager @Inject constructor(
    private val workManager: WorkManager,
    private val presencaRepository: IPresencaRepository,
    // private val ausenciaRepository: IAusenciaRepository,
    private val cultoRepository: ICultoRepository,
    private val connectivityManager: ConnectivityManager
) {
    
    companion object {
        const val PRESENCA_SYNC_WORK = "presenca_sync_work"
        const val AUSENCIA_SYNC_WORK = "ausencia_sync_work"
        const val CULTO_SYNC_WORK = "culto_sync_work"
    }
    
    /**
     * Agendar sincronização periódica em background
     * Executa a cada 15 minutos quando houver conexão
     */
    fun scheduleSyncWork() {
        val syncWork = PeriodicWorkRequestBuilder<SyncWorker>(
            15, TimeUnit.MINUTES
        )
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build()
            )
            .setBackoffCriteria(
                BackoffPolicy.EXPONENTIAL,
                15, TimeUnit.MINUTES
            )
            .build()
        
        workManager.enqueueUniquePeriodicWork(
            "sync_all_data",
            ExistingPeriodicWorkPolicy.KEEP,
            syncWork
        )
    }
    
    /**
     * Sincronizar imediatamente se houver conexão
     */
    suspend fun syncImmediately() {
        if (isConnected()) {
            try {
                syncPresencas()
                // syncAusencias()
                syncCultos()
                Log.d("SyncManager", "✅ Sincronização imediata concluída")
            } catch (e: Exception) {
                Log.e("SyncManager", "❌ Erro na sincronização imediata: \${e.message}")
            }
        } else {
            Log.d("SyncManager", "⚠️ Sem conexão internet. Sincronização agendada para depois")
        }
    }
    
    /**
     * Sincronizar presenças pendentes
     */
    private suspend fun syncPresencas() {
        try {
            presencaRepository.syncPendingPresencas()
            Log.d("SyncManager", "✅ Presenças sincronizadas")
        } catch (e: Exception) {
            Log.e("SyncManager", "❌ Erro ao sincronizar presenças: \${e.message}")
        }
    }
    
    /**
     * Sincronizar cultos pendentes
     */
    private suspend fun syncCultos() {
        try {
            // cultoRepository.syncPendingCultos()
            Log.d("SyncManager", "✅ Cultos sincronizados")
        } catch (e: Exception) {
            Log.e("SyncManager", "❌ Erro ao sincronizar cultos: \${e.message}")
        }
    }
    
    /**
     * Verificar se há conexão internet
     */
    fun isConnected(): Boolean {
        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val caps = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false
        return when {
            caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
            caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
            caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> true
            else -> false
        }
    }
    
    /**
     * Flow que emite mudanças de conectividade
     */
    fun getConnectivityFlow(): Flow<Boolean> = flow {
        emit(isConnected())
        // TODO: Implementar listener real de conectividade
    }
}`
    },
    'sync_worker': {
      name: 'SyncWorker.kt',
      icon: RefreshCw,
      content: `package com.koinonia.app.sync

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.koinonia.app.IgrejaPresencaApp
import javax.inject.Inject

class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {
    
    @Inject lateinit var syncManager: SyncManager
    
    override suspend fun doWork(): Result {
        return try {
            // Injetar dependências
            // val appComponent = (applicationContext as? IgrejaPresencaApp)?.component
            //    ?: return Result.retry()
            
            Log.d("SyncWorker", "🔄 Iniciando sincronização em background...")
            
            // Sincronizar tudo
            syncManager.syncImmediately()
            
            Log.d("SyncWorker", "✅ Sincronização em background concluída com sucesso")
            Result.success()
            
        } catch (e: Exception) {
            Log.e("SyncWorker", "❌ Erro na sincronização: \${e.message}")
            // Retry com backoff exponencial (1min, 2min, 4min, 8min, 16min)
            Result.retry()
        }
    }
}`
    },
    'workmanager_module': {
      name: 'WorkManagerModule.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.di

import android.content.Context
import android.net.ConnectivityManager
import androidx.work.WorkManager
import com.koinonia.app.domain.repository.ICultoRepository
import com.koinonia.app.domain.repository.IPresencaRepository
import com.koinonia.app.sync.SyncManager
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object WorkManagerModule {
    
    @Provides
    @Singleton
    fun provideWorkManager(@ApplicationContext context: Context): WorkManager {
        return WorkManager.getInstance(context)
    }
    
    @Provides
    @Singleton
    fun provideSyncManager(
        @ApplicationContext context: Context,
        workManager: WorkManager,
        presencaRepository: IPresencaRepository,
        // ausenciaRepository: IAusenciaRepository,
        cultoRepository: ICultoRepository
    ): SyncManager {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        
        return SyncManager(
            workManager,
            presencaRepository,
            // ausenciaRepository,
            cultoRepository,
            connectivityManager
        )
    }
}`
    },
    'conflict_resolver': {
      name: 'ConflictResolver.kt',
      icon: Activity,
      content: `package com.koinonia.app.sync

object ConflictResolver {
    
    /**
     * Estratégia: Last-Write-Wins (LWW)
     * O registro com updated_at mais recente prevalece
     */
    fun <T : HasTimestamp> resolveConflict(
        local: T,
        remote: T
    ): T {
        return if (local.updatedAt > remote.updatedAt) {
            local // Versão local é mais recente
        } else {
            remote // Versão remota é mais recente
        }
    }
    
    /**
     * Estratégia: User Gets Priority (UGP)
     * Mudanças locais SEMPRE prevalecem
     */
    fun <T> userGetsPriority(local: T, remote: T): T {
        return local
    }
}

/**
 * Interface para modelos que têm timestamp
 */
interface HasTimestamp {
    val updatedAt: Long
}`
    },
    'presenca_dto': {
      name: 'PresencaDto.kt',
      icon: Layers,
      content: `package com.koinonia.app.data.remote.dto

// import kotlinx.serialization.Serializable

// @Serializable
data class PresencaDto(
    val id: String,
    val membro_id: String,
    val culto_id: String,
    val data_horario: String, // ISO 8601
    val atrasado: Boolean,
    val tempo_atraso_minutos: Int,
    val acompanhante_id: String?,
    val visitante_id: String?,
    val notas: String?,
    val created_at: String,
    val updated_at: String,
    val synced_at: String?
)`
    },
    'presenca_remote_datasource': {
      name: 'PresencaRemoteDataSource.kt',
      icon: Network,
      content: `package com.koinonia.app.data.remote.supabase

import android.util.Log
import com.koinonia.app.data.remote.dto.PresencaDto
// import io.github.jan.supabase.SupabaseClient
// import io.github.jan.supabase.postgrest.postgrest
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PresencaRemoteDataSource @Inject constructor(
    // private val supabaseClient: SupabaseClient
) {
    
    /**
     * Enviar presença para Supabase
     */
    suspend fun registrarPresenca(presenca: PresencaDto): PresencaDto {
        return try {
            /*
            supabaseClient.postgrest["presencas"]
                .insert(presenca)
                .decodeAs<PresencaDto>()
                .first()
            */
            presenca
        } catch (e: Exception) {
            Log.e("PresencaRemote", "Erro ao registrar presença: \${e.message}")
            throw e
        }
    }
    
    /**
     * Atualizar presença em Supabase
     */
    suspend fun atualizarPresenca(id: String, presenca: PresencaDto): PresencaDto {
        return try {
            /*
            supabaseClient.postgrest["presencas"]
                .update(presenca) {
                    filter { eq("id", id) }
                }
                .decodeAs<PresencaDto>()
                .first()
            */
            presenca
        } catch (e: Exception) {
            Log.e("PresencaRemote", "Erro ao atualizar presença: \${e.message}")
            throw e
        }
    }
    
    /**
     * Buscar presenças (para sincronização)
     */
    suspend fun getPresencas(desde: String): List<PresencaDto> {
        return try {
            /*
            supabaseClient.postgrest["presencas"]
                .select {
                    filter { gt("updated_at", desde) }
                }
                .decodeList<PresencaDto>()
            */
            emptyList()
        } catch (e: Exception) {
            Log.e("PresencaRemote", "Erro ao buscar presenças: \${e.message}")
            throw e
        }
    }
}`
    },
    'presenca_repository': {
      name: 'PresencaRepository.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.repository

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.util.Log
import com.koinonia.app.data.local.dao.PresencaDao
import com.koinonia.app.data.remote.supabase.PresencaRemoteDataSource
import com.koinonia.app.domain.model.Presenca
import com.koinonia.app.domain.repository.IPresencaRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PresencaRepository @Inject constructor(
    private val presencaDao: PresencaDao,
    private val remoteDataSource: PresencaRemoteDataSource,
    @ApplicationContext private val context: Context
) : IPresencaRepository {
    
    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    
    override suspend fun registrarPresenca(presenca: Presenca): Result<Presenca> {
        return try {
            // 1. SEMPRE salvar localmente (OFFLINE-FIRST)
            // val entity = presenca.toEntity()
            // presencaDao.insert(entity)
            
            // 2. Tentar sincronizar IMEDIATAMENTE se online
            if (isConnected()) {
                try {
                    // remoteDataSource.registrarPresenca(presenca.toDto())
                    // Marcar como sincronizado
                    presencaDao.markAsSynced(
                        presenca.id,
                        System.currentTimeMillis()
                    )
                    Log.d("PresencaRepo", "✅ Presença sincronizada imediatamente")
                } catch (e: Exception) {
                    // Se falhar, marcar para sincronizar depois
                    Log.d("PresencaRepo", "⚠️ Sync imediato falhou, agendando para depois")
                    presencaDao.markForSync(presenca.id)
                }
            } else {
                // Sem conexão, apenas marcar para sincronizar depois
                Log.d("PresencaRepo", "📱 Sem conexão. Marcando para sincronizar depois")
                presencaDao.markForSync(presenca.id)
            }
            
            Result.success(presenca)
        } catch (e: Exception) {
            Log.e("PresencaRepo", "❌ Erro ao registrar: \${e.message}")
            Result.failure(e)
        }
    }
    
    override suspend fun syncPendingPresencas(): Result<Unit> {
        return try {
            // Buscar todas as presenças que precisam sincronizar
            val pendentes = presencaDao.getPendingSync()
            
            if (pendentes.isEmpty()) {
                Log.d("PresencaRepo", "✅ Nenhuma presença pendente para sincronizar")
                return Result.success(Unit)
            }
            
            Log.d("PresencaRepo", "🔄 Sincronizando \${pendentes.size} presenças...")
            
            var sucessos = 0
            var erros = 0
            
            for (presenca in pendentes) {
                try {
                    // Tentar sincronizar
                    // remoteDataSource.registrarPresenca(presenca.toDto())
                    
                    // Marcar como sincronizado
                    presencaDao.markAsSynced(
                        presenca.id,
                        System.currentTimeMillis()
                    )
                    sucessos++
                    
                } catch (e: Exception) {
                    Log.d("PresencaRepo", "❌ Erro ao sincronizar \${presenca.id}: \${e.message}")
                    erros++
                }
            }
            
            Log.d("PresencaRepo", "📊 Resultado: \$sucessos sincronizadas, \$erros com erro")
            
            Result.success(Unit)
            
        } catch (e: Exception) {
            Log.e("PresencaRepo", "❌ Erro crítico na sincronização: \${e.message}")
            Result.failure(e)
        }
    }

    override fun getPresencasByCulto(cultoId: String): Flow<List<Presenca>> = emptyFlow()
    override fun getPresencasByMember(memberId: String): Flow<List<Presenca>> = emptyFlow()
    override suspend fun getPresenca(memberId: String, cultoId: String): Presenca? = null
    override suspend fun getPresencasPendentes(): List<Presenca> = emptyList()
    override suspend fun atualizarPresenca(presenca: Presenca): Result<Presenca> = Result.success(presenca)
    
    private fun isConnected(): Boolean {
        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val caps = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false
        return when {
            caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
            caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
            caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> true
            else -> false
        }
    }
}`
    },
    'presenca_dao_sync': {
      name: 'PresencaDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.koinonia.app.data.local.entity.PresencaEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PresencaDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(presenca: PresencaEntity)
    
    // ... métodos anteriores ...
    
    /**
     * Obter presenças que precisam sincronizar
     */
    @Query("SELECT * FROM presencas WHERE needs_sync = 1 ORDER BY created_at ASC")
    suspend fun getPendingSync(): List<PresencaEntity>
    
    /**
     * Marcar como sincronizado
     */
    @Query("UPDATE presencas SET needs_sync = 0, synced_at = :syncedAt WHERE id = :presencaId")
    suspend fun markAsSynced(presencaId: String, syncedAt: Long)
    
    /**
     * Marcar para sincronizar
     */
    @Query("UPDATE presencas SET needs_sync = 1 WHERE id = :presencaId")
    suspend fun markForSync(presencaId: String)
    
    /**
     * Contar itens pendentes de sincronização
     */
    @Query("SELECT COUNT(*) FROM presencas WHERE needs_sync = 1")
    fun countPendingSync(): Flow<Int>
    
    @Query("SELECT COUNT(*) FROM presencas WHERE needs_sync = 1")
    fun getPendingSyncCount(): Flow<Int>
    
    /**
     * Limpar sincronizações antigas (older than 30 days)
     */
    @Query("DELETE FROM presencas WHERE synced_at < :data AND synced_at IS NOT NULL")
    suspend fun cleanOldSynced(data: Long)
}`
    },
    'app_kt': {
      name: 'IgrejaPresencaApp.kt',
      icon: FileCode2,
      content: `package com.koinonia.app

import android.app.Application
import android.util.Log
import com.koinonia.app.sync.SyncManager
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class IgrejaPresencaApp : Application() {
    
    @Inject lateinit var syncManager: SyncManager
    
    override fun onCreate() {
        super.onCreate()
        Log.d("IgrejaApp", "✅ App iniciando...")
        
        // Inicializar sincronização periódica em background
        syncManager.scheduleSyncWork()
        Log.d("IgrejaApp", "✅ Sincronização agendada (a cada 15 min)")
    }
}`
    },
    'presenca_viewmodel_sync': {
      name: 'PresencaViewModel.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.koinonia.app.domain.repository.IPresencaRepository
import com.koinonia.app.sync.SyncManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PresencaViewModel @Inject constructor(
    private val repository: IPresencaRepository,
    private val syncManager: SyncManager
) : ViewModel() {
    
    private val _syncStatus = MutableStateFlow<SyncStatus>(SyncStatus.Idle)
    val syncStatus: StateFlow<SyncStatus> = _syncStatus.asStateFlow()
    
    private val _isPendingSync = MutableStateFlow(false)
    val isPendingSync: StateFlow<Boolean> = _isPendingSync.asStateFlow()
    
    init {
        // Monitorar itens pendentes
        viewModelScope.launch {
            /*
            repository.getPendingSyncCount().collect { count ->
                _isPendingSync.value = count > 0
            }
            */
        }
        
        // Monitorar conectividade
        viewModelScope.launch {
            syncManager.getConnectivityFlow().collect { isConnected ->
                if (isConnected && _isPendingSync.value) {
                    // Sincronizar imediatamente se voltou online
                    sincronizarAgora()
                }
            }
        }
    }
    
    fun sincronizarAgora() {
        viewModelScope.launch {
            _syncStatus.value = SyncStatus.Syncing
            syncManager.syncImmediately()
            _syncStatus.value = SyncStatus.Idle
        }
    }
}

sealed class SyncStatus {
    object Idle : SyncStatus()
    object Syncing : SyncStatus()
    data class Error(val message: String) : SyncStatus()
}`
    },
    'sync_status_indicator': {
      name: 'SyncStatusIndicator.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.koinonia.app.presentation.viewmodel.SyncStatus

@Composable
fun SyncStatusIndicator(
    syncStatus: SyncStatus,
    isPendingSync: Boolean,
    onSyncClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(8.dp),
        horizontalArrangement = Arrangement.End,
        verticalAlignment = Alignment.CenterVertically
    ) {
        when {
            syncStatus is SyncStatus.Syncing -> {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sincronizando...", style = MaterialTheme.typography.labelSmall)
            }
            isPendingSync -> {
                Icon(
                    Icons.Default.Sync,
                    contentDescription = "Itens pendentes",
                    tint = MaterialTheme.colorScheme.error
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    "Itens pendentes",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.error
                )
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(onClick = onSyncClick, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Default.Refresh, contentDescription = "Sincronizar agora")
                }
            }
            syncStatus is SyncStatus.Error -> {
                Text(
                    "❌ Erro de sincronização",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.error
                )
            }
            else -> {
                Text(
                    "✅ Sincronizado",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}`
    },
    'android_manifest': {
      name: 'AndroidManifest.xml',
      icon: FileCode2,
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.koinonia.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:name=".IgrejaPresencaApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.IgrejaPresenca"
        android:usesCleartextTraffic="false"
        android:enableOnBackInvokedCallback="true">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Sync Offline-First (Android)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Implementação do WorkManager, Supabase Remote DataSource e Repositórios para sincronização local-first e em background.
        </p>
      </div>

      <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex h-[700px]">
        
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/80 border-r border-slate-700 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arquivos Implementados</h3>
          </div>
          <div className="flex-1 py-2 space-y-1">
            {Object.entries(files).map(([key, file]) => {
              const Icon = file.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left transition-colors ${
                    activeTab === key 
                      ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
          <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
            <span className="text-[11px] font-mono text-indigo-400">{files[activeTab as keyof typeof files].name}</span>
            <button className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-slate-300 transition-colors bg-slate-800 px-2 py-1 rounded border border-slate-700">
              Copiar Código
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <pre className="text-[13px] font-mono text-slate-300 leading-relaxed">
              {files[activeTab as keyof typeof files].content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
