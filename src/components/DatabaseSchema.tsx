import React, { useState } from 'react';
import { Network, Code, BookText, Sprout, Key, Link, Database } from 'lucide-react';

const sqlCode = `-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Famílias
CREATE TABLE familias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Membros
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    familia_id UUID REFERENCES familias(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Pessoas (Diretores, Oradores, Líderes)
CREATE TABLE pessoas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100),
    whatsapp VARCHAR(20),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    tiktok VARCHAR(100),
    endereco TEXT,
    telefone VARCHAR(20),
    tipo_pessoa VARCHAR(50), -- ex: 'DIRETOR', 'ORADOR', 'PASTOR'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Ministérios
CREATE TABLE ministerios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    diretor_id UUID REFERENCES pessoas(id) ON DELETE SET NULL,
    vice_diretor_id UUID REFERENCES pessoas(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Locais de Culto
CREATE TABLE locais_culto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_local VARCHAR(50) NOT NULL, -- ex: 'IGREJA', 'PEQUENO_GRUPO', 'AUDITORIO'
    nome VARCHAR(100) NOT NULL,
    endereco TEXT,
    bairro VARCHAR(100),
    rua VARCHAR(150),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Cultos
CREATE TABLE cultos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME,
    tipo VARCHAR(50) NOT NULL, -- ex: 'DIVINO', 'JA', 'QUARTA'
    is_ordinario BOOLEAN DEFAULT TRUE,
    ministerio_id UUID REFERENCES ministerios(id) ON DELETE SET NULL,
    local_id UUID REFERENCES locais_culto(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Cultos Especiais (Herança/Detalhes Adicionais)
CREATE TABLE cultos_especiais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    culto_id UUID REFERENCES cultos(id) ON DELETE CASCADE,
    tema VARCHAR(200) NOT NULL,
    orador_id UUID REFERENCES pessoas(id) ON DELETE SET NULL,
    evangelismo_tipo VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitantes
CREATE TABLE visitantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    whatsapp VARCHAR(20),
    rede_social VARCHAR(100),
    culto_id UUID REFERENCES cultos(id) ON DELETE SET NULL,
    referencia VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Presenças
CREATE TABLE presencas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    culto_id UUID REFERENCES cultos(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    horario_chegada TIME,
    atrasado BOOLEAN DEFAULT FALSE,
    tempo_atraso INTERVAL,
    acompanhante_id UUID REFERENCES visitantes(id) ON DELETE SET NULL,
    visitante BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ausências
CREATE TABLE ausencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    culto_id UUID REFERENCES cultos(id) ON DELETE CASCADE,
    motivo VARCHAR(100), -- ex: 'DOENCA', 'VIAGEM', 'TRABALHO'
    descricao_motivo TEXT,
    responsavel_contato UUID REFERENCES pessoas(id) ON DELETE SET NULL,
    meio_contato VARCHAR(50), -- ex: 'WHATSAPP', 'LIGACAO', 'VISITA'
    data_contato DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de Performance
CREATE INDEX idx_members_familia ON members(familia_id);
CREATE INDEX idx_cultos_data ON cultos(data);
CREATE INDEX idx_presencas_member_culto ON presencas(member_id, culto_id);
CREATE INDEX idx_ausencias_member_culto ON ausencias(member_id, culto_id);
CREATE INDEX idx_visitantes_culto ON visitantes(culto_id);

-- Configuração de Row Level Security (RLS) - Exemplo Básico
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencas ENABLE ROW LEVEL SECURITY;
`;

const seedCode = `-- Inserção de Famílias
INSERT INTO familias (id, nome) VALUES 
('f0000000-0000-0000-0000-000000000001', 'Silva'),
('f0000000-0000-0000-0000-000000000002', 'Souza');

-- Inserção de Membros
INSERT INTO members (id, nome, sobrenome, familia_id) VALUES 
('m0000000-0000-0000-0000-000000000001', 'João', 'Silva', 'f0000000-0000-0000-0000-000000000001'),
('m0000000-0000-0000-0000-000000000002', 'Maria', 'Silva', 'f0000000-0000-0000-0000-000000000001'),
('m0000000-0000-0000-0000-000000000003', 'Carlos', 'Souza', 'f0000000-0000-0000-0000-000000000002');

-- Inserção de Locais
INSERT INTO locais_culto (id, tipo_local, nome) VALUES
('l0000000-0000-0000-0000-000000000001', 'IGREJA', 'Igreja Central');

-- Inserção de Pessoas (Líderes/Oradores)
INSERT INTO pessoas (id, nome, tipo_pessoa) VALUES
('p0000000-0000-0000-0000-000000000001', 'Pr. Marcos', 'PASTOR'),
('p0000000-0000-0000-0000-000000000002', 'Ana', 'DIRETOR');

-- Inserção de Ministério
INSERT INTO ministerios (id, nome, diretor_id) VALUES
('mi000000-0000-0000-0000-000000000001', 'Ministério Jovem', 'p0000000-0000-0000-0000-000000000002');

-- Inserção de Culto
INSERT INTO cultos (id, data, horario_inicio, tipo, local_id, ministerio_id) VALUES
('c0000000-0000-0000-0000-000000000001', '2023-11-04', '09:00:00', 'DIVINO', 'l0000000-0000-0000-0000-000000000001', 'mi000000-0000-0000-0000-000000000001');

-- Inserção de Presença
INSERT INTO presencas (id, member_id, culto_id, data, horario_chegada) VALUES
('pr000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '2023-11-04', '08:55:00');
`;

