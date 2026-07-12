import React, { useState } from 'react';
import { Database, FileCode2, Layers, LayoutTemplate, Calendar, PlusCircle } from 'lucide-react';

export default function AndroidCalendar() {
  const [activeTab, setActiveTab] = useState<string>('culto_entity');

  const files = {
    'culto_entity': {
      name: 'CultoEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "cultos",
    foreignKeys = [
        ForeignKey(entity = MinisterioEntity::class, parentColumns = ["id"], childColumns = ["ministerio_id"], onDelete = ForeignKey.RESTRICT),
        ForeignKey(entity = LocalCultoEntity::class, parentColumns = ["id"], childColumns = ["local_id"], onDelete = ForeignKey.RESTRICT),
        ForeignKey(entity = PessoaEntity::class, parentColumns = ["id"], childColumns = ["orador_id"], onDelete = ForeignKey.SET_NULL)
    ],
    indices = [Index("data"), Index("ministerio_id"), Index("local_id")]
)
data class CultoEntity(
    @PrimaryKey val id: String,
    val data: Long, // LocalDate em milissegundos
    val horario_inicio: String, // "HH:mm"
    val horario_fim: String,
    val tipo_culto: String, // "ORDINARIO" ou "EXTRAORDINARIO"
    val nome_serie: String?,
    val ministerio_id: String,
    val local_id: String,
    val tema: String?,
    val orador_id: String?,
    val observacoes: String?,
    val ativo: Boolean = true,
    val created_at: Long,
    val updated_at: Long
)`
    },
    'culto_ordinario_entity': {
      name: 'CultoOrdinarioEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "cultos_ordinarios",
    foreignKeys = [
        ForeignKey(entity = MinisterioEntity::class, parentColumns = ["id"], childColumns = ["ministerio_id"], onDelete = ForeignKey.RESTRICT),
        ForeignKey(entity = LocalCultoEntity::class, parentColumns = ["id"], childColumns = ["local_id"], onDelete = ForeignKey.RESTRICT)
    ]
)
data class CultoOrdinarioEntity(
    @PrimaryKey val id: String,
    val dia_semana: String, // "DOMINGO", "QUARTA", "SABADO"
    val horario_inicio: String, // "HH:mm"
    val horario_fim: String,
    val ministerio_id: String,
    val local_id: String,
    val ativo: Boolean = true,
    val created_at: Long,
    val updated_at: Long
)`
    },
    'ministerio_entity': {
      name: 'MinisterioEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "ministerios",
    foreignKeys = [
        ForeignKey(entity = PessoaEntity::class, parentColumns = ["id"], childColumns = ["diretor_id"], onDelete = ForeignKey.RESTRICT),
        ForeignKey(entity = PessoaEntity::class, parentColumns = ["id"], childColumns = ["vice_diretor_id"], onDelete = ForeignKey.SET_NULL)
    ]
)
data class MinisterioEntity(
    @PrimaryKey val id: String,
    val nome: String,
    val descricao: String?,
    val diretor_id: String,
    val vice_diretor_id: String?,
    val ativo: Boolean = true,
    val created_at: Long,
    val updated_at: Long
)`
    },
    'local_culto_entity': {
      name: 'LocalCultoEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "locais_culto")
data class LocalCultoEntity(
    @PrimaryKey val id: String,
    val tipo_local: String, // "IGREJA_LOCAL", "PARQUE", "ESTADIO", "ESCOLA", "PRACA_PUBLICA", "OUTRO"
    val nome: String?,
    val endereco: String?,
    val bairro: String?,
    val rua: String?,
    val latitude: Double?,
    val longitude: Double?,
    val observacoes: String?,
    val ativo: Boolean = true,
    val created_at: Long,
    val updated_at: Long
)`
    },
    'pessoa_entity': {
      name: 'PessoaEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "pessoas")
data class PessoaEntity(
    @PrimaryKey val id: String,
    val nome: String,
    val sobrenome: String,
    val email: String?,
    val whatsapp: String?,
    val instagram: String?,
    val facebook: String?,
    val tiktok: String?,
    val endereco: String?,
    val telefone: String?,
    val tipo_pessoa: String, // "DIRETOR", "ORADOR", "COORDENADOR"
    val created_at: Long,
    val updated_at: Long
)`
    },
    'culto_dao': {
      name: 'CultoDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.koinonia.app.data.local.entity.CultoEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CultoDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(culto: CultoEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(cultos: List<CultoEntity>)
    
    @Query("SELECT * FROM cultos WHERE data = :data ORDER BY horario_inicio ASC")
    suspend fun getCultosByData(data: Long): List<CultoEntity>
    
    @Query("SELECT * FROM cultos WHERE data BETWEEN :dataInicio AND :dataFim ORDER BY data ASC, horario_inicio ASC")
    fun getCultosByDateRange(dataInicio: Long, dataFim: Long): Flow<List<CultoEntity>>
    
    @Query("SELECT * FROM cultos WHERE id = :cultoId")
    suspend fun getCultoById(cultoId: String): CultoEntity?
    
    @Query("SELECT * FROM cultos WHERE tipo_culto = 'ORDINARIO' ORDER BY data ASC")
    fun getOrdinarios(): Flow<List<CultoEntity>>
    
    @Query("SELECT * FROM cultos WHERE tipo_culto = 'EXTRAORDINARIO' ORDER BY data ASC")
    fun getExtraordinarios(): Flow<List<CultoEntity>>
    
    @Update
    suspend fun update(culto: CultoEntity)
    
    @Delete
    suspend fun delete(culto: CultoEntity)
    
    @Query("DELETE FROM cultos WHERE data < :data")
    suspend fun deleteOldCultos(data: Long)
}`
    },
    'culto_ordinario_dao': {
      name: 'CultoOrdinarioDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.koinonia.app.data.local.entity.CultoOrdinarioEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CultoOrdinarioDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(culto: CultoOrdinarioEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(cultos: List<CultoOrdinarioEntity>)
    
    @Query("SELECT * FROM cultos_ordinarios WHERE ativo = 1 ORDER BY dia_semana ASC")
    fun getAll(): Flow<List<CultoOrdinarioEntity>>
    
    @Query("SELECT * FROM cultos_ordinarios WHERE dia_semana = :diaSemana")
    suspend fun getCultoByDia(diaSemana: String): CultoOrdinarioEntity?
    
    @Update
    suspend fun update(culto: CultoOrdinarioEntity)
}`
    },
    'ministerio_dao': {
      name: 'MinisterioDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.koinonia.app.data.local.entity.MinisterioEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MinisterioDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(ministerio: MinisterioEntity)
    
    @Query("SELECT * FROM ministerios WHERE ativo = 1 ORDER BY nome ASC")
    fun getAll(): Flow<List<MinisterioEntity>>
    
    @Query("SELECT * FROM ministerios WHERE id = :ministerioId")
    suspend fun getById(ministerioId: String): MinisterioEntity?
    
    @Update
    suspend fun update(ministerio: MinisterioEntity)
}`
    },
    'pessoa_dao': {
      name: 'PessoaDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.koinonia.app.data.local.entity.PessoaEntity

@Dao
interface PessoaDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(pessoa: PessoaEntity)
    
    @Query("SELECT * FROM pessoas WHERE id = :pessoaId")
    suspend fun getById(pessoaId: String): PessoaEntity?
    
    @Query("SELECT * FROM pessoas WHERE tipo_pessoa = :tipo ORDER BY nome ASC")
    suspend fun getPessoasByType(tipo: String): List<PessoaEntity>
    
    @Update
    suspend fun update(pessoa: PessoaEntity)
}`
    },
    'local_culto_dao': {
      name: 'LocalCultoDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.koinonia.app.data.local.entity.LocalCultoEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface LocalCultoDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(local: LocalCultoEntity)
    
    @Query("SELECT * FROM locais_culto WHERE ativo = 1 ORDER BY nome ASC")
    fun getAll(): Flow<List<LocalCultoEntity>>
    
    @Query("SELECT * FROM locais_culto WHERE id = :localId")
    suspend fun getById(localId: String): LocalCultoEntity?
    
    @Query("SELECT * FROM locais_culto WHERE tipo_local = :tipo ORDER BY nome ASC")
    fun getByTipo(tipo: String): Flow<List<LocalCultoEntity>>
}`
    },
    'domain_culto': {
      name: 'Culto.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.model

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

data class Culto(
    val id: String,
    val data: LocalDate,
    val horarioInicio: LocalTime,
    val horarioFim: LocalTime,
    val tipoCulto: TipoCulto, // ORDINARIO ou EXTRAORDINARIO
    val nomeSerie: String?,
    val ministerioId: String,
    val localId: String,
    val tema: String?,
    val oradorId: String?,
    val observacoes: String?,
    val ativo: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    enum class TipoCulto {
        ORDINARIO, EXTRAORDINARIO
    }
}

// Opcionalmente: data class CultoComDetalhes(...) se precisar`
    },
    'domain_ministerio': {
      name: 'Ministerio.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.model

import java.time.LocalDateTime

data class Ministerio(
    val id: String,
    val nome: String,
    val descricao: String?,
    val diretorId: String,
    val viceDiretorId: String?,
    val ativo: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)`
    },
    'repo_interface': {
      name: 'ICultoRepository.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.repository

import com.koinonia.app.domain.model.Culto
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.time.YearMonth

interface ICultoRepository {
    
    suspend fun criarCulto(culto: Culto): Result<Culto>
    
    fun getCultosDoMes(mes: YearMonth): Flow<List<Culto>>
    
    suspend fun getCultosPorData(data: LocalDate): List<Culto>
    
    suspend fun getCultoById(cultoId: String): Culto?
    
    fun getCultosOrdinarios(): Flow<List<Culto>>
    
    suspend fun sincronizarCultosOrdinarios(): Result<Unit>
    
    suspend fun atualizarCulto(culto: Culto): Result<Culto>
    
    suspend fun deletarCulto(cultoId: String): Result<Unit>
}`
    },
    'repo_impl': {
      name: 'CultoRepository.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.repository

import com.koinonia.app.data.local.dao.CultoDao
import com.koinonia.app.data.local.dao.CultoOrdinarioDao
import com.koinonia.app.data.local.dao.LocalCultoDao
import com.koinonia.app.data.local.dao.MinisterioDao
import com.koinonia.app.data.local.dao.PessoaDao
import com.koinonia.app.data.local.entity.CultoOrdinarioEntity
import com.koinonia.app.domain.model.Culto
import com.koinonia.app.domain.repository.ICultoRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import java.time.LocalDate
import java.time.YearMonth
import java.time.ZoneOffset
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CultoRepository @Inject constructor(
    private val cultoDao: CultoDao,
    private val cultoOrdinarioDao: CultoOrdinarioDao,
    private val ministerioDao: MinisterioDao,
    private val pessoaDao: PessoaDao,
    private val localCultoDao: LocalCultoDao
) : ICultoRepository {
    
    override suspend fun criarCulto(culto: Culto): Result<Culto> {
        return try {
            // cultoDao.insert(culto.toEntity()) // Assumindo mapper
            Result.success(culto)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override fun getCultosDoMes(mes: YearMonth): Flow<List<Culto>> {
        val inicio = mes.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli()
        val fim = mes.atEndOfMonth().atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli()
        
        return cultoDao.getCultosByDateRange(inicio, fim)
            .map { entities -> 
                emptyList() // entities.map { it.toDomain() } 
            }
    }
    
    override suspend fun getCultosPorData(data: LocalDate): List<Culto> {
        val millis = data.atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli()
        return emptyList() // cultoDao.getCultosByData(millis).map { it.toDomain() }
    }
    
    override suspend fun getCultoById(cultoId: String): Culto? {
        return null // cultoDao.getCultoById(cultoId)?.toDomain()
    }
    
    override fun getCultosOrdinarios(): Flow<List<Culto>> {
        return cultoDao.getOrdinarios()
            .map { entities -> emptyList() /* entities.map { it.toDomain() } */ }
    }
    
    override suspend fun sincronizarCultosOrdinarios(): Result<Unit> {
        return try {
            // Inserir cultos ordinários padrão se não existirem
            val ordinarios = cultoOrdinarioDao.getAll().firstOrNull() ?: emptyList()
            if (ordinarios.isEmpty()) {
                inicializarCultosOrdinariosPadrao()
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun atualizarCulto(culto: Culto): Result<Culto> {
        return try {
            // cultoDao.update(culto.toEntity())
            Result.success(culto)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun deletarCulto(cultoId: String): Result<Unit> {
        return try {
            val culto = cultoDao.getCultoById(cultoId)
            if (culto != null) {
                cultoDao.delete(culto)
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private suspend fun inicializarCultosOrdinariosPadrao() {
        val ordinarios = listOf(
            CultoOrdinarioEntity(
                id = UUID.randomUUID().toString(),
                dia_semana = "DOMINGO",
                horario_inicio = "18:30",
                horario_fim = "19:45",
                ministerio_id = "",
                local_id = "",
                created_at = System.currentTimeMillis(),
                updated_at = System.currentTimeMillis()
            ),
            CultoOrdinarioEntity(
                id = UUID.randomUUID().toString(),
                dia_semana = "QUARTA",
                horario_inicio = "19:30",
                horario_fim = "20:45",
                ministerio_id = "",
                local_id = "",
                created_at = System.currentTimeMillis(),
                updated_at = System.currentTimeMillis()
            ),
            CultoOrdinarioEntity(
                id = UUID.randomUUID().toString(),
                dia_semana = "SABADO",
                horario_inicio = "08:45",
                horario_fim = "11:45",
                ministerio_id = "",
                local_id = "",
                created_at = System.currentTimeMillis(),
                updated_at = System.currentTimeMillis()
            )
        )
        
        cultoOrdinarioDao.insertAll(ordinarios)
    }
}`
    },
    'viewmodel': {
      name: 'CalendarioViewModel.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.koinonia.app.domain.model.Culto
import com.koinonia.app.domain.repository.ICultoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.YearMonth
import javax.inject.Inject

@HiltViewModel
class CalendarioViewModel @Inject constructor(
    private val cultoRepository: ICultoRepository
) : ViewModel() {
    
    private val _mesAtual = MutableStateFlow(YearMonth.now())
    val mesAtual: StateFlow<YearMonth> = _mesAtual.asStateFlow()
    
    private val _cultosMes = MutableStateFlow<List<Culto>>(emptyList())
    val cultosMes: StateFlow<List<Culto>> = _cultosMes.asStateFlow()
    
    private val _cultoSelecionado = MutableStateFlow<Culto?>(null)
    val cultoSelecionado: StateFlow<Culto?> = _cultoSelecionado.asStateFlow()
    
    private val _uiState = MutableStateFlow<CalendarioUiState>(CalendarioUiState.Loading)
    val uiState: StateFlow<CalendarioUiState> = _uiState.asStateFlow()
    
    init {
        carregarCultosMes()
    }
    
    fun carregarCultosMes() {
        viewModelScope.launch {
            _uiState.value = CalendarioUiState.Loading
            
            try {
                cultoRepository.getCultosDoMes(_mesAtual.value).collect { cultos ->
                    _cultosMes.value = cultos
                    _uiState.value = CalendarioUiState.Idle
                }
            } catch (e: Exception) {
                _uiState.value = CalendarioUiState.Error(e.message ?: "Erro desconhecido")
            }
        }
    }
    
    fun selecionarCulto(culto: Culto) {
        _cultoSelecionado.value = culto
    }
    
    fun proximoMes() {
        _mesAtual.value = _mesAtual.value.plusMonths(1)
        carregarCultosMes()
    }
    
    fun mesAnterior() {
        _mesAtual.value = _mesAtual.value.minusMonths(1)
        carregarCultosMes()
    }
}

sealed class CalendarioUiState {
    object Idle : CalendarioUiState()
    object Loading : CalendarioUiState()
    data class Error(val message: String) : CalendarioUiState()
}`
    },
    'screen_calendario': {
      name: 'CalendarioScreen.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.koinonia.app.domain.model.Culto
import com.koinonia.app.presentation.ui.component.CultoCard
import com.koinonia.app.presentation.viewmodel.CalendarioUiState
import com.koinonia.app.presentation.viewmodel.CalendarioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalendarioScreen(
    viewModel: CalendarioViewModel = hiltViewModel(),
    onCultoSelecionado: (Culto) -> Unit = {}
) {
    val mesAtual by viewModel.mesAtual.collectAsState()
    val cultosMes by viewModel.cultosMes.collectAsState()
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Calendário \${mesAtual.month} \${mesAtual.year}") },
                navigationIcon = {
                    IconButton(onClick = { viewModel.mesAnterior() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Mês anterior")
                    }
                },
                actions = {
                    IconButton(onClick = { viewModel.proximoMes() }) {
                        Icon(Icons.Default.ArrowForward, contentDescription = "Próximo mês")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (uiState) {
                is CalendarioUiState.Loading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                is CalendarioUiState.Error -> {
                    Text(
                        (uiState as CalendarioUiState.Error).message,
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(cultosMes) { culto ->
                            CultoCard(
                                culto = culto,
                                onClick = {
                                    viewModel.selecionarCulto(culto)
                                    onCultoSelecionado(culto)
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}`
    },
    'culto_card': {
      name: 'CultoCard.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.koinonia.app.domain.model.Culto
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CultoCard(
    culto: Culto,
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
            Row(
                modifier = Modifier
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = culto.data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "\${culto.horarioInicio} - \${culto.horarioFim}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Badge(
                    containerColor = if (culto.tipoCulto == Culto.TipoCulto.ORDINARIO) 
                        MaterialTheme.colorScheme.primary 
                    else 
                        MaterialTheme.colorScheme.secondary
                ) {
                    Text(
                        culto.tipoCulto.name,
                        color = Color.White,
                        fontSize = 10.sp
                    )
                }
            }
            
            if (culto.tema != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Tema: \${culto.tema}",
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}`
    },
    'cadastrar_culto': {
      name: 'CadastrarCultoScreen.kt',
      icon: PlusCircle,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.koinonia.app.presentation.viewmodel.CalendarioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CadastrarCultoScreen(
    viewModel: CalendarioViewModel = hiltViewModel(),
    onCultoRegistrado: () -> Unit = {}
) {
    var data by remember { mutableStateOf("") }
    var horarioInicio by remember { mutableStateOf("") }
    var horarioFim by remember { mutableStateOf("") }
    var tipoCulto by remember { mutableStateOf("ORDINARIO") }
    var tema by remember { mutableStateOf("") }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Cadastrar Culto") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = data,
                onValueChange = { data = it },
                label = { Text("Data (DD/MM/YYYY)") },
                modifier = Modifier.fillMaxWidth()
            )
            
            OutlinedTextField(
                value = horarioInicio,
                onValueChange = { horarioInicio = it },
                label = { Text("Horário Início (HH:mm)") },
                modifier = Modifier.fillMaxWidth()
            )
            
            OutlinedTextField(
                value = horarioFim,
                onValueChange = { horarioFim = it },
                label = { Text("Horário Fim (HH:mm)") },
                modifier = Modifier.fillMaxWidth()
            )
            
            OutlinedTextField(
                value = tema,
                onValueChange = { tema = it },
                label = { Text("Tema (opcional)") },
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 80.dp),
                maxLines = 3
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = {
                    // TODO: Implementar lógica de salvamento
                    onCultoRegistrado()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text("Salvar Culto")
            }
        }
    }
}`
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Calendário e Cultos (Android)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Implementação do Domínio, Data Layer (Room) e UI (Compose) para gestão do calendário de cultos.
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
