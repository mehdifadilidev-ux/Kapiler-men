import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
}

interface UIActions {
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  isSidebarOpen: false,
  activeModal: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
