package com.example.koinonia.domain.model

data class Presenca(
    val id: String,
    val memberId: String,
    val cultoId: String,
    val data: String,
    val horarioChegada: String?,
    val atrasado: Boolean,
    val visitante: Boolean,
    val needsSync: Boolean,
    val createdAt: Long,
    val updatedAt: Long,
    val syncedAt: Long?
)
