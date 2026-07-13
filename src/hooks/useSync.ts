import { useEffect } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { supabase } from '../config/supabase'

export function useSync() {
  const { setSyncing, setLastSync, setPendingSync } = useAppStore()

  useEffect(() => {
    const syncData = async () => {
      try {
        setSyncing(true)

        // Sincronizar presencas
        const { data: presencas, error: presencasError } = await supabase
          .from('presencas')
          .select('*')
          .order('created_at', { ascending: false })

        if (presencasError) throw presencasError

        // Sincronizar ausencias
        const { data: ausencias, error: ausenciasError } = await supabase
          .from('ausencias')
          .select('*')
          .order('created_at', { ascending: false })

        if (ausenciasError) throw ausenciasError

        // Atualizar store
        useAppStore.setState({
          presencas: presencas || [],
          ausencias: ausencias || [],
          lastSync: new Date().toISOString(),
        })

        console.log('✅ Sincronização concluída')
      } catch (error) {
        console.error('❌ Erro ao sincronizar:', error)
      } finally {
        setSyncing(false)
      }
    }

    // Sincronizar ao montar
    syncData()

    // Sincronizar a cada 30 segundos
    const interval = setInterval(syncData, 30000)
    return () => clearInterval(interval)
  }, [setSyncing, setLastSync, setPendingSync])
}
