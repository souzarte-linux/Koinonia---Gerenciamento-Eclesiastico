package com.example.koinonia.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.koinonia.data.local.entity.PresencaEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PresencaDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(presenca: PresencaEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(presencas: List<PresencaEntity>)
    
    @Update
    suspend fun update(presenca: PresencaEntity)
    
    @Query("SELECT * FROM presencas WHERE id = :id")
    suspend fun getById(id: String): PresencaEntity?
    
    @Query("SELECT * FROM presencas ORDER BY created_at DESC")
    fun getAllFlow(): Flow<List<PresencaEntity>>
    
    @Query("SELECT * FROM presencas WHERE needs_sync = 1 ORDER BY created_at ASC")
    suspend fun getPendingSync(): List<PresencaEntity>
    
    @Query("UPDATE presencas SET needs_sync = 0, synced_at = :syncedAt WHERE id = :presencaId")
    suspend fun markAsSynced(presencaId: String, syncedAt: Long)
    
    @Query("UPDATE presencas SET needs_sync = 1 WHERE id = :presencaId")
    suspend fun markForSync(presencaId: String)
    
    @Query("SELECT COUNT(*) FROM presencas WHERE needs_sync = 1")
    fun countPendingSync(): Flow<Int>
}
