package com.example.koinonia.sync

object ConflictResolver {
    
    /**
     * Last-Write-Wins (LWW) resolver.
     * Retorna a versão mais recente com base no timestamp.
     */
    fun <T : HasTimestamp> resolveConflict(local: T, remote: T): T {
        return if (local.updatedAt > remote.updatedAt) {
            local
        } else {
            remote
        }
    }
}

interface HasTimestamp {
    val updatedAt: Long
}
