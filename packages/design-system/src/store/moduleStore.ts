import { create } from 'zustand'
import type { ReactNode } from 'react'

export interface Module {
  id: string
  name: string
  icon?: ReactNode
  path?: string
  active?: boolean
  description?: string
}

interface ModuleState {
  modules: Module[]
  currentModule: string | null
  setModules: (modules: Module[]) => void
  setCurrentModule: (moduleId: string | null) => void
}

export const useModuleStore = create<ModuleState>((set) => ({
  modules: [],
  currentModule: null,
  setModules: (modules) => set({ modules }),
  setCurrentModule: (moduleId) => set({ currentModule: moduleId }),
}))
