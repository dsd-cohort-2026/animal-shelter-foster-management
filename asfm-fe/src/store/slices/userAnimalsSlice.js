export const userAnimalsSlice = (set) => ({

    //states 
    isFosterMember: true,
    userAnimals: [{name: 'Jeanie'}],

    //actions 
    setUserAnimals: (animals) => set(state => {state.userAnimals = animals}),

    addUserAnimal: (animal) => set(state => {state.userAnimals.push(animal)}),
    // Safe to push animals due to the global store wrapped in immer which makes a draft copy of current state that is mutate  

    removeUserAnimal: (animal) => set(state => {state.userAnimals = state.userAnimals.filter((entity) => entity.id !== animal.id)}),

    setIsFosterMember: (isFoster) => set(state => {state.isFosterMember = isFoster}) 

})