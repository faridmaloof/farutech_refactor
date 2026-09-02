import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  collapse: () => set({ isCollapsed: true }),
  expand: () => set({ isCollapsed: false }),
}));
