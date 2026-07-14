package com.example.koinonia.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "presencas")
data class PresencaEntity(
    @PrimaryKey
    val id: String,
    
    @ColumnInfo(name = "member_id")
    val memberId: String,
    
    @ColumnInfo(name = "culto_id")
    val cultoId: String,
    
    val data: String,
    
    @ColumnInfo(name = "horario_chegada")
    val horarioChegada: String?,
    
    val atrasado: Boolean,
    
    val visitante: Boolean,
    
    @ColumnInfo(name = "needs_sync")
    val needsSync: Int = 1, // 1 = true, 0 = false
    
    @ColumnInfo(name = "created_at")
    val createdAt: Long,
    
    @ColumnInfo(name = "updated_at")
    val updatedAt: Long,
    
    @ColumnInfo(name = "synced_at")
    val syncedAt: Long? = null
)
