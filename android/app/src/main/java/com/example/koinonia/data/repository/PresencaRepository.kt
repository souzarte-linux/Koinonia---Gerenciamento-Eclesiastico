package com.example.koinonia.data.repository

import com.example.koinonia.data.local.dao.PresencaDao
import com.example.koinonia.data.local.entity.PresencaEntity
import com.example.koinonia.data.remote.dto.PresencaDto
import com.example.koinonia.data.remote.supabase.PresencaRemoteDataSource
import com.example.koinonia.domain.model.Presenca
import com.example.koinonia.domain.repository.IPresencaRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class PresencaRepository(
    private val presencaDao: PresencaDao,
    private val remoteDataSource: PresencaRemoteDataSource
) : IPresencaRepository {

    private val dateFormatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())

    override suspend fun registrarPresenca(presenca: Presenca): Result<Presenca> {
        return try {
            // 1. Salvar no Room Database localmente (Offline-First)
            val entity = presenca.toEntity(needsSyncVal = 1)
            presencaDao.insert(entity)

            // 2. Tentar sincronizar imediatamente no Supabase
            val dto = presenca.toDto()
            val remoteResult = remoteDataSource.registrarPresenca(dto)
            
            if (remoteResult.isSuccess) {
                // Sincronização imediata bem-sucedida, atualiza flag local
                presencaDao.markAsSynced(presenca.id, System.currentTimeMillis())
                Result.success(presenca.copy(needsSync = false, syncedAt = System.currentTimeMillis()))
            } else {
                // Sincronização falhou, mantém flag local como pendente de sync
                Result.success(presenca)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun syncPendingPresencas(): Result<Unit> {
        return try {
            val pendingList = presencaDao.getPendingSync()
            if (pendingList.isEmpty()) return Result.success(Unit)

            val dtos = pendingList.map { it.toDto() }
            val bulkResult = remoteDataSource.bulkUpsert(dtos)

            if (bulkResult.isSuccess) {
                val now = System.currentTimeMillis()
                pendingList.forEach {
                    presencaDao.markAsSynced(it.id, now)
                }
                Result.success(Unit)
            } else {
                Result.failure(bulkResult.exceptionOrNull() ?: Exception("Unknown error in sync"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override fun getPresencasFlow(): Flow<List<Presenca>> {
        return presencaDao.getAllFlow().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override fun getPendingSyncCountFlow(): Flow<Int> {
        return presencaDao.countPendingSync()
    }

    override suspend fun getPresencaById(id: String): Presenca? {
        return presencaDao.getById(id)?.toDomain()
    }

    // Helper functions
    private fun PresencaEntity.toDomain(): Presenca {
        return Presenca(
            id = id,
            memberId = memberId,
            cultoId = cultoId,
            data = data,
            horarioChegada = horarioChegada,
            atrasado = atrasado,
            visitante = visitante,
            needsSync = needsSync == 1,
            createdAt = createdAt,
            updatedAt = updatedAt,
            syncedAt = syncedAt
        )
    }

    private fun Presenca.toEntity(needsSyncVal: Int): PresencaEntity {
        return PresencaEntity(
            id = id,
            memberId = memberId,
            cultoId = cultoId,
            data = data,
            horarioChegada = horarioChegada,
            atrasado = atrasado,
            visitante = visitante,
            needsSync = needsSyncVal,
            createdAt = createdAt,
            updatedAt = updatedAt,
            syncedAt = syncedAt
        )
    }

    private fun PresencaEntity.toDto(): PresencaDto {
        return PresencaDto(
            id = id,
            member_id = memberId,
            culto_id = cultoId,
            data = data,
            horario_chegada = horarioChegada,
            atrasado = atrasado,
            visitante = visitante,
            created_at = dateFormatter.format(Date(createdAt)),
            updated_at = dateFormatter.format(Date(updatedAt))
        )
    }

    private fun Presenca.toDto(): PresencaDto {
        return PresencaDto(
            id = id,
            member_id = memberId,
            culto_id = cultoId,
            data = data,
            horario_chegada = horarioChegada,
            atrasado = atrasado,
            visitante = visitante,
            created_at = dateFormatter.format(Date(createdAt)),
            updated_at = dateFormatter.format(Date(updatedAt))
        )
    }
}
