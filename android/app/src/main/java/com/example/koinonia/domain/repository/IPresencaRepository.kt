package com.example.koinonia.domain.repository

import com.example.koinonia.domain.model.Presenca
import kotlinx.coroutines.flow.Flow

interface IPresencaRepository {
    suspend fun registrarPresenca(presenca: Presenca): Result<Presenca>
    suspend fun syncPendingPresencas(): Result<Unit>
    fun getPresencasFlow(): Flow<List<Presenca>>
    fun getPendingSyncCountFlow(): Flow<Int>
    suspend fun getPresencaById(id: String): Presenca?
}