export default function DatabaseSchema() {
  const [activeTab, setActiveTab] = useState<'er' | 'sql' | 'docs' | 'seed'>('sql');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Schema do Banco de Dados</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Modelagem completa para o <strong className="text-slate-200">Supabase (PostgreSQL)</strong> focada no controle de presença, membros, e gestão de cultos da Igreja Adventista.
        </p>
      </div>

      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        <TabButton id="sql" label="DDL SQL" icon={Code} active={activeTab === 'sql'} onClick={() => setActiveTab('sql')} />
        <TabButton id="er" label="Diagrama ER" icon={Network} active={activeTab === 'er'} onClick={() => setActiveTab('er')} />
        <TabButton id="docs" label="Dicionário de Dados" icon={BookText} active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
        <TabButton id="seed" label="Seed Iniciais" icon={Sprout} active={activeTab === 'seed'} onClick={() => setActiveTab('seed')} />
      </div>

      <div className="mt-4">
        {activeTab === 'sql' && <SqlView />}
        {activeTab === 'er' && <ErDiagramView />}
        {activeTab === 'docs' && <DocsView />}
        {activeTab === 'seed' && <SeedView />}
      </div>
    </div>
  );
}

function TabButton({ label, icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
        active 
          ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10' 
          : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function SqlView() {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl">
      <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">schema.sql</span>
        <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded">PostgreSQL</span>
      </div>
      <pre className="p-4 overflow-x-auto text-[11px] font-mono text-indigo-200/80 leading-relaxed">
        {sqlCode}
      </pre>
    </div>
  );
}

function SeedView() {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl">
      <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">seed.sql</span>
        <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">Mock Data</span>
      </div>
      <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-200/80 leading-relaxed">
        {seedCode}
      </pre>
    </div>
  );
}

function ErDiagramView() {
  const tables = [
    { name: 'familias', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'nome', t: 'VARCHAR' }] },
    { name: 'members', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'nome', t: 'VARCHAR' }, { n: 'familia_id', t: 'UUID', k: 'FK' }] },
    { name: 'pessoas', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'nome', t: 'VARCHAR' }, { n: 'tipo_pessoa', t: 'VARCHAR' }] },
    { name: 'ministerios', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'nome', t: 'VARCHAR' }, { n: 'diretor_id', t: 'UUID', k: 'FK' }] },
    { name: 'locais_culto', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'nome', t: 'VARCHAR' }, { n: 'tipo_local', t: 'VARCHAR' }] },
    { name: 'cultos', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'data', t: 'DATE' }, { n: 'ministerio_id', t: 'UUID', k: 'FK' }, { n: 'local_id', t: 'UUID', k: 'FK' }] },
    { name: 'cultos_especiais', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'culto_id', t: 'UUID', k: 'FK' }, { n: 'orador_id', t: 'UUID', k: 'FK' }] },
    { name: 'visitantes', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'nome', t: 'VARCHAR' }, { n: 'culto_id', t: 'UUID', k: 'FK' }] },
    { name: 'presencas', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'member_id', t: 'UUID', k: 'FK' }, { n: 'culto_id', t: 'UUID', k: 'FK' }] },
    { name: 'ausencias', fields: [{ n: 'id', t: 'UUID', k: 'PK' }, { n: 'member_id', t: 'UUID', k: 'FK' }, { n: 'culto_id', t: 'UUID', k: 'FK' }, { n: 'responsavel_id', t: 'UUID', k: 'FK' }] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tables.map(table => (
        <div key={table.name} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-lg">
          <div className="bg-indigo-900/30 border-b border-indigo-500/20 px-3 py-2 flex justify-between items-center">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-3 h-3 text-indigo-500" />
              {table.name}
            </span>
          </div>
          <div className="p-3 flex flex-col gap-1.5 bg-slate-900/50">
            {table.fields.map((f, i) => (
              <div key={i} className="text-[10px] font-mono flex items-center justify-between border-b border-slate-800 pb-1 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  {f.k === 'PK' && <Key className="w-3 h-3 text-amber-400" />}
                  {f.k === 'FK' && <Link className="w-3 h-3 text-cyan-400" />}
                  {f.k !== 'PK' && f.k !== 'FK' && <span className="w-3 h-3 inline-block" />}
                  <span className={f.k === 'PK' ? 'text-slate-200 font-bold' : 'text-slate-400'}>{f.n}</span>
                </div>
                <span className="text-slate-500 text-[9px]">{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DocsView() {
  const docs = [
    { table: 'members', desc: 'Armazena os membros oficiais da igreja. Usado para relatórios e tracking de frequência contínua.', rules: 'Soft-delete habilitado. RLS: Apenas secretários/diretores podem editar.' },
    { table: 'familias', desc: 'Agrupa membros em unidades familiares para facilitar o controle de presença (ex: Check-in por família).', rules: 'Criada via trigger ou app. RLS restrito.' },
    { table: 'presencas', desc: 'Registro transacional de check-in. Associa um membro a um culto específico.', rules: 'Altíssimo volume de escrita. Índices compostos por (member_id, culto_id) para relatórios rápidos.' },
    { table: 'ausencias', desc: 'Registro de acompanhamento (visitação) para membros faltosos.', rules: 'Obrigatório preencher motivo e responsável.' },
    { table: 'cultos', desc: 'Entidade base para qualquer reunião (Culto Divino, JA, Pequeno Grupo).', rules: 'Filtros comuns por data e tipo. Soft-delete.' },
  ];

  return (
    <div className="space-y-4">
      {docs.map(doc => (
        <div key={doc.table} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-2 flex items-center gap-2">
             <Database className="w-4 h-4 text-emerald-400" />
             {doc.table}
          </h3>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">{doc.desc}</p>
          <div className="bg-slate-900 rounded p-3 border border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Regras de Negócio & Constraint</span>
            <p className="text-[11px] text-slate-300 font-mono">{doc.rules}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
