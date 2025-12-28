import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global authentication store using Zustand
 * This ensures auth state is shared across all components
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false, // Start as false - will be set to true only during active verification
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      updateUser: (updatedUserData) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedUserData } : null
      })),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      }),
    }),
    {
      name: 'rfp-auth-storage',
      partialize: (state) => ({ 
        // Persist user data and auth status
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      // When rehydrating, trust persisted state but mark loading as false
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      }
    }
  )
);
