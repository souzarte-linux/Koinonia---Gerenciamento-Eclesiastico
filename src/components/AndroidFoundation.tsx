import React, { useState } from 'react';
import { Smartphone, Code, FileCode2, Settings, ShieldCheck, Database, LayoutTemplate, Layers } from 'lucide-react';

export default function AndroidFoundation() {
  const [activeTab, setActiveTab] = useState<string>('app_gradle');

  const files = {
    'app_gradle': {
      name: 'build.gradle.kts (App)',
      icon: Code,
      content: `plugins {
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
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    
    kotlinOptions {
        jvmTarget = "11"
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
    implementation("io.github.jan-tennert.supabase:postgrest-kt:2.0.2")
    implementation("io.github.jan-tennert.supabase:gotrue-kt:2.0.2")
    implementation("io.github.jan-tennert.supabase:realtime-kt:2.0.2")
    implementation("io.ktor:ktor-client-cio:2.3.8")

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
    
    // Logging
    implementation("com.jakewharton.timber:timber:5.0.1")
}`
    },
    'project_gradle': {
      name: 'build.gradle.kts (Project)',
      icon: Code,
      content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
    id("com.google.dagger.hilt.android") version "2.48.1" apply false
}

tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}`
    },
    'manifest': {
      name: 'AndroidManifest.xml',
      icon: FileCode2,
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.koinonia.app">

    <!-- Permissões de Internet para Sync com Supabase -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Para WorkManager e Sync Background -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:name=".IgrejaPresencaApp"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.IgrejaPresenca"
        android:usesCleartextTraffic="false"
        android:enableOnBackInvokedCallback="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.IgrejaPresenca">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

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
</manifest>`
    },
    'folder_structure': {
      name: 'Estrutura de Pastas',
      icon: Layers,
      content: `app/src/main/
├── java/com/koinonia/app/
│   ├── data/
│   │   ├── local/
│   │   │   ├── database/
│   │   │   ├── dao/
│   │   │   └── entity/
│   │   ├── remote/
│   │   │   ├── supabase/
│   │   │   └── dto/
│   │   └── repository/
│   ├── domain/
│   │   ├── model/
│   │   ├── repository/
│   │   └── usecase/
│   ├── presentation/
│   │   ├── ui/
│   │   │   ├── screen/
│   │   │   └── component/
│   │   ├── viewmodel/
│   │   ├── navigation/
│   │   └── theme/
│   ├── sync/
│   ├── di/
│   ├── util/
│   ├── IgrejaPresencaApp.kt
│   └── MainActivity.kt
├── res/
│   ├── values/
│   │   ├── strings.xml
│   │   ├── colors.xml
│   │   └── themes.xml
│   ├── drawable/
│   └── mipmap/
└── AndroidManifest.xml`
    },
    'gradle_properties': {
      name: 'gradle.properties',
      icon: Settings,
      content: `# Projeto
org.gradle.jvmargs=-Xmx2048m
android.useAndroidX=true
kotlin.code.style=official
android.enableJetifier=true

# Supabase
supabase.url=https://bahxggpeblywkggcjfmw.supabase.co
supabase.anon.key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaHhnZ3BlYmx5d2tnZ2NqZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTE0MTUsImV4cCI6MjA5OTM4NzQxNX0.iV_O_82ln38Bjg45O5e-74HNJ8KFdnXcm3-X_A3au2g`
    },
    'settings_gradle': {
      name: 'settings.gradle.kts',
      icon: Code,
      content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "Koinonia"
include(":app")`
    },
    'local_properties': {
      name: 'local.properties.example',
      icon: Settings,
      content: `# Supabase Configuration
SUPABASE_URL=https://bahxggpeblywkggcjfmw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaHhnZ3BlYmx5d2tnZ2NqZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTE0MTUsImV4cCI6MjA5OTM4NzQxNX0.iV_O_82ln38Bjg45O5e-74HNJ8KFdnXcm3-X_A3au2g

# Android SDK
# Copie para local.properties e preencha com seus valores reais
sdk.dir=/Users/seu_user/Library/Android/sdk
# ou para Windows: C:\\Users\\seu_user\\AppData\\Local\\Android\\Sdk`
    },
    'app_class': {
      name: 'App.kt (Hilt)',
      icon: Layers,
      content: `package com.koinonia.app

import android.app.Application
import android.util.Log
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class IgrejaPresencaApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Log inicial
        Log.d("IgrejaApp", "✅ App iniciando...")
    }
}`
    },
    'main_activity': {
      name: 'MainActivity.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import dagger.hilt.android.AndroidEntryPoint
import com.koinonia.app.presentation.theme.IgrejaPresencaTheme

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            IgrejaPresencaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // MainScreen() a ser implementado
                }
            }
        }
    }
}`
    },
    'theme': {
      name: 'theme/Theme.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

@Composable
fun IgrejaPresencaTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = IgrejaLightColors
    val view = LocalView.current
    
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}`
    },
    'color': {
      name: 'theme/Color.kt',
      icon: LayoutTemplate,
      content: `package com.koinonia.app.presentation.theme

import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

val IgrejaLightColors = lightColorScheme(
    primary = Color(0xFF1F4788),
    secondary = Color(0xFFD4AF37),
    tertiary = Color(0xFFFFFFFF),
    error = Color(0xFFB3261E),
    background = Color(0xFFFFFFFF),
    surface = Color(0xFFF5F5F5)
)`
    },
    'strings': {
      name: 'strings.xml',
      icon: FileCode2,
      content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Igreja Presença</string>
    <string name="menu_presenca">Presença</string>
    <string name="menu_cultos">Cultos</string>
    <string name="menu_relatorio">Relatório</string>
    <string name="menu_ausencia">Ausências</string>
    <string name="btn_marcar_presenca">Marcar Presença</string>
    <string name="btn_salvar">Salvar</string>
    <string name="btn_cancelar">Cancelar</string>
    <string name="error_generic">Ocorreu um erro. Tente novamente.</string>
    <string name="success_presenca_registrada">Presença registrada com sucesso</string>
</resources>`
    },
    'gitignore': {
      name: '.gitignore',
      icon: FileCode2,
      content: `# Android
build/
.gradle/
local.properties
*.apk
*.aar
*.jks

# IDE
.idea/
.DS_Store
*.swp

# Secrets
credentials.json`
    },
    'gradle_wrapper': {
      name: 'gradle-wrapper.properties',
      icon: Settings,
      content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.2-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
    },
    'di_database': {
      name: 'DatabaseModule.kt',
      icon: Database,
      content: `package com.koinonia.app.di

import android.content.Context
import androidx.room.Room
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton
// import com.koinonia.app.data.local.database.AppDatabase

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "igreja_presenca_db"
        )
        .fallbackToDestructiveMigration() // Apenas para dev
        .build()
    }
    
    @Provides
    fun provideMemberDao(database: AppDatabase) = database.memberDao()
    
    @Provides
    fun providePresencaDao(database: AppDatabase) = database.presencaDao()
    
    @Provides
    fun provideCultoDao(database: AppDatabase) = database.cultoDao()
    
    @Provides
    fun provideAusenciaDao(database: AppDatabase) = database.ausenciaDao()
}`
    },
    'di_supabase': {
      name: 'SupabaseModule.kt',
      icon: ShieldCheck,
      content: `package com.koinonia.app.di

import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.Auth
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.Realtime
import javax.inject.Singleton
import com.koinonia.app.BuildConfig

@Module
@InstallIn(SingletonComponent::class)
object SupabaseModule {
    
    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient {
        return createSupabaseClient(
            supabaseUrl = BuildConfig.SUPABASE_URL,
            supabaseKey = BuildConfig.SUPABASE_ANON_KEY
        ) {
            install(Postgrest)
            install(Auth)
            install(Realtime)
        }
    }
}`
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 mb-2">Android Foundation Setup</h2>
        <p className="text-slate-400 mb-4 text-sm">
          Arquivos base de configuração para o projeto Android (Koinonia Sistema de Controle Eclesiástico).
        </p>
      </div>

      <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl flex h-[700px]">
        
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/80 border-r border-slate-700 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arquivos Base</h3>
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
