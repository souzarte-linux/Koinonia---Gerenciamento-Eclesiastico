package com.example.koinonia.di

import android.content.Context
import androidx.work.WorkManager
import com.example.koinonia.data.local.AppDatabase
import com.example.koinonia.data.remote.supabase.PresencaRemoteDataSource
import com.example.koinonia.data.repository.PresencaRepository
import com.example.koinonia.domain.repository.IPresencaRepository
import com.example.koinonia.sync.SyncManager

class AppContainer(private val context: Context) {
    
    val database: AppDatabase by lazy {
        AppDatabase.getDatabase(context)
    }
    
    val remoteDataSource: PresencaRemoteDataSource by lazy {
        PresencaRemoteDataSource()
    }
    
    val presencaRepository: IPresencaRepository by lazy {
        PresencaRepository(
            presencaDao = database.presencaDao(),
            remoteDataSource = remoteDataSource
        )
    }
    
    val syncManager: SyncManager by lazy {
        SyncManager(
            context = context,
            workManager = WorkManager.getInstance(context),
            presencaRepository = presencaRepository
        )
    }
}
