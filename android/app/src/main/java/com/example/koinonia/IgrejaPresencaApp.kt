package com.example.koinonia

import android.app.Application
import android.util.Log
import com.example.koinonia.di.AppContainer

class IgrejaPresencaApp : Application() {
    
    lateinit var appContainer: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        Log.d("IgrejaPresencaApp", "🚀 Inicializando IgrejaPresencaApp...")
        
        // Inicializa o Container de Injeção de Dependência Manual
        appContainer = AppContainer(this)
        
        // Agenda a sincronização periódica
        appContainer.syncManager.schedulePeriodicSync()
    }
}
