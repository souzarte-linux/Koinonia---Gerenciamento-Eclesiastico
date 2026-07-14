package com.example.koinonia.sync

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
import com.example.koinonia.domain.repository.IPresencaRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.util.concurrent.TimeUnit

class SyncManager(
    private val context: Context,
    private val workManager: WorkManager,
    private val presencaRepository: IPresencaRepository
) {

    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    companion object {
        const val SYNC_PERIODIC_WORK_NAME = "periodic_data_sync_work"
    }

    /**
     * Agenda a sincronização em segundo plano a cada 15 minutos,
     * exigindo conexão ativa com a internet.
     */
    fun schedulePeriodicSync() {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .setBackoffCriteria(
                BackoffPolicy.EXPONENTIAL,
                androidx.work.WorkRequest.MIN_BACKOFF_MILLIS,
                TimeUnit.MILLISECONDS
            )
            .build()

        workManager.enqueueUniquePeriodicWork(
            SYNC_PERIODIC_WORK_NAME,
            ExistingPeriodicWorkPolicy.KEEP,
            syncRequest
        )
        Log.d("SyncManager", "Sincronização periódica agendada via WorkManager.")
    }

    /**
     * Executa a sincronização imediatamente se houver internet.
     */
    suspend fun syncImmediately(): Result<Unit> {
        return if (isConnected()) {
            Log.d("SyncManager", "Conectado. Iniciando sincronização imediata...")
            presencaRepository.syncPendingPresencas()
        } else {
            Log.w("SyncManager", "Sem conexão internet. Cancelando sincronização imediata.")
            Result.failure(Exception("Sem conexão com a internet"))
        }
    }

    /**
     * Verifica o estado de conectividade atual do aparelho.
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
     * Flow que emite periodicamente o status da rede.
     */
    fun getConnectivityFlow(): Flow<Boolean> = flow {
        while (true) {
            emit(isConnected())
            kotlinx.coroutines.delay(5000) // Verifica a cada 5s
        }
    }
}
