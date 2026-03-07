import { mockMedicalLogs } from '@/features/mockMedicalLogs';

// TODO: Replace setTimeout with actual API calls to backend
const SIMULATED_API_DELAY = 400;

export const medicalLogsSlice = (set, get) => ({
  medicalLogs: [],
  medicalLogsLoading: false,
  medicalLogsError: null,
  medicalLogsFetched: false,

  fetchMedicalLogs: () => {
    const { medicalLogsLoading, medicalLogsFetched } = get();
    if (medicalLogsFetched || medicalLogsLoading) return;

    set((state) => {
      state.medicalLogsLoading = true;
      state.medicalLogsError = null;
    });

    setTimeout(() => {
      try {
        set((state) => {
          state.medicalLogs = mockMedicalLogs;
          state.medicalLogsLoading = false;
          state.medicalLogsFetched = true;
        });
      } catch {
        set((state) => {
          state.medicalLogsError = 'Failed to load medical logs.';
          state.medicalLogsLoading = false;
        });
      }
    }, SIMULATED_API_DELAY);
  },

  addMedicalLog: (log) =>
    set((state) => {
      state.medicalLogs.push(log);
    }),
});
