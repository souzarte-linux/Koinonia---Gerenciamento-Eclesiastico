import React, { useState } from 'react';
import { BarChart3, FileCode2, Layers, LayoutTemplate, LineChart, PieChart } from 'lucide-react';

export default function AndroidReports() {
  const [activeTab, setActiveTab] = useState<string>('relatorio_data');

  const files = {
    'relatorio_data': {
      name: 'RelatorioData.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.model

import java.time.LocalDate
import java.time.LocalTime

// Relatório de Membros Faltantes
data class MembrosAusentes(
    val memberId: String,
    val nomeCompleto: String,
    val totalFaltas: Int,
    val ultimaFalta: LocalDate?,
    val motivos: Map<String, Int> // Map de motivo -> count
)

// Relatório de Aderência por Culto
data class AdesaoCulto(
    val cultoId: String,
    val data: LocalDate,
    val horarioInicio: LocalTime,
    val tipoCulto: String,
    val totalEsperado: Int,
    val totalPresentes: Int,
    val percentualAdesao: Double,
    val atrasados: Int
)

// Ponto de dados para gráfico de horários
data class PontoHorario(
    val horario: String, // "18:30"
    val quantidade: Int
)

// Relatório de Comparação Cultos
data class ComparativoCultos(
    val tipoCulto: String, // "ORDINARIO" ou "EXTRAORDINARIO"
    val totalCultos: Int,
    val totalPresentes: Int,
    val percentualAdesao: Double,
    val melhorDia: String?,
    val melhorAdesao: Double?
)

// Análise de Feriado
data class AnaliseFeriado(
    val feriado: String,
    val dataCulto: LocalDate,
    val totalMembros: Int,
    val viajaram: Int,
    val permaneceram: Int,
    val percentualViagem: Double
)

// Resumo de Evangelismo
data class ResumoEvangelismo(
    val local: String,
    val bairro: String?,
    val tipoLocal: String,
    val quantidadeVisitantes: Int,
    val quantidadeConvertidos: Int,
    val quantidadeRetornos: Int,
    val sugestaoMudancaEstrategia: String?
)

// Resumo geral
data class ResumoGeral(
    val periodoInicio: LocalDate,
    val periodoFim: LocalDate,
    val totalCultos: Int,
    val totalPresencas: Int,
    val totalAusencias: Int,
    val percentualAdesaoGeral: Double,
    val membroComMaiorFrequencia: MembrosAusentes?,
    val membroComMenorFrequencia: MembrosAusentes?
)`
    },
    'irelatorio_repository': {
      name: 'IRelatorioRepository.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.repository

import com.koinonia.app.domain.model.AdesaoCulto
import com.koinonia.app.domain.model.AnaliseFeriado
import com.koinonia.app.domain.model.ComparativoCultos
import com.koinonia.app.domain.model.MembrosAusentes
import com.koinonia.app.domain.model.PontoHorario
import com.koinonia.app.domain.model.ResumoEvangelismo
import com.koinonia.app.domain.model.ResumoGeral
import java.time.LocalDate

interface IRelatorioRepository {
    
    suspend fun getMembrosComMaiorAusencia(
        dataInicio: LocalDate,
        dataFim: LocalDate,
        limite: Int = 10
    ): List<MembrosAusentes>
    
    suspend fun getCultosComMenorAderencia(
        dataInicio: LocalDate,
        dataFim: LocalDate,
        limite: Int = 10
    ): List<AdesaoCulto>
    
    suspend fun getHorariosChegada(
        cultoId: String
    ): List<PontoHorario>
    
    suspend fun getComparativoCultos(
        dataInicio: LocalDate,
        dataFim: LocalDate
    ): List<ComparativoCultos>
    
    suspend fun getAnaliseFeriados(
        ano: Int
    ): List<AnaliseFeriado>
    
    suspend fun getResumoEvangelismo(
        dataInicio: LocalDate,
        dataFim: LocalDate
    ): List<ResumoEvangelismo>
    
    suspend fun getResumoGeral(
        dataInicio: LocalDate,
        dataFim: LocalDate
    ): ResumoGeral
}`
    },
    'relatorio_repository': {
      name: 'RelatorioRepository.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.repository

import com.koinonia.app.data.local.dao.AusenciaDao
import com.koinonia.app.data.local.dao.CultoDao
import com.koinonia.app.data.local.dao.MemberDao
import com.koinonia.app.data.local.dao.PresencaDao
import com.koinonia.app.domain.model.AdesaoCulto
import com.koinonia.app.domain.model.AnaliseFeriado
import com.koinonia.app.domain.model.ComparativoCultos
import com.koinonia.app.domain.model.MembrosAusentes
import com.koinonia.app.domain.model.PontoHorario
import com.koinonia.app.domain.model.ResumoEvangelismo
import com.koinonia.app.domain.model.ResumoGeral
import com.koinonia.app.domain.repository.IRelatorioRepository
import java.time.LocalDate
import java.time.ZoneOffset
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RelatorioRepository @Inject constructor(
    private val presencaDao: PresencaDao,
    private val ausenciaDao: AusenciaDao,
    private val cultoDao: CultoDao,
    private val memberDao: MemberDao
) : IRelatorioRepository {
    
    override suspend fun getMembrosComMaiorAusencia(
        dataInicio: LocalDate,
        dataFim: LocalDate,
        limite: Int
    ): List<MembrosAusentes> {
        val inicio = dataInicio.atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli()
        val fim = dataFim.atEndOfDay().toInstant(ZoneOffset.UTC).toEpochMilli()
        
        // Query: Contar ausências por membro
        val ausenciasPorMembro = mutableMapOf<String, MembrosAusentes>()
        
        // TODO: Implementar query complexa
        // Buscar todas as ausências no período
        // Agrupar por membro
        // Contar e ordenar
        
        return ausenciasPorMembro.values
            .sortedByDescending { it.totalFaltas }
            .take(limite)
    }
    
    override suspend fun getCultosComMenorAderencia(
        dataInicio: LocalDate,
        dataFim: LocalDate,
        limite: Int
    ): List<AdesaoCulto> {
        val inicio = dataInicio.atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli()
        val fim = dataFim.atEndOfDay().toInstant(ZoneOffset.UTC).toEpochMilli()
        
        // Query: Buscar cultos e contar presenças/ausências
        return emptyList() // TODO: Implementar
    }
    
    override suspend fun getHorariosChegada(cultoId: String): List<PontoHorario> {
        // Query: Buscar todas as presenças do culto
        // Agrupar por hora de chegada
        // Retornar gráfico
        
        return emptyList() // TODO: Implementar com agrupamento por 30min
    }
    
    override suspend fun getComparativoCultos(
        dataInicio: LocalDate,
        dataFim: LocalDate
    ): List<ComparativoCultos> {
        // Query: Comparar ordinários vs extraordinários
        // Por dia da semana (domingo, quarta, sábado)
        
        return emptyList() // TODO: Implementar
    }
    
    override suspend fun getAnaliseFeriados(ano: Int): List<AnaliseFeriado> {
        // Query: Para cada feriado, buscar culto 1 dia antes
        // Contar quantos viajaram vs permaneceram
        // Usar ausências com motivo identificando viagem
        
        return emptyList() // TODO: Implementar
    }
    
    override suspend fun getResumoEvangelismo(
        dataInicio: LocalDate,
        dataFim: LocalDate
    ): List<ResumoEvangelismo> {
        // Query: Juntar data de evangelismo_resultados + locais_culto
        // Agrupar por local e bairro
        
        return emptyList() // TODO: Implementar
    }
    
    override suspend fun getResumoGeral(
        dataInicio: LocalDate,
        dataFim: LocalDate
    ): ResumoGeral {
        // Query: Contar tudo
        // - Total de cultos
        // - Total de presenças
        // - Total de ausências
        // - Membro com mais frequência
        // - Membro com menos frequência
        
        return ResumoGeral(
            periodoInicio = dataInicio,
            periodoFim = dataFim,
            totalCultos = 0, // TODO
            totalPresencas = 0, // TODO
            totalAusencias = 0, // TODO
            percentualAdesaoGeral = 0.0, // TODO
            membroComMaiorFrequencia = null, // TODO
            membroComMenorFrequencia = null // TODO
        )
    }
}`
    },
    'relatorio_viewmodel': {
      name: 'RelatorioViewModel.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.presentation.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.koinonia.app.domain.model.AdesaoCulto
import com.koinonia.app.domain.model.ComparativoCultos
import com.koinonia.app.domain.model.MembrosAusentes
import com.koinonia.app.domain.model.PontoHorario
import com.koinonia.app.domain.model.ResumoGeral
import com.koinonia.app.domain.repository.IRelatorioRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

@HiltViewModel
class RelatorioViewModel @Inject constructor(
    private val repository: IRelatorioRepository
) : ViewModel() {
    
    private val _dataInicio = MutableStateFlow(LocalDate.now().minusMonths(1))
    private val _dataFim = MutableStateFlow(LocalDate.now())
    val dataInicio: StateFlow<LocalDate> = _dataInicio.asStateFlow()
    val dataFim: StateFlow<LocalDate> = _dataFim.asStateFlow()
    
    private val _uiState = MutableStateFlow<RelatorioUiState>(RelatorioUiState.Loading)
    val uiState: StateFlow<RelatorioUiState> = _uiState.asStateFlow()
    
    private val _membrosAusentes = MutableStateFlow<List<MembrosAusentes>>(emptyList())
    val membrosAusentes: StateFlow<List<MembrosAusentes>> = _membrosAusentes.asStateFlow()
    
    private val _cultosComMenorAderencia = MutableStateFlow<List<AdesaoCulto>>(emptyList())
    val cultosComMenorAderencia: StateFlow<List<AdesaoCulto>> = _cultosComMenorAderencia.asStateFlow()
    
    private val _horariosChegada = MutableStateFlow<List<PontoHorario>>(emptyList())
    val horariosChegada: StateFlow<List<PontoHorario>> = _horariosChegada.asStateFlow()
    
    private val _comparativoCultos = MutableStateFlow<List<ComparativoCultos>>(emptyList())
    val comparativoCultos: StateFlow<List<ComparativoCultos>> = _comparativoCultos.asStateFlow()
    
    private val _resumoGeral = MutableStateFlow<ResumoGeral?>(null)
    val resumoGeral: StateFlow<ResumoGeral?> = _resumoGeral.asStateFlow()
    
    init {
        carregarRelatorios()
    }
    
    fun carregarRelatorios() {
        viewModelScope.launch {
            _uiState.value = RelatorioUiState.Loading
            
            try {
                // Carregar todos os dados em paralelo
                val membrosJob = async { 
                    repository.getMembrosComMaiorAusencia(_dataInicio.value, _dataFim.value)
                }
                val cultosJob = async { 
                    repository.getCultosComMenorAderencia(_dataInicio.value, _dataFim.value)
                }
                val comparativoJob = async { 
                    repository.getComparativoCultos(_dataInicio.value, _dataFim.value)
                }
                val resumoJob = async { 
                    repository.getResumoGeral(_dataInicio.value, _dataFim.value)
                }
                
                _membrosAusentes.value = membrosJob.await()
                _cultosComMenorAderencia.value = cultosJob.await()
                _comparativoCultos.value = comparativoJob.await()
                _resumoGeral.value = resumoJob.await()
                
                _uiState.value = RelatorioUiState.Idle
            } catch (e: Exception) {
                Log.e("RelatorioVM", "Erro ao carregar: \${e.message}")
                _uiState.value = RelatorioUiState.Error(e.message ?: "Erro desconhecido")
            }
        }
    }
    
    fun alterarDataInicio(data: LocalDate) {
        _dataInicio.value = data
        carregarRelatorios()
    }
    
    fun alterarDataFim(data: LocalDate) {
        _dataFim.value = data
        carregarRelatorios()
    }
}

sealed class RelatorioUiState {
    object Idle : RelatorioUiState()
    object Loading : RelatorioUiState()
    data class Error(val message: String) : RelatorioUiState()
}`
    },
    'relatorio_screen': {
      name: 'RelatorioScreen.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import com.koinonia.app.presentation.viewmodel.RelatorioUiState
import com.koinonia.app.presentation.viewmodel.RelatorioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RelatorioScreen(
    viewModel: RelatorioViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var abaAtual by remember { mutableIntStateOf(0) }
    val abas = listOf("Resumo", "Faltantes", "Aderência", "Comparativo")
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Relatórios") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { innerPadding ->
        when (uiState) {
            is RelatorioUiState.Loading -> {
                CircularProgressIndicator(
                    modifier = Modifier
                        .fillMaxSize()
                        .wrapContentSize(Alignment.Center)
                )
            }
            is RelatorioUiState.Error -> {
                Text(
                    (uiState as RelatorioUiState.Error).message,
                    modifier = Modifier
                        .fillMaxSize()
                        .wrapContentSize(Alignment.Center),
                    color = MaterialTheme.colorScheme.error
                )
            }
            else -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(innerPadding)
                ) {
                    // Abas
                    TabRow(
                        selectedTabIndex = abaAtual,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        abas.forEachIndexed { index, title ->
                            Tab(
                                selected = abaAtual == index,
                                onClick = { abaAtual = index },
                                text = { Text(title, maxLines = 1) }
                            )
                        }
                    }
                    
                    // Conteúdo das abas
                    when (abaAtual) {
                        0 -> AbaResumo(viewModel)
                        1 -> AbaFaltantes(viewModel)
                        2 -> AbaAderencia(viewModel)
                        3 -> AbaComparativo(viewModel)
                    }
                }
            }
        }
    }
}`
    },
    'aba_resumo': {
      name: 'AbaResumo.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.koinonia.app.domain.model.ResumoGeral
import com.koinonia.app.presentation.viewmodel.RelatorioViewModel

@Composable
fun AbaResumo(viewModel: RelatorioViewModel) {
    val resumoGeral by viewModel.resumoGeral.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            resumoGeral?.let { resumo ->
                ResumoPrincipalCard(resumo)
            }
        }
        
        item {
            SeletorDataRange(viewModel)
        }
        
        item {
            EstatisticasCard(resumoGeral)
        }
    }
}

@Composable
fun ResumoPrincipalCard(resumo: ResumoGeral) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                "Resumo do Período",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                EstatisticasItem("Cultos", "\${resumo.totalCultos}")
                EstatisticasItem("Presenças", "\${resumo.totalPresencas}")
                EstatisticasItem("Ausências", "\${resumo.totalAusencias}")
                EstatisticasItem("Aderência", "%.1f%%".format(resumo.percentualAdesaoGeral))
            }
        }
    }
}

@Composable
fun EstatisticasItem(label: String, valor: String) {
    Column(
        modifier = Modifier
            .background(MaterialTheme.colorScheme.primary, RoundedCornerShape(8.dp))
            .padding(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = Color.White)
        Text(valor, style = MaterialTheme.typography.headlineSmall, color = Color.White)
    }
}

@Composable
fun SeletorDataRange(viewModel: RelatorioViewModel) {
    val dataInicio by viewModel.dataInicio.collectAsState()
    val dataFim by viewModel.dataFim.collectAsState()
    
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        OutlinedTextField(
            value = dataInicio.toString(),
            onValueChange = { },
            label = { Text("De") },
            readOnly = true,
            modifier = Modifier.weight(1f)
        )
        
        OutlinedTextField(
            value = dataFim.toString(),
            onValueChange = { },
            label = { Text("Até") },
            readOnly = true,
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
fun EstatisticasCard(resumo: ResumoGeral?) {
    if (resumo == null) return
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text("Membros", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
            
            if (resumo.membroComMaiorFrequencia != null) {
                Text(
                    "Maior frequência: \${resumo.membroComMaiorFrequencia.nomeCompleto} (\${resumo.membroComMaiorFrequencia.totalFaltas} ausências)",
                    style = MaterialTheme.typography.bodySmall
                )
            }
            
            if (resumo.membroComMenorFrequencia != null) {
                Text(
                    "Menor frequência: \${resumo.membroComMenorFrequencia.nomeCompleto} (\${resumo.membroComMenorFrequencia.totalFaltas} ausências)",
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}`
    },
    'aba_faltantes': {
      name: 'AbaFaltantes.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Badge
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.koinonia.app.domain.model.MembrosAusentes
import com.koinonia.app.presentation.viewmodel.RelatorioViewModel

@Composable
fun AbaFaltantes(viewModel: RelatorioViewModel) {
    val membrosAusentes by viewModel.membrosAusentes.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        item {
            Text(
                "Top 10 Membros Faltantes",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
        }
        
        items(membrosAusentes) { membro ->
            MembroFaltanteCard(membro)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MembroFaltanteCard(membro: MembrosAusentes) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    membro.nomeCompleto,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold
                )
                
                Badge(containerColor = MaterialTheme.colorScheme.error) {
                    Text("\${membro.totalFaltas} faltas", color = Color.White)
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Mostrar motivos
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                membro.motivos.forEach { (motivo, count) ->
                    FilterChip(
                        selected = false,
                        onClick = { },
                        label = { Text("\$motivo: \$count") },
                        modifier = Modifier.wrapContentSize()
                    )
                }
            }
        }
    }
}`
    },
    'aba_aderencia': {
      name: 'AbaAderencia.kt',
      icon: LineChart,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Badge
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.koinonia.app.domain.model.AdesaoCulto
import com.koinonia.app.presentation.viewmodel.RelatorioViewModel
import java.time.format.DateTimeFormatter

@Composable
fun AbaAderencia(viewModel: RelatorioViewModel) {
    val cultosComMenor by viewModel.cultosComMenorAderencia.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                "Cultos com Menor Aderência",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
        }
        
        items(cultosComMenor) { culto ->
            CultoAderenciaCard(culto)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CultoAderenciaCard(culto: AdesaoCulto) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        "\${culto.data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))} \${culto.horarioInicio}",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        culto.tipoCulto,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Badge(
                    containerColor = if (culto.percentualAdesao >= 50) 
                        MaterialTheme.colorScheme.primary 
                    else 
                        MaterialTheme.colorScheme.error
                ) {
                    Text("%.1f%%".format(culto.percentualAdesao), color = Color.White)
                }
            }
            
            LinearProgressIndicator(
                progress = { (culto.percentualAdesao / 100).toFloat() },
                modifier = Modifier.fillMaxWidth(),
            )
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text("Presentes: \${culto.totalPresentes}/\${culto.totalEsperado}", 
                    style = MaterialTheme.typography.labelSmall)
                Text("Atrasados: \${culto.atrasados}", 
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.error)
            }
        }
    }
}`
    },
    'aba_comparativo': {
      name: 'AbaComparativo.kt',
      icon: PieChart,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.koinonia.app.domain.model.ComparativoCultos
import com.koinonia.app.presentation.viewmodel.RelatorioViewModel

@Composable
fun AbaComparativo(viewModel: RelatorioViewModel) {
    val comparativo by viewModel.comparativoCultos.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                "Comparativo: Ordinários vs Extraordinários",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
        }
        
        items(comparativo) { comp ->
            ComparativoCard(comp)
        }
    }
}

