import React, { useState } from 'react';
import { Database, FileCode2, Layers, LayoutTemplate, UserMinus, PlusCircle, MessageSquare } from 'lucide-react';

export default function AndroidAbsence() {
  const [activeTab, setActiveTab] = useState<string>('ausencia_entity');

  const files = {
    'ausencia_entity': {
      name: 'AusenciaEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "ausencias",
    foreignKeys = [
        ForeignKey(entity = MemberEntity::class, parentColumns = ["id"], childColumns = ["membro_id"], onDelete = ForeignKey.CASCADE),
        ForeignKey(entity = CultoEntity::class, parentColumns = ["id"], childColumns = ["culto_id"], onDelete = ForeignKey.CASCADE)
    ],
    indices = [Index("membro_id"), Index("culto_id"), Index("data_falta"), Index("status_acompanhamento")]
)
data class AusenciaEntity(
    @PrimaryKey val id: String,
    val membro_id: String,
    val culto_id: String,
    val data_falta: Long, // LocalDate em milissegundos
    val motivo: String, // "SAUDE_PROPRIA", "SAUDE_FAMILIAR", "TRABALHO", "ESTUDO", "ATIVIDADE_PESSOAL", "OUTRO"
    val descricao_motivo: String?,
    val responsavel_contato: String?,
    val meio_contato: String?, // "PESSOALMENTE", "WHATSAPP", "REDE_SOCIAL"
    val tipo_contato_pessoal: String?, // "VISITA_DOMICILIAR", "REENCONTRO_PROXIMO_CULTO"
    val rede_social_contato: String?, // "INSTAGRAM", "FACEBOOK", "TIKTOK"
    val data_contato: Long?,
    val anotacoes: String?,
    val status_acompanhamento: String = "PENDENTE", // "PENDENTE", "REALIZADO", "VISITADO", "RESPONDEU"
    val created_at: Long,
    val updated_at: Long,
    val synced_at: Long?,
    val needs_sync: Boolean = false
)`
    },
    'domain_ausencia': {
      name: 'Ausencia.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.model

import java.time.LocalDate
import java.time.LocalDateTime

data class Ausencia(
    val id: String,
    val memberId: String,
    val cultoId: String,
    val dataFalta: LocalDate,
    val motivo: MotivoAusencia,
    val descricaoMotivo: String?,
    val responsavelContato: String?,
    val meioContato: MeioContato?,
    val tipoContatoPessoal: TipoContatoPessoal?,
    val redeSocialContato: RedeSocial?,
    val dataContato: LocalDateTime?,
    val anotacoes: String?,
    val statusAcompanhamento: StatusAcompanhamento,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val syncedAt: LocalDateTime?,
    val needsSync: Boolean
) {
    enum class MotivoAusencia {
        SAUDE_PROPRIA,
        SAUDE_FAMILIAR,
        TRABALHO,
        ESTUDO,
        ATIVIDADE_PESSOAL,
        OUTRO
    }
    
    enum class MeioContato {
        PESSOALMENTE,
        WHATSAPP,
        REDE_SOCIAL
    }
    
    enum class TipoContatoPessoal {
        VISITA_DOMICILIAR,
        REENCONTRO_PROXIMO_CULTO
    }
    
    enum class RedeSocial {
        INSTAGRAM,
        FACEBOOK,
        TIKTOK
    }
    
    enum class StatusAcompanhamento {
        PENDENTE,
        REALIZADO,
        VISITADO,
        RESPONDEU
    }
}`
    },
    'ausencia_dao': {
      name: 'AusenciaDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.koinonia.app.data.local.entity.AusenciaEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AusenciaDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(ausencia: AusenciaEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(ausencias: List<AusenciaEntity>)
    
    @Query("SELECT * FROM ausencias WHERE culto_id = :cultoId ORDER BY data_falta DESC")
    fun getAusenciasByCulto(cultoId: String): Flow<List<AusenciaEntity>>
    
    @Query("SELECT * FROM ausencias WHERE membro_id = :memberId ORDER BY data_falta DESC")
    fun getAusenciasByMember(memberId: String): Flow<List<AusenciaEntity>>
    
    @Query("SELECT * FROM ausencias WHERE id = :ausenciaId")
    suspend fun getAusenciaById(ausenciaId: String): AusenciaEntity?
    
    @Query("SELECT * FROM ausencias WHERE status_acompanhamento = 'PENDENTE' ORDER BY data_falta ASC")
    fun getAusenciasPendentes(): Flow<List<AusenciaEntity>>
    
    @Query("SELECT * FROM ausencias WHERE needs_sync = 1 ORDER BY created_at ASC")
    suspend fun getPendingSync(): List<AusenciaEntity>
    
    @Query("UPDATE ausencias SET needs_sync = 0, synced_at = :syncedAt WHERE id = :ausenciaId")
    suspend fun markAsSynced(ausenciaId: String, syncedAt: Long)
    
    @Query("UPDATE ausencias SET needs_sync = 1 WHERE id = :ausenciaId")
    suspend fun markForSync(ausenciaId: String)
    
    @Query("SELECT COUNT(*) FROM ausencias WHERE motivo = :motivo AND data_falta BETWEEN :dataInicio AND :dataFim")
    suspend fun countByMotivo(motivo: String, dataInicio: Long, dataFim: Long): Int
    
    @Query("SELECT COUNT(*) FROM ausencias WHERE membro_id = :memberId AND data_falta BETWEEN :dataInicio AND :dataFim")
    suspend fun countMemberAusencias(memberId: String, dataInicio: Long, dataFim: Long): Int
    
    @Update
    suspend fun update(ausencia: AusenciaEntity)
    
    @Delete
    suspend fun delete(ausencia: AusenciaEntity)
    
    @Query("SELECT * FROM ausencias WHERE status_acompanhamento = 'PENDENTE' AND data_falta < :data")
    suspend fun getAusenciasAtrasadas(data: Long): List<AusenciaEntity>
}`
    },
    'repo_interface': {
      name: 'IAusenciaRepository.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.repository

import com.koinonia.app.domain.model.Ausencia
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.time.LocalDateTime

interface IAusenciaRepository {
    
    suspend fun registrarAusencia(ausencia: Ausencia): Result<Ausencia>
    
    fun getAusenciasByCulto(cultoId: String): Flow<List<Ausencia>>
    
    fun getAusenciasByMember(memberId: String): Flow<List<Ausencia>>
    
    suspend fun getAusenciaById(ausenciaId: String): Ausencia?
    
    fun getAusenciasPendentes(): Flow<List<Ausencia>>
    
    suspend fun atualizarAusencia(ausencia: Ausencia): Result<Ausencia>
    
    suspend fun syncPendingAusencias(): Result<Unit>
    
    suspend fun registrarAcompanhamento(
        ausenciaId: String,
        responsavel: String,
        meioContato: Ausencia.MeioContato,
        dataContato: LocalDateTime,
        status: Ausencia.StatusAcompanhamento,
        anotacoes: String?
    ): Result<Ausencia>
    
    suspend fun countMemberAusencias(memberId: String, dataInicio: LocalDate, dataFim: LocalDate): Int
}`
    },
    'repo_impl': {
      name: 'AusenciaRepository.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.repository

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.util.Log
import com.koinonia.app.data.local.dao.AusenciaDao
import com.koinonia.app.data.remote.supabase.AusenciaRemoteDataSource
import com.koinonia.app.domain.model.Ausencia
import com.koinonia.app.domain.repository.IAusenciaRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AusenciaRepository @Inject constructor(
    private val ausenciaDao: AusenciaDao,
    private val remoteDataSource: AusenciaRemoteDataSource,
    @ApplicationContext private val context: Context
) : IAusenciaRepository {
    
    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    
    override suspend fun registrarAusencia(ausencia: Ausencia): Result<Ausencia> {
        return try {
            // 1. Salvar localmente
            // val entity = ausencia.toEntity()
            // ausenciaDao.insert(entity)
            
            // 2. Tentar sincronizar se online
            if (isConnected()) {
                try {
                    // remoteDataSource.registrarAusencia(ausencia.toDto())
                    ausenciaDao.markAsSynced(ausencia.id, System.currentTimeMillis())
                    Log.d("AusenciaRepo", "✅ Ausência sincronizada imediatamente")
                } catch (e: Exception) {
                    Log.d("AusenciaRepo", "⚠️ Sync falhou, agendando para depois")
                    ausenciaDao.markForSync(ausencia.id)
                }
            } else {
                ausenciaDao.markForSync(ausencia.id)
            }
            
            Result.success(ausencia)
        } catch (e: Exception) {
            Log.e("AusenciaRepo", "❌ Erro ao registrar: \${e.message}")
            Result.failure(e)
        }
    }
    
    override fun getAusenciasByCulto(cultoId: String): Flow<List<Ausencia>> = emptyFlow()
    override fun getAusenciasByMember(memberId: String): Flow<List<Ausencia>> = emptyFlow()
    override suspend fun getAusenciaById(ausenciaId: String): Ausencia? = null
    override fun getAusenciasPendentes(): Flow<List<Ausencia>> = emptyFlow()
    
    override suspend fun atualizarAusencia(ausencia: Ausencia): Result<Ausencia> {
        return try {
            // ausenciaDao.update(ausencia.toEntity())
            Result.success(ausencia)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun syncPendingAusencias(): Result<Unit> {
        return try {
            val pendentes = ausenciaDao.getPendingSync()
            
            if (pendentes.isEmpty()) {
                return Result.success(Unit)
            }
            
            Log.d("AusenciaRepo", "🔄 Sincronizando \${pendentes.size} ausências...")
            
            var sucessos = 0
            for (ausencia in pendentes) {
                try {
                    // remoteDataSource.registrarAusencia(ausencia.toDto())
                    ausenciaDao.markAsSynced(ausencia.id, System.currentTimeMillis())
                    sucessos++
                } catch (e: Exception) {
                    Log.d("AusenciaRepo", "❌ Erro ao sincronizar \${ausencia.id}")
                }
            }
            
            Log.d("AusenciaRepo", "📊 Resultado: \$sucessos sincronizadas")
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun registrarAcompanhamento(
        ausenciaId: String,
        responsavel: String,
        meioContato: Ausencia.MeioContato,
        dataContato: LocalDateTime,
        status: Ausencia.StatusAcompanhamento,
        anotacoes: String?
    ): Result<Ausencia> {
        return Result.failure(Exception("Not implemented yet"))
    }
    
    override suspend fun countMemberAusencias(memberId: String, dataInicio: LocalDate, dataFim: LocalDate): Int {
        val inicio = dataInicio.atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli()
        val fim = dataFim.atStartOfDay().plusDays(1).toInstant(ZoneOffset.UTC).toEpochMilli() - 1
        return ausenciaDao.countMemberAusencias(memberId, inicio, fim)
    }
    
    private fun isConnected(): Boolean {
        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val caps = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false
        return when {
            caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
            caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
            else -> false
        }
    }
}`
    },
    'usecase_registrar': {
      name: 'RegistrarAusenciaUseCase.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.usecase

import com.koinonia.app.domain.model.Ausencia
import com.koinonia.app.domain.repository.IAusenciaRepository
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RegistrarAusenciaUseCase @Inject constructor(
    private val repository: IAusenciaRepository
) {
    
    suspend operator fun invoke(
        memberId: String,
        cultoId: String,
        motivo: Ausencia.MotivoAusencia,
        descricaoMotivo: String? = null
    ): Result<Ausencia> {
        return try {
            val ausencia = Ausencia(
                id = UUID.randomUUID().toString(),
                memberId = memberId,
                cultoId = cultoId,
                dataFalta = LocalDate.now(),
                motivo = motivo,
                descricaoMotivo = descricaoMotivo,
                responsavelContato = null,
                meioContato = null,
                tipoContatoPessoal = null,
                redeSocialContato = null,
                dataContato = null,
                anotacoes = null,
                statusAcompanhamento = Ausencia.StatusAcompanhamento.PENDENTE,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                syncedAt = null,
                needsSync = true
            )
            
            repository.registrarAusencia(ausencia)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`
    },
    'usecase_acompanhamento': {
      name: 'RegistrarAcompanhamentoUseCase.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.usecase

import com.koinonia.app.domain.model.Ausencia
import com.koinonia.app.domain.repository.IAusenciaRepository
import java.time.LocalDateTime
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RegistrarAcompanhamentoUseCase @Inject constructor(
    private val repository: IAusenciaRepository
) {
    
    suspend operator fun invoke(
        ausenciaId: String,
        responsavel: String,
        meioContato: Ausencia.MeioContato,
        tipoContatoPessoal: Ausencia.TipoContatoPessoal? = null,
        redeSocial: Ausencia.RedeSocial? = null,
        status: Ausencia.StatusAcompanhamento,
        anotacoes: String? = null
    ): Result<Ausencia> {
        return repository.registrarAcompanhamento(
            ausenciaId = ausenciaId,
            responsavel = responsavel,
            meioContato = meioContato,
            dataContato = LocalDateTime.now(),
            status = status,
            anotacoes = anotacoes
        )
    }
}`
    },
    'viewmodel': {
      name: 'AusenciaViewModel.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.koinonia.app.domain.model.Ausencia
import com.koinonia.app.domain.repository.IAusenciaRepository
import com.koinonia.app.domain.usecase.RegistrarAcompanhamentoUseCase
import com.koinonia.app.domain.usecase.RegistrarAusenciaUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AusenciaViewModel @Inject constructor(
    private val registrarAusenciaUseCase: RegistrarAusenciaUseCase,
    private val registrarAcompanhamentoUseCase: RegistrarAcompanhamentoUseCase,
    private val repository: IAusenciaRepository
) : ViewModel() {
    
    private val _ausenciasPendentes = MutableStateFlow<List<Ausencia>>(emptyList())
    val ausenciasPendentes: StateFlow<List<Ausencia>> = _ausenciasPendentes.asStateFlow()
    
    private val _uiState = MutableStateFlow<AusenciaUiState>(AusenciaUiState.Idle)
    val uiState: StateFlow<AusenciaUiState> = _uiState.asStateFlow()
    
    private val _ausenciaAtual = MutableStateFlow<Ausencia?>(null)
    val ausenciaAtual: StateFlow<Ausencia?> = _ausenciaAtual.asStateFlow()
    
    init {
        carregarAusenciasPendentes()
    }
    
    fun registrarAusencia(memberId: String, cultoId: String, motivo: Ausencia.MotivoAusencia, descricao: String?) {
        viewModelScope.launch {
            _uiState.value = AusenciaUiState.Loading
            
            val result = registrarAusenciaUseCase(memberId, cultoId, motivo, descricao)
            
            result.onSuccess { ausencia ->
                _uiState.value = AusenciaUiState.Success("Ausência registrada")
                delay(2000)
                _uiState.value = AusenciaUiState.Idle
                carregarAusenciasPendentes()
            }.onFailure { error ->
                _uiState.value = AusenciaUiState.Error(error.message ?: "Erro desconhecido")
            }
        }
    }
    
    fun registrarAcompanhamento(
        ausenciaId: String,
        responsavel: String,
        meioContato: Ausencia.MeioContato,
        status: Ausencia.StatusAcompanhamento,
        anotacoes: String?
    ) {
        viewModelScope.launch {
            _uiState.value = AusenciaUiState.Loading
            
            val result = registrarAcompanhamentoUseCase(
                ausenciaId,
                responsavel,
                meioContato,
                status = status,
                anotacoes = anotacoes
            )
            
            result.onSuccess { ausencia ->
                _uiState.value = AusenciaUiState.Success("Acompanhamento registrado")
                delay(2000)
                _uiState.value = AusenciaUiState.Idle
                carregarAusenciasPendentes()
            }.onFailure { error ->
                _uiState.value = AusenciaUiState.Error(error.message ?: "Erro desconhecido")
            }
        }
    }
    
    fun carregarAusenciasPendentes() {
        viewModelScope.launch {
            repository.getAusenciasPendentes().collect { ausencias ->
                _ausenciasPendentes.value = ausencias
            }
        }
    }
    
    fun selecionarAusencia(ausencia: Ausencia) {
        _ausenciaAtual.value = ausencia
    }
}

sealed class AusenciaUiState {
    object Idle : AusenciaUiState()
    object Loading : AusenciaUiState()
    data class Success(val message: String) : AusenciaUiState()
    data class Error(val message: String) : AusenciaUiState()
}`
    },
    'screen_ausencia': {
      name: 'AusenciaScreen.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.koinonia.app.presentation.ui.component.AusenciaCard
import com.koinonia.app.presentation.viewmodel.AusenciaUiState
import com.koinonia.app.presentation.viewmodel.AusenciaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AusenciaScreen(
    viewModel: AusenciaViewModel = hiltViewModel()
) {
    val ausenciasPendentes by viewModel.ausenciasPendentes.collectAsState()
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Ausências") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (uiState) {
                is AusenciaUiState.Loading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                is AusenciaUiState.Success -> {
                    Text(
                        (uiState as AusenciaUiState.Success).message,
                        modifier = Modifier.align(Alignment.Center),
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                is AusenciaUiState.Error -> {
                    Text(
                        (uiState as AusenciaUiState.Error).message,
                        modifier = Modifier.align(Alignment.Center),
                        color = MaterialTheme.colorScheme.error
                    )
                }
                else -> {
                    if (ausenciasPendentes.isEmpty()) {
                        Text(
                            "Nenhuma ausência pendente",
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(16.dp),
                            textAlign = TextAlign.Center
                        )
                    } else {
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(ausenciasPendentes) { ausencia ->
                                AusenciaCard(
                                    ausencia = ausencia,
                                    onClick = { viewModel.selecionarAusencia(ausencia) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}`
    },
    'ausencia_card': {
      name: 'AusenciaCard.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Badge
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.koinonia.app.domain.model.Ausencia
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AusenciaCard(
    ausencia: Ausencia,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = "Ausência - \${ausencia.dataFalta.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))}",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "Motivo: \${ausencia.motivo.name.replace("_", " ")}",
                style = MaterialTheme.typography.bodySmall
            )
            
            if (ausencia.descricaoMotivo != null) {
                Text(
                    text = ausencia.descricaoMotivo,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Badge(
                containerColor = when (ausencia.statusAcompanhamento) {
                    Ausencia.StatusAcompanhamento.PENDENTE -> MaterialTheme.colorScheme.error
                    Ausencia.StatusAcompanhamento.REALIZADO -> MaterialTheme.colorScheme.primary
                    Ausencia.StatusAcompanhamento.VISITADO -> MaterialTheme.colorScheme.secondary
                    Ausencia.StatusAcompanhamento.RESPONDEU -> Color(0xFF4CAF50)
                }
            ) {
                Text(
                    ausencia.statusAcompanhamento.name,
                    color = Color.White,
                    fontSize = 10.sp
                )
            }
        }
    }
}`
    },
    'form_dialog': {
      name: 'AusenciaFormDialog.kt',
      icon: PlusCircle,
      content: `package com.koinonia.app.presentation.ui.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.koinonia.app.domain.model.Ausencia

@Composable
fun AusenciaFormDialog(
    memberId: String,
    cultoId: String,
    onDismiss: () -> Unit,
    onConfirm: (motivo: Ausencia.MotivoAusencia, descricao: String?) -> Unit
) {
    var motivoSelecionado by remember { mutableStateOf<Ausencia.MotivoAusencia?>(null) }
    var descricao by remember { mutableStateOf("") }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Registrar Ausência") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Selecione o motivo:", style = MaterialTheme.typography.bodyMedium)
                
                Ausencia.MotivoAusencia.values().forEach { motivo ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { motivoSelecionado = motivo }
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = motivoSelecionado == motivo,
                            onClick = { motivoSelecionado = motivo }
                        )
                        Text(
                            motivo.name.replace("_", " "),
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }
                }
                
                if (motivoSelecionado == Ausencia.MotivoAusencia.OUTRO) {
                    OutlinedTextField(
                        value = descricao,
                        onValueChange = { descricao = it },
                        label = { Text("Descreva o motivo") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 80.dp),
                        maxLines = 5
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (motivoSelecionado != null) {
                        onConfirm(motivoSelecionado!!, if (descricao.isNotEmpty()) descricao else null)
                    }
                },
                enabled = motivoSelecionado != null
            ) {
                Text("Registrar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        }
    )
}`
    },
    'acompanhamento_dialog': {
      name: 'AcompanhamentoFormDialog.kt',
      icon: MessageSquare,
      content: `package com.koinonia.app.presentation.ui.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.koinonia.app.domain.model.Ausencia

@Composable
fun AcompanhamentoFormDialog(
    ausencia: Ausencia,
    onDismiss: () -> Unit,
    onConfirm: (responsavel: String, meioContato: Ausencia.MeioContato, status: Ausencia.StatusAcompanhamento, anotacoes: String?) -> Unit
) {
    var responsavel by remember { mutableStateOf("") }
    var meioContatoSelecionado by remember { mutableStateOf<Ausencia.MeioContato?>(null) }
    var statusSelecionado by remember { mutableStateOf<Ausencia.StatusAcompanhamento?>(null) }
    var anotacoes by remember { mutableStateOf("") }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Registrar Acompanhamento") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = responsavel,
                    onValueChange = { responsavel = it },
                    label = { Text("Responsável pelo contato") },
                    modifier = Modifier.fillMaxWidth()
                )
                
                Text("Meio de contato:", style = MaterialTheme.typography.bodyMedium)
                Ausencia.MeioContato.values().forEach { meio ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { meioContatoSelecionado = meio }
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = meioContatoSelecionado == meio,
                            onClick = { meioContatoSelecionado = meio }
                        )
                        Text(meio.name.replace("_", " "), modifier = Modifier.padding(start = 8.dp))
                    }
                }
                
                Text("Status:", style = MaterialTheme.typography.bodyMedium)
                Ausencia.StatusAcompanhamento.values().forEach { status ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { statusSelecionado = status }
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = statusSelecionado == status,
                            onClick = { statusSelecionado = status }
                        )
                        Text(status.name.replace("_", " "), modifier = Modifier.padding(start = 8.dp))
                    }
                }
                
                OutlinedTextField(
                    value = anotacoes,
                    onValueChange = { anotacoes = it },
                    label = { Text("Anotações (opcional)") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(min = 80.dp),
                    maxLines = 4
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (responsavel.isNotEmpty() && meioContatoSelecionado != null && statusSelecionado != null) {
                        onConfirm(responsavel, meioContatoSelecionado!!, statusSelecionado!!, if (anotacoes.isNotEmpty()) anotacoes else null)
                    }
                },
                enabled = responsavel.isNotEmpty() && meioContatoSelecionado != null && statusSelecionado != null
            ) {
                Text("Salvar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        }
    )
}`
    },
    'ausencia_remote_datasource': {
      name: 'AusenciaRemoteDataSource.kt',
      icon: Network,
      content: `package com.koinonia.app.data.remote.supabase

import android.util.Log
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AusenciaRemoteDataSource @Inject constructor(
    // private val supabaseClient: SupabaseClient
) {
    
    suspend fun registrarAusencia(ausencia: Any): Any {
        return try {
            /*
            supabaseClient.from("ausencias")
                .insert(ausencia)
                .decodeAs<AusenciaDto>()
                .first()
            */
            ausencia
        } catch (e: Exception) {
            Log.e("AusenciaRemote", "Erro ao registrar: \${e.message}")
            throw e
        }
    }
    
    suspend fun atualizarAusencia(id: String, ausencia: Any): Any {
        return try {
            /*
            supabaseClient.from("ausencias")
                .update(ausencia) {
                    filter { eq("id", id) }
                }
                .decodeAs<AusenciaDto>()
                .first()
            */
            ausencia
        } catch (e: Exception) {
            Log.e("AusenciaRemote", "Erro ao atualizar: \${e.message}")
            throw e
        }
    }
}`
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Ausências e Acompanhamento (Android)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Implementação do Domínio, Data Layer e UI (Compose) para gestão de ausências e contatos pastorais.
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
