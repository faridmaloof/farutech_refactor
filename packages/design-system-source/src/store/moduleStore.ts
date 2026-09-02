import { create } from 'zustand';

interface Module {
  id: string;
  name: string;
  icon: string;
  path: string;
  active?: boolean;
}

interface ModuleState {
  modules: Module[];
  currentModule: Module | null;
  setModules: (modules: Module[]) => void;
  setCurrentModule: (module: Module | null) => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
  modules: [],
  currentModule: null,
  setModules: (modules) => set({ modules }),
  setCurrentModule: (module) => set({ currentModule: module }),
}));
