import { supabase } from '@/lib/supabaseClient';
import apiClient from '@/lib/axios';

export const userAnimalsSlice = (set, get) => ({

    //states
    isFosterMember: true,
    userAnimals: [],
    userAnimalsLoading: false,
    userAnimalsError: null,

    //actions
    setUserAnimals: (animals) => set(state => {state.userAnimals = animals}),

    fetchUserAnimals: async () => {
        set((state) => {
            state.userAnimalsLoading = true;
            state.userAnimalsError = null;
        });

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                set((state) => {
                    state.userAnimalsError = 'User not authenticated';
                    state.userAnimalsLoading = false;
                });
                return;
            }

            const userId = session.user.id;
            const response = await apiClient.get(`/users/${userId}/animals`);

            set((state) => {
                state.userAnimals = response.data;
                state.userAnimalsLoading = false;
            });
        } catch (error) {
            console.error('Error fetching user animals:', error);
            set((state) => {
                state.userAnimalsError = 'Failed to load your animals.';
                state.userAnimalsLoading = false;
            });
        }
    },

    addUserAnimal: (animal) => set(state => {state.userAnimals.push(animal)}),
    // Safe to push animals due to the global store wrapped in immer which makes a draft copy of current state that is mutate  

    removeUserAnimal: (animal) => set(state => {state.userAnimals = state.userAnimals.filter((entity) => entity.id !== animal.id)}),

    setIsFosterMember: (isFoster) => set(state => {state.isFosterMember = isFoster}) 

})