package com.example.koinonia.sync

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.koinonia.IgrejaPresencaApp

class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            val app = applicationContext as? IgrejaPresencaApp
            val syncManager = app?.appContainer?.syncManager

            if (syncManager != null) {
                Log.d("SyncWorker", "🔄 Executando SyncWorker de sincronização periódica...")
                val result = syncManager.syncImmediately()
                if (result.isSuccess) {
                    Result.success()
                } else {
                    Result.retry()
                }
            } else {
                Log.e("SyncWorker", "❌ IgrejaPresencaApp ou AppContainer indisponíveis")
                Result.failure()
            }
        } catch (e: Exception) {
            Log.e("SyncWorker", "❌ Falha crítica no SyncWorker: ${e.message}")
            Result.retry()
        }
    }
}
