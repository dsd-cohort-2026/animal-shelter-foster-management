import { fetchMedicalLogs as fetchMedicalLogsFromAPI } from '@/services/medicalLogsService';
import { enrichMedicalLogs } from '@/utils/enrichMedicalLogs';

export const medicalLogsSlice = (set, get) => ({
  medicalLogs: [],
  medicalLogsLoading: false,
  medicalLogsError: null,
  medicalLogsFetched: false,

  fetchMedicalLogs: async () => {
    const { medicalLogsLoading, medicalLogsFetched } = get();
    if (medicalLogsFetched || medicalLogsLoading) return;

    set((state) => {
      state.medicalLogsLoading = true;
      state.medicalLogsError = null;
    });

    try {
      const data = await fetchMedicalLogsFromAPI();
      const animals = get().animals;

      // Enrich using centralized utility
      const enrichedData = enrichMedicalLogs(data, animals, []);

      set((state) => {
        state.medicalLogs = enrichedData;
        state.medicalLogsLoading = false;
        state.medicalLogsFetched = true;
      });
    } catch (error) {
      set((state) => {
        state.medicalLogsError = 'Failed to load medical logs. Please try again.';
        state.medicalLogsLoading = false;
      });
    }
  },

  addMedicalLog: (log) =>
    set((state) => {
      const animals = get().animals;

      // Inline enrichment for single log (animals array is typically small)
      const animal = animals.find((a) => a.id === log.animal_id);
      state.medicalLogs.push({
        ...log,
        animal_name: animal?.name || '—',
      });
    }),
});