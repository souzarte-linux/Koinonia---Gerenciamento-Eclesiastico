package com.example.koinonia

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

// Rotas de navegação do app
@Serializable data object Main : NavKey
@Serializable data object PresencaRoute : NavKey
@Serializable data object CalendarioRoute : NavKey
@Serializable data object AusenciasRoute : NavKey
@Serializable data object RelatoriosRoute : NavKey
