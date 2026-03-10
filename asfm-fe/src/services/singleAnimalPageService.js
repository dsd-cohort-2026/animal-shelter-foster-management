import apiClient from "@/lib/axios";
import getBirthdayYear from "@/utils/getBirthday";

function sortMedicalLogs(logs) {
    logs.sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  }

  export async function fetchAnimal(id) {
    try {
      const response = await apiClient.get(`/animals/${id}`)
      const data = response.data
      if(Object.keys(data).length === 0) return null;
      const animal = data;

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

  export async function fetchAnimalMedicalLogs() {
    try {
      const response = await apiClient.get(`/medical-logs`);
      const data = response.data
      sortMedicalLogs(data)
      return data;
    } catch (err) {
      console.error('Failed to fetch animal medical logs', err);
      throw err;
    }
  }