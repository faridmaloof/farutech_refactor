import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  sidebarWidth: number;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  close: () => void;
  setSidebarWidth: (width: number) => void;
  setMobile: (isMobile: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  isMobile: false,
  sidebarWidth: 280,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  collapse: () => set({ isCollapsed: true }),
  expand: () => set({ isCollapsed: false }),
  close: () => set({ isOpen: false }),
  setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
  setMobile: (isMobile: boolean) => set({ isMobile }),
}));
