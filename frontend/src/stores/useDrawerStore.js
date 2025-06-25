// src/stores/useDrawerStore.js
// 설정창 전역연결
import { create } from 'zustand';

export const useDrawerStore = create((set) => ({
  isDrawerOpen: false,
  shouldAutoOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setShouldAutoOpen: (flag) => set({ shouldAutoOpen: flag }),
}));
