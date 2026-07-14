package com.example.koinonia.presentation.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.koinonia.domain.model.Presenca
import com.example.koinonia.presentation.ui.component.SyncStatusIndicator
import com.example.koinonia.presentation.viewmodel.PresencaViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PresencaScreen(viewModel: PresencaViewModel) {
    val presencas by viewModel.presencas.collectAsState()
    val syncStatus by viewModel.syncStatus.collectAsState()
    val pendingCount by viewModel.pendingSyncCount.collectAsState()
    val isConnected by viewModel.isConnected.collectAsState()

    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Koinonia", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("Controle de Presença", fontSize = 12.sp, color = Color.White.copy(alpha = 0.75f))
                    }
                },
                actions = {
                    SyncStatusIndicator(
                        syncStatus = syncStatus,
                        pendingCount = pendingCount,
                        isConnected = isConnected,
                        onSyncClick = { viewModel.sincronizarAgora() },
                        modifier = Modifier.padding(end = 8.dp)
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF1F4788),
                    titleContentColor = Color.White,
                    actionIconContentColor = Color.White
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    // Demo: registra uma presença simulada
                    viewModel.registrarPresenca(
                        memberId = "membro-demo-001",
                        cultoId = "culto-demo-001",
                        data = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault())
                            .format(java.util.Date()),
                        atrasado = false
                    )
                    scope.launch {
                        snackbarHostState.showSnackbar("✅ Presença registrada!")
                    }
                },
                containerColor = Color(0xFF1F4788)
            ) {
                Icon(Icons.Default.CheckCircle, contentDescription = "Registrar Presença", tint = Color.White)
            }
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        if (presencas.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(
                    Icons.Default.Person,
                    contentDescription = null,
                    tint = Color(0xFF94A3B8),
                    modifier = Modifier.padding(bottom = 16.dp)
                )
                Text(
                    text = "Nenhuma presença registrada",
                    color = Color(0xFF64748B),
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "Toque no botão + para registrar",
                    color = Color(0xFF94A3B8),
                    fontSize = 13.sp
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(presencas) { presenca ->
                    PresencaItem(presenca = presenca)
                }
            }
        }
    }
}

@Composable
fun PresencaItem(presenca: Presenca) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (presenca.needsSync)
                Color(0xFFFFF7ED) // Orange light - pendente
            else
                Color(0xFFF0FDF4)  // Green light - sincronizado
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                if (presenca.needsSync) Icons.Default.Person else Icons.Default.CheckCircle,
                contentDescription = null,
                tint = if (presenca.needsSync) Color(0xFFD97706) else Color(0xFF16A34A)
            )
            Spacer(modifier = Modifier.padding(horizontal = 8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text("Membro: ${presenca.memberId}", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                Text("Culto: ${presenca.cultoId}", fontSize = 12.sp, color = Color(0xFF64748B))
                Text("Data: ${presenca.data}", fontSize = 12.sp, color = Color(0xFF64748B))
            }
            Text(
                if (presenca.needsSync) "⏳ Pendente" else "✅ Sync",
                fontSize = 11.sp,
                color = if (presenca.needsSync) Color(0xFFD97706) else Color(0xFF16A34A),
                fontWeight = FontWeight.Bold
            )
        }
    }
}
