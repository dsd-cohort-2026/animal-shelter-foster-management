import './App.css'
import { Button } from './components/ui/button'
import { usePetStore } from './hooks/useStore'

function App() {
  const pets = usePetStore((state) => state.pets)
  const addPet= usePetStore((state) => state.addPet)


  return (
    <div className="flex items-center justify-center h-screen gap-4">
      <Button variant="outline" onClick={() => addPet({ name: "Dog", type: "dog" })}>Add Dog</Button>
      <Button variant="outline" onClick={() => addPet({ name: "Cat", type: "cat" })}>Add Cat</Button>
      <div>
      {pets.map((pet) => (
          <div key={pet.id} className="p-4 border rounded">
            <h3 className="text-lg font-semibold">{pet.name}</h3>
            <p className="text-sm text-gray-500">{pet.type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
