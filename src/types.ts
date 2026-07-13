import React from 'react';

export type Section = {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
};

export interface Member {
  id: string;
  nome: string;
  sobrenome: string;
  dataNascimento?: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  fotoUrl?: string;
  ativo?: boolean;
  grupoId?: string;
  familiaId?: string;
}

export interface Culto {
  id: string;
  data: string;
  horarioInicio: string;
  horarioFim?: string;
  tipoCulto: string;
  nomeSerie?: string;
  tema?: string;
  titulo?: string;
  descricao?: string;
  ativo?: boolean;
  localId?: string;
  ministerioId?: string;
}

export interface Presenca {
  id: string;
  cultoId: string;
  memberId: string;
  atrasado?: boolean;
  dataRegistro?: string;
  dataHorario?: string;
  tempoAtrasoMinutos?: number;
  acompanhanteId?: string;
  visitanteId?: string;
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
  syncedAt?: string;
  needsSync?: boolean;
}

export interface Ausencia {
  id: string;
  memberId: string;
  dataFalta: string;
  motivo?: string;
  descricaoMotivo?: string;
  statusAcompanhamento?: any;
  meioContato?: string;
  tipoContatoPessoal?: string;
  redeSocialContato?: string;
  responsavelContato?: string;
  dataContato?: string;
  anotacoes?: string;
  justificativa?: string;
  dataRegistro?: string;
  cultoId?: string;
  createdAt?: string;
  updatedAt?: string;
  syncedAt?: string;
  needsSync?: boolean;
}
