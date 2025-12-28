import { create } from 'zustand';

// LocalStorage keys
const STORAGE_KEYS = {
  PARSED_BIDSENSE: 'bidsense_parsed_bidsense',
  CHAT_MESSAGES: 'bidsense_chat_messages',
  CURRENT_BIDSENSE: 'bidsense_current_bidsense',
  DRAFTS: 'bidsense_drafts',
  LAST_SAVED: 'bidsense_last_saved',
  DRAFT_ID: 'bidsense_current_draft_id',
};

// Helper functions for localStorage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return defaultValue;
  }
};

const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove from localStorage:', e);
  }
};

export const useBidSenseStore = create((set, get) => {
  // Load initial state from localStorage
  const initialParsedBidSense = getFromLocalStorage(STORAGE_KEYS.PARSED_BIDSENSE, null);

  return {
    // BidSense State
    currentBidSense: getFromLocalStorage(STORAGE_KEYS.CURRENT_BIDSENSE, null),
    parsedBidSense: initialParsedBidSense,
    bidsenseList: [],
    bidsenseLoading: false,
    bidsenseError: null,

    // Proposal State
    proposals: [],
    proposalLoading: false,
    proposalError: null,

    // Vendor State
    vendors: [],
    selectedVendors: [],
    vendorLoading: false,
    vendorError: null,

    // Comparison State
    comparisonData: null,
    comparisonLoading: false,
    comparisonError: null,

    // Chat State
    chatMessages: getFromLocalStorage(STORAGE_KEYS.CHAT_MESSAGES, []),
    chatLoading: false,

    // Save State
    saveStatus: 'saved', // 'saved', 'saving', 'failed'
    lastSavedAt: getFromLocalStorage(STORAGE_KEYS.LAST_SAVED, null),
    isDirty: false,

    // Draft Management
    drafts: getFromLocalStorage(STORAGE_KEYS.DRAFTS, []),
    currentDraftId: getFromLocalStorage(STORAGE_KEYS.DRAFT_ID, null),

    // BidSense Actions
    setCurrentBidSense: (bidsense) => {
      saveToLocalStorage(STORAGE_KEYS.CURRENT_BIDSENSE, bidsense);
      set({ currentBidSense: bidsense });
    },
    setParsedBidSense: (bidsense) => {
      saveToLocalStorage(STORAGE_KEYS.PARSED_BIDSENSE, bidsense);
      set({ parsedBidSense: bidsense, isDirty: true });
      // Debounce auto-save
      setTimeout(() => get().autoSaveDraft(), 2000);
    },
    setBidSenseList: (bidsenses) => set({ bidsenseList: bidsenses }),
    setBidSenseLoading: (loading) => set({ bidsenseLoading: loading }),
    setBidSenseError: (error) => set({ bidsenseError: error }),

    // Proposal Actions
    setProposals: (proposals) => set({ proposals }),
    setProposalLoading: (loading) => set({ proposalLoading: loading }),
    setProposalError: (error) => set({ proposalError: error }),

    // Vendor Actions
    setVendors: (vendors) => set({ vendors }),
    setSelectedVendors: (vendors) => set({ selectedVendors: vendors }),
    toggleVendor: (vendorId) => set((state) => ({
      selectedVendors: state.selectedVendors.includes(vendorId)
        ? state.selectedVendors.filter((id) => id !== vendorId)
        : [...state.selectedVendors, vendorId],
    })),
    setVendorLoading: (loading) => set({ vendorLoading: loading }),
    setVendorError: (error) => set({ vendorError: error }),

    // Comparison Actions
    setComparisonData: (data) => set({ comparisonData: data }),
    setComparisonLoading: (loading) => set({ comparisonLoading: loading }),
    setComparisonError: (error) => set({ comparisonError: error }),

    // Chat Actions
    addMessage: (message) => set((state) => {
      const updatedMessages = [...state.chatMessages, message];
      saveToLocalStorage(STORAGE_KEYS.CHAT_MESSAGES, updatedMessages);
      get().autoSaveDraft();
      return { chatMessages: updatedMessages };
    }),
    clearMessages: () => {
      removeFromLocalStorage(STORAGE_KEYS.CHAT_MESSAGES);
      set({ chatMessages: [] });
    },
    setChatLoading: (loading) => set({ chatLoading: loading }),

    // Save Actions
    setSaveStatus: (status) => set({ saveStatus: status }),
    setLastSavedAt: (timestamp) => {
      saveToLocalStorage(STORAGE_KEYS.LAST_SAVED, timestamp);
      set({ lastSavedAt: timestamp, saveStatus: 'saved', isDirty: false });
    },
    setDirty: (dirty) => set({ isDirty: dirty }),

    // Auto-save functionality
    autoSaveDraft: async () => {
      const state = get();
      if (!state.parsedBidSense && state.chatMessages.length === 0) return;

      set({ saveStatus: 'saving' });

      try {
        // Create draft object
        const draft = {
          id: state.currentDraftId || `draft_${Date.now()}`,
          title: state.parsedBidSense?.title || 'Untitled BidSense',
          status: 'draft',
          createdAt: state.lastSavedAt || new Date().toISOString(),
          lastSavedAt: new Date().toISOString(),
          currentStep: 1,
          chatHistory: state.chatMessages,
          bidsenseData: state.parsedBidSense,
          uiState: {
            expandedSections: [],
            scrollPosition: 0
          }
        };

        // Save to drafts list
        const existingDrafts = state.drafts.filter(d => d.id !== draft.id);
        const updatedDrafts = [draft, ...existingDrafts].slice(0, 10); // Keep last 10 drafts
        saveToLocalStorage(STORAGE_KEYS.DRAFTS, updatedDrafts);
        saveToLocalStorage(STORAGE_KEYS.DRAFT_ID, draft.id);

        set({
          drafts: updatedDrafts,
          currentDraftId: draft.id,
          lastSavedAt: draft.lastSavedAt,
          saveStatus: 'saved',
          isDirty: false
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        set({ saveStatus: 'failed' });
      }
    },

    // Draft Management Actions
    loadDraft: (draftId) => {
      const state = get();
      const draft = state.drafts.find(d => d.id === draftId);
      if (!draft) return false;

      set({
        currentDraftId: draft.id,
        parsedBidSense: draft.bidsenseData,
        chatMessages: draft.chatHistory || [],
        lastSavedAt: draft.lastSavedAt,
        saveStatus: 'saved',
        isDirty: false
      });

      saveToLocalStorage(STORAGE_KEYS.DRAFT_ID, draft.id);
      return true;
    },

    deleteDraft: (draftId) => set((state) => {
      const updatedDrafts = state.drafts.filter(d => d.id !== draftId);
      saveToLocalStorage(STORAGE_KEYS.DRAFTS, updatedDrafts);
      return { drafts: updatedDrafts };
    }),

    clearAllDrafts: () => {
      removeFromLocalStorage(STORAGE_KEYS.DRAFTS);
      removeFromLocalStorage(STORAGE_KEYS.DRAFT_ID);
      set({ 
        drafts: [], 
        currentDraftId: null 
      });
    },

    startNewDraft: () => {
      const newDraftId = `draft_${Date.now()}`;
      saveToLocalStorage(STORAGE_KEYS.DRAFT_ID, newDraftId);
      set({
        currentDraftId: newDraftId,
        parsedBidSense: null,
        chatMessages: [],
        lastSavedAt: null,
        saveStatus: 'saved',
        isDirty: false
      });
    },

    // Reset Store
    reset: () => {
      removeFromLocalStorage(STORAGE_KEYS.PARSED_BIDSENSE);
      removeFromLocalStorage(STORAGE_KEYS.CHAT_MESSAGES);
      removeFromLocalStorage(STORAGE_KEYS.CURRENT_BIDSENSE);
      removeFromLocalStorage(STORAGE_KEYS.LAST_SAVED);
      removeFromLocalStorage(STORAGE_KEYS.DRAFT_ID);
      set({
        currentBidSense: null,
        parsedBidSense: null,
        bidsenseList: [],
        proposals: [],
        selectedVendors: [],
        comparisonData: null,
        chatMessages: [],
        saveStatus: 'saved',
        lastSavedAt: null,
        isDirty: false,
        currentDraftId: null,
      });
    },
  };
});

