import React, { useState } from 'react';
import { Database, FileCode2, Layers, LayoutTemplate, UserCheck } from 'lucide-react';

export default function AndroidPresence() {
  const [activeTab, setActiveTab] = useState<string>('member_entity');

  const files = {
    'member_entity': {
      name: 'MemberEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import com.koinonia.app.domain.model.Member

@Entity(
    tableName = "membros",
    foreignKeys = [
        ForeignKey(
            entity = FamiliaEntity::class,
            parentColumns = ["id"],
            childColumns = ["familia_id"],
            onDelete = ForeignKey.SET_NULL
        )
    ],
    indices = [Index("familia_id")]
)
data class MemberEntity(
    @PrimaryKey val id: String,
    val nome: String,
    val sobrenome: String,
    val familia_id: String?,
    val email: String?,
    val telefone: String?,
    val data_nascimento: Long?,
    val ativo: Boolean = true,
    val created_at: Long,
    val updated_at: Long
) {
    fun toDomain() = Member(
        id = id,
        nome = nome,
        sobrenome = sobrenome,
        familiaId = familia_id,
        email = email,
        telefone = telefone,
        dataNascimento = null, // TODO: Converter timestamp
        ativo = ativo,
        createdAt = null, // TODO: Converter timestamp
        updatedAt = null // TODO: Converter timestamp
    )
}`
    },
    'familia_entity': {
      name: 'FamiliaEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "familias")
data class FamiliaEntity(
    @PrimaryKey val id: String,
    val nome: String,
    val descricao: String?,
    val created_at: Long,
    val updated_at: Long
)`
    },
    'presenca_entity': {
      name: 'PresencaEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import com.koinonia.app.domain.model.Presenca

@Entity(
    tableName = "presencas",
    foreignKeys = [
        ForeignKey(entity = MemberEntity::class, parentColumns = ["id"], childColumns = ["membro_id"], onDelete = ForeignKey.CASCADE),
        ForeignKey(entity = CultoEntity::class, parentColumns = ["id"], childColumns = ["culto_id"], onDelete = ForeignKey.CASCADE),
        ForeignKey(entity = VisitanteEntity::class, parentColumns = ["id"], childColumns = ["visitante_id"], onDelete = ForeignKey.SET_NULL)
    ],
    indices = [Index("membro_id"), Index("culto_id"), Index("data_horario")]
)
data class PresencaEntity(
    @PrimaryKey val id: String,
    val membro_id: String,
    val culto_id: String,
    val data_horario: Long,
    val atrasado: Boolean = false,
    val tempo_atraso_minutos: Int = 0,
    val acompanhante_id: String?,
    val visitante_id: String?,
    val notas: String?,
    val created_at: Long,
    val updated_at: Long,
    val synced_at: Long?,
    val needs_sync: Boolean = false
) {
    fun toDomain() = Presenca(
        id = id,
        memberId = membro_id,
        cultoId = culto_id,
        dataHorario = null, // TODO: Converter
        atrasado = atrasado,
        tempoAtrasoMinutos = tempo_atraso_minutos,
        acompanhanteId = acompanhante_id,
        visitanteId = visitante_id,
        notas = notas,
        createdAt = null,
        updatedAt = null,
        syncedAt = null,
        needsSync = needs_sync
    )
}`
    },
    'visitante_entity': {
      name: 'VisitanteEntity.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "visitantes",
    foreignKeys = [
        ForeignKey(entity = CultoEntity::class, parentColumns = ["id"], childColumns = ["culto_id"], onDelete = ForeignKey.CASCADE)
    ],
    indices = [Index("culto_id")]
)
data class VisitanteEntity(
    @PrimaryKey val id: String,
    val nome: String,
    val whatsapp: String?,
    val rede_social: String?,
    val referencia: String?,
    val culto_id: String,
    val email: String?,
    val observacoes: String?,
    val created_at: Long,
    val updated_at: Long
)`
    },
    'member_dao': {
      name: 'MemberDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.koinonia.app.data.local.entity.MemberEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MemberDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(member: MemberEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(members: List<MemberEntity>)
    
    @Query("SELECT * FROM membros WHERE ativo = 1 ORDER BY nome ASC")
    fun getAllActive(): Flow<List<MemberEntity>>
    
    @Query("SELECT * FROM membros WHERE familia_id = :familiaId AND ativo = 1 ORDER BY nome ASC")
    fun getFamilyMembers(familiaId: String): Flow<List<MemberEntity>>
    
    @Query("SELECT * FROM membros WHERE id = :memberId")
    suspend fun getMemberById(memberId: String): MemberEntity?
    
    @Update
    suspend fun update(member: MemberEntity)
    
    @Delete
    suspend fun delete(member: MemberEntity)
    
    @Query("SELECT COUNT(*) FROM membros WHERE ativo = 1")
    suspend fun getTotalActiveMembers(): Int
}`
    },
    'presenca_dao': {
      name: 'PresencaDao.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.koinonia.app.data.local.entity.PresencaEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PresencaDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(presenca: PresencaEntity)
    
    @Query("SELECT * FROM presencas WHERE culto_id = :cultoId ORDER BY data_horario DESC")
    fun getPresencasByCulto(cultoId: String): Flow<List<PresencaEntity>>
    
    @Query("SELECT * FROM presencas WHERE membro_id = :memberId ORDER BY data_horario DESC")
    fun getPresencasByMember(memberId: String): Flow<List<PresencaEntity>>
    
    @Query("SELECT * FROM presencas WHERE membro_id = :memberId AND culto_id = :cultoId")
    suspend fun getPresenca(memberId: String, cultoId: String): PresencaEntity?
    
    @Query("SELECT * FROM presencas WHERE needs_sync = 1")
    suspend fun getPendingSync(): List<PresencaEntity>
    
    @Query("UPDATE presencas SET needs_sync = 0, synced_at = :syncedAt WHERE id = :presencaId")
    suspend fun markAsSynced(presencaId: String, syncedAt: Long)
    
    @Query("UPDATE presencas SET needs_sync = 1 WHERE id = :presencaId")
    suspend fun markForSync(presencaId: String)
    
    @Query("SELECT COUNT(*) FROM presencas WHERE culto_id = :cultoId")
    suspend fun getTotalPresentes(cultoId: String): Int
    
    @Query("SELECT * FROM presencas WHERE culto_id = :cultoId AND atrasado = 1")
    suspend fun getAtrasados(cultoId: String): List<PresencaEntity>
    
    @Update
    suspend fun update(presenca: PresencaEntity)
}`
    },
    'app_database': {
      name: 'AppDatabase.kt',
      icon: Database,
      content: `package com.koinonia.app.data.local.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.koinonia.app.data.local.dao.MemberDao
import com.koinonia.app.data.local.dao.PresencaDao
import com.koinonia.app.data.local.dao.FamiliaDao
import com.koinonia.app.data.local.dao.VisitanteDao
import com.koinonia.app.data.local.dao.CultoDao
import com.koinonia.app.data.local.dao.AusenciaDao
import com.koinonia.app.data.local.entity.MemberEntity
import com.koinonia.app.data.local.entity.FamiliaEntity
import com.koinonia.app.data.local.entity.PresencaEntity
import com.koinonia.app.data.local.entity.VisitanteEntity
import com.koinonia.app.data.local.entity.CultoEntity
import com.koinonia.app.data.local.entity.AusenciaEntity

@Database(
    entities = [
        MemberEntity::class,
        FamiliaEntity::class,
        PresencaEntity::class,
        VisitanteEntity::class,
        CultoEntity::class,
        AusenciaEntity::class
    ],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    
    abstract fun memberDao(): MemberDao
    abstract fun presencaDao(): PresencaDao
    abstract fun familiaDao(): FamiliaDao
    abstract fun visitanteDao(): VisitanteDao
    abstract fun cultoDao(): CultoDao
    abstract fun ausenciaDao(): AusenciaDao
}`
    },
    'domain_member': {
      name: 'Member.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.model

import java.time.LocalDate
import java.time.LocalDateTime

data class Member(
    val id: String,
    val nome: String,
    val sobrenome: String,
    val familiaId: String?,
    val email: String?,
    val telefone: String?,
    val dataNascimento: LocalDate?,
    val ativo: Boolean,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
) {
    val nomeCompleto: String get() = "$nome $sobrenome"
}`
    },
    'domain_presenca': {
      name: 'Presenca.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.model

import java.time.LocalDateTime

data class Presenca(
    val id: String,
    val memberId: String,
    val cultoId: String,
    val dataHorario: LocalDateTime?,
    val atrasado: Boolean,
    val tempoAtrasoMinutos: Int,
    val acompanhanteId: String?,
    val visitanteId: String?,
    val notas: String?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?,
    val syncedAt: LocalDateTime?,
    val needsSync: Boolean
)`
    },
    'repo_interface': {
      name: 'IPresencaRepository.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.repository

import com.koinonia.app.domain.model.Presenca
import kotlinx.coroutines.flow.Flow

interface IPresencaRepository {
    
    suspend fun registrarPresenca(presenca: Presenca): Result<Presenca>
    
    fun getPresencasByCulto(cultoId: String): Flow<List<Presenca>>
    
    fun getPresencasByMember(memberId: String): Flow<List<Presenca>>
    
    suspend fun getPresenca(memberId: String, cultoId: String): Presenca?
    
    suspend fun syncPendingPresencas(): Result<Unit>
    
    suspend fun getPresencasPendentes(): List<Presenca>
    
    suspend fun atualizarPresenca(presenca: Presenca): Result<Presenca>
}`
    },
    'repo_impl': {
      name: 'PresencaRepository.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.data.repository

import android.util.Log
import com.koinonia.app.data.local.dao.MemberDao
import com.koinonia.app.data.local.dao.PresencaDao
import com.koinonia.app.domain.model.Presenca
import com.koinonia.app.domain.repository.IPresencaRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PresencaRepository @Inject constructor(
    private val presencaDao: PresencaDao,
    private val memberDao: MemberDao,
    // private val localDataSource: PresencaLocalDataSource,
    // private val remoteDataSource: PresencaRemoteDataSource
) : IPresencaRepository {
    
    override suspend fun registrarPresenca(presenca: Presenca): Result<Presenca> {
        return try {
            // 1. Salvar localmente
            // val entity = presenca.toEntity()
            // presencaDao.insert(entity)
            
            // 2. Tentar sincronizar imediatamente (se online)
            if (isConnected()) {
                try {
                    // remoteDataSource.registrarPresenca(presenca.toDto())
                    // presencaDao.markAsSynced(presenca.id, System.currentTimeMillis())
                } catch (e: Exception) {
                    Log.d("PresencaRepo", "Erro ao sincronizar, marcado para sync posterior: \${e.message}")
                    presencaDao.markForSync(presenca.id)
                }
            } else {
                presencaDao.markForSync(presenca.id)
            }
            
            Result.success(presenca)
        } catch (e: Exception) {
            Log.e("PresencaRepo", "Erro ao registrar presença: \${e.message}")
            Result.failure(e)
        }
    }
    
    override fun getPresencasByCulto(cultoId: String): Flow<List<Presenca>> {
        return presencaDao.getPresencasByCulto(cultoId)
            .map { entities -> entities.map { it.toDomain() } }
            .catch { e ->
                Log.e("PresencaRepo", "Erro ao obter presenças: \${e.message}")
                emit(emptyList())
            }
    }
    
    override fun getPresencasByMember(memberId: String): Flow<List<Presenca>> {
        return presencaDao.getPresencasByMember(memberId)
            .map { entities -> entities.map { it.toDomain() } }
    }
    
    override suspend fun getPresenca(memberId: String, cultoId: String): Presenca? {
        return presencaDao.getPresenca(memberId, cultoId)?.toDomain()
    }
    
    override suspend fun syncPendingPresencas(): Result<Unit> {
        return try {
            val pendentes = presencaDao.getPendingSync()
            for (presenca in pendentes) {
                try {
                    // remoteDataSource.registrarPresenca(presenca.toDto())
                    presencaDao.markAsSynced(presenca.id, System.currentTimeMillis())
                } catch (e: Exception) {
                    Log.d("PresencaRepo", "Erro ao sincronizar \${presenca.id}: \${e.message}")
                }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun getPresencasPendentes(): List<Presenca> {
        return presencaDao.getPendingSync().map { it.toDomain() }
    }
    
    override suspend fun atualizarPresenca(presenca: Presenca): Result<Presenca> {
        return try {
            // val entity = presenca.toEntity()
            // presencaDao.update(entity)
            Result.success(presenca)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private suspend fun isConnected(): Boolean {
        // Implementar verificação de conexão real
        return true // Por enquanto
    }
}`
    },
    'usecase': {
      name: 'RegistrarPresencaUseCase.kt',
      icon: Layers,
      content: `package com.koinonia.app.domain.usecase

import com.koinonia.app.domain.model.Presenca
import com.koinonia.app.domain.repository.IPresencaRepository
import java.time.LocalDateTime
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RegistrarPresencaUseCase @Inject constructor(
    private val repository: IPresencaRepository
) {
    
    suspend operator fun invoke(
        memberId: String,
        cultoId: String,
        acomphanteId: String? = null,
        visitanteId: String? = null
    ): Result<Presenca> {
        return try {
            val presenca = Presenca(
                id = UUID.randomUUID().toString(),
                memberId = memberId,
                cultoId = cultoId,
                dataHorario = LocalDateTime.now(),
                atrasado = calcularAtraso(cultoId),
                tempoAtrasoMinutos = calcularTempoAtraso(cultoId),
                acompanhanteId = acomphanteId,
                visitanteId = visitanteId,
                notas = null,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                syncedAt = null,
                needsSync = true
            )
            
            repository.registrarPresenca(presenca)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private suspend fun calcularAtraso(cultoId: String): Boolean {
        // Implementar lógica para verificar se está atrasado
        return false
    }
    
    private suspend fun calcularTempoAtraso(cultoId: String): Int {
        // Implementar cálculo de tempo de atraso
        return 0
    }
}`
    },
    'viewmodel': {
      name: 'PresencaViewModel.kt',
      icon: FileCode2,
      content: `package com.koinonia.app.presentation.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.koinonia.app.domain.model.Member
import com.koinonia.app.domain.model.Presenca
import com.koinonia.app.domain.repository.IPresencaRepository
import com.koinonia.app.domain.usecase.RegistrarPresencaUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PresencaViewModel @Inject constructor(
    private val registrarPresencaUseCase: RegistrarPresencaUseCase,
    private val repository: IPresencaRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<PresencaUiState>(PresencaUiState.Idle)
    val uiState: StateFlow<PresencaUiState> = _uiState.asStateFlow()
    
    private val _members = MutableStateFlow<List<Member>>(emptyList())
    val members: StateFlow<List<Member>> = _members.asStateFlow()
    
    private val _presencas = MutableStateFlow<List<Presenca>>(emptyList())
    val presencas: StateFlow<List<Presenca>> = _presencas.asStateFlow()
    
    init {
        loadMembers()
    }
    
    fun registrarPresenca(memberId: String, cultoId: String, acompanhanteId: String? = null) {
        viewModelScope.launch {
            _uiState.value = PresencaUiState.Loading
            
            val result = registrarPresencaUseCase(memberId, cultoId, acompanhanteId)
            
            result.onSuccess { presenca ->
                _uiState.value = PresencaUiState.Success(presenca)
                // Limpar mensagem após 2 segundos
                delay(2000)
                _uiState.value = PresencaUiState.Idle
            }.onFailure { error ->
                _uiState.value = PresencaUiState.Error(error.message ?: "Erro desconhecido")
            }
        }
    }
    
    fun loadMembers() {
        viewModelScope.launch {
            try {
                // repository.getAllActiveMembers().collect { members ->
                //     _members.value = members
                // }
            } catch (e: Exception) {
                Log.e("PresencaVM", "Erro ao carregar membros: \${e.message}")
            }
        }
    }
    
    fun loadPresencasByCulto(cultoId: String) {
        viewModelScope.launch {
            repository.getPresencasByCulto(cultoId).collect { presencas ->
                _presencas.value = presencas
            }
        }
    }
}

sealed class PresencaUiState {
    object Idle : PresencaUiState()
    object Loading : PresencaUiState()
    data class Success(val presenca: Presenca) : PresencaUiState()
    data class Error(val message: String) : PresencaUiState()
}`
    },
    'screen': {
      name: 'PresencaScreen.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
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
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.koinonia.app.presentation.ui.component.MemberListItem
import com.koinonia.app.presentation.viewmodel.PresencaUiState
import com.koinonia.app.presentation.viewmodel.PresencaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PresencaScreen(
    viewModel: PresencaViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val members by viewModel.members.collectAsState()
    val presencas by viewModel.presencas.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Presença") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (uiState) {
                is PresencaUiState.Loading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                is PresencaUiState.Success -> {
                    val presenca = (uiState as PresencaUiState.Success).presenca
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text("✅ Presença registrada!", style = MaterialTheme.typography.headlineMedium)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(presenca.dataHorario.toString())
                    }
                }
                is PresencaUiState.Error -> {
                    val error = (uiState as PresencaUiState.Error).message
                    Text(
                        "❌ Erro: $error",
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
                        items(members) { member ->
                            MemberListItem(
                                member = member,
                                onClick = {
                                    viewModel.registrarPresenca(member.id, "culto_id_mock")
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
    'member_list_item': {
      name: 'MemberListItem.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.koinonia.app.domain.model.Member

@Composable
fun MemberListItem(
    member: Member,
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
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = member.nomeCompleto,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold
                )
                if (member.email != null) {
                    Text(
                        text = member.email,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Button(
                onClick = onClick,
                modifier = Modifier.wrapContentSize()
            ) {
                Text("Marcar")
            }
        }
    }
}`
    },
    'familia_popup': {
      name: 'FamiliaPopup.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.ui.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
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
import com.koinonia.app.domain.model.Member

@Composable
fun FamiliaPopup(
    familyMembers: List<Member>,
    onDismiss: () -> Unit,
    onConfirm: (selectedMemberId: String?) -> Unit
) {
    var selectedId by remember { mutableStateOf<String?>(null) }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Com quem está acompanhado?") },
        text = {
            LazyColumn {
                items(familyMembers) { member ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedId = member.id }
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = selectedId == member.id,
                            onCheckedChange = { selectedId = member.id }
                        )
                        Text(member.nomeCompleto, modifier = Modifier.padding(start = 8.dp))
                    }
                }
            }
        },
        confirmButton = {
            Button(onClick = { onConfirm(selectedId) }) {
                Text("Confirmar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        }
    )
}`
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Presença e Membros (Android)</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Implementação do Domínio, Data Layer (Room) e UI (Compose) para gestão de presença de membros.
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
