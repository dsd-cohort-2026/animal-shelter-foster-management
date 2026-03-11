import apiClient from '@/lib/axios';

export const animalsSlice = (set, get) => ({
  animals: [],
  animalsLoading: false,
  animalsError: null,
  animalsFetched: false,

  fetchAnimals: async () => {
    const { animalsLoading, animalsFetched } = get();
    if (animalsFetched || animalsLoading) return;

    set((state) => {
      state.animalsLoading = true;
      state.animalsError = null;
    });

    try {
      const response = await apiClient.get('/animals', { params: { limit: 10000 } });
      set((state) => {
        state.animals = response.data;
        state.animalsLoading = false;
        state.animalsFetched = true;
      });
    } catch (error) {
      set((state) => {
        state.animalsError = 'Failed to load animals.';
        state.animalsLoading = false;
      });
    }
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
