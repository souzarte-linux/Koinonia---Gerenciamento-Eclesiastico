package com.example.koinonia

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DoNotDisturb
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation3.runtime.NavKey
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.example.koinonia.presentation.ui.screen.PresencaScreen
import com.example.koinonia.presentation.viewmodel.PresencaViewModel

sealed class BottomNavItem(
    val label: String,
    val icon: ImageVector,
    val route: NavKey
) {
    object Presenca  : BottomNavItem("Presença",   Icons.Default.CheckCircle,   PresencaRoute)
    object Calendario: BottomNavItem("Calendário", Icons.Default.CalendarToday, CalendarioRoute)
    object Ausencias : BottomNavItem("Ausências",  Icons.Default.DoNotDisturb,  AusenciasRoute)
    object Relatorios: BottomNavItem("Relatórios", Icons.Default.BarChart,      RelatoriosRoute)
}

val navItems = listOf(
    BottomNavItem.Presenca,
    BottomNavItem.Calendario,
    BottomNavItem.Ausencias,
    BottomNavItem.Relatorios
)

@Composable
fun MainNavigation() {
    val backStack = rememberNavBackStack(PresencaRoute)

    // Observa qual rota está no topo do stack
    val currentRouteKey by remember {
        derivedStateOf { backStack.lastOrNull() }
    }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xFF0F172A),
                contentColor = Color.White
            ) {
                navItems.forEach { item ->
                    // Compara por tipo de objeto de rota
                    val selected = currentRouteKey != null &&
                        currentRouteKey!!::class == item.route::class

                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = selected,
                        onClick = {
                            if (!selected) {
                                // Remove todos os itens do stack e adiciona a nova rota
                                val size = backStack.size
                                if (size > 0) {
                                    backStack.removeRange(0, size)
                                }
                                backStack.add(item.route)
                            }
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor   = Color(0xFFD4AF37),
                            selectedTextColor   = Color(0xFFD4AF37),
                            unselectedIconColor = Color(0xFF94A3B8),
                            unselectedTextColor = Color(0xFF94A3B8),
                            indicatorColor      = Color(0xFF1E3A6E)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        val context = LocalContext.current

        NavDisplay(
            backStack = backStack,
            onBack    = { backStack.removeLastOrNull() },
            modifier  = Modifier.padding(innerPadding),
            entryProvider = entryProvider {

                entry<PresencaRoute> {
                    val app = context.applicationContext as IgrejaPresencaApp
                    val vm: PresencaViewModel = viewModel(
                        factory = PresencaViewModel.provideFactory(
                            repository  = app.appContainer.presencaRepository,
                            syncManager = app.appContainer.syncManager
                        )
                    )
                    PresencaScreen(viewModel = vm)
                }

                entry<CalendarioRoute> {
                    PlaceholderScreen("Calendário", "📅 Em desenvolvimento")
                }

                entry<AusenciasRoute> {
                    PlaceholderScreen("Ausências", "📋 Em desenvolvimento")
                }

                entry<RelatoriosRoute> {
                    PlaceholderScreen("Relatórios", "📊 Em desenvolvimento")
                }
            }
        )
    }
}
