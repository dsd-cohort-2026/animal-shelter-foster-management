import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import getBirthdayYear from '@/utils/getBirthday';
import { useEffect } from 'react';
import MedicalLogCard from '@/components/single-animal/MedicalLogCard';
import { AnimalGeneralInfo } from '@/components/single-animal/AnimalGeneralInfo';

export default function SingleAnimalPage() {
  // state to be replaced with global state and actions once ready
  const [isStaff, setIsStaff] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [viewAnimal, setViewAnimal] = useState('');
  const [animalLogs, setAnimalLogs] = useState([]);

  const url = "http://localhost:3005"; // <-- placeholder

  async function fetchAnimal(id) {
    try {
      const response = await fetch(`${url}/animals?id=${id}`);
      if (!response.ok) {
        throw new Error(`Fetch request error status: ${response.status}`)
      }
      const data = await response.json();
  
      console.log(data)
      setViewAnimal(data[0])
      return data[0]
    } catch (err) {
      console.error('Failed to fetch animal', err)
      throw err
    }
  }

  async function fetchAnimalMedicalLogs(id) {
    try {
      const response = await fetch(`${url}/medical-logs?animal_id=${id}`)
      if (!response.ok) {
        throw new Error (`Failed to find the animal's medical logs ${response.status}`)
      }
      const data = await response.json();
      console.log('medical logs', data)
      setAnimalLogs(data)
      return data
    } catch (err) {
      console.error('Failed to fetch animal medical logs', err )
      throw err
    }
  }

  async function fetchAllAnimalRecords(id) {
      const animalBase = await fetchAnimal(id);
      const animalLogs = await fetchAnimalMedicalLogs(id);
      return {animalBase, animalLogs}
  }

  useEffect(() => {
    fetchAllAnimalRecords('550e8400-e29b-41d4-a716-446655550001')

    // if (viewAnimal.dob) {
    //   setViewAnimal({
    //     ...viewAnimal,
    //     age: getBirthdayYear(viewAnimal.dob),
    //   });
    // }
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <article>
          {isStaff && (
            <div className="flex justify-end">
              <Button className={'rounded-lg'} onClick={() => setIsEditing(!isEditing)}>
                Edit Animal Info
              </Button>
            </div>
          )}
          {isEditing ? (
            <AnimalEditForm isEditing={isEditing} viewAnimal={viewAnimal} />
          ) : (
            <AnimalGeneralInfo viewAnimal={viewAnimal} />
          )}
          <Card className="mt-10">
            <CardTitle className="pl-5">Medical Logs</CardTitle>
            <CardDescription className="px-5 flex flex-col gap-y-5">
              {animalLogs.map((log) => (
                <MedicalLogCard log={log} />
              ))}
              {/* <MedicalLogCard /> */}
            </CardDescription>
          </Card>
        </article>
      </div>
    </>
  );
}