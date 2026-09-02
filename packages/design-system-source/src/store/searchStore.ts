import { create } from 'zustand';

interface SearchState {
  query: string;
  isOpen: boolean;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setOpen: (isOpen: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  isOpen: false,
  recentSearches: [],
  setQuery: (query) => set({ query }),
  setOpen: (isOpen) => set({ isOpen }),
  addRecentSearch: (query) =>
    set((state) => ({
      recentSearches: [query, ...state.recentSearches.filter((s) => s !== query)].slice(0, 5),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
