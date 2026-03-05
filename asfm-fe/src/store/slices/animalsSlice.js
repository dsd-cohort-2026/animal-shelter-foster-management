import { mockAnimals } from '@/features/mockAnimals';

// Helper to merge animal lists, with secondary values taking precedence on ID collision
// This allows local additions/edits to persist during mock data loading
function mergeAnimalsById(primary, secondary) {
  const map = new Map();
  for (const animal of primary) map.set(animal.id, animal);
  for (const animal of secondary) map.set(animal.id, animal); // Secondary overwrites on collision
  return Array.from(map.values());
}

// TODO: Replace setTimeout with actual API calls to backend
// Pattern: fetchAnimals -> loading state -> success/error -> update store
const SIMULATED_API_DELAY = 400;

export const animalsSlice = (set, get) => ({
  animals: [],
  animalsLoading: false,
  animalsError: null,
  animalsFetched: false,

  fetchAnimals: () => {
    const { animalsLoading, animalsFetched } = get();
    if (animalsFetched || animalsLoading) return;

    set((state) => {
      state.animalsLoading = true;
      state.animalsError = null;
    });

    // Simulate async fetch — swap with real API call later
    setTimeout(() => {
      try {
        set((state) => {
          // Merge mock data with current state, with current state taking precedence on ID collision.
          // This preserves any animals added/edited while the fetch was in-flight.
          state.animals = mergeAnimalsById(mockAnimals, state.animals);
          state.animalsLoading = false;
          state.animalsFetched = true;
        });
      } catch {
        set((state) => {
          state.animalsError = 'Failed to load animals.';
          state.animalsLoading = false;
        });
      }
    }, SIMULATED_API_DELAY);
  },

  setAnimals: (animals) =>
    set((state) => {
      state.animals = animals;
      state.animalsFetched = true;
    }),

  addAnimal: (animal) =>
    set((state) => {
      state.animals.push(animal);
    }),

  updateAnimal: (updatedAnimal) =>
    set((state) => {
      const index = state.animals.findIndex((a) => a.id === updatedAnimal.id);
      if (index !== -1) state.animals[index] = updatedAnimal;
    }),

  removeAnimal: (id) =>
    set((state) => {
      state.animals = state.animals.filter((a) => a.id !== id);
    }),
});
