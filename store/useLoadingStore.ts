import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
  showLoader: () => void;
  hideLoader: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: 'Loading Empire Lifestyle...',
  setLoading: (loading, text) =>
    set({
      isLoading: loading,
      loadingText: text || 'Loading Empire Lifestyle...',
    }),
  showLoader: () => set({ isLoading: true }),
  hideLoader: () => set({ isLoading: false }),
}));
