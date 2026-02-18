import { create } from 'zustand';

export const usePetStore = create((set) => ({
  pets: [],

  addPet: (pet) =>
    set((state) => ({
      pets: [...state.pets, { ...pet, id: crypto.randomUUID() }],
    })),
}));
