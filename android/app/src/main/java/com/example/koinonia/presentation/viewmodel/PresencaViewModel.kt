package com.example.koinonia.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.koinonia.domain.model.Presenca
import com.example.koinonia.domain.repository.IPresencaRepository
import com.example.koinonia.sync.SyncManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class PresencaViewModel(
    private val repository: IPresencaRepository,
    private val syncManager: SyncManager
) : ViewModel() {

    private val _syncStatus = MutableStateFlow<SyncStatus>(SyncStatus.Idle)
    val syncStatus: StateFlow<SyncStatus> = _syncStatus.asStateFlow()

    /** Observa as presenças locais registradas em tempo real */
    val presencas: StateFlow<List<Presenca>> = repository.getPresencasFlow()
        .stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    /** Conta de itens pendentes de sincronização */
    val pendingSyncCount: StateFlow<Int> = repository.getPendingSyncCountFlow()
        .stateIn(viewModelScope, SharingStarted.Lazily, 0)

    /** Estado da conectividade */
    val isConnected: StateFlow<Boolean> = syncManager.getConnectivityFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), syncManager.isConnected())

    private val timeFormatter = SimpleDateFormat("HH:mm:ss", Locale.getDefault())

    init {
        // Sincroniza automaticamente quando internet retorna e há pendências
        viewModelScope.launch {
            isConnected.collect { connected ->
                if (connected && pendingSyncCount.value > 0) {
                    sincronizarAgora()
                }
            }
        }
    }

    /**
     * Registra uma presença offline-first: salva localmente primeiro
     * e depois tenta sincronizar com Supabase.
     */
    fun registrarPresenca(
        memberId: String,
        cultoId: String,
        data: String,
        atrasado: Boolean = false,
        visitante: Boolean = false
    ) {
        viewModelScope.launch {
            val nova = Presenca(
                id = UUID.randomUUID().toString(),
                memberId = memberId,
                cultoId = cultoId,
                data = data,
                horarioChegada = timeFormatter.format(Date()),
                atrasado = atrasado,
                visitante = visitante,
                needsSync = true,
                createdAt = System.currentTimeMillis(),
                updatedAt = System.currentTimeMillis(),
                syncedAt = null
            )
            repository.registrarPresenca(nova)
        }
    }

    /** Dispara o fluxo de sincronização imediata com Supabase */
    fun sincronizarAgora() {
        viewModelScope.launch {
            _syncStatus.value = SyncStatus.Syncing
            val result = syncManager.syncImmediately()
            _syncStatus.value = if (result.isSuccess) {
                SyncStatus.Success
            } else {
                SyncStatus.Error(result.exceptionOrNull()?.message ?: "Erro desconhecido")
            }
        }
    }

    companion object {
        fun provideFactory(
            repository: IPresencaRepository,
            syncManager: SyncManager
        ): ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return PresencaViewModel(repository, syncManager) as T
            }
        }
    }
}

sealed class SyncStatus {
    object Idle : SyncStatus()
    object Syncing : SyncStatus()
    object Success : SyncStatus()
    data class Error(val message: String) : SyncStatus()
}
