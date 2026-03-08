const url = 'http://localhost:3005'; // <-- placeholder

export async function fetchMedication(medicationId) {
  try {
    const response = await fetch(`${url}/medication?id=${medicationId}`);
    if (!response.ok) {
      throw new Error(`Fetch request error status: ${response.status}`);
    }
    const data = await response.json();
    if (Object.keys(data).length === 0) {
      return null;
    }
    return data;
  } catch (err) {
    console.error(`Failed to fetch medication ${err}`);
  }
}

export async function fetchMedicationItem(itemId) {
  try {
    const response = await fetch(`${url}/items?id=${itemId}`);
    if (!response.ok) {
      throw new Error(`Fetch request error status: ${response.status}`);
    }
    const data = await response.json();
    if (data.length === 0) return null;
    return data[0];
  } catch (err) {
    console.error(`Failed to fetch item from medication id ${err}`);
  }
}
