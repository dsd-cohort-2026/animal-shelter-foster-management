import getBirthdayYear from "@/utils/getBirthday";

const url = 'http://localhost:3005'; // <-- placeholder

function sortMedicalLogs(logs) {
    logs.sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  }

  export async function fetchAnimal(id) {
    try {
      const response = await fetch(`${url}/animals?id=${id}`);
      if (!response.ok) {
        throw new Error(`Fetch request error status: ${response.status}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        return null;
      }
      const animal = data[0];

      const updatedAnimal = {
        ...animal,
        age: animal.dob ? getBirthdayYear(animal.dob) : null,
        altered: animal.altered ? 'Fixed' : 'Not Fixed',
      };
      return updatedAnimal;
    } catch (err) {
      console.error('Failed to fetch animal', err);
      throw err;
    }
  }

  export async function fetchAnimalMedicalLogs(id) {
    try {
      const response = await fetch(`${url}/medical-logs?animal_id=${id}`);
      if (!response.ok) {
        throw new Error(`Failed to find the animal's medical logs ${response.status}`);
      }
      const data = await response.json();
      sortMedicalLogs(data)
      return data;
    } catch (err) {
      console.error('Failed to fetch animal medical logs', err);
      throw err;
    }
  }