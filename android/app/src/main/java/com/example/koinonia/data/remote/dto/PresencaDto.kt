package com.example.koinonia.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class PresencaDto(
    val id: String,
    val member_id: String,
    val culto_id: String,
    val data: String,
    val horario_chegada: String?,
    val atrasado: Boolean,
    val visitante: Boolean,
    val created_at: String, // Supabase expects ISO timestamps or similar
    val updated_at: String
)
