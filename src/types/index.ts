// Membros
export interface Member {
  id: string
  nome: string
  sobrenome: string
  email?: string
  telefone?: string
  familiaId?: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

// Cultos
export interface Culto {
  id: string
  data: string
  horarioInicio: string
  horarioFim: string
  tipoCulto: 'ORDINARIO' | 'EXTRAORDINARIO'
  nomeSerie?: string
  ministerioId: string
  localId: string
  tema?: string
  oradorId?: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

// Presença
export interface Presenca {
  id: string
  memberId: string
  cultoId: string
  dataHorario: string
  atrasado: boolean
  tempoAtrasoMinutos: number
  acompanhanteId?: string
  visitanteId?: string
  notas?: string
  createdAt: string
  updatedAt: string
  syncedAt?: string
  needsSync: boolean
}

// Ausência
export interface Ausencia {
  id: string
  memberId: string
  cultoId: string
  dataFalta: string
  motivo: 'SAUDE_PROPRIA' | 'SAUDE_FAMILIAR' | 'TRABALHO' | 'ESTUDO' | 'ATIVIDADE_PESSOAL' | 'OUTRO'
  descricaoMotivo?: string
  responsavelContato?: string
  meioContato?: 'PESSOALMENTE' | 'WHATSAPP' | 'REDE_SOCIAL'
  tipoContatoPessoal?: 'VISITA_DOMICILIAR' | 'REENCONTRO_PROXIMO_CULTO'
  redeSocialContato?: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK'
  dataContato?: string
  anotacoes?: string
  statusAcompanhamento: 'PENDENTE' | 'REALIZADO' | 'VISITADO' | 'RESPONDEU'
  createdAt: string
  updatedAt: string
  syncedAt?: string
  needsSync: boolean
}

// Visitante
export interface Visitante {
  id: string
  nome: string
  whatsapp?: string
  redeSocial?: string
  referencia?: string
  cultoId: string
  createdAt: string
  updatedAt: string
}
