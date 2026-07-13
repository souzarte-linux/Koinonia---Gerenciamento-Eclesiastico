import { create } from 'zustand'
import { Member, Culto, Presenca, Ausencia } from '../types'

interface AppState {
  // Dados
  members: Member[]
  cultos: Culto[]
  presencas: Presenca[]
  ausencias: Ausencia[]
  
  // Sincronização
  isSyncing: boolean
  lastSync?: string
  pendingSync: number
  
  // Estado
  currentCulto?: Culto
  currentMember?: Member
  
  // Ações
  setMembers: (members: Member[]) => void
  setCultos: (cultos: Culto[]) => void
  setPresencas: (presencas: Presenca[]) => void
  setAusencias: (ausencias: Ausencia[]) => void
  addPresenca: (presenca: Presenca) => void
  addAusencia: (ausencia: Ausencia) => void
  setSyncing: (syncing: boolean) => void
  setLastSync: (date: string) => void
  setPendingSync: (count: number) => void
  setCurrentCulto: (culto: Culto | undefined) => void
  setCurrentMember: (member: Member | undefined) => void
}

export const useAppStore = create<AppState>((set) => ({
  members: [],
  cultos: [],
  presencas: [],
  ausencias: [],
  isSyncing: false,
  pendingSync: 0,
  currentCulto: undefined,
  currentMember: undefined,
  
  setMembers: (members) => set({ members }),
  setCultos: (cultos) => set({ cultos }),
  setPresencas: (presencas) => set({ presencas }),
  setAusencias: (ausencias) => set({ ausencias }),
  
  addPresenca: (presenca) => set((state) => ({
    presencas: [presenca, ...state.presencas]
  })),
  
  addAusencia: (ausencia) => set((state) => ({
    ausencias: [ausencia, ...state.ausencias]
  })),
  
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSync: (date) => set({ lastSync: date }),
  setPendingSync: (count) => set({ pendingSync: count }),
  setCurrentCulto: (culto) => set({ currentCulto: culto }),
  setCurrentMember: (member) => set({ currentMember: member }),
}))
