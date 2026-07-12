import React, { useState } from 'react';
import { 
  Rocket, Smartphone, MonitorPlay, Database, FileText, 
  Terminal, ShieldCheck, Code2, ServerCog 
} from 'lucide-react';

export default function InitialSetup() {
  const [activeTab, setActiveTab] = useState<'android' | 'web' | 'supabase' | 'docs'>('android');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Setup Inicial e Configuração</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Guias de configuração, dependências e scripts de inicialização para Android, Web e Banco de Dados.
        </p>
      </div>

      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        <TabButton id="android" label="Android Setup" icon={Smartphone} active={activeTab === 'android'} onClick={() => setActiveTab('android')} />
        <TabButton id="web" label="Web Setup" icon={MonitorPlay} active={activeTab === 'web'} onClick={() => setActiveTab('web')} />
        <TabButton id="supabase" label="Supabase (Backend)" icon={Database} active={activeTab === 'supabase'} onClick={() => setActiveTab('supabase')} />
        <TabButton id="docs" label="ReadMe & Env" icon={FileText} active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
      </div>

      <div className="mt-4">
        {activeTab === 'android' && <AndroidSetup />}
        {activeTab === 'web' && <WebSetup />}
        {activeTab === 'supabase' && <SupabaseSetup />}
        {activeTab === 'docs' && <DocumentationSetup />}
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

function AndroidSetup() {
  const codeFiles = {
    gradle: `// app/build.gradle.kts
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.koinonia.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.koinonia.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    
    buildFeatures {
        compose = true
        buildConfig = true
    }
    
    buildTypes {
        debug {
            buildConfigField("String", "SUPABASE_URL", '"\\"" + getLocalProperty("SUPABASE_URL") + "\\""')
            buildConfigField("String", "SUPABASE_ANON_KEY", '"\\"" + getLocalProperty("SUPABASE_ANON_KEY") + "\\""')
        }
        release {
            buildConfigField("String", "SUPABASE_URL", '"\\"" + getLocalProperty("SUPABASE_URL") + "\\""')
            buildConfigField("String", "SUPABASE_ANON_KEY", '"\\"" + getLocalProperty("SUPABASE_ANON_KEY") + "\\""')
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
}

fun getLocalProperty(key: String): String {
    val properties = java.util.Properties()
    val file = rootProject.file("local.properties")
    if (file.exists()) {
        properties.load(file.inputStream())
    }
    return properties.getProperty(key) ?: ""
}

dependencies {
    // Core & Compose
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    
    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")

    // Supabase
    implementation("io.github.supabase:postgrest-kt:2.0.2")
    implementation("io.github.supabase:auth-kt:2.0.2")
    implementation("io.github.supabase:realtime-kt:2.0.2")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Hilt
    implementation("com.google.dagger:hilt-android:2.48.1")
    kapt("com.google.dagger:hilt-compiler:2.48.1")
    implementation("androidx.hilt:hilt-navigation-compose:1.2.0")
    
    // WorkManager
    implementation("androidx.work:work-runtime-ktx:2.8.1")
    implementation("androidx.hilt:hilt-work:1.2.0")
    kapt("androidx.hilt:hilt-compiler:1.2.0")
}`,
    manifest: `<!-- app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.koinonia.app">

    <!-- Permissões de Internet para Sync com Supabase -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Para WorkManager e Sync Background -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:name=".KoinoniaApplication"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Koinonia">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.Koinonia">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Registra HiltWorkerFactory para injeção no WorkManager -->
        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="\${applicationId}.androidx-startup"
            android:exported="false"
            tools:node="merge">
            <meta-data
                android:name="androidx.work.WorkManagerInitializer"
                android:value="androidx.startup"
                tools:node="remove" />
        </provider>
    </application>
</manifest>`,
    hilt: `// app/src/main/java/com/koinonia/app/di/AppModule.kt
@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient {
        return createSupabaseClient(
            supabaseUrl = BuildConfig.SUPABASE_URL,
            supabaseKey = BuildConfig.SUPABASE_ANON_KEY
        ) {
            install(Postgrest)
            install(Auth)
        }
    }

    @Provides
    @Singleton
    fun provideRoomDatabase(@ApplicationContext context: Context): KoinoniaDatabase {
        return Room.databaseBuilder(
            context,
            KoinoniaDatabase::class.java,
            "koinonia.db"
        ).build()
    }
    
    @Provides
    @Singleton
    fun providePresencaDao(database: KoinoniaDatabase): PresencaDao = database.presencaDao()
}`
  };

  const [activeFile, setActiveFile] = useState<keyof typeof codeFiles>('gradle');

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="flex bg-slate-800/80 border-b border-slate-700 overflow-x-auto">
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'gradle' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('gradle')}>build.gradle.kts</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'manifest' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('manifest')}>AndroidManifest.xml</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'hilt' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('hilt')}>DI Setup (Hilt)</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-emerald-400/90 leading-relaxed">
          {codeFiles[activeFile]}
        </pre>
      </div>
    </div>
  )
}

