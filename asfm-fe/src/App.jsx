import './App.css'
import FilterSelect from './components/custom/FilterSelect'
import { Button } from './components/ui/button'
import { usePetStore } from './hooks/useStore'
import  TopNavBar  from './components/NonMemberSignInNavBar'

function App() {
  const pets = usePetStore((state) => state.pets)
  const addPet= usePetStore((state) => state.addPet)

  return (

    <>
      <TopNavBar/>
      <div className="flex items-center justify-center h-screen gap-4">
      <Button className="bg-secondary text-secondary-foreground font-montserrat text-h2 px-xl py-xl">
        Testing ShadeCn Config
      </Button>
      <FilterSelect selectTriggerClassName="w-[300px]" selectItems={["approved", "pending", "denied"]} />
      </div>
    </>
  )
}

export default App