@Composable
fun ComparativoCard(comp: ComparativoCultos) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                comp.tipoCulto,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Bold
            )
            
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                EstatisticasItem("Cultos", "\${comp.totalCultos}")
                EstatisticasItem("Presenças", "\${comp.totalPresentes}")
                EstatisticasItem("Aderência", "%.1f%%".format(comp.percentualAdesao))
            }
        }
    }
}`
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Relatórios e Analytics (Android)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Implementação do Domínio, Data Layer e UI (Compose) para análise de dados, relatórios, faltantes, aderência de cultos e resumo geral.
        </p>
      </div>

      <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex h-[700px]">
        
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/80 border-r border-slate-700 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arquivos Implementados</h3>
          </div>
          <div className="flex-1 py-2 space-y-1">
            {Object.entries(files).map(([key, file]) => {
              const Icon = file.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left transition-colors ${
                    activeTab === key 
                      ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
          <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
            <span className="text-[11px] font-mono text-indigo-400">{files[activeTab as keyof typeof files].name}</span>
            <button className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-slate-300 transition-colors bg-slate-800 px-2 py-1 rounded border border-slate-700">
              Copiar Código
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <pre className="text-[13px] font-mono text-slate-300 leading-relaxed">
              {files[activeTab as keyof typeof files].content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
