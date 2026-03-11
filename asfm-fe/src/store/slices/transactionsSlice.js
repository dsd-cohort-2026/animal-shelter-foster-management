import apiClient from '@/lib/axios';

export const transactionsSlice = (set, get) => ({
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionsfetched: false,

  fetchTransactions: async () => {
    set((state) => {
      state.transactionsLoading = true;
      state.transactionsError = null;
    });

    try {
      const userRole = get().userRole;
      if (userRole === 'USER') {
        set((state) => {
          state.transactionsError = 'User not authorized.';
          state.transactionsLoading = false;
        });
        return;
      }

      const response = await apiClient.get('/inventory-transactions', {
        params: {
          limit: 100,
        },
      });

      set((state) => {
        state.transactions = response.data;
        state.transactionsFetched = true;
      });
    } catch (error) {
      console.error('Error fetching transactions: ', error);
      set((state) => {
        state.transactionsError = 'Failed to load transactions';
      });
    } finally {
      set((state) => {
        state.transactionsLoading = false;
      });
    }
  },
});