function WebSetup() {
  const codeFiles = {
    package: `{
  "name": "koinonia-web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "@supabase/supabase-js": "^2.38.0",
    "react-query": "^3.39.3",
    "zustand": "^4.4.1",
    "react-router-dom": "^6.20.0",
    "recharts": "^2.10.3",
    "tailwindcss": "^3.3.6",
    "@radix-ui/react-select": "^2.0.0",
    "lucide-react": "^0.312.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}`,
    structure: `koinonia-web/
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx          # Routes
    ├── main.tsx         # Entry point (Providers)
    ├── components/      # UI components (Shadcn/Custom)
    ├── hooks/           # Custom hooks (e.g., useAuth)
    ├── lib/
    │   ├── supabase.ts  # Supabase client config
    │   └── utils.ts     # cn() util para tailwind
    ├── pages/           # View components
    ├── services/        # Supabase data fetching
    ├── store/           # Zustand stores
    └── types/           # TS Interfaces`,
    supabase: `// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are missing in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});`
  };

  const [activeFile, setActiveFile] = useState<keyof typeof codeFiles>('package');

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="flex bg-slate-800/80 border-b border-slate-700 overflow-x-auto">
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'package' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('package')}>package.json</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'structure' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('structure')}>Estrutura</button>
        <button className={`px-4 py-3 text-[11px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${activeFile === 'supabase' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => setActiveFile('supabase')}>supabase.ts</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-emerald-400/90 leading-relaxed">
          {codeFiles[activeFile]}
        </pre>
      </div>
    </div>
  )
}

function SupabaseSetup() {
  const code = `-- 0. Ativar Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Criação das Tabelas
CREATE TABLE igrejas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE membros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sobrenome TEXT,
  familia_id UUID,
  is_ativo BOOLEAN DEFAULT TRUE,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE presencas (
  id UUID PRIMARY KEY, -- ID gerado no device (Offline First)
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  membro_id UUID REFERENCES membros(id),
  culto_id UUID NOT NULL,
  data DATE NOT NULL,
  horario_chegada TIME NOT NULL,
  is_atrasado BOOLEAN DEFAULT FALSE,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Row Level Security (RLS)
ALTER TABLE igrejas ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencas ENABLE ROW LEVEL SECURITY;

-- Exemplo: Policy para Membros
CREATE POLICY "Acesso por tenant (Igreja)" 
ON membros
FOR ALL
USING (
  igreja_id = (SELECT igreja_id FROM public.users_profiles WHERE user_id = auth.uid())
);

-- 3. Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_membros_modtime
    BEFORE UPDATE ON membros
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();`;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[600px]">
      <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">migrations/001_initial_schema.sql</span>
        <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded">PostgreSQL</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        <pre className="text-[12px] font-mono text-emerald-400/90 leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  )
}

function DocumentationSetup() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FileText className="w-4 h-4"/> README.md (Excerto)</h3>
         
         <div className="prose prose-invert prose-sm max-w-none">
           <h1>Koinonia - Sistema de Controle Eclesiástico</h1>
           <p>Sistema completo Offline-First para gestão de presença, evangelismo e acompanhamento pastoral.</p>
           
           <h3>🚀 Como rodar o Web App (React)</h3>
           <pre className="bg-slate-900 p-3 rounded-lg text-xs"><code>{`git clone https://github.com/koinonia/web
cd koinonia-web
npm install
cp .env.example .env
npm run dev`}</code></pre>

           <h3>📱 Como rodar o App Android</h3>
           <ol>
             <li>Abra o projeto <code>/android</code> no Android Studio (Iguana ou superior)</li>
             <li>No arquivo <code>local.properties</code>, adicione suas chaves do Supabase.</li>
             <li>Sincronize o Gradle e clique em Run (Shift + F10)</li>
           </ol>
         </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
         <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ServerCog className="w-4 h-4"/> Variáveis de Ambiente (.env)</h3>
         <pre className="bg-slate-900 border border-slate-700 p-4 rounded-lg font-mono text-xs text-slate-300">
# WEB (.env)
VITE_SUPABASE_URL=https://bahxggpeblywkggcjfmw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaHhnZ3BlYmx5d2tnZ2NqZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTE0MTUsImV4cCI6MjA5OTM4NzQxNX0.iV_O_82ln38Bjg45O5e-74HNJ8KFdnXcm3-X_A3au2g

# Em caso de usar Create React App em vez de Vite, utilize:
REACT_APP_SUPABASE_URL=https://bahxggpeblywkggcjfmw.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaHhnZ3BlYmx5d2tnZ2NqZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTE0MTUsImV4cCI6MjA5OTM4NzQxNX0.iV_O_82ln38Bjg45O5e-74HNJ8KFdnXcm3-X_A3au2g

# ANDROID (local.properties)
SUPABASE_URL="https://bahxggpeblywkggcjfmw.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaHhnZ3BlYmx5d2tnZ2NqZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTE0MTUsImV4cCI6MjA5OTM4NzQxNX0.iV_O_82ln38Bjg45O5e-74HNJ8KFdnXcm3-X_A3au2g"
         </pre>
      </div>
    </div>
  )
}
